import subprocess
import tempfile
import os
import re

class CodeExecutor:
    
    def execute_python(self, code, user_inputs):
        """Execute Python code"""
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False, encoding='utf-8') as f:
                f.write(code)
                temp_file = f.name
            
            result = subprocess.run(
                ['python', temp_file],
                input=user_inputs,
                capture_output=True,
                text=True,
                timeout=10
            )
            os.unlink(temp_file)
            
            if result.returncode != 0:
                return result.stdout, result.stderr
            return result.stdout, None
            
        except subprocess.TimeoutExpired:
            return "", "Execution timeout (10 seconds exceeded)"
        except Exception as e:
            return "", str(e)
    
    def execute_javascript(self, code, user_inputs):
        """Execute JavaScript code using Node.js"""
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False, encoding='utf-8') as f:
                f.write(code)
                temp_file = f.name
            
            result = subprocess.run(
                ['node', temp_file],
                input=user_inputs,
                capture_output=True,
                text=True,
                timeout=10
            )
            os.unlink(temp_file)
            
            if result.returncode != 0:
                return result.stdout, result.stderr
            return result.stdout, None
            
        except subprocess.TimeoutExpired:
            return "", "Execution timeout (10 seconds exceeded)"
        except Exception as e:
            return "", str(e)
    
    def execute_java(self, code, user_inputs):
        """Execute Java code"""
        try:
            # Extract class name from code
            match = re.search(r'public\s+class\s+(\w+)', code)
            if not match:
                match = re.search(r'class\s+(\w+)', code)
            class_name = match.group(1) if match else 'Main'
            
            with tempfile.TemporaryDirectory() as tmpdir:
                java_file = os.path.join(tmpdir, f'{class_name}.java')
                with open(java_file, 'w', encoding='utf-8') as f:
                    f.write(code)
                
                # Compile
                compile_result = subprocess.run(
                    ['javac', java_file],
                    capture_output=True,
                    text=True,
                    timeout=15
                )
                
                if compile_result.returncode != 0:
                    return "", f"Compilation Error:\n{compile_result.stderr}"
                
                # Run
                run_result = subprocess.run(
                    ['java', '-cp', tmpdir, class_name],
                    input=user_inputs,
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                
                if run_result.returncode != 0:
                    return run_result.stdout, run_result.stderr
                return run_result.stdout, None
                
        except subprocess.TimeoutExpired:
            return "", "Execution timeout exceeded"
        except FileNotFoundError:
            return "", "Java compiler (javac) not found. Please install JDK."
        except Exception as e:
            return "", str(e)
    
    def execute_cpp(self, code, user_inputs):
        """Execute C++ code"""
        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                cpp_file = os.path.join(tmpdir, 'main.cpp')
                exe_file = os.path.join(tmpdir, 'main.exe' if os.name == 'nt' else 'main')
                
                with open(cpp_file, 'w', encoding='utf-8') as f:
                    f.write(code)
                
                # Compile
                compile_result = subprocess.run(
                    ['g++', cpp_file, '-o', exe_file, '-std=c++17'],
                    capture_output=True,
                    text=True,
                    timeout=15
                )
                
                if compile_result.returncode != 0:
                    return "", f"Compilation Error:\n{compile_result.stderr}"
                
                # Run
                run_result = subprocess.run(
                    [exe_file],
                    input=user_inputs,
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                
                if run_result.returncode != 0:
                    return run_result.stdout, run_result.stderr
                return run_result.stdout, None
                
        except subprocess.TimeoutExpired:
            return "", "Execution timeout exceeded"
        except FileNotFoundError:
            return "", "C++ compiler (g++) not found. Please install GCC."
        except Exception as e:
            return "", str(e)
    
    def execute_c(self, code, user_inputs):
        """Execute C code"""
        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                c_file = os.path.join(tmpdir, 'main.c')
                exe_file = os.path.join(tmpdir, 'main.exe' if os.name == 'nt' else 'main')
                
                with open(c_file, 'w', encoding='utf-8') as f:
                    f.write(code)
                
                # Compile
                compile_result = subprocess.run(
                    ['gcc', c_file, '-o', exe_file],
                    capture_output=True,
                    text=True,
                    timeout=15
                )
                
                if compile_result.returncode != 0:
                    return "", f"Compilation Error:\n{compile_result.stderr}"
                
                # Run
                run_result = subprocess.run(
                    [exe_file],
                    input=user_inputs,
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                
                if run_result.returncode != 0:
                    return run_result.stdout, run_result.stderr
                return run_result.stdout, None
                
        except subprocess.TimeoutExpired:
            return "", "Execution timeout exceeded"
        except FileNotFoundError:
            return "", "C compiler (gcc) not found. Please install GCC."
        except Exception as e:
            return "", str(e)
    
    def execute_csharp(self, code, user_inputs):
        """Execute C# code"""
        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                cs_file = os.path.join(tmpdir, 'Program.cs')
                dll_file = os.path.join(tmpdir, 'Program.dll')
                
                with open(cs_file, 'w', encoding='utf-8') as f:
                    f.write(code)
                
                # Compile with dotnet
                compile_result = subprocess.run(
                    ['dotnet', 'build', cs_file, '-o', tmpdir],
                    capture_output=True,
                    text=True,
                    timeout=15
                )
                
                # Alternative: Try csc compiler
                if compile_result.returncode != 0:
                    compile_result = subprocess.run(
                        ['csc', '/out:' + dll_file, cs_file],
                        capture_output=True,
                        text=True,
                        timeout=15
                    )
                
                if compile_result.returncode != 0:
                    return "", f"Compilation Error:\n{compile_result.stderr}"
                
                # Run
                run_result = subprocess.run(
                    ['dotnet', dll_file],
                    input=user_inputs,
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                
                if run_result.returncode != 0:
                    return run_result.stdout, run_result.stderr
                return run_result.stdout, None
                
        except subprocess.TimeoutExpired:
            return "", "Execution timeout exceeded"
        except FileNotFoundError:
            return "", "C# compiler not found. Please install .NET SDK or Mono."
        except Exception as e:
            return "", str(e)
    
    def execute_go(self, code, user_inputs):
        """Execute Go code"""
        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                go_file = os.path.join(tmpdir, 'main.go')
                
                with open(go_file, 'w', encoding='utf-8') as f:
                    f.write(code)
                
                # Run directly (go run compiles and runs)
                run_result = subprocess.run(
                    ['go', 'run', go_file],
                    input=user_inputs,
                    capture_output=True,
                    text=True,
                    timeout=15
                )
                
                if run_result.returncode != 0:
                    return run_result.stdout, run_result.stderr
                return run_result.stdout, None
                
        except subprocess.TimeoutExpired:
            return "", "Execution timeout exceeded"
        except FileNotFoundError:
            return "", "Go compiler not found. Please install Go."
        except Exception as e:
            return "", str(e)
    
    def execute_rust(self, code, user_inputs):
        """Execute Rust code"""
        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                rs_file = os.path.join(tmpdir, 'main.rs')
                exe_file = os.path.join(tmpdir, 'main.exe' if os.name == 'nt' else 'main')
                
                with open(rs_file, 'w', encoding='utf-8') as f:
                    f.write(code)
                
                # Compile
                compile_result = subprocess.run(
                    ['rustc', rs_file, '-o', exe_file],
                    capture_output=True,
                    text=True,
                    timeout=20
                )
                
                if compile_result.returncode != 0:
                    return "", f"Compilation Error:\n{compile_result.stderr}"
                
                # Run
                run_result = subprocess.run(
                    [exe_file],
                    input=user_inputs,
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                
                if run_result.returncode != 0:
                    return run_result.stdout, run_result.stderr
                return run_result.stdout, None
                
        except subprocess.TimeoutExpired:
            return "", "Execution timeout exceeded"
        except FileNotFoundError:
            return "", "Rust compiler not found. Please install Rust."
        except Exception as e:
            return "", str(e)
    
    def execute_typescript(self, code, user_inputs):
        """Execute TypeScript code"""
        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                ts_file = os.path.join(tmpdir, 'main.ts')
                
                with open(ts_file, 'w', encoding='utf-8') as f:
                    f.write(code)
                
                # Run with ts-node
                run_result = subprocess.run(
                    ['ts-node', ts_file],
                    input=user_inputs,
                    capture_output=True,
                    text=True,
                    timeout=15
                )
                
                if run_result.returncode != 0:
                    return run_result.stdout, run_result.stderr
                return run_result.stdout, None
                
        except subprocess.TimeoutExpired:
            return "", "Execution timeout exceeded"
        except FileNotFoundError:
            return "", "TypeScript not found. Please install ts-node."
        except Exception as e:
            return "", str(e)
    
    def execute_php(self, code, user_inputs):
        """Execute PHP code"""
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.php', delete=False, encoding='utf-8') as f:
                f.write(code)
                temp_file = f.name
            
            result = subprocess.run(
                ['php', temp_file],
                input=user_inputs,
                capture_output=True,
                text=True,
                timeout=10
            )
            os.unlink(temp_file)
            
            if result.returncode != 0:
                return result.stdout, result.stderr
            return result.stdout, None
            
        except subprocess.TimeoutExpired:
            return "", "Execution timeout exceeded"
        except FileNotFoundError:
            return "", "PHP not found. Please install PHP."
        except Exception as e:
            return "", str(e)
    
    def execute_ruby(self, code, user_inputs):
        """Execute Ruby code"""
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.rb', delete=False, encoding='utf-8') as f:
                f.write(code)
                temp_file = f.name
            
            result = subprocess.run(
                ['ruby', temp_file],
                input=user_inputs,
                capture_output=True,
                text=True,
                timeout=10
            )
            os.unlink(temp_file)
            
            if result.returncode != 0:
                return result.stdout, result.stderr
            return result.stdout, None
            
        except subprocess.TimeoutExpired:
            return "", "Execution timeout exceeded"
        except FileNotFoundError:
            return "", "Ruby not found. Please install Ruby."
        except Exception as e:
            return "", str(e)
    
    def execute_swift(self, code, user_inputs):
        """Execute Swift code"""
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.swift', delete=False, encoding='utf-8') as f:
                f.write(code)
                temp_file = f.name
            
            result = subprocess.run(
                ['swift', temp_file],
                input=user_inputs,
                capture_output=True,
                text=True,
                timeout=15
            )
            os.unlink(temp_file)
            
            if result.returncode != 0:
                return result.stdout, result.stderr
            return result.stdout, None
            
        except subprocess.TimeoutExpired:
            return "", "Execution timeout exceeded"
        except FileNotFoundError:
            return "", "Swift not found. Please install Swift."
        except Exception as e:
            return "", str(e)
    
    def execute_kotlin(self, code, user_inputs):
        """Execute Kotlin code"""
        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                kt_file = os.path.join(tmpdir, 'Main.kt')
                jar_file = os.path.join(tmpdir, 'main.jar')
                
                with open(kt_file, 'w', encoding='utf-8') as f:
                    f.write(code)
                
                # Compile
                compile_result = subprocess.run(
                    ['kotlinc', kt_file, '-include-runtime', '-d', jar_file],
                    capture_output=True,
                    text=True,
                    timeout=20
                )
                
                if compile_result.returncode != 0:
                    return "", f"Compilation Error:\n{compile_result.stderr}"
                
                # Run
                run_result = subprocess.run(
                    ['java', '-jar', jar_file],
                    input=user_inputs,
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                
                if run_result.returncode != 0:
                    return run_result.stdout, run_result.stderr
                return run_result.stdout, None
                
        except subprocess.TimeoutExpired:
            return "", "Execution timeout exceeded"
        except FileNotFoundError:
            return "", "Kotlin compiler not found. Please install Kotlin."
        except Exception as e:
            return "", str(e)

# Create singleton instance
code_executor = CodeExecutor()
