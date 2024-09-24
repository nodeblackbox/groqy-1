# backend/app/main.py

from flask import Flask
from api.file_structure import FileStructureAPI
from api.file_insights import FileInsightsAPI
from api.file_contents import FileContentsAPI
from api.comprehensive_file_insights import ComprehensiveInsightsAPI

app = Flask(__name__)

# Initialize API classes
file_structure_api = FileStructureAPI()
file_insights_api = FileInsightsAPI()
file_contents_api = FileContentsAPI()
comprehensive_insights_api = ComprehensiveInsightsAPI()

# Register routes
app.add_url_rule('/api/get-file-structure', view_func=file_structure_api.get_file_structure, methods=['GET'])
app.add_url_rule('/api/file-insights', view_func=file_insights_api.get_file_insights, methods=['POST'])
app.add_url_rule('/api/get-file-contents', view_func=file_contents_api.get_file_contents, methods=['GET'])
app.add_url_rule('/api/comprehensive-file-insights', view_func=comprehensive_insights_api.get_comprehensive_insights, methods=['POST'])

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)