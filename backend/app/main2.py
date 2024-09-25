import unittest
from fastapi.testclient import TestClient
from main import app  # Import your FastAPI app
import json

class TestAgentChefAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_prepare_dataset(self):
        payload = {
            "source": "test_data.csv",
            "template": "default_template",
            "num_samples": 50,
            "output_file": "test_output.parquet"
        }
        response = self.client.post("/prepare_dataset", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn("Dataset prepared and saved", response.json()["message"])

    def test_generate_paraphrases(self):
        payload = {
            "seed_file": "test_seed.txt",
            "num_samples": 2,
            "system_prompt": "Generate casual paraphrases"
        }
        response = self.client.post("/generate_paraphrases", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn("Paraphrased content saved", response.json()["message"])

    def test_augment_data(self):
        payload = {
            "seed_parquet": "test_seed.parquet"
        }
        response = self.client.post("/augment_data", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn("Augmented data saved", response.json()["message"])

    def test_parse_text_to_parquet(self):
        payload = {
            "text_content": "Sample text content for parsing",
            "template_name": "default_template",
            "filename": "test_parsed"
        }
        response = self.client.post("/parse_text_to_parquet", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn("Parsing completed successfully", response.json()["message"])

    def test_convert_parquet(self):
        payload = {
            "parquet_file": "test_input.parquet",
            "output_formats": ["csv", "jsonl"]
        }
        response = self.client.post("/convert_parquet", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn("Parquet file converted", response.json()["message"])

    def test_get_templates(self):
        response = self.client.get("/get_templates")
        self.assertEqual(response.status_code, 200)
        self.assertIn("templates", response.json())

    def test_create_template(self):
        payload = {
            "template_name": "new_test_template",
            "template_fields": ["field1", "field2", "field3"]
        }
        response = self.client.post("/create_template", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn("Template 'new_test_template' created successfully", response.json()["message"])

if __name__ == "__main__":
    unittest.main()