from flask import Flask, request, jsonify
import os
import logging
from agentChef import DatasetKitchen

app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration for AgentChef
config = {
    'templates_dir': './templates',
    'input_dir': './input',
    'output_dir': './output',
    'ollama_config': {
        'model': 'phi3',
        'api_base': 'http://localhost:11434'
    }
}

# Ensure directories exist
os.makedirs(config['templates_dir'], exist_ok=True)
os.makedirs(config['input_dir'], exist_ok=True)
os.makedirs(config['output_dir'], exist_ok=True)

# Initialize DatasetKitchen
kitchen = DatasetKitchen(config)

@app.route('/prepare_dataset', methods=['POST'])
def prepare_dataset():
    """
    api usage payload:
    
    {
    "source": "<source_data>",
    "template": "<template_name>",
    "num_samples": 100,
    "output_file": "<output_file_path>"
    }
    
    """
    data = request.json
    source = data.get('source')
    template_name = data.get('template')
    num_samples = data.get('num_samples', 100)
    output_file = data.get('output_file')

    if not all([source, template_name, output_file]):
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        dataset = kitchen.prepare_dataset(
            source=source,
            template_name=template_name,
            num_samples=num_samples,
            augmentation_config={},
            output_file=output_file
        )
        return jsonify({"message": f"Dataset prepared and saved to {output_file}"}), 200
    except Exception as e:
        logger.error(f"Error in preparing dataset: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/generate_paraphrases', methods=['POST'])
def generate_paraphrases():
    """
    api usage payload:
    {
    "seed_file": "<path_to_seed_file>",
    "num_samples": 1,
    "system_prompt": "<optional_system_prompt>"
    }
    """
    data = request.json
    seed_file = data.get('seed_file')
    num_samples = data.get('num_samples', 1)
    system_prompt = data.get('system_prompt')

    if not seed_file:
        return jsonify({"error": "Missing seed_file parameter"}), 400

    try:
        output_files = kitchen.generate_paraphrases(seed_file=seed_file, num_samples=num_samples, system_prompt=system_prompt)
        return jsonify({"message": f"Paraphrased content saved to: {', '.join(output_files)}"}), 200
    except Exception as e:
        logger.error(f"Error in generating paraphrases: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/augment_data', methods=['POST'])
def augment_data():
    """
    api usage payload:
    {
    "seed_parquet": "<path_to_seed_parquet>"
    }
    """
    data = request.json
    seed_parquet = data.get('seed_parquet')

    if not seed_parquet:
        return jsonify({"error": "Missing seed_parquet parameter"}), 400

    try:
        augmentation_config = {}  # You can extend this to accept configuration from the request
        output_file = kitchen.augment_data(seed_parquet=seed_parquet, augmentation_config=augmentation_config)
        return jsonify({"message": f"Augmented data saved to: {output_file}"}), 200
    except Exception as e:
        logger.error(f"Error in augmenting data: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/parse_text_to_parquet', methods=['POST'])
def parse_text_to_parquet():
    """
    api usage payload:
    {
    "text_content": "<your_text_content>",
    "template_name": "<template_name>",
    "filename": "<output_filename>"
    }
    """
    data = request.json
    text_content = data.get('text_content')
    template_name = data.get('template_name')
    filename = data.get('filename')

    if not all([text_content, template_name, filename]):
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        df, json_file, parquet_file = kitchen.dataset_manager.parse_text_to_parquet(text_content, template_name, filename)
        return jsonify({
            "message": "Parsing completed successfully",
            "json_file": json_file,
            "parquet_file": parquet_file,
            "dataframe_shape": df.shape
        }), 200
    except Exception as e:
        logger.error(f"Error in parsing text to parquet: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/convert_parquet', methods=['POST'])
def convert_parquet():
    """
    api usage payload:
    {
    "parquet_file": "<path_to_parquet_file>",
    "output_formats": ["csv", "jsonl"]
    }
    """
    data = request.json
    parquet_file = data.get('parquet_file')
    output_formats = data.get('output_formats', ['csv', 'jsonl'])

    if not parquet_file:
        return jsonify({"error": "Missing parquet_file parameter"}), 400

    try:
        kitchen.dataset_manager.convert_parquet(parquet_file, output_formats)
        return jsonify({"message": f"Parquet file converted to {', '.join(output_formats)}"}), 200
    except Exception as e:
        logger.error(f"Error in converting parquet: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8888)