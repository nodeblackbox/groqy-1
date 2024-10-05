import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';
import fs from 'fs/promises';
import path from 'path';

export const extractComponents = async (fileContent) => {
    const ast = parse(fileContent, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
    });

    const components = {};

    traverse(ast, {
        VariableDeclarator(path) {
            if (t.isArrowFunctionExpression(path.node.init) || t.isFunctionExpression(path.node.init))
            {
                const componentName = path.node.id.name;
                components[componentName] = {
                    name: componentName,
                    code: fileContent.slice(path.node.start, path.node.end),
                    type: 'FunctionComponent',
                    props: extractProps(path.node.init),
                    childComponents: [],
                    stateVariables: [],
                    hooks: [],
                };
                extractComponentDetails(path, components[componentName]);
            }
        },
        FunctionDeclaration(path) {
            const componentName = path.node.id.name;
            components[componentName] = {
                name: componentName,
                code: fileContent.slice(path.node.start, path.node.end),
                type: 'FunctionComponent',
                props: extractProps(path.node),
                childComponents: [],
                stateVariables: [],
                hooks: [],
            };
            extractComponentDetails(path, components[componentName]);
        },
    });

    return components;
};

const extractProps = (node) => {
    if (t.isArrowFunctionExpression(node) || t.isFunctionExpression(node))
    {
        return node.params[0]?.properties?.map(prop => prop.key.name) || [];
    } else if (t.isFunctionDeclaration(node))
    {
        return node.params[0]?.properties?.map(prop => prop.key.name) || [];
    }
    return [];
};

const extractComponentDetails = (path, component) => {
    path.traverse({
        JSXElement(jsxPath) {
            const elementName = jsxPath.node.openingElement.name.name;
            if (elementName[0] === elementName[0].toUpperCase() && !component.childComponents.includes(elementName))
            {
                component.childComponents.push(elementName);
            }
        },
        CallExpression(callPath) {
            if (callPath.node.callee.name === 'useState')
            {
                const stateVariable = callPath.parent.id.elements[0].name;
                component.stateVariables.push(stateVariable);
            } else if (callPath.node.callee.name?.startsWith('use'))
            {
                const hookName = callPath.node.callee.name;
                if (!component.hooks.includes(hookName))
                {
                    component.hooks.push(hookName);
                }
            }
        },
    });
};

export const organizeComponents = async (components, originalFilePath) => {
    const dir = path.dirname(originalFilePath);
    const fileName = path.basename(originalFilePath, path.extname(originalFilePath));
    const componentDir = path.join(dir, `${fileName}-components`);

    await fs.mkdir(componentDir, { recursive: true });

    const organizedComponents = {};

    for (const [name, component] of Object.entries(components))
    {
        const componentCode = `import React from 'react';\n\n${component.code}\n\nexport default ${name};`;
        const componentPath = path.join(componentDir, `${name}.js`);
        await fs.writeFile(componentPath, componentCode);
        organizedComponents[name] = {
            ...component,
            path: path.relative(dir, componentPath),
        };
    }

    const indexContent = Object.keys(components)
        .map(name => `export { default as ${name} } from './${name}';`)
        .join('\n');
    await fs.writeFile(path.join(componentDir, 'index.js'), indexContent);

    const updatedOriginalContent = `
import React from 'react';
${Object.keys(components).map(name => `import { ${name} } from './${fileName}-components';`).join('\n')}

// Rest of the file content...
`;

    await fs.writeFile(originalFilePath, updatedOriginalContent);

    return organizedComponents;
};