from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from app.models import CodeRequest, CodeResponse, ExecutionRequest, ExecutionResponse
from app.services.openai_service import huggingface_service as openai_service
from app.services.code_executor import code_executor

load_dotenv()

app = FastAPI(
    title="REGEN API",
    description="Code Generation and Execution API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "REGEN API is running",
        "endpoints": {
            "generate": "/api/generate",
            "execute": "/api/execute",
            "docs": "/docs"
        }
    }

@app.post("/api/generate", response_model=CodeResponse)
async def generate_code(request: CodeRequest):
    """Generate code using AI"""
    try:
        generated_code = openai_service.generate_code(
            prompt=request.prompt,
            existing_code=request.code,
            language=request.language
        )
        return CodeResponse(content=generated_code, language=request.language)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/execute", response_model=ExecutionResponse)
async def execute_code(request: ExecutionRequest):
    """Execute code with pre-provided inputs"""
    try:
        if request.language.lower() == "python":
            output, error = code_executor.execute_python(request.code, request.user_inputs or "")
        elif request.language.lower() in ["javascript", "js"]:
            output, error = code_executor.execute_javascript(request.code, request.user_inputs or "")
        else:
            raise HTTPException(status_code=400, detail=f"Execution not supported for {request.language}")
        
        return ExecutionResponse(output=output, error=error)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
