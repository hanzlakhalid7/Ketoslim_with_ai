import logging
import os
import sys

def setup_logger(name: str):
    """
    Sets up a logger that writes to both console and a file.
    """
    # Create logs directory if it doesn't exist
    log_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "logs")
    os.makedirs(log_dir, exist_ok=True)
    
    log_file = os.path.join(log_dir, "backend_errors.log")

    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    # Check if handlers are already added to avoid duplicates
    if not logger.handlers:
        # File Handler
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(logging.ERROR)
        file_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        file_handler.setFormatter(file_formatter)
        logger.addHandler(file_handler)

        # Stream Handler (Console)
        stream_handler = logging.StreamHandler(sys.stdout)
        stream_handler.setLevel(logging.INFO)
        stream_formatter = logging.Formatter('%(levelname)s: %(message)s')
        stream_handler.setFormatter(stream_formatter)
        logger.addHandler(stream_handler)

    return logger
