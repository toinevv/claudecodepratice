# GitHub Setup Guide for Claude Code Action

This guide will help you set up your UIGen repository on GitHub with Claude Code Action integration.

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon and select "New repository"
3. Name it `uigen` (or your preferred name)
4. Make it public or private (your choice)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these files)
6. Click "Create repository"

## Step 2: Push Your Local Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit your code
git commit -m "Initial commit with Claude Code integration"

# Add your GitHub repository as origin (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/uigen.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Set Up Anthropic API Key

1. Go to your repository on GitHub
2. Click **Settings** (repository settings, not account settings)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Name: `ANTHROPIC_API_KEY`
6. Value: Your Anthropic API key (get one from https://console.anthropic.com)
7. Click **Add secret**

## Step 4: Enable GitHub Actions

1. In your repository, go to the **Actions** tab
2. If prompted, click **I understand my workflows, go ahead and enable them**
3. The workflows should now be active

## Step 5: Test Claude Code Action

Create a test issue:
1. Go to **Issues** tab in your repository
2. Click **New issue**
3. Title: "Test Claude Code"
4. Body: "@claude-code please help me understand the project structure"
5. Click **Create issue**

The Claude Code Action should respond within a few minutes!

## Alternative: Manual Setup (if GitHub App doesn't work)

If the automatic GitHub App installation fails, you can use the workflow file I created:

1. The workflow is already created at `.github/workflows/claude-code.yml`
2. It will trigger when:
   - Issues/comments mention `@claude-code`
   - Issues/PRs have the `claude-code` label
   - PR review comments mention `@claude-code`

## Troubleshooting

### Common Issues:

1. **"Failed to access repository"**
   - Make sure the repository exists on GitHub
   - Ensure you have admin permissions on the repository

2. **Action doesn't trigger**
   - Check that `ANTHROPIC_API_KEY` secret is set correctly
   - Verify the workflow file is in `.github/workflows/`
   - Make sure to mention `@claude-code` in issues/comments

3. **Permission errors**
   - Ensure GitHub Actions are enabled in repository settings
   - Check that the `GITHUB_TOKEN` has sufficient permissions

### Getting Help:

- Check the Actions tab for error logs
- Review the [official documentation](https://github.com/anthropics/claude-code-action/)
- Create an issue in the anthropics/claude-code-action repository

## Usage Examples

Once set up, you can use Claude Code Action like this:

**In Issues:**
```
@claude-code can you help me implement a dark mode toggle for this application?
```

**In Pull Requests:**
```
@claude-code please review this authentication implementation and suggest improvements
```

**In Comments:**
```
@claude-code I'm getting a TypeScript error here, can you help fix it?
```

The action will analyze your code and provide helpful responses directly in GitHub!