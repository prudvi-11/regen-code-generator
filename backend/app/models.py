from pydantic import BaseModel
from typing import Optional

class CodeRequest(BaseModel):
    prompt: str
    code: Optional[str] = None
    language: str = "python"

class CodeResponse(BaseModel):
    content: str
    language: str

class ExecutionRequest(BaseModel):
    code: str
    language: str
    user_inputs: Optional[str] = ""

class ExecutionResponse(BaseModel):
    output: str
    error: Optional[str] = None
