// backend/app/utils/generateContent.js

import fs from 'fs/promises';
import path from 'path';

/**
 * Generate content for an API endpoint
 * @param {string} name - The name of the API
 * @param {string} method - The HTTP method (GET, POST, etc.)
 * @param {string} handler - The handler code
 * @param {Object} responseType - The response type definition
 * @param {boolean} bearerToken - Whether bearer token authentication is required
 * @param {string[]} componentImports - List of components to import
 * @param {Object[]} apiCalls - List of API calls made by this endpoint
 * @returns {string} The generated API content
 */
export function generateApiContent(
    name,
    method,
    handler,
    responseType,
    bearerToken,
    componentImports,
    apiCalls
) {
    const imports = generateImports(componentImports);
    const apiCallsCode = generateApiCalls(apiCalls);
    const responseTypeDef = responseType ? generateResponseType(responseType) : '';
    const bearerTokenCheck = bearerToken ? generateBearerTokenCheck() : '';

    return `
${imports}
import { NextResponse } from 'next/server';
import axios from 'axios';

${responseTypeDef}

${apiCallsCode}

export async function ${method.toLowerCase()}(req) {
  ${bearerTokenCheck}

  try {
    ${handler}
  } catch (error) {
    console.error('Error in ${name}:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
`;
}

/**
 * Generate API call functions
 * @param {Object[]} apiCalls - List of API calls
 * @returns {string} The generated API call functions
 */
function generateApiCalls(apiCalls) {
    if (!apiCalls || apiCalls.length === 0) return '';
    return apiCalls
        .map(
            (api) => `
export async function call${capitalize(api.name)}API(data) {
  try {
    const response = await axios.${api.method.toLowerCase()}('${api.url}', data);
    return response.data;
  } catch (error) {
    console.error('Error calling ${api.name} API:', error);
    throw error;
  }
}
`
        )
        .join('\n');
}

/**
 * Generate content for a page
 * @param {string} name - The name of the page
 * @param {string} handler - The handler code
 * @param {string[]} componentImports - List of components to import
 * @returns {string} The generated page content
 */
export function generatePageContent(name, handler, componentImports) {
    const imports = generateImports(componentImports);

    return `
import React from 'react';
${imports}

export default function ${capitalize(name)}Page() {
  return (
    <div>
      <h1>${name}</h1>
      ${handler}
    </div>
  );
}
`;
}

/**
 * Generate JSDoc for response type
 * @param {Object} responseType - The response type definition
 * @returns {string} The generated JSDoc for response type
 */
function generateResponseType(responseType) {
    let doc = `
/**
 * @typedef {Object} ResponseType
`;
    for (const [key, type] of Object.entries(responseType)) {
        doc += ` * @property {${type}} ${key}\n`;
    }
    doc += ` */\n`;
    return doc;
}

/**
 * Generate import statements for components
 * @param {string[]} componentImports - List of components to import
 * @returns {string} The generated import statements
 */
function generateImports(componentImports) {
    if (!componentImports || componentImports.length === 0) return '';
    return componentImports
        .map((comp) => `import ${comp} from '@/components/${comp}';`)
        .join('\n');
}

/**
 * Generate bearer token check code
 * @returns {string} The generated bearer token check code
 */
function generateBearerTokenCheck() {
    return `
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing or invalid bearer token' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  // TODO: Implement token validation logic here
`;
}

/**
 * Capitalize the first letter of a string
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
function capitalize(str) {
    if (typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate API documentation content
 * @param {string} name - The name of the API
 * @param {string} method - The HTTP method
 * @param {string} path - The API path
 * @param {Object} responseType - The response type definition
 * @param {boolean} bearerToken - Whether bearer token authentication is required
 * @param {Object[]} apiCalls - List of API calls made by this endpoint
 * @returns {string} The generated API documentation content
 */
export function generateApiDocContent(
    name,
    method,
    path,
    responseType,
    bearerToken,
    apiCalls
) {
    const apiCallsDoc =
        apiCalls && apiCalls.length > 0
            ? `
## API Calls

This API makes calls to the following APIs:

${apiCalls.map((api) => `- **${api.name}**: \`${api.method} ${api.url}\``).join('\n')}
`
            : '';

    return `
# ${name} API

## Endpoint

\`${method} /api/openai/v1/${path}\`

## Description

This API endpoint ${name} ...

## Authentication

${bearerToken ? 'This endpoint requires a Bearer token for authentication.' : 'No authentication required.'}

## Request

### Headers

${bearerToken ? '- Authorization: Bearer <your_token>' : 'No specific headers required.'}

### Body

Describe the request body here.

## Response

${responseType
            ? `\`\`\`json
${JSON.stringify(responseType, null, 2)}
\`\`\``
            : 'Describe the response structure here.'}

${apiCallsDoc}

## Example

Provide an example request and response here.
`;
}

/**
 * Generate page documentation content
 * @param {string} name - The name of the page
 * @param {string} path - The page path
 * @param {string[]} componentImports - List of components used in the page
 * @returns {string} The generated page documentation content
 */
export function generatePageDocContent(name, path, componentImports) {
    return `
# ${name} Page

## Route

\`/${path}\`

## Description

This page ${name} ...

## Components Used

${componentImports && componentImports.length > 0
            ? componentImports.map((comp) => `- ${comp}`).join('\n')
            : 'No specific components used.'}

## Data Requirements

Describe any data requirements or API calls made by this page.

## Example

Provide a screenshot or description of what the page looks like.
`;
}
