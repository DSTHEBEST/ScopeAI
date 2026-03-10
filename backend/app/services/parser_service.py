import os
import ast

ALLOWED_EXTENSIONS = (
    ".py",
    ".md",
    ".txt",
    ".toml",
    ".yaml",
    ".yml",
    ".json"
)


def parse_python_file(file_path):

    with open(file_path, "r", encoding="utf-8") as f:
        code = f.read()

    tree = ast.parse(code)

    functions = []
    classes = []
    imports = []

    for node in ast.walk(tree):

        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):

            func_code = ast.get_source_segment(code, node)

            functions.append({
                "name": node.name,
                "lineno": node.lineno,
                "docstring": ast.get_docstring(node),
                "code": func_code
            })

        elif isinstance(node, ast.ClassDef):

            class_code = ast.get_source_segment(code, node)

            classes.append({
                "name": node.name,
                "lineno": node.lineno,
                "docstring": ast.get_docstring(node),
                "code": class_code
            })

        elif isinstance(node, ast.Import):
            for alias in node.names:
                imports.append(alias.name)

        elif isinstance(node, ast.ImportFrom):
            if node.module:
                imports.append(node.module)

    return {
        "type": "python",
        "functions": functions,
        "classes": classes,
        "imports": imports
    }


def parse_text_file(file_path):

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    return {
        "type": "text",
        "content": content
    }


def parse_repository(repo_path):

    chunks = []

    IGNORED_DIRS = {"venv", ".git", "__pycache__", "node_modules", "dist", "build"}

    for root, dirs, files in os.walk(repo_path):

        dirs[:] = [d for d in dirs if d not in IGNORED_DIRS]

        for file in files:

            if file.endswith(ALLOWED_EXTENSIONS):

                file_path = os.path.join(root, file)

                # Handle Python files
                if file.endswith(".py"):

                    parsed = parse_python_file(file_path)

                    for func in parsed["functions"]:
                        chunks.append({
                            "type": "function",
                            "file": file_path,
                            **func
                        })

                    for cls in parsed["classes"]:
                        chunks.append({
                            "type": "class",
                            "file": file_path,
                            **cls
                        })

                # Handle text files
                else:

                    text_data = parse_text_file(file_path)

                    chunks.append({
                        "type": "document",
                        "file": file_path,
                        "content": text_data["content"]
                    })

    return chunks