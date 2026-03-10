import chromadb
from chromadb.config import Settings

import chromadb

client = chromadb.PersistentClient(path=r"C:\Users\Devansh\ScopeAI\backend\chroma_db")

collection = client.get_or_create_collection(name="code_chunks")

def store_chunk(chunk_id, embedding, metadata, document):

    collection.add(
        ids=[chunk_id],
        embeddings=[embedding],
        metadatas=[metadata],
        documents=[document]
    )