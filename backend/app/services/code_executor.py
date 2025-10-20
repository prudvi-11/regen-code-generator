"""
Secure code execution service for Python and JavaScript.
"""
import subprocess
import tempfile
import os
from typing import Tuple


class CodeExecutor:
    """Service for executing Python and JavaScript code safely"""
    
    @staticmethod
    def execute_python(code: str, user_inputs: str = "") -> Tuple[str, str]:
        """Execute Python code with pre-provided inputs"""
        try:
            inputs_list = user_inputs.strip().split('\n') if user_inputs.strip() else []
            
            wrapper_code = f'''
import sys
_inputs = {repr(inputs_list)}
_input_index = [0]

def _custom_input(prompt=""):
    if prompt:
        print(prompt, end="", flush=True)
    if _input_index[0] < len(_inputs):
        value = _inputs[_input_index[0]]
        _input_index[0] += 1
        print(value)
        return value
    else:
        raise EOFError("No more inputs available")

# Replace built-in input
__builtins__.input = _custom_input

# Run user code
{code}
'''
            
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False, encoding='utf-8') as f:
                f.write(wrapper_code)
                temp_file = f.name
            
            try:
                result = subprocess.run(
                    ['python', temp_file],
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                
                output = result.stdout or ""
                error = result.stderr or ""
                
                return output, error
                
            finally:
                try:
                    os.unlink(temp_file)
                except:
                    pass
                
        except subprocess.TimeoutExpired:
            return "", "Timeout: Code took longer than 30 seconds"
        except Exception as e:
            return "", str(e)
    
    @staticmethod
    def execute_javascript(code: str, user_inputs: str = "") -> Tuple[str, str]:
        """Execute JavaScript code with pre-provided inputs"""
        try:
            inputs_list = user_inputs.strip().split('\n') if user_inputs.strip() else []
            
            wrapper_code = f'''
const readline = require('readline');

const inputs = {repr(inputs_list)};
let inputIndex = 0;

const rl = {{
    question: function(query, callback) {{
        process.stdout.write(query);
        if (inputIndex < inputs.length) {{
            const answer = inputs[inputIndex++];
            console.log(answer);
            callback(answer);
        }} else {{
            throw new Error("No more inputs available");
        }}
    }},
    close: function() {{}}
}};

{code}
'''
            
            with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False, encoding='utf-8') as f:
                f.write(wrapper_code)
                temp_file = f.name
            
            try:
                result = subprocess.run(
                    ['node', temp_file],
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                
                output = result.stdout or ""
                error = result.stderr or ""
                
                return output, error
                
            finally:
                try:
                    os.unlink(temp_file)
                except:
                    pass
                
        except subprocess.TimeoutExpired:
            return "", "Timeout: Code took longer than 30 seconds"
        except FileNotFoundError:
            return "", "Node.js not found."
        except Exception as e:
            return "", str(e)


code_executor = CodeExecutor()
