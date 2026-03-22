# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory to /code
WORKDIR /code

# Copy the requirements file
COPY ./requirements.txt /code/requirements.txt

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Set up a generic non-root user (Hugging Face Spaces requirement)
RUN useradd -m -u 1000 user

# Switch to the non-root user
USER user

# Set home to the user's home directory
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Change the working directory to the user's app block
WORKDIR $HOME/app

# Copy the rest of the backend files and assign ownership to the user
COPY --chown=user . $HOME/app

# Hugging Face Spaces expose port 7860 by default!
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
