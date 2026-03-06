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

        if isinstance(node, ast.FunctionDef):
            functions.append(node.name)

        elif isinstance(node, ast.ClassDef):
            classes.append(node.name)

        elif isinstance(node, ast.Import):
            for alias in node.names:
                imports.append(alias.name)

        elif isinstance(node, ast.ImportFrom):
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

    parsed_files = []

    IGNORED_DIRS = {"venv", ".git", "__pycache__", "node_modules", "dist", "build"}

    for root, dirs, files in os.walk(repo_path):

        dirs[:] = [d for d in dirs if d not in IGNORED_DIRS]

        for file in files:

            if file.endswith(ALLOWED_EXTENSIONS):

                file_path = os.path.join(root, file)

                if file.endswith(".py"):
                    parsed_data = parse_python_file(file_path)
                else:
                    parsed_data = parse_text_file(file_path)

                parsed_files.append({
                    "file": file_path,
                    "data": parsed_data
                })

    return parsed_files