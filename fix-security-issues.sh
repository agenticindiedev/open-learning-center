#!/bin/bash

# Fix Security Issues Script
# This script fixes the issues found by the security audit

set -e

echo "========================================="
echo "Fixing Security Issues"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Fix REMOTE_WORK_SETUP.md
if [ -f "REMOTE_WORK_SETUP.md" ]; then
  echo "1. Fixing REMOTE_WORK_SETUP.md..."
  # Replace absolute paths with generic paths
  sed -i.bak 's|/Users/decod3rs/www/shipshitdev/oss/open-learning-center|~/projects/academy|g' REMOTE_WORK_SETUP.md
  sed -i.bak 's|/Users/decod3rs/www/shipshitdev/oss/academy|~/projects/academy|g' REMOTE_WORK_SETUP.md
  rm -f REMOTE_WORK_SETUP.md.bak
  echo -e "${GREEN}✓ Fixed REMOTE_WORK_SETUP.md${NC}"
else
  echo -e "${YELLOW}⚠ REMOTE_WORK_SETUP.md not found, skipping${NC}"
fi
echo ""

# 2. Fix .agent/SYSTEM/decisions.md
if [ -f ".agent/SYSTEM/decisions.md" ]; then
  echo "2. Fixing .agent/SYSTEM/decisions.md..."
  # Replace absolute paths with generic paths
  sed -i.bak 's|/Users/decod3rs/www/shipshitdev/open-learning-center|~/projects/academy|g' .agent/SYSTEM/decisions.md
  sed -i.bak 's|/Users/decod3rs/www/shipshitdev/oss/academy|~/projects/academy|g' .agent/SYSTEM/decisions.md
  rm -f .agent/SYSTEM/decisions.md.bak
  echo -e "${GREEN}✓ Fixed .agent/SYSTEM/decisions.md${NC}"
else
  echo -e "${YELLOW}⚠ .agent/SYSTEM/decisions.md not found, skipping${NC}"
fi
echo ""

# 3. Check if .env files are committed to git
echo "3. Checking for committed .env files..."
COMMITTED_ENV=$(git ls-files 2>/dev/null | grep -E "\.env$" | grep -v ".env.example" || true)
if [ -n "$COMMITTED_ENV" ]; then
  echo -e "${RED}⚠ Found .env files committed to git:${NC}"
  echo "$COMMITTED_ENV"
  echo -e "${YELLOW}You should remove these from git:${NC}"
  echo "  git rm --cached <file>"
  echo "  (Make sure .env is in .gitignore first)"
else
  echo -e "${GREEN}✓ No .env files are committed to git${NC}"
fi
echo ""

# 4. Check if .next is in .gitignore
echo "4. Verifying .gitignore includes .next..."
if [ -f ".gitignore" ]; then
  if grep -qE "^\.next|^\.next/" .gitignore 2>/dev/null; then
    echo -e "${GREEN}✓ .next is in .gitignore${NC}"
  else
    echo -e "${YELLOW}⚠ .next may not be in .gitignore${NC}"
    echo "Checking if .next files are committed..."
    COMMITTED_NEXT=$(git ls-files 2>/dev/null | grep "\.next" || true)
    if [ -n "$COMMITTED_NEXT" ]; then
      echo -e "${RED}⚠ Found .next files committed to git${NC}"
      echo "You should add .next to .gitignore and remove these files"
    else
      echo -e "${GREEN}✓ No .next files are committed to git${NC}"
    fi
  fi
else
  echo -e "${RED}⚠ .gitignore file not found!${NC}"
fi
echo ""

# 5. Remove build artifacts that might contain absolute paths
echo "5. Checking build artifacts..."
if [ -d "apps/web/.next" ]; then
  echo -e "${YELLOW}⚠ Build artifacts found in apps/web/.next${NC}"
  echo "These should be in .gitignore. Checking..."
  if git ls-files apps/web/.next 2>/dev/null | grep -q .; then
    echo -e "${RED}⚠ Some .next files are committed!${NC}"
    echo "Consider: git rm -r --cached apps/web/.next"
  else
    echo -e "${GREEN}✓ .next directory is not committed${NC}"
  fi
fi
echo ""

echo "========================================="
echo "Fix Summary"
echo "========================================="
echo -e "${GREEN}✓ Absolute paths in documentation files have been replaced${NC}"
echo ""
echo "Next steps:"
echo "1. Review the changes made to the files"
echo "2. If .env files were found in git, remove them: git rm --cached <file>"
echo "3. Ensure .next is in .gitignore"
echo "4. Re-run the security audit: bash .security-audit.sh"
echo "5. Commit your fixes"
