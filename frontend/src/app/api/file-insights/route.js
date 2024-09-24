// src/app/api/file-insights/route.js
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

export async function POST(req) {
    const { filePath } = await req.json();
    const fullPath = path.join(process.cwd(), filePath);

    try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const insights = analyzeFile(content, filePath);
        return NextResponse.json(insights);
    } catch (error) {
        console.error('Error analyzing file:', error);
        return NextResponse.json({ error: 'Error analyzing file' }, { status: 500 });
    }
}

function analyzeFile(content, filePath) {
    const ast = parse(content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
    });

    const insights = {
        imports: [],
        exports: [],
        components: [],
        hooks: [],
        props: [],
        stateVariables: [],
        functions: [],
        dependencies: new Set(),
    };

    traverse(ast, {
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
            if (path.node.init && path.node.init.type === 'ArrowFunctionExpression') {
                insights.components.push(path.node.id.name);
            }
            if (path.node.init && path.node.init.type === 'CallExpression' && path.node.init.callee.name === 'useState') {
                insights.stateVariables.push(path.node.id.name);
            }
        },
        FunctionDeclaration(path) {
            insights.functions.push(path.node.id.name);
        },
        CallExpression(path) {
            if (path.node.callee.name && path.node.callee.name.startsWith('use')) {
                insights.hooks.push(path.node.callee.name);
            }
        },
        JSXOpeningElement(path) {
            const componentName = path.node.name.name;
            if (componentName && componentName[0] === componentName[0].toUpperCase()) {
                insights.components.push(componentName);
            }
            path.node.attributes.forEach(attr => {
                if (attr.type === 'JSXAttribute') {
                    insights.props.push(attr.name.name);
                }
            });
        },
    });

    insights.dependencies = Array.from(insights.dependencies);
    return insights;
}