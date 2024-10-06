from pydantic import BaseSettings

class Settings(BaseSettings):
    ANTHROPIC_API_KEY: str
    OPENAI_API_KEY: str
    GROQ_API_KEY: str
    QDRANT_HOST: str
    QDRANT_PORT: int
    JWT_SECRET_KEY: str = "your-secret-key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()
