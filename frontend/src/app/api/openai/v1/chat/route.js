// Import necessary modules
const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');
const router = express.Router();

// Define base paths for different parts of the application
const API_BASE_PATH = path.join(process.cwd(), 'frontend', 'src', 'app', 'api', 'openai', 'v1');
const PAGES_BASE_PATH = path.join(process.cwd(), 'frontend', 'src', 'app');
const COMPONENTS_BASE_PATH = path.join(process.cwd(), 'frontend', 'src', 'components');
const DOCUMENTATION_BASE_PATH = path.join(process.cwd(), 'frontend', 'src', 'app', 'documentation');
const CONFIG_PATH = path.join(process.cwd(), 'frontend', 'src', 'app', 'api', 'openai', 'v1', 'config');

// Initialize an empty array to store API information
let apiList = [];

// Get the secret key from environment variables or use a default
const secretKey = process.env.API_MAKER_SECRET_KEY || 'default-secret-key';

/**
 * Middleware to validate the authorization token
 */
function validateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    const hash = crypto.createHmac('sha256', secretKey).update(token).digest('hex');
    if (hash !== token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

/**
 * GET handler for retrieving the list of APIs
 */
router.get('/', validateToken, (req, res) => {
    res.status(200).json({ apis: apiList });
});

/**
 * POST handler for creating new API endpoints or pages
 */
router.post('/', validateToken, async (req, res) => {
    try {
        const { name, type, method, apiPath, handler, responseType, bearerToken, componentImports, apiCalls, config } = req.body;

        // Validate required fields
        if (!name || !type || !apiPath || !handler) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Ensure method is provided for API endpoints
        if (type === 'api' && !method) {
            return res.status(400).json({ error: 'Method is required for API endpoints' });
        }

        let filePath;
        let fileContent;
        let docContent;

        // Generate content based on the type (API or page)
        if (type === 'api') {
            filePath = path.join(API_BASE_PATH, ...apiPath.split('/'), 'route.js');
            fileContent = generateApiContent(name, method, handler, responseType, bearerToken, componentImports, apiCalls);
            docContent = generateApiDocContent(name, method, apiPath, responseType, bearerToken, apiCalls);
        } else if (type === 'page') {
            filePath = path.join(PAGES_BASE_PATH, ...apiPath.split('/'), 'page.jsx');
            fileContent = generatePageContent(name, handler, componentImports);
            docContent = generatePageDocContent(name, apiPath, componentImports);
        } else {
            return res.status(400).json({ error: 'Invalid type. Must be "api" or "page".' });
        }

        // Create directories and write the file
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, fileContent);

        // Create documentation
        const docPath = path.join(DOCUMENTATION_BASE_PATH, `${name}.mdx`);
        await fs.mkdir(path.dirname(docPath), { recursive: true });
        await fs.writeFile(docPath, docContent);

        // Save configuration if provided
        if (config) {
            const configPathFile = path.join(CONFIG_PATH, `${name}.json`);
            await fs.mkdir(path.dirname(configPathFile), { recursive: true });
            await fs.writeFile(configPathFile, JSON.stringify(config, null, 2));
        }

        // Add to API list
        apiList.push({ name, type, method, path: apiPath });

        // Create API for documentation
        await createDocumentationApi(name, apiPath, type);

        // Return success response
        res.status(201).json({
            message: `${type === 'api' ? 'API endpoint' : 'Page'} created successfully`,
            config: { name, type, method, path: apiPath, responseType, bearerToken, componentImports, apiCalls },
        });

    } catch (error) {
        console.error('Error creating endpoint:', error);
        res.status(500).json({ error: 'Failed to create endpoint' });
    }
});

/**
 * DELETE handler for removing API endpoints or pages
 */
router.delete('/', validateToken, async (req, res) => {
    try {
        const { name, type, apiPath } = req.body;

        // Validate required fields
        if (!name || !type || !apiPath) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        let filePath;
        // Determine the file path based on the type
        if (type === 'api') {
            filePath = path.join(API_BASE_PATH, ...apiPath.split('/'), 'route.js');
        } else if (type === 'page') {
            filePath = path.join(PAGES_BASE_PATH, ...apiPath.split('/'), 'page.jsx');
        } else {
            return res.status(400).json({ error: 'Invalid type. Must be "api" or "page".' });
        }

        // Delete the file
        await fs.unlink(filePath);

        // Remove documentation
        const docPath = path.join(DOCUMENTATION_BASE_PATH, `${name}.mdx`);
        await fs.unlink(docPath);

        // Remove documentation API
        const docApiPath = path.join(API_BASE_PATH, 'documentation', `${name}.js`);
        await fs.unlink(docApiPath);

        // Remove configuration
        const configPathFile = path.join(CONFIG_PATH, `${name}.json`);
        await fs.unlink(configPathFile);

        // Remove from API list
        apiList = apiList.filter(api => !(api.name === name && api.type === type && api.path === apiPath));

        // Return success response
        res.status(200).json({ message: `${type === 'api' ? 'API endpoint' : 'Page'} deleted successfully` });

    } catch (error) {
        console.error('Error deleting endpoint:', error);
        res.status(500).json({ error: 'Failed to delete endpoint' });
    }
});

