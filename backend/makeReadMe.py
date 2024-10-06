import os
import sys
import re
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def generate_tree(startpath):
    tree = []
    for root, dirs, files in os.walk(startpath):
        # Exclude venv directory
        if 'venv' in dirs:
            dirs.remove('venv')
        
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
            content = file.read()
            logging.info(f"Successfully read file: {file_path}")
            return content
    except Exception as e:
        logging.error(f"Error reading file {file_path}: {str(e)}")
        return f"Error reading file: {str(e)}"

def extract_function_names(content):
    pattern = r'(async\s+)?def\s+(\w+)|class\s+(\w+)'
    matches = re.findall(pattern, content)
    return [match[1] or match[2] for match in matches if match[1] or match[2]]

def generate_implementation_prompt(file_path, content):
    functions = extract_function_names(content)
    relative_path = os.path.relpath(file_path, start=os.getcwd())
    prompt = f"Implement the following functions/classes for the file '{relative_path}':\n\n"
    for func in functions:
        prompt += f"- {func}\n"
    prompt += "\nEnsure that the implementation follows best practices and integrates with the existing project structure."
    return prompt

def get_file_language(file_extension):
    language_map = {
        '.js': 'javascript',
        '.ts': 'typescript',
        '.jsx': 'jsx',
        '.tsx': 'tsx',
        '.py': 'python',
        '.yml': 'yaml',
        '.env': 'plaintext'
    }
    return language_map.get(file_extension.lower(), 'plaintext')

def generate_readme(folder_path):
    project_name = os.path.basename(os.path.dirname(folder_path))
    readme_content = f"# {project_name}\n\n"
    readme_content += "## Project Structure\n\n```\n"
    readme_content += generate_tree(folder_path)
    readme_content += "\n```\n\n"
    readme_content += "## File Contents and Implementation Guidelines\n\n"

    for root, dirs, files in os.walk(folder_path):
        # Exclude venv directory
        if 'venv' in dirs:
            dirs.remove('venv')
        
        for file in files:
            file_extension = os.path.splitext(file)[1]
            if file_extension in ['.js', '.ts', '.jsx', '.tsx', '.py', '.env', '.yml']:
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, folder_path)
                content = read_file_content(file_path)
                
                readme_content += f"### `{relative_path}`\n\n"
                readme_content += "#### File Content:\n"
                language = get_file_language(file_extension)
                readme_content += f"```{language}\n"
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
        folder_path = os.getcwd()

    if not os.path.isdir(folder_path):
        logging.error(f"Error: {folder_path} is not a valid directory")
        sys.exit(1)

    logging.info(f"Generating documentation for: {folder_path}")
    readme_content = generate_readme(folder_path)
    
    readme_path = os.path.join(folder_path, "PROJECT_DOCUMENTATION.md")
    try:
        with open(readme_path, 'w', encoding='utf-8') as readme_file:
            readme_file.write(readme_content)
        logging.info(f"PROJECT_DOCUMENTATION.md has been generated at {readme_path}")
    except Exception as e:
        logging.error(f"Error writing documentation file: {str(e)}")

if __name__ == "__main__":
    main()