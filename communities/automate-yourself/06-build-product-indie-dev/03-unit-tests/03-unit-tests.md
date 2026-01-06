# Unit Tests and GitHub Actions

## Learning Objective

Write unit tests for your code and set up GitHub Actions to automatically run tests, check coverage, and enforce quality standards.

## Main Content

Unit tests verify individual functions and components work correctly. GitHub Actions runs these tests automatically on every push and pull request.

**Why Tests Matter:**

**Catch Bugs Early**: Tests find bugs before users do. Fix bugs when they're cheap to fix.

**Prevent Regressions**: When you change code, tests ensure you didn't break existing functionality.

**Documentation**: Tests show how code is supposed to work. They're executable documentation.

**Confidence**: You can refactor and improve code knowing tests will catch mistakes.

**Why Automate with GitHub Actions:**

**Runs on Every Push**: Tests run automatically. No manual steps.

**Catches Issues Early**: Failures show up immediately in pull requests.

**Enforces Standards**: Can block merges if tests fail or coverage is too low.

**Saves Time**: You don't have to remember to run tests manually.

**Professional**: Shows you care about quality. Users and employers notice.

**Writing Unit Tests:**

**Python Example with pytest:**

```python
# calculator.py
def add(a: float, b: float) -> float:
    """Add two numbers."""
    return a + b

def divide(a: float, b: float) -> float:
    """Divide two numbers."""
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b
```

```python
# tests/test_calculator.py
import pytest
from calculator import add, divide

def test_add_positive_numbers():
    """Test adding two positive numbers."""
    assert add(2, 3) == 5

def test_add_negative_numbers():
    """Test adding negative numbers."""
    assert add(-2, -3) == -5

def test_add_zero():
    """Test adding zero."""
    assert add(5, 0) == 5

def test_divide_normal():
    """Test normal division."""
    assert divide(10, 2) == 5

def test_divide_by_zero():
    """Test division by zero raises error."""
    with pytest.raises(ValueError, match="Cannot divide by zero"):
        divide(10, 0)
```

**JavaScript Example with Jest:**

```javascript
// calculator.js
function add(a, b) {
  return a + b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

module.exports = { add, divide };
```

```javascript
// calculator.test.js
const { add, divide } = require("./calculator");

describe("Calculator", () => {
  describe("add", () => {
    test("adds two positive numbers", () => {
      expect(add(2, 3)).toBe(5);
    });

    test("adds negative numbers", () => {
      expect(add(-2, -3)).toBe(-5);
    });

    test("adds zero", () => {
      expect(add(5, 0)).toBe(5);
    });
  });

  describe("divide", () => {
    test("divides normally", () => {
      expect(divide(10, 2)).toBe(5);
    });

    test("throws error when dividing by zero", () => {
      expect(() => divide(10, 0)).toThrow("Cannot divide by zero");
    });
  });
});
```

**Test Coverage:**

Coverage measures how much of your code is tested. Aim for 80%+ coverage.

**Python Coverage:**

```bash
# Install coverage
pip install pytest-cov

# Run tests with coverage
pytest --cov=calculator --cov-report=html

# View HTML report
open htmlcov/index.html
```

**JavaScript Coverage:**

```bash
# Jest includes coverage
bun test -- --coverage

# View coverage report
open coverage/lcov-report/index.html
```

**Setting Up GitHub Actions:**

GitHub Actions runs workflows automatically. Create `.github/workflows/ci.yml`:

**Python Workflow:**

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: "3.11"

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-cov

      - name: Run tests
        run: |
          pytest --cov=calculator --cov-report=xml --cov-report=term

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage.xml
          fail_ci_if_error: true
```

**JavaScript/Node.js Workflow:**

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Run tests
        run: bun test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          fail_ci_if_error: true
```

**Advanced: Enforcing Coverage Thresholds:**

**Python with pytest-cov:**