/**
 * Helper Functions
 */

/**
 * Generate content for an API endpoint
 */
function generateApiContent(name, method, handler, responseType, bearerToken, componentImports, apiCalls) {
    const imports = generateImports(componentImports);
    const apiCallsCode = generateApiCalls(apiCalls);
    return `
${imports}
const express = require('express');
const router = express.Router();
const axios = require('axios');

${generateResponseType(responseType)}

${apiCallsCode}

router.${method.toLowerCase()}('/', ${bearerToken ? 'authenticateToken,' : ''} async (req, res) => {
    try {
        ${handler}
    } catch (error) {
        console.error('Error in ${name}:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
`;
}

/**
 * Generate API call functions
 */
function generateApiCalls(apiCalls) {
    if (!apiCalls || apiCalls.length === 0) return '';
    return apiCalls.map(api => `
async function call${api.name}API(data) {
    try {
        const response = await axios.${api.method.toLowerCase()}('${api.url}', data);
        return response.data;
    } catch (error) {
        console.error('Error calling ${api.name} API:', error);
        throw error;
    }
}
`).join('\n');
}

/**
 * Generate content for a page
 */
function generatePageContent(name, handler, componentImports) {
    const imports = generateImports(componentImports);
    return `
import React from 'react';
${imports}

const ${name}Page = () => {
    ${handler}
};

export default ${name}Page;
`;
}

/**
 * Generate import statements for components
 */
function generateImports(componentImports) {
    if (!componentImports || componentImports.length === 0) return '';
    return componentImports.map(comp => `const ${comp} = require('@/components/${comp}');`).join('\n');
}

/**
 * Generate JSDoc for response type
 */
function generateResponseType(responseType) {
    if (!responseType) return '';
    let typedef = '/**\n * @typedef {Object} ResponseType\n';
    Object.entries(responseType).forEach(([key, type]) => {
        typedef += ` * @property {${type}} ${key}\n`;
    });
    typedef += ' */\n';
    return typedef;
}

/**
 * Generate API documentation content
 */
function generateApiDocContent(name, method, apiPath, responseType, bearerToken, apiCalls) {
    const apiCallsDoc = apiCalls && apiCalls.length > 0 ?
        `## API Calls

This API makes calls to the following APIs:

${apiCalls.map(api => `- **${api.name}**: \`${api.method} ${api.url}\``).join('\n')}
` : '';

    return `
# ${name} API

## Endpoint

\`${method.toUpperCase()} /api/openai/v1/${apiPath}\`

## Description

This API endpoint handles ${name} operations.

## Authentication

${bearerToken ? 'This endpoint requires a Bearer token for authentication.' : 'No authentication required.'}

## Request

### Headers

${bearerToken ? '- Authorization: Bearer <your_token>' : 'No specific headers required.'}

### Body

Describe the request body here.

## Response

${responseType ? `\`\`\`json
${JSON.stringify(responseType, null, 2)}
\`\`\`` : 'Describe the response structure here.'}

${apiCallsDoc}

## Example

Provide an example request and response here.
`;
}

/**
 * Create an API endpoint for serving documentation
 */
async function createDocumentationApi(name, apiPath, type) {
    const docApiPath = path.join(API_BASE_PATH, 'documentation', `${name}.js`);
    const docApiContent = `
const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');

router.get('/', async (req, res) => {
    try {
        const docPath = path.join(process.cwd(), 'frontend', 'src', 'app', 'documentation', '${name}.mdx');
        const content = await fs.readFile(docPath, 'utf-8');
        res.status(200).json({ content });
    } catch (error) {
        console.error('Error fetching documentation:', error);
        res.status(500).json({ error: 'Failed to fetch documentation' });
    }
});

module.exports = router;
`;
    await fs.mkdir(path.dirname(docApiPath), { recursive: true });
    await fs.writeFile(docApiPath, docApiContent);
}

module.exports = router;
