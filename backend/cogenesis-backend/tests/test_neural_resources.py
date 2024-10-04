
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.fixture
def mock_llm_manager(mocker):
    return mocker.patch('app.services.neural_resources.LLMManager')

def test_route_query(mock_llm_manager):
    mock_llm_manager.return_value.route_query.return_value = {"response": "Test response"}
    response = client.post("/neural_resources/route_query", json={"content": "Test query", "role": "user"})
    assert response.status_code == 200
    assert "response" in response.json()

def test_set_api_key(mock_llm_manager):
    response = client.post("/neural_resources/set_api_key", json={"provider": "test_provider", "api_key": "test_key"})
    assert response.status_code == 200
    assert response.json() == {"message": "API key updated for test_provider"}

def test_get_available_models(mock_llm_manager):
    mock_llm_manager.return_value.get_available_models.return_value = ["model1", "model2"]
    response = client.get("/neural_resources/available_models")
    assert response.status_code == 200
    assert "available_models" in response.json()

def test_get_model_info(mock_llm_manager):
    mock_llm_manager.return_value.get_model_info.return_value = {"model": "test_model", "info": "test_info"}
    response = client.get("/neural_resources/model_info/test_model")
    assert response.status_code == 200
    assert "model" in response.json()