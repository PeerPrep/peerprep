import json
import os
import tempfile

import Crypto
import Crypto.Random
import requests
from Crypto.Cipher import AES
from dotenv import load_dotenv
from git import Repo

load_dotenv()
BASE_URL = os.environ.get("BASE_URL")
INITIALIZATION_VECTOR = os.environ.get("INITIALIZATION_VECTOR")
ENCRYPTION_KEY = os.environ.get("ENCRYPTION_KEY")

def make_api_request(request_data):
    # Define the API endpoint and the request payload (in JSON format)
    print (str.encode(ENCRYPTION_KEY))

    # Encrypt the request_data as needed with the INITIALIZATION_VECTOR and ENCRYPTION_KEY
    cipher = AES.new(str.encode(ENCRYPTION_KEY), AES.MODE_CBC, iv=str.encode(INITIALIZATION_VECTOR))
    encrypted = cipher.encrypt(request_data)


    # Make an HTTP POST request to the API
    url = f"{BASE_URL}/api/serverless"
    try:
        response = requests.post(url, data=encrypted)
        response.raise_for_status()  # Raise an exception for HTTP errors (4xx and 5xx)

        # Handle the API response here
        response_data = response.json()
        return response_data
    except requests.exceptions.RequestException as e:
        print(f"Error making the API request: {e}")
        return None
    



def load_problems():
    with tempfile.TemporaryDirectory() as base_path:
        Repo.clone_from("https://github.com/kyle8998/Practice-Coding-Questions.git", base_path)

        # Define the path to the "repo/leetcode" directory
        base_path += "/leetcode"
        problems = []

        # Iterate over the folders in the base directory
        for folder_name in os.listdir(base_path):
            folder_path = os.path.join(base_path, folder_name)
            
            # Check if the item is a directory
            if os.path.isdir(folder_path):
                problem_md_path = os.path.join(folder_path, "problem.md")
                
                # Check if "problem.md" exists in the folder
                if os.path.exists(problem_md_path):
                    # Open and read the contents of "problem.md"
                    with open(problem_md_path, "r", encoding="utf-8") as problem_file:
                        problem_contents = problem_file.read()
                        problems.append(problem_contents)
                else:
                    print(f"No problem.md found in {folder_name}")
    print(f"Total number of questions found: {len(problems)}")
    return problems

def parse(qn):
    try:
        qn = qn.split("\n")
        title = qn[0][2:]
        qn.pop(0)
        while qn[0].strip() == "":
            qn.pop(0)
        difficulty = qn[0].split(" ")[2].strip().upper()
        qn.pop(0)
        while qn[0].strip() == "":
            qn.pop(0)

        if difficulty not in ["EASY", "MEDIUM", "HARD"]:
            return None

        if title.split(" ")[0] != "Problem" and title.split(" ")[1][-1] != ":":
            return None
        else:
            title = " ".join(title.split(" ")[2:])
            
        return { "title": title, "difficulty": difficulty, "question": qn}
    except:
        return None

def send_to_questions_service(qn):
    data = {}
    data['title'] = qn["title"]
    data['difficulty'] = qn["difficulty"]
    data['question'] = qn["question"]

    json_data = json.dumps(data)
    print(json_data)
    response = make_api_request(json_data)
    
    print(f"How send ah...")

problems = load_problems()
problems = [parse(qn) for qn in problems]
problems = [qn for qn in problems if qn is not None]
print(f"Total number of questions parsed: {len(problems)}")

for qn in [problems[0]]:
    send_to_questions_service(qn)
