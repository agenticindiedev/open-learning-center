# Practical Code Examples

## Learning Objective

Review complete, production-ready code examples with tests and CI/CD setup that you can use as templates for your own projects.

## Main Content

The `tools/indie-dev/` folder contains complete, working examples you can use as templates.

**What's Included:**

**Calculator Module (Python)**: `calculator.py` and `test_calculator.py`

- Clean code structure
- Type hints
- Docstrings
- Comprehensive tests
- Error handling

**Calculator Module (JavaScript)**: `calculator.js` and `calculator.test.js`

- JSDoc comments
- Clean functions
- Comprehensive tests
- Error handling

**GitHub Actions Workflow**: `.github/workflows/indie-dev-ci.yml`

- Automated testing
- Coverage checking
- Multi-language support

**The Python Example:**

**Structure:**

```
tools/indie-dev/
├── calculator.py          # Main module
├── test_calculator.py     # Unit tests
├── requirements.txt       # Dependencies
└── README.md             # Documentation
```

**Key Features:**

- Type hints for all functions
- Docstrings with examples
- Error handling
- Test organization with classes
- Edge case coverage

**Running the Example:**

```bash
cd tools/indie-dev
pip install -r requirements.txt
pytest test_calculator.py --cov=calculator
```

**The JavaScript Example:**

**Structure:**

```
tools/indie-dev/
├── calculator.js          # Main module
├── calculator.test.js     # Unit tests
├── package.json          # Dependencies
└── README.md             # Documentation
```

**Key Features:**

- JSDoc comments
- Module exports
- Jest test framework
- Coverage thresholds

**Running the Example:**

```bash
cd tools/indie-dev
bun install
bun test
```

**Using These Examples as Templates:**

**Step 1: Copy the Structure**

```bash
# For Python project
cp -r tools/indie-dev/calculator.py my_module.py
cp -r tools/indie-dev/test_calculator.py test_my_module.py

# For JavaScript project
cp -r tools/indie-dev/calculator.js my_module.js
cp -r tools/indie-dev/calculator.test.js my_module.test.js
```

**Step 2: Adapt the Code**

- Replace calculator functions with your functions
- Keep the same structure and patterns
- Maintain type hints/docstrings
- Keep error handling

**Step 3: Write Your Tests**

- Follow the same test organization
- Test happy path, edge cases, errors
- Maintain >80% coverage
- Use descriptive test names

**Step 4: Set Up CI/CD**

- Copy `.github/workflows/indie-dev-ci.yml`
- Update paths for your project
- Set coverage thresholds
- Push and verify it works

**Common Patterns from Examples:**

**Error Handling:**

```python
if b == 0:
    raise ValueError("Cannot divide by zero")
```

**Type Hints:**

```python
def add(a: float, b: float) -> float:
```

**Docstrings:**

```python
"""
Add two numbers.
Args:
    a: First number
    b: Second number
Returns:
    Sum of a and b
"""
```

**Test Organization:**

```python
class TestAdd:
    def test_add_positive_numbers(self):
        assert add(2, 3) == 5.0
```

**Edge Case Testing:**

- Normal cases
- Zero values
- Negative values
- Empty collections
- Error conditions

**What Makes These Examples Good:**

**Clean Code:**

- Single responsibility per function
- Clear naming
- Proper error handling
- Good documentation

**Comprehensive Tests:**

- High coverage
- Edge cases covered
- Error cases tested
- Well organized

**Production Ready:**

- Type hints/types
- Error handling
- Documentation
- Tests

**Adapting to Your Project:**

**For an API Project:**

```python
# api.py
from fastapi import FastAPI, HTTPException

app = FastAPI()

@app.get("/calculate/{operation}")
def calculate(operation: str, a: float, b: float):
    if operation == "add":
        return {"result": add(a, b)}
    elif operation == "divide":
        if b == 0:
            raise HTTPException(status_code=400, detail="Cannot divide by zero")
        return {"result": divide(a, b)}
    else:
        raise HTTPException(status_code=400, detail="Invalid operation")
```

**For a CLI Tool:**

```python
# cli.py
import sys
from calculator import add, divide

def main():
    if len(sys.argv) != 4:
        print("Usage: python cli.py <operation> <a> <b>")
        sys.exit(1)

    operation = sys.argv[1]
    a = float(sys.argv[2])
    b = float(sys.argv[3])

    if operation == "add":
        result = add(a, b)
    elif operation == "divide":
        result = divide(a, b)
    else:
        print(f"Unknown operation: {operation}")
        sys.exit(1)

    print(result)

if __name__ == "__main__":
    main()
```

**For a Library:**

```python
# mylib/calculator.py
"""Calculator library for indie developers."""

__version__ = "1.0.0"

from .operations import add, subtract, multiply, divide

__all__ = ["add", "subtract", "multiply", "divide"]
```

**Best Practices Demonstrated:**

**1. Test Organization:**

- Group related tests in classes
- Descriptive test names
- One assertion per test (when possible)

**2. Error Handling:**

- Validate inputs
- Raise specific exceptions
- Include helpful error messages

**3. Documentation:**

- Docstrings for all functions
- Examples in docstrings
- Type hints/types

**4. Code Structure:**

- Single responsibility
- Clear naming
- Consistent formatting

**5. Testing:**

- High coverage
- Edge cases
- Error cases
- Fast execution

**Running the Examples:**

**Python:**

```bash
cd tools/indie-dev
pip install -r requirements.txt
pytest test_calculator.py -v
pytest test_calculator.py --cov=calculator --cov-report=html
```

**JavaScript:**

```bash
cd tools/indie-dev
bun install
bun test
bun test -- --coverage
```

**GitHub Actions:**

The workflow automatically runs when you push code. Check `.github/workflows/indie-dev-ci.yml` for the configuration.

**Next Steps After Examples:**

**1. Understand the Code:**

- Read through each function
- Understand the tests
- Trace execution flow

**2. Modify the Code:**

- Add new functions
- Write tests for them
- Run coverage

**3. Build Your Own:**

- Start with the structure
- Replace with your logic
- Maintain the quality

**4. Set Up CI/CD:**

- Copy the workflow
- Adapt for your project
- Push and verify

## Key Takeaways

- Examples are in `tools/indie-dev/`
- Study the code structure and patterns
- Use as templates for your projects
- Maintain the same quality standards
- Write tests for everything

## Next Steps

You now have complete examples to learn from. Use them as templates for your own projects. Start by modifying the calculator, then build something new using the same patterns.

## Action Items

- Run the Python example and verify tests pass
- Run the JavaScript example and verify tests pass
- Study the code structure and test organization
- Copy the structure for a new project
- Set up GitHub Actions for your project
