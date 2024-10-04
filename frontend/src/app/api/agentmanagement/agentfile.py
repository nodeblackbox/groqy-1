import os
import re

def sanitize_filename(name):
    return re.sub(r'[^\w\-_\. ]', '_', name)

def create_file(path, content=''):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)

def generate_route_file(method, path):
    content = f"""/**
 * @file {path} - {method} handler
 * @description Handles {method} requests for {path}
 */

import {{ NextResponse }} from 'next/server';

// You can import necessary utilities or services here
// import {{ someUtilityFunction }} from '@/utils/someUtility';
// import SomeService from '@/services/SomeService';

/**
 * Handles {method} requests for {path}
 * @param {{NextRequest}} request - The incoming request object
 * @returns {{Promise<NextResponse>}} The response object
 */
export async function {method.lower()}(request) {{
  try {{
    // Your {method.lower()} logic here
    // const someData = await SomeService.getData();
    
    return NextResponse.json(
      {{ message: '{method} request to {path} successful' }},
      {{ status: 200 }}
    );
  }} catch (error) {{
    console.error('Error in {path} {method} handler:', error);
    return NextResponse.json(
      {{ error: 'An internal server error occurred' }},
      {{ status: 500 }}
    );
  }}
}}

// Export other HTTP methods as needed
// export async function post(request) {{ ... }}
// export async function put(request) {{ ... }}
// export async function delete(request) {{ ... }}
"""
    return content

# List of API endpoints
endpoints = [
    ("POST", "/api/upload"),
    ("POST", "/api/users/register"),
    ("POST", "/api/users/login"),
    ("POST", "/api/admin/promote"),
    ("GET", "/api/users/me"),
    ("POST", "/api/tasks"),
    ("GET", "/api/tasks/[id]"),
    ("POST", "/api/tasks/assign"),
    ("PUT", "/api/tasks/[id]"),
    ("GET", "/api/tasks"),
    ("DELETE", "/api/tasks/[id]"),
    ("GET", "/api/submissions"),
    ("POST", "/api/projects"),
    ("GET", "/api/projects"),
    ("GET", "/api/projects/[id]"),
    ("PUT", "/api/projects/[id]"),
    ("DELETE", "/api/projects/[id]"),
    ("POST", "/api/comments"),
    ("GET", "/api/comments/[taskId]"),
    ("GET", "/api/admin/users"),
    ("GET", "/api/admin/overview"),
    ("GET", "/api/admin/task-status"),
    ("GET", "/api/admin/user-activity"),
    ("POST", "/api/admin/tasks/assign"),
    ("GET", "/api/users"),
    ("PUT", "/api/users/[id]"),
    ("DELETE", "/api/users/[id]"),
    ("PUT", "/api/admin/tasks/[id]"),
    ("GET", "/api/admin/analytics/user-activity"),
    ("GET", "/api/admin/analytics/task-completion"),
    ("POST", "/api/processor"),
]

# Generate files
for method, path in endpoints:
    parts = path.strip('/').split('/')
    filename = sanitize_filename(parts[-1])
    if filename.startswith('[') and filename.endswith(']'):
        filename = filename[1:-1]
    
    folder_path = os.path.join('app', *parts)
    file_path = os.path.join(folder_path, "route.js")
    
    content = generate_route_file(method, path)
    create_file(file_path, content)
    print(f"Created: {file_path}")

print("Next.js 14 JavaScript API route files generated successfully!")