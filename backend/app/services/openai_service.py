import os
import requests
from dotenv import load_dotenv

load_dotenv()

class GroqService:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        if self.api_key:
            print("API key loaded")

    def generate_code(self, prompt, existing_code=None, language="python"):
        try:
            url = "https://api.groq.com/openai/v1/chat/completions"
            
            msg = language + " code: " + prompt
            
            data = {
                "model": "llama-3.1-8b-instant",
                "messages": [{"role": "user", "content": msg}]
            }
            
            headers = {
                "Authorization": "Bearer " + self.api_key,
                "Content-Type": "application/json"
            }
            
            r = requests.post(url, json=data, headers=headers, timeout=15)
            
            if r.status_code == 200:
                result = r.json()
                code = result["choices"][0]["message"]["content"]
                code = code.replace("``````javascript", "").replace("``````", "")
                return code.strip()
            else:
                return "API Error " + str(r.status_code)
                
        except Exception as e:
            return "Error: " + str(e)

huggingface_service = GroqService()