```python
# pytest.ini
[pytest]
testpaths = tests
python_files = test_*.py
addopts =
    --cov=calculator
    --cov-report=term-missing
    --cov-report=html
    --cov-fail-under=80
```

**JavaScript with Jest:**

```json
// package.json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

**Linting and Formatting:**

Add linting and formatting checks to your workflow:

**Python Example:**

```yaml
- name: Lint with ruff
  run: |
    pip install ruff
    ruff check .

- name: Format check with black
  run: |
    pip install black
    black --check .
```

**JavaScript Example:**

```yaml
- name: Lint with ESLint
  run: bun run lint

- name: Format check with Prettier
  run: bun run format:check
```

**Complete Workflow Example:**

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: "3.11"

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-cov ruff black

      - name: Lint with ruff
        run: ruff check .

      - name: Format check with black
        run: black --check .

      - name: Run tests
        run: |
          pytest --cov=calculator --cov-report=xml --cov-report=term --cov-fail-under=80

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage.xml
          fail_ci_if_error: true
```

**Best Practices:**

**Write Tests First (TDD)**: Write tests before code. Tests define what code should do.

**Test Edge Cases**: Test normal cases, edge cases, and error cases.

**Keep Tests Fast**: Unit tests should run in seconds, not minutes.

**Isolate Tests**: Tests shouldn't depend on each other or external services.

**Use Descriptive Names**: Test names should explain what they test.

**Mock External Services**: Don't hit real APIs or databases in unit tests.

**Run Tests Locally First**: Don't push code that fails tests locally.

**Review Test Failures**: When tests fail, understand why. Don't just fix them blindly.

**The AI-Assisted Testing Workflow:**

**Before AI:**

- Write tests manually: 30-60 minutes
- Miss edge cases
- Inconsistent test patterns

**With AI:**

- Generate tests: 5-10 minutes
- AI suggests edge cases
- Consistent patterns automatically

**Prompt for AI:**
"Write comprehensive unit tests for [function]. Include: happy path, edge cases, error conditions. Use [framework]."

**Example AI-Generated Test:**

You provide:

```python
def calculate_total(items: list[dict], tax_rate: float) -> float:
    subtotal = sum(item['price'] for item in items)
    tax = subtotal * tax_rate
    return subtotal + tax
```

AI generates:

```python
def test_calculate_total_normal():
    items = [{'price': 10}, {'price': 20}]
    assert calculate_total(items, 0.1) == 33.0

def test_calculate_total_empty_list():
    assert calculate_total([], 0.1) == 0.0

def test_calculate_total_zero_tax():
    items = [{'price': 100}]
    assert calculate_total(items, 0.0) == 100.0

def test_calculate_total_negative_price():
    items = [{'price': -10}]
    assert calculate_total(items, 0.1) == -11.0
```

**Setting Up for Your Project:**

**Step 1: Choose Testing Framework**

- Python: pytest
- JavaScript: Jest
- TypeScript: Jest or Vitest
- Go: testing package
- Rust: built-in test framework

**Step 2: Write First Test**

- Pick a simple function
- Write test
- Run it
- Make it pass

**Step 3: Set Up Coverage**

- Install coverage tool
- Configure threshold
- Run coverage report

**Step 4: Create GitHub Actions Workflow**

- Create `.github/workflows/ci.yml`
- Add test step
- Add coverage step
- Push and verify it runs

**Step 5: Enforce Standards**

- Set coverage threshold
- Add linting
- Require passing tests for merges

## Key Takeaways

- Write tests for every function. No exceptions.
- Aim for 80%+ test coverage
- Set up GitHub Actions to run tests automatically
- Use AI to generate tests faster
- Tests catch bugs before users do

## Next Steps

Now that you understand testing and CI/CD, let's look at practical code examples you can build. The next module includes complete projects with tests and CI/CD setup.

## Action Items

- Write unit tests for a function in your current project
- Set up test coverage reporting
- Create `.github/workflows/ci.yml` for your project
- Push code and verify GitHub Actions runs
- Set coverage threshold to 80%
