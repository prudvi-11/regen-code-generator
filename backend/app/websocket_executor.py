"""
WebSocket-based interactive code executor
"""
import asyncio
import sys
import io
from contextlib import redirect_stdout, redirect_stderr


class InteractiveExecutor:
    def __init__(self):
        self.input_queue = asyncio.Queue()
        self.output_callback = None
    
    async def execute_python_interactive(self, code: str, output_callback):
        """Execute Python code with interactive input support"""
        self.output_callback = output_callback
        
        # Create custom input function
        original_input = __builtins__.input
        
        async def async_input(prompt=""):
            if prompt:
                await self.output_callback(prompt)
            
            # Wait for user input
            user_input = await self.input_queue.get()
            await self.output_callback(user_input + "\n")
            return user_input
        
        # Capture stdout
        output_buffer = io.StringIO()
        error_buffer = io.StringIO()
        
        try:
            # Replace input with our async version
            def sync_input_wrapper(prompt=""):
                loop = asyncio.get_event_loop()
                return loop.run_until_complete(async_input(prompt))
            
            __builtins__.input = sync_input_wrapper
            
            # Redirect stdout/stderr
            with redirect_stdout(output_buffer), redirect_stderr(error_buffer):
                # Execute code
                exec(code, {'__builtins__': __builtins__})
            
            # Get output
            stdout = output_buffer.getvalue()
            stderr = error_buffer.getvalue()
            
            if stdout:
                await self.output_callback(stdout)
            if stderr:
                await self.output_callback(f"ERROR: {stderr}")
                
        except Exception as e:
            await self.output_callback(f"ERROR: {str(e)}")
        finally:
            __builtins__.input = original_input
    
    async def send_input(self, user_input: str):
        """Send user input to the running program"""
        await self.input_queue.put(user_input)


interactive_executor = InteractiveExecutor()
