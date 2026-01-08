#!/usr/bin/env python3
"""
Fix absolute paths in documentation files
"""
import os
import re
from pathlib import Path

# Patterns to replace
PATTERNS = [
    (r'/Users/decod3rs/www/shipshitdev/oss/open-learning-center', '~/projects/academy'),
    (r'/Users/decod3rs/www/shipshitdev/open-learning-center', '~/projects/academy'),
    (r'/Users/decod3rs/www/shipshitdev/oss/academy', '~/projects/academy'),
    (r'/Users/decod3rs/www/agenticindiedev/oss/open-learning-center', '~/projects/academy'),
    # Also replace the username in any remaining paths
    (r'/Users/decod3rs/', '~/'),
]

# Files to check and fix
FILES_TO_FIX = [
    'REMOTE_WORK_SETUP.md',
    '.agent/SYSTEM/decisions.md',
]

def fix_file(filepath):
    """Fix absolute paths in a file"""
    if not os.path.exists(filepath):
        print(f"⚠ File not found: {filepath}")
        return False

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        changes_made = False

        # Apply all pattern replacements
        for pattern, replacement in PATTERNS:
            new_content = re.sub(pattern, replacement, content)
            if new_content != content:
                changes_made = True
                content = new_content

        # Only write if changes were made
        if changes_made:
            # Create backup
            backup_path = f"{filepath}.bak"
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.write(original_content)

            # Write fixed content
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

            print(f"✓ Fixed: {filepath}")
            return True
        else:
            print(f"✓ No changes needed: {filepath}")
            return False

    except Exception as e:
        print(f"✗ Error processing {filepath}: {e}")
        return False

def main():
    print("=" * 50)
    print("Fixing Absolute Paths")
    print("=" * 50)
    print()

    fixed_count = 0
    for filepath in FILES_TO_FIX:
        if fix_file(filepath):
            fixed_count += 1
        print()

    print("=" * 50)
    print(f"Summary: Fixed {fixed_count} file(s)")
    print("=" * 50)

    # Check for .env files in git
    print()
    print("Checking for committed .env files...")
    import subprocess
    try:
        result = subprocess.run(
            ['git', 'ls-files'],
            capture_output=True,
            text=True,
            check=True
        )
        env_files = [f for f in result.stdout.split('\n') if f.endswith('.env') and '.example' not in f]
        if env_files:
            print(f"⚠ Found .env files in git: {', '.join(env_files)}")
            print("  Remove them with: git rm --cached <file>")
        else:
            print("✓ No .env files are committed to git")
    except Exception as e:
        print(f"⚠ Could not check git status: {e}")

if __name__ == '__main__':
    main()
