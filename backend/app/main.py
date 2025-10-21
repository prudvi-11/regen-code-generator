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
        lang = request.language.lower()
        print(f"DEBUG: Received language: '{request.language}' -> normalized: '{lang}'")
        
        if lang == "python":
            output, error = code_executor.execute_python(request.code, request.user_inputs or "")
        elif lang in ["javascript", "js"]:
            output, error = code_executor.execute_javascript(request.code, request.user_inputs or "")
        elif lang == "java":
            output, error = code_executor.execute_java(request.code, request.user_inputs or "")
        elif lang in ["cpp", "c++"]:
            output, error = code_executor.execute_cpp(request.code, request.user_inputs or "")
        elif lang == "c":
            output, error = code_executor.execute_c(request.code, request.user_inputs or "")
        elif lang in ["csharp", "cs", "c#"]:
            output, error = code_executor.execute_csharp(request.code, request.user_inputs or "")
        elif lang == "go":
            output, error = code_executor.execute_go(request.code, request.user_inputs or "")
        elif lang == "rust":
            output, error = code_executor.execute_rust(request.code, request.user_inputs or "")
        elif lang == "typescript":
            output, error = code_executor.execute_typescript(request.code, request.user_inputs or "")
        elif lang == "php":
            output, error = code_executor.execute_php(request.code, request.user_inputs or "")
        elif lang == "ruby":
            output, error = code_executor.execute_ruby(request.code, request.user_inputs or "")
        elif lang == "swift":
            output, error = code_executor.execute_swift(request.code, request.user_inputs or "")
        elif lang == "kotlin":
            output, error = code_executor.execute_kotlin(request.code, request.user_inputs or "")
        else:
            print(f"ERROR: Language '{lang}' not matched in any condition!")
            raise HTTPException(status_code=400, detail=f"Execution not supported for {request.language}")
        
        return ExecutionResponse(output=output, error=error)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
