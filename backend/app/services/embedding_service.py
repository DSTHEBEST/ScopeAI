from sentence_transformers import SentenceTransformer

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

def generate_embedding(text):
    """Convert text to vector embedding from chromadb"""

    embedding = model.encode(text)
    return embedding.tolist()
