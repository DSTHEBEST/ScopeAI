import chromadb
from chromadb.config import Settings

import chromadb
import os

# Dynamically resolve backend directory to store chroma_db securely in Docker
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
db_path = os.path.join(backend_dir, "chroma_db")

client = chromadb.PersistentClient(path=db_path)

collection = client.get_or_create_collection(name="code_chunks")

def store_chunk(chunk_id, embedding, metadata, document):

    collection.add(
        ids=[chunk_id],
        embeddings=[embedding],
        metadatas=[metadata],
        documents=[document]
    )

def search_chunks(query_embedding, top_k=5):

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )

    return results

def format_retrieved_chunks(results):

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]

    formatted_chunks = []

    for doc, meta in zip(documents, metadatas):

        formatted = f"""
File: {meta['file']}
Type: {meta['type']}

{doc}
"""

        formatted_chunks.append(formatted)

    return formatted_chunks