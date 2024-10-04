import os
import re

def create_file_from_content(base_dir, file_path, content):
    full_path = os.path.join(base_dir, file_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Created file: {full_path}")

def parse_readme_and_create_files(readme_path):
    with open(readme_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Get the directory of the README file
    base_dir = os.path.dirname(readme_path)

    # Split the content into sections based on the numbered file paths
    sections = re.split(r'\n\d+\.\s+`([^`]+)`:', content)

    # The first element is the text before any file paths, so we skip it
    sections = sections[1:]

    for i in range(0, len(sections), 2):
        file_path = sections[i].strip()
        file_content = sections[i + 1].strip() if i + 1 < len(sections) else ""

        # Remove the leading newline and any code block markers
        file_content = re.sub(r'^\n+```\w*\n', '', file_content)
        file_content = re.sub(r'\n+```\s*$', '', file_content)

        create_file_from_content(base_dir, file_path, file_content)

if __name__ == "__main__":
    # Use raw string for Windows file path
    script_dir = os.path.dirname(os.path.abspath(__file__))
    default_path = os.path.join(script_dir, "test2.MD")
    readme_path = input(f"Enter the path to your README file (press Enter to use default: {default_path}): ")
    
    if not readme_path:
        readme_path = default_path

    # Ensure the path is properly formatted for Windows
    readme_path = os.path.normpath(readme_path)

    if not os.path.exists(readme_path):
        print(f"Error: The file {readme_path} does not exist.")
    else:
        parse_readme_and_create_files(readme_path)
        print("File generation complete!")