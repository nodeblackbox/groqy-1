import os
import sys

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

def generate_readme(folder_path):
    readme_content = f"# Project Structure\n\n```\n{generate_tree(folder_path)}\n```\n\n"
    readme_content += "# File Contents\n\n"

    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith(('.js', '.ts', '.jsx', '.tsx')):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, folder_path)
                readme_content += f"## `{relative_path}`\n\n"
                readme_content += "```javascript\n"
                readme_content += read_file_content(file_path)
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
    
    readme_path = os.path.join(folder_path, "cursorrules.md")
    with open(readme_path, 'w', encoding='utf-8') as readme_file:
        readme_file.write(readme_content)

    print(f"cursorrules.md has been generated at {readme_path}")

if __name__ == "__main__":
    main()