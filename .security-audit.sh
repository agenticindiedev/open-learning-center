#!/bin/bash

# Security Audit Script for Open Source Project
# Checks for leaked paths, environment variables, and secrets

echo "========================================="
echo "Security Audit - Checking for Leaks"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

FOUND_ISSUES=0

# 1. Check for absolute paths
echo "1. Checking for absolute paths (/Users/, /home/, C:\\)..."
echo "---------------------------------------------------"
ABSOLUTE_PATHS=$(grep -r -i -E "(/Users/|/home/[^/]+|C:\\\\|\\\\Users)" . \
  --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" \
  --include="*.json" --include="*.md" --include="*.sh" --include="*.yml" \
  --include="*.yaml" 2>/dev/null | \
  grep -v node_modules | grep -v ".git" | grep -v "dist/" | grep -v "coverage/" | \
  grep -v ".next/" | grep -v ".security-audit.sh" | grep -v "fix-security-issues.sh" | \
  grep -v "fix_paths.py" | grep -v "SECURITY_AUDIT.md" | grep -v "SECURITY_FIXES_SUMMARY.md")

if [ -n "$ABSOLUTE_PATHS" ]; then
  echo -e "${RED}⚠ ISSUES FOUND:${NC}"
  echo "$ABSOLUTE_PATHS"
  FOUND_ISSUES=$((FOUND_ISSUES + 1))
else
  echo -e "${GREEN}✓ No absolute paths found${NC}"
fi
echo ""

# 2. Check for hardcoded secrets/API keys
echo "2. Checking for hardcoded secrets/API keys..."
echo "---------------------------------------------------"
HARDCODED_SECRETS=$(grep -riE "(api[_-]?key|secret|password|token|auth|private[_-]?key)\s*[=:]\s*['\"][a-zA-Z0-9_\-]{10,}['\"]" . \
  --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" \
  --include="*.json" 2>/dev/null | \
  grep -v node_modules | grep -v ".git" | grep -v "dist/" | grep -v "coverage/" | \
  grep -v "example" | grep -v "test" | grep -v "mock")

if [ -n "$HARDCODED_SECRETS" ]; then
  echo -e "${RED}⚠ ISSUES FOUND:${NC}"
  echo "$HARDCODED_SECRETS" | sed 's/\([a-zA-Z0-9_\-]\{20,\}\)/\1.../g'  # Mask long strings
  FOUND_ISSUES=$((FOUND_ISSUES + 1))
else
  echo -e "${GREEN}✓ No hardcoded secrets found${NC}"
fi
echo ""

# 3. Check for .env files that might be committed
echo "3. Checking for .env files..."
echo "---------------------------------------------------"
ENV_FILES=$(find . -name ".env*" -type f 2>/dev/null | \
  grep -v node_modules | grep -v ".git" | grep -v "dist/")

if [ -n "$ENV_FILES" ]; then
  echo -e "${YELLOW}⚠ Found .env files (verify they're in .gitignore):${NC}"
  echo "$ENV_FILES"
  for file in $ENV_FILES; do
    if [ -f "$file" ]; then
      echo "  Checking: $file"
      # Check if it contains actual secrets (not just placeholders)
      if grep -qiE "(api[_-]?key|secret|password)\s*[=:]\s*[^#\s]+" "$file" 2>/dev/null | grep -v "^#" | grep -v "your-" | grep -v "placeholder" | grep -v "example"; then
        echo -e "    ${RED}⚠ May contain real secrets!${NC}"
        FOUND_ISSUES=$((FOUND_ISSUES + 1))
      fi
    fi
  done
else
  echo -e "${GREEN}✓ No .env files found${NC}"
fi
echo ""

# 4. Check .gitignore
echo "4. Checking .gitignore..."
echo "---------------------------------------------------"
if [ -f ".gitignore" ]; then
  if grep -qE "^\.env" .gitignore 2>/dev/null; then
    echo -e "${GREEN}✓ .env files are in .gitignore${NC}"
  else
    echo -e "${YELLOW}⚠ .env files may not be in .gitignore${NC}"
    FOUND_ISSUES=$((FOUND_ISSUES + 1))
  fi

  if grep -qE "node_modules" .gitignore 2>/dev/null; then
    echo -e "${GREEN}✓ node_modules is in .gitignore${NC}"
  else
    echo -e "${YELLOW}⚠ node_modules may not be in .gitignore${NC}"
  fi
else
  echo -e "${RED}⚠ .gitignore file not found!${NC}"
  FOUND_ISSUES=$((FOUND_ISSUES + 1))
fi
echo ""

# 5. Check process.env usage for suspicious patterns
echo "5. Checking environment variable usage..."
echo "---------------------------------------------------"
ENV_USAGE=$(grep -r "process\.env\." . --include="*.ts" --include="*.tsx" \
  --include="*.js" --include="*.jsx" 2>/dev/null | \
  grep -v node_modules | grep -v ".git" | grep -v "dist/" | \
  grep -E "\|\|.*['\"][a-zA-Z0-9_\-]{10,}" | grep -v "localhost" | grep -v "example")

if [ -n "$ENV_USAGE" ]; then
  echo -e "${YELLOW}⚠ Found process.env with hardcoded fallbacks:${NC}"
  echo "$ENV_USAGE"
  FOUND_ISSUES=$((FOUND_ISSUES + 1))
else
  echo -e "${GREEN}✓ Environment variable usage looks safe${NC}"
fi
echo ""

# 6. Check config files
echo "6. Checking config files..."
echo "---------------------------------------------------"
CONFIG_FILES=$(find . -name "*.config.*" -o -name "config.*" -o -name "*.env.example" \
  2>/dev/null | grep -v node_modules | grep -v ".git" | grep -v "dist/")

if [ -n "$CONFIG_FILES" ]; then
  for file in $CONFIG_FILES; do
    echo "  Checking: $file"
    # Check for suspicious content
    if grep -qiE "(api[_-]?key|secret|password)\s*[=:]\s*[^#\s]+" "$file" 2>/dev/null | \
       grep -v "^#" | grep -v "your-" | grep -v "placeholder" | grep -v "example" | \
       grep -v "process\.env" | grep -v "undefined" | grep -qE "[a-zA-Z0-9_\-]{10,}"; then
      echo -e "    ${RED}⚠ May contain real secrets!${NC}"
      FOUND_ISSUES=$((FOUND_ISSUES + 1))
    fi
  done
else
  echo -e "${GREEN}✓ No suspicious config files${NC}"
fi
echo ""

# Summary
echo "========================================="
echo "Audit Summary"
echo "========================================="
if [ $FOUND_ISSUES -eq 0 ]; then
  echo -e "${GREEN}✓ No security issues found!${NC}"
  exit 0
else
  echo -e "${RED}⚠ Found $FOUND_ISSUES potential security issue(s)${NC}"
  echo "Please review the issues above before making the project public."
  exit 1
fi
