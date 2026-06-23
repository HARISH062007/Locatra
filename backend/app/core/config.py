from pydantic_settings import BaseSettings
from pydantic import Field, field_validator
from typing import Any, Dict, Optional

class Settings(BaseSettings):
    API_V1_STR: str = "/v1"
    PROJECT_NAME: str = "Locatra AI Microservice"
    
    # Database Settings
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/locatra",
        validation_alias="DATABASE_URL"
    )

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_async_db_url(cls, v: Any) -> Any:
        if isinstance(v, str) and v.startswith("postgresql://"):
            return v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v

    # Security Settings
    # Matches NextAuth JWT secret or a dedicated microservice shared secret
    JWT_SECRET: str = Field(
        default="locatra-super-secret-auth-key-change-me",
        validation_alias="NEXTAUTH_SECRET"
    )
    JWT_ALGORITHM: str = "HS256"

    # AWS S3 Settings (for media access)
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    S3_BUCKET_NAME: str = "locatra-spatial-scans"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
