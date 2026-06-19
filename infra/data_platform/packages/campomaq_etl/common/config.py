import os
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()


@dataclass
class Config:
    sqlserver_uri: str
    supabase_db_url: str
    etl_env: str
    log_level: str


def load_config() -> Config:
    missing = []
    required = ["SQLSERVER_URI", "DATABASE_URL"]
    for var in required:
        if not os.getenv(var):
            missing.append(var)
    if missing:
        raise RuntimeError(f"Missing required environment variables: {', '.join(missing)}")

    return Config(
        sqlserver_uri=os.environ["SQLSERVER_URI"],
        supabase_db_url=os.environ["DATABASE_URL"],
        etl_env=os.getenv("ETL_ENV", "dev"),
        log_level=os.getenv("ETL_LOG_LEVEL", "INFO"),
    )
