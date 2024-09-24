// src/app/api/comprehensive-file-insights/route.js
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';



export async function POST(req) {
    try {
        const { filePath } = await req.json();
        const fullPath = path.join(process.cwd(), filePath);

        const content = await fs.readFile(fullPath, 'utf8');
        const insights = analyzeFile(content, filePath);
        return NextResponse.json({ ...insights, fileContent: content });
    } catch (error) {
        console.error('Error analyzing file:', error);
        return NextResponse.json({ error: 'Error analyzing file', details: error.message }, { status: 500 });
    }
}

export default async function handler(req, res) {
    const { filePath } = req.body;
    try {
        const fullPath = path.join(process.cwd(), filePath);
        const fileContent = await fs.readFile(fullPath, 'utf8');
        const insights = analyzeFile(fileContent, filePath);
        res.status(200).json({ ...insights, fileContent });
    } catch (error) {
        console.error('Error analyzing file:', error);
        res.status(500).json({ error: 'Error analyzing file' });
    }
}




function analyzeFile(content, filePath) {
    const ast = parse(content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
    });

    const insights = {
        filePath,
        imports: [],
        exports: [],
        components: {},
        hooks: {},
        functions: {},
        stateVariables: {},
        props: {},
        dependencies: new Set(),
        fileReferences: [],
    };

    let currentComponent = null;

    traverse(ast, {
        Identifier(path) {
            const name = path.node.name;
            if (insights.components[name]) {
                insights.components[name].usages.push(getLocationInfo(path));
            }
            if (insights.functions[name]) {
                insights.functions[name].usages.push(getLocationInfo(path));
            }
        },
        ImportDeclaration(path) {
            const importInfo = {
                source: path.node.source.value,
                specifiers: path.node.specifiers.map(specifier => ({
                    type: specifier.type,
                    name: specifier.local.name,
                    importedName: specifier.type === 'ImportSpecifier' ? specifier.imported.name : null,
                })),
            };
            insights.imports.push(importInfo);
            insights.dependencies.add(importInfo.source);
        },
        ExportNamedDeclaration(path) {
            if (path.node.declaration) {
                insights.exports.push(path.node.declaration.declarations[0].id.name);
            }
        },
        ExportDefaultDeclaration(path) {
            if (path.node.declaration.name) {
                insights.exports.push(path.node.declaration.name);
            }
        },
        VariableDeclarator(path) {
            if (t.isArrowFunctionExpression(path.node.init) || t.isFunctionExpression(path.node.init)) {
                const componentName = path.node.id.name;
                currentComponent = componentName;
                insights.components[componentName] = {
                    type: 'FunctionComponent',
                    stateVariables: [],
                    props: [],
                    childComponents: [],
                    hooks: [],
                    code: content.slice(path.node.start, path.node.end),
                    usages: [], // We'll populate this later
                };
                analyzeComponent(path, componentName, insights);
            }
        },
        FunctionDeclaration(path) {
            const functionName = path.node.id.name;
            analyzeFunctionDetails(path, functionName, insights, content);
        },
        CallExpression(path) {
            if (path.node.callee.name && path.node.callee.name.startsWith('use')) {
                const hookName = path.node.callee.name;
                if (!insights.hooks[hookName]) {
                    insights.hooks[hookName] = [];
                }
                if (currentComponent) {
                    insights.hooks[hookName].push(currentComponent);
                    insights.components[currentComponent].hooks.push(hookName);
                }
                if (hookName === 'useState') {
                    const stateVarName = path.parent.id.elements[0].name;
                    const initialValue = path.node.arguments[0] ? generateReadableAstValue(path.node.arguments[0]) : 'undefined';
                    insights.stateVariables[stateVarName] = {
                        initialValue,
                        setterName: path.parent.id.elements[1].name,
                        component: currentComponent,
                    };
                    if (currentComponent) {
                        insights.components[currentComponent].stateVariables.push(stateVarName);
                    }
                }
            }
        },
        JSXOpeningElement(path) {
            const componentName = path.node.name.name;
            if (componentName && componentName[0] === componentName[0].toUpperCase()) {
                if (currentComponent) {
                    insights.components[currentComponent].childComponents.push(componentName);
                }
                analyzeJSXElementProps(path, componentName, insights);
            }
        },
    });

    insights.dependencies = Array.from(insights.dependencies);
    insights.fileReferences = analyzeFileReferences(content, filePath);

    return insights;
}

function analyzeComponent(path, componentName, insights) {
    path.traverse({
        JSXOpeningElement(childPath) {
            const childComponentName = childPath.node.name.name;
            if (childComponentName && childComponentName[0] === childComponentName[0].toUpperCase()) {
                insights.components[componentName].childComponents.push(childComponentName);
            }
        },
        JSXAttribute(childPath) {
            const propName = childPath.node.name.name;
            if (!insights.components[componentName].props.includes(propName)) {
                insights.components[componentName].props.push(propName);
            }
        },
    });
}

function analyzeJSXElementProps(path, componentName, insights) {
    path.node.attributes.forEach(attr => {
        if (attr.type === 'JSXAttribute') {
            const propName = attr.name.name;
            if (!insights.props[propName]) {
                insights.props[propName] = {
                    components: [componentName],
                    value: attr.value ? generateReadableAstValue(attr.value) : null,
                };
            } else if (!insights.props[propName].components.includes(componentName)) {
                insights.props[propName].components.push(componentName);
            }
        }
    });
}

function analyzeFunctionDetails(path, functionName, insights, content) {
    insights.functions[functionName] = {
        params: path.node.params.map(param => param.name),
        body: path.node.body.body.map(statement => statement.type),
        calls: [],
        calledBy: [],
        code: content.slice(path.node.start, path.node.end),
        usages: [],
    };

    path.traverse({
        CallExpression(childPath) {
            if (childPath.node.callee.name) {
                insights.functions[functionName].calls.push(childPath.node.callee.name);
            }
        },
    });
}
function getLocationInfo(path) {
    const loc = path.node.loc;
    return {
        start: { line: loc.start.line, column: loc.start.column },
        end: { line: loc.end.line, column: loc.end.column },
    };
}
function analyzeFileReferences(content, currentFilePath) {
    const fileReferences = [];
    const regex = /from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        const importPath = match[1];
        if (!importPath.startsWith('.')) continue;
        const absolutePath = path.resolve(path.dirname(currentFilePath), importPath);
        fileReferences.push(absolutePath);
    }
    return fileReferences;
}

function generateReadableAstValue(node) {
    if (t.isStringLiteral(node)) {
        return `"${node.value}"`;
    } else if (t.isNumericLiteral(node)) {
        return node.value.toString();
    } else if (t.isBooleanLiteral(node)) {
        return node.value.toString();
    } else if (t.isNullLiteral(node)) {
        return 'null';
    } else if (t.isIdentifier(node)) {
        return node.name;
    } else if (t.isArrayExpression(node)) {
        return `[${node.elements.map(generateReadableAstValue).join(', ')}]`;
    } else if (t.isObjectExpression(node)) {
        const properties = node.properties.map(prop => {
            const key = prop.key.name || `"${prop.key.value}"`;
            const value = generateReadableAstValue(prop.value);
            return `${key}: ${value}`;
        });
        return `{ ${properties.join(', ')} }`;
    } else {
        return 'complex_expression';
    }
}