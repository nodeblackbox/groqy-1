import os
import sys
import re

def generate_tree(startpath):
    tree = []
    for root, dirs, files in os.walk(startpath):
        level = root.replace(startpath, '').count(os.sep)
        indent = '│   ' * (level - 1) + '├── ' if level > 0 else ''
        tree.append(f"{indent}{os.path.basename(root)}/")
        subindent = '│   ' * level + '├── '
        for f in files:
            tree.append(f"{subindent}{f}")
    return '\n'.join(tree)

def read_file_content(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        return f"Error reading file: {str(e)}"

def extract_function_names(content):
    pattern = r'(async\s+)?function\s+(\w+)|const\s+(\w+)\s*=\s*(async\s*)?\('
    matches = re.findall(pattern, content)
    return [match[1] or match[2] for match in matches if match[1] or match[2]]

def generate_implementation_prompt(file_path, content):
    functions = extract_function_names(content)
    relative_path = os.path.relpath(file_path, start=os.getcwd())
    prompt = f"Implement the following functions for the file '{relative_path}':\n\n"
    for func in functions:
        prompt += f"- {func}\n"
    prompt += "\nEnsure that the implementation follows Next.js 14 best practices and integrates with the existing project structure."
    return prompt

def generate_readme(folder_path):
    readme_content = "# Next.js 14 API and Agent Management System\n\n"
    readme_content += "## Project Structure\n\n```\n"
    readme_content += generate_tree(folder_path)
    readme_content += "\n```\n\n"
    readme_content += "## File Contents and Implementation Guidelines\n\n"

    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith(('.js', '.ts', '.jsx', '.tsx', ".env",".md",".yml")):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, folder_path)
                content = read_file_content(file_path)
                
                readme_content += f"### `{relative_path}`\n\n"
                readme_content += "#### File Content:\n"
                readme_content += "```javascript\n"
                readme_content += content
                readme_content += "\n```\n\n"
                
                readme_content += "#### Implementation Guidelines:\n"
                readme_content += "- Purpose: [Briefly describe the purpose of this file]\n"
                readme_content += "- Key Components/Functions:\n"
                for func in extract_function_names(content):
                    readme_content += f"  - `{func}`: [Describe the purpose and expected behavior]\n"
                readme_content += "- Integration Points: [Describe how this file integrates with other parts of the system]\n"
                readme_content += "- Data Flow: [Explain the data flow in and out of this file]\n"
                readme_content += "- Error Handling: [Describe any specific error handling requirements]\n\n"
                
                readme_content += "#### Implementation Prompt:\n"
                readme_content += "```\n"
                readme_content += generate_implementation_prompt(file_path, content)
                readme_content += "\n```\n\n"

    return readme_content

def main():
    if len(sys.argv) > 1:
        folder_path = sys.argv[1]
    else:
        folder_path = os.path.join(os.getcwd(), 'src', 'app', 'api', 'agentmanagement')

    if not os.path.isdir(folder_path):
        print(f"Error: {folder_path} is not a valid directory")
        sys.exit(1)

    readme_content = generate_readme(folder_path)
    
    readme_path = os.path.join(folder_path, "PROJECT_DOCUMENTATION.md")
    with open(readme_path, 'w', encoding='utf-8') as readme_file:
        readme_file.write(readme_content)

    print(f"PROJECT_DOCUMENTATION.md has been generated at {readme_path}")

if __name__ == "__main__":
    main()
    
    
