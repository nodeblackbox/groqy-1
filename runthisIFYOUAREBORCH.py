import os
import re
import yaml
import json
import time
import logging
import threading
import tkinter as tk
from tkinter import filedialog, messagebox, simpledialog, ttk
from groq import Groq
from pygments import highlight
from pygments.lexers import get_lexer_for_filename
from pygments.formatters import HtmlFormatter
import html2text

# Constants
CONFIG_FILE = 'config.json'
LOG_FILE = 'project_analyzer.log'
RATE_LIMIT = 2  # seconds between API calls

# Set up logging
logging.basicConfig(
    filename=LOG_FILE,
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
)

class ProjectAnalyzerGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Project Analyzer")
        self.root.geometry("1200x800")
        self.root.protocol("WM_DELETE_WINDOW", self.on_close)

        self.config = self.load_config()
        self.api_key = self.config.get('api_key', '')
        self.client = None
        self.project_dir = self.config.get('project_dir', '')
        self.selected_files = self.config.get('selected_files', [])
        self.system_prompt = self.config.get('system_prompt', "You are an AI assistant analyzing a project structure.")
        self.user_prompt = self.config.get('user_prompt', "Analyze the following project structure:")
        self.include_context = tk.BooleanVar(value=self.config.get('include_context', True))
        self.excluded_dirs = set(self.config.get('excluded_dirs', ['.git', '__pycache__', 'node_modules']))
        self.excluded_extensions = set(self.config.get('excluded_extensions', ['.log', '.pyc', '.pyo']))

        self.create_widgets()
        self.populate_fields()

    def create_widgets(self):
        # Main frame
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.pack(fill=tk.BOTH, expand=True)

        # API Key Entry
        api_frame = ttk.Frame(main_frame)
        api_frame.pack(fill=tk.X, pady=(0, 10))
        ttk.Label(api_frame, text="API Key:").pack(side=tk.LEFT)
        self.api_key_entry = ttk.Entry(api_frame, show="*", width=50)
        self.api_key_entry.pack(side=tk.LEFT, padx=(5, 0), expand=True, fill=tk.X)

        # Project Directory Selection
        dir_frame = ttk.Frame(main_frame)
        dir_frame.pack(fill=tk.X, pady=(0, 10))
        ttk.Label(dir_frame, text="Project Directory:").pack(side=tk.LEFT)
        self.dir_entry = ttk.Entry(dir_frame, width=50)
        self.dir_entry.pack(side=tk.LEFT, padx=(5, 5), expand=True, fill=tk.X)
        ttk.Button(dir_frame, text="Browse", command=self.browse_directory).pack(side=tk.LEFT)

        # File Selection
        file_frame = ttk.Frame(main_frame)
        file_frame.pack(fill=tk.BOTH, expand=True, pady=(0, 10))
        ttk.Label(file_frame, text="Select Files:").pack(anchor=tk.W)
        self.file_listbox = tk.Listbox(file_frame, selectmode=tk.MULTIPLE)
        self.file_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar = ttk.Scrollbar(file_frame, orient=tk.VERTICAL, command=self.file_listbox.yview)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.file_listbox.config(yscrollcommand=scrollbar.set)

        # Buttons frame
        button_frame = ttk.Frame(main_frame)
        button_frame.pack(fill=tk.X, pady=(0, 10))
        ttk.Button(button_frame, text="Refresh File List", command=self.populate_file_list).pack(side=tk.LEFT)
        ttk.Button(button_frame, text="Add Exclusion", command=self.add_exclusion).pack(side=tk.LEFT, padx=(5, 0))
        ttk.Button(button_frame, text="Remove Exclusion", command=self.remove_exclusion).pack(side=tk.LEFT, padx=(5, 0))

        # Prompts
        prompt_frame = ttk.Frame(main_frame)
        prompt_frame.pack(fill=tk.BOTH, expand=True, pady=(0, 10))
        ttk.Label(prompt_frame, text="System Prompt:").pack(anchor=tk.W)
        self.system_prompt_text = tk.Text(prompt_frame, height=3, width=50)
        self.system_prompt_text.pack(fill=tk.X)
        ttk.Label(prompt_frame, text="User Prompt:").pack(anchor=tk.W)
        self.user_prompt_text = tk.Text(prompt_frame, height=3, width=50)
        self.user_prompt_text.pack(fill=tk.X)

        # Include Context Checkbox
        ttk.Checkbutton(main_frame, text="Include Context in Report", variable=self.include_context).pack(anchor=tk.W)

        # Analyze Button
        ttk.Button(main_frame, text="Analyze Project", command=self.analyze_project, style="Accent.TButton").pack(pady=(10, 0))

    def populate_fields(self):
        if self.api_key:
            self.api_key_entry.insert(0, self.api_key)
        if self.project_dir:
            self.dir_entry.insert(0, self.project_dir)
        self.system_prompt_text.insert(tk.END, self.system_prompt)
        self.user_prompt_text.insert(tk.END, self.user_prompt)
        self.populate_file_list()

    def browse_directory(self):
        self.project_dir = filedialog.askdirectory(initialdir=self.project_dir)
        if self.project_dir:
            self.dir_entry.delete(0, tk.END)
            self.dir_entry.insert(0, self.project_dir)
            self.populate_file_list()

    def populate_file_list(self):
        self.file_listbox.delete(0, tk.END)
        if not self.project_dir:
            return
        for root, dirs, files in os.walk(self.project_dir):
            dirs[:] = [d for d in dirs if d not in self.excluded_dirs]
            for file in files:
                if not any(file.endswith(ext) for ext in self.excluded_extensions):
                    file_path = os.path.join(root, file)
                    self.file_listbox.insert(tk.END, file_path)

    def add_exclusion(self):
        exclusion = simpledialog.askstring("Add Exclusion", "Enter directory name or file extension (e.g., .log):")
        if exclusion:
            if exclusion.startswith('.'):
                self.excluded_extensions.add(exclusion)
            else:
                self.excluded_dirs.add(exclusion)
            self.populate_file_list()

    def remove_exclusion(self):
        exclusions = list(self.excluded_dirs) + list(self.excluded_extensions)
        choice = simpledialog.askstring("Remove Exclusion", f"Current exclusions: {', '.join(exclusions)}\nEnter exclusion to remove:")
        if choice:
            if choice in self.excluded_dirs:
                self.excluded_dirs.remove(choice)
            elif choice in self.excluded_extensions:
                self.excluded_extensions.remove(choice)
            self.populate_file_list()

    def analyze_project(self):
        self.api_key = self.api_key_entry.get().strip()
        if not self.api_key:
            messagebox.showerror("API Key Error", "Please enter your API key.")
            return
        self.client = self.initialize_groq_client(self.api_key)
        if not self.client:
            return

        selected_indices = self.file_listbox.curselection()
        self.selected_files = [self.file_listbox.get(i) for i in selected_indices] if selected_indices else None

        self.system_prompt = self.system_prompt_text.get("1.0", tk.END).strip()
        self.user_prompt = self.user_prompt_text.get("1.0", tk.END).strip()

        if not self.project_dir:
            messagebox.showerror("Directory Error", "Please select a project directory.")
            return

        self.save_current_config()
        threading.Thread(target=self.run_analysis, daemon=True).start()

    def run_analysis(self):
        try:
            report = self.generate_project_report(
                self.client,
                self.project_dir,
                self.selected_files,
                self.system_prompt,
                self.user_prompt,
                self.include_context.get()
            )

            output_file = filedialog.asksaveasfilename(
                defaultextension=".md",
                filetypes=[("Markdown files", "*.md"), ("All files", "*.*")]
            )
            if output_file:
                with open(output_file, 'w', encoding='utf-8') as f:
                    f.write(report)
                messagebox.showinfo("Success", f"Report saved to {output_file}")
        except Exception as e:
            self.log_error("Error during analysis thread", e)
            messagebox.showerror("Analysis Error", f"An error occurred during analysis: {e}")

    def save_current_config(self):
        self.config['api_key'] = self.api_key
        self.config['project_dir'] = self.project_dir
        self.config['selected_files'] = self.selected_files if self.selected_files else []
        self.config['system_prompt'] = self.system_prompt
        self.config['user_prompt'] = self.user_prompt
        self.config['include_context'] = self.include_context.get()
        self.config['excluded_dirs'] = list(self.excluded_dirs)
        self.config['excluded_extensions'] = list(self.excluded_extensions)
        self.save_config(self.config)

    def on_close(self):
        self.save_current_config()
        self.root.destroy()

    @staticmethod
    def initialize_groq_client(api_key):
        try:
            client = Groq(api_key=api_key)
            logging.info("Groq client initialized successfully.")
            return client
        except Exception as e:
            logging.error(f"Failed to initialize Groq client: {e}")
            messagebox.showerror("API Key Error", f"Failed to initialize Groq client: {e}")
            return None

    @staticmethod
    def load_config():
        if not os.path.exists(CONFIG_FILE):
            return {}
        try:
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logging.error(f"Error loading configuration: {e}")
            return {}

    @staticmethod
    def save_config(config):
        try:
            with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=4)
            logging.info("Configuration saved successfully.")
        except Exception as e:
            logging.error(f"Error saving configuration: {e}")

    @staticmethod
    def log_error(error_description, exception):
        logging.error(f"Error: {error_description}")
        logging.error(f"Exception: {str(exception)}")

    def generate_project_report(self, client, root_dir, selected_files, system_prompt, user_prompt, include_context=True):
        logging.info("Starting project analysis...")
        start_time = time.time()

        try:
            project_structure = self.process_directory(root_dir, selected_files)
            logging.info("Project structure analysis complete.")

            relationships = self.analyze_relationships(root_dir, selected_files)
            relationships_markdown = self.generate_relationship_markdown(relationships)

            report = "# Project Analysis Report\n\n"

            if include_context:
                report += "## Overall Project Structure\n\n"
                report += project_structure
                report += relationships_markdown
                report += "\n\n"

            logging.info("Generating AI analysis...")
            api_call_start = time.time()
            full_prompt = f"{system_prompt}\n\n{user_prompt}\n\n{project_structure}"
            ai_analysis = self.run_conversation(client, full_prompt)
            api_call_end = time.time()
            logging.info(f"API call duration: {api_call_end - api_call_start:.2f} seconds")

            time.sleep(max(0, RATE_LIMIT - (api_call_end - api_call_start)))
            logging.info("Rate limit delay complete")

            report += "## AI Analysis\n\n"
            report += ai_analysis
        except Exception as e:
            self.log_error("Error during project report generation", e)
            report += f"\n\nError during project report generation: {e}\n"

        end_time = time.time()
        total_time = end_time - start_time
        logging.info(f"Analysis completed in {total_time:.2f} seconds.")
        return report

    def process_directory(self, root_dir, selected_files=None, indent_level=0):
        markdown_content = ""
        items = sorted(os.listdir(root_dir))

        for item in items:
            item_path = os.path.join(root_dir, item)
            
            if os.path.isdir(item_path) and item not in self.excluded_dirs:
                markdown_content += "  " * indent_level + f"## Directory: {item}\n\n"
                markdown_content += self.process_directory(item_path, selected_files, indent_level + 1)
            elif os.path.isfile(item_path):
                if selected_files and item_path not in selected_files:
                    continue
                if not any(item.endswith(ext) for ext in self.excluded_extensions):
                    content = self.get_file_content(item_path)
                    markdown_content += self.generate_markdown_block(item_path, content, indent_level)

        return markdown_content

    @staticmethod
    def get_file_content(file_path, max_lines=50):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                content = ''.join(lines[:max_lines])
                if len(lines) > max_lines:
                    content += f"\n... (truncated, showing first {max_lines} lines)"
            return content
        except UnicodeDecodeError:
            return None

    @staticmethod
    def generate_markdown_block(file_path, content, indent_level=0):
        ext = os.path.splitext(file_path)[1][1:]
        relative_path = os.path.relpath(file_path)
        clickable_path = f"[{relative_path}](file://{os.path.abspath(file_path)})"

        markdown_block = "  " * indent_level + f"### {clickable_path}\n\n"
        markdown_block += "  " * indent_level + f"**Type:** {ext.upper()} file\n\n"

        if content:
            try:
                lexer = get_lexer_for_filename(file_path)
                formatter = HtmlFormatter()
                highlighted_html = highlight(content, lexer, formatter)
                
                h = html2text.HTML2Text()
                h.ignore_links = True
                formatted_content = h.handle(highlighted_html)
                
                markdown_block += "  " * indent_level + formatted_content + "\n\n"
            except Exception as e:
                logging.error(f"Syntax highlighting failed for {file_path}: {e}")
                markdown_block += "  " * indent_level + f"```{ext}\n{content}\n```\n\n"
        else:
            markdown_block += "  " * indent_level + "(Binary or unreadable file)\n\n"

        return markdown_block

    def analyze_relationships(self, root_dir, selected_files=None):
        relationships = {
            'variable_usage': {},
            'file_dependencies': {}
        }

        for subdir, _, files in os.walk(root_dir):
            for file in files:
                file_path = os.path.join(subdir, file)
                if selected_files and file_path not in selected_files:
                    continue
                if any(file.endswith(ext) for ext in self.excluded_extensions):
                    continue

                content = self.get_file_content(file_path)
                if not content:
                    continue

                if file.endswith(('.py', '.js')):
                    variables = re.findall(r'\b(\w+)\s*=', content)
                    for var in variables:
                        if var not in relationships['variable_usage']:
                            relationships['variable_usage'][var] = []
                        relationships['variable_usage'][var].append(file_path)

                    if file.endswith('.py'):
                        imports = re.findall(r'(?:from\s+(\S+)\s+import|import\s+(\S+))', content)
                        relationships['file_dependencies'][file_path] = [imp[0] or imp[1] for imp in imports]

        return relationships

    @staticmethod
    def generate_relationship_markdown(relationships):
        markdown = "## Project Relationships\n\n"

        markdown += "### Variable Usage\n"
        if relationships['variable_usage']:
            for var, files in relationships['variable_usage'].items():
                markdown += f"- **{var}** is used in:\n"
                for file in files:
                    relative_path = os.path.relpath(file)
                    markdown += f"  - [{relative_path}](file://{os.path.abspath(file)})\n"
        else:
            markdown += "No variable usage found.\n"

        markdown += "\n### File Dependencies\n"
        if relationships['file_dependencies']:
            for file, dependencies in relationships['file_dependencies'].items():
                relative_path = os.path.relpath(file)
                markdown += f"- [{relative_path}](file://{os.path.abspath(file)}) depends on:\n"
                for dep in dependencies:
                    markdown += f"  - {dep}\n"
        else:
            markdown += "No file dependencies found.\n"

        return markdown

    def run_conversation(self, client, prompt, model="llama-3.1-70b-versatile", max_retries=3):
        messages = [
            {
                "role": "system",
                "content": "You are an AI assistant tasked with analyzing a project structure."
            },
            {
                "role": "user",
                "content": prompt,
            }
        ]

        for attempt in range(max_retries):
            try:
                start_time = time.time()
                response = client.chat.completions.create(
                    model=model,
                    messages=messages,
                    max_tokens=4096
                )
                end_time = time.time()
                api_duration = end_time - start_time
                time.sleep(max(0, RATE_LIMIT - api_duration))

                return response.choices[0].message.content
            except Exception as e:
                self.log_error(f"Error in Groq API call (attempt {attempt+1}/{max_retries})", e)
                if attempt == max_retries - 1:
                    return f"Error in Groq API call after {max_retries} attempts: {str(e)}"
                time.sleep(RATE_LIMIT * (attempt + 1))  # Exponential backoff

        return "Max retries reached without successful response"

if __name__ == "__main__":
    root = tk.Tk()
    app = ProjectAnalyzerGUI(root)
    root.mainloop()