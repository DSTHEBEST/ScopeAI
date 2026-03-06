import subprocess
import os

REPO_DIR = "repos"

def clone_repository(repo_url: str):

    repo_name = repo_url.split("/")[-1].replace(".git", "")

    repo_path = os.path.join(REPO_DIR, repo_name)

    if os.path.exists(repo_path):
        return repo_path
    
    subprocess.run(["git", "clone", repo_url, repo_path], check=True)

    return repo_path

import os
import shutil
import stat

def remove_readonly(func, path, exc_info):
    os.chmod(path, stat.S_IWRITE)
    func(path)

def safe_delete(path):
    if os.path.exists(path):
        shutil.rmtree(path, onerror=remove_readonly)