import logging
import os


def _resolve_log_level() -> int:
    level_name = os.getenv("ETL_LOG_LEVEL", "INFO").upper()
    return getattr(logging, level_name, logging.INFO)


def get_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    level = _resolve_log_level()
    logger.setLevel(level)
    logger.propagate = False

    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(name)s %(message)s"))
        logger.addHandler(handler)

    for handler in logger.handlers:
        handler.setLevel(level)

    return logger
