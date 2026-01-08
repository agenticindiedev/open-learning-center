# Security Audit Guide

This document helps you check for leaked paths, environment variables, and secrets before making your project open source.

## Quick Start

Run the automated security audit script:

```bash
bash .security-audit.sh
```

## Manual Checks

If you prefer to check manually, follow these steps:

### 1. Check for Absolute Paths

Search for paths containing your username, home directory, or computer-specific paths:

```bash
# Search for macOS paths
grep -r "/Users/" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.json" --include="*.md" --include="*.sh" 2>/dev/null | grep -v node_modules | grep -v ".git"

# Search for Linux paths
grep -r "/home/" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.json" --include="*.md" --include="*.sh" 2>/dev/null | grep -v node_modules | grep -v ".git"

# Search for Windows paths
grep -r "C:\\\\" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.json" --include="*.md" --include="*.sh" 2>/dev/null | grep -v node_modules | grep -v ".git"

# Search for your specific username (replace 'decod3rs' with your username)
grep -ri "decod3rs" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.json" --include="*.md" --include="*.sh" 2>/dev/null | grep -v node_modules | grep -v ".git"
```

### 2. Check for Hardcoded Secrets

Search for hardcoded API keys, secrets, passwords, or tokens:

```bash
grep -riE "(api[_-]?key|secret|password|token|auth|private[_-]?key)\s*[=:]\s*['\"][a-zA-Z0-9_\-]{10,}['\"]" . \
  --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" \
  --include="*.json" 2>/dev/null | grep -v node_modules | grep -v ".git" | \
  grep -v "example" | grep -v "test" | grep -v "mock" | grep -v "placeholder"
```

### 3. Check for .env Files

Find all `.env` files and verify they're not committed:

```bash
# Find all .env files
find . -name ".env*" -type f 2>/dev/null | grep -v node_modules | grep -v ".git"

# Check if they're in .gitignore
cat .gitignore | grep -E "\.env"
```

**Important**: All `.env*` files should be in `.gitignore` and should never contain real secrets.

### 4. Verify .gitignore

Check that your `.gitignore` includes:

```bash
cat .gitignore
```

Ensure it contains:
- `.env`
- `.env.local`
- `.env.*.local`
- `node_modules/`
- `dist/`
- `coverage/`
- Any build artifacts
- IDE-specific files (`.vscode/`, `.idea/`, etc.)

### 5. Check Environment Variable Usage

Verify that environment variables are used correctly (not hardcoded):

```bash
# Find all process.env usage
grep -r "process\.env\." . --include="*.ts" --include="*.tsx" \
  --include="*.js" --include="*.jsx" 2>/dev/null | grep -v node_modules | \
  grep -v ".git"

# Check for suspicious fallback values (hardcoded secrets as fallbacks)
grep -r "process\.env\." . --include="*.ts" --include="*.tsx" \
  --include="*.js" --include="*.jsx" 2>/dev/null | grep -v node_modules | \
  grep -v ".git" | grep -E "\|\|.*['\"][a-zA-Z0-9_\-]{10,}"
```

### 6. Review Config Files

Check these key files:

- `docker/env.production.example` - Should only have placeholder values like `your-api-key-here`
- `apps/api/src/config/*` - Should use `process.env` or environment variables
- `scripts/*.sh` - Should not contain hardcoded paths or secrets
- Any `*.config.*` files - Should not contain real secrets

### 7. Check Documentation Files

Review markdown files for:
- Example commands with your username
- Screenshots with your path visible
- Documentation with hardcoded secrets (even if marked as examples)

```bash
grep -riE "(decod3rs|/Users/|api[_-]?key.*[a-zA-Z0-9]{20,})" . \
  --include="*.md" 2>/dev/null | grep -v node_modules | grep -v ".git"
```

## Common Issues to Fix

### Issue: Absolute Path in Code

**Problem:**
```typescript
const filePath = '/Users/decod3rs/projects/myfile.txt';
```

**Fix:**
```typescript
const filePath = path.join(process.cwd(), 'myfile.txt');
// or
const filePath = path.resolve(__dirname, 'myfile.txt');
```

### Issue: Hardcoded API Key

**Problem:**
```typescript
const apiKey = 'sk_live_1234567890abcdef';
```

**Fix:**
```typescript
const apiKey = process.env.API_KEY || '';
if (!apiKey) {
  throw new Error('API_KEY environment variable is required');
}
```

### Issue: .env File Committed

**Problem:** `.env` file is in git

**Fix:**
1. Remove from git (but keep locally):
   ```bash
   git rm --cached .env
   git rm --cached .env.local
   ```
2. Add to `.gitignore`:
   ```
   .env
   .env.local
   .env.*.local
   ```
3. Commit the changes

### Issue: Real Secrets in Example Files

**Problem:** `env.production.example` contains real values

**Fix:** Replace with placeholders:
```
API_KEY=your-api-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

## Pre-commit Checklist

Before pushing to a public repository, verify:

- [ ] No absolute paths with your username
- [ ] No hardcoded API keys, secrets, or passwords
- [ ] All `.env*` files are in `.gitignore`
- [ ] Example files only contain placeholders
- [ ] All `process.env` usage is correct
- [ ] Documentation doesn't reveal personal information
- [ ] No database connection strings with real credentials
- [ ] No service account keys or tokens

## After Audit

1. Review all findings from the audit script
2. Fix any issues found
3. Re-run the audit to confirm
4. Test that your application still works with environment variables
5. Commit your fixes
6. Make the repository public

## Need Help?

If you find any suspicious content:
1. Don't panic - rotate any exposed secrets immediately
2. Remove sensitive data from git history if already committed:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch path/to/file" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. Use tools like `git-secrets` to prevent future leaks
