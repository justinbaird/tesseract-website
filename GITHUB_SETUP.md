# GitHub Setup for Multiple Accounts

This repository is configured to use **local Git settings** so it won't interfere with your other projects.

## Current Configuration

- **Repository-specific user**: `justinbaird` (justin@justinbaird.com)
- **Remote URL**: `git@github.com-tesseract:justinbaird/tesseract-website.git` (SSH)
- **SSH Key**: `~/.ssh/id_ed25519_tesseract` (already generated and added to SSH agent)
- **SSH Config**: Configured in `~/.ssh/config` with host alias `github.com-tesseract`

## ✅ SSH Setup Complete!

SSH keys have been generated and configured for this repository. You just need to add the public key to your GitHub account.

### Final Step: Add SSH Key to GitHub

1. **Copy your public SSH key** (already copied below):
   ```
   ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFCIm8A8KY8D8XIoKDp7SKSySlTy+lB89y25kIN242vG justin@justinbaird.com
   ```

2. **Add it to GitHub**:
   - Go to: https://github.com/settings/ssh/new
   - **Title**: `Tesseract Website - Cursor` (or any descriptive name)
   - **Key type**: Authentication Key
   - **Key**: Paste the public key above
   - Click **"Add SSH key"**

3. **Test the connection**:
   ```bash
   ssh -T git@github.com-tesseract
   ```
   You should see: `Hi justinbaird! You've successfully authenticated...`

4. **Push your changes**:
   ```bash
   git push origin main
   ```

## How It Works

This setup uses a **custom SSH host alias** (`github.com-tesseract`) so you can:
- Use different SSH keys for different projects
- Keep your other projects using their own GitHub accounts
- Avoid conflicts between multiple GitHub accounts

The SSH config routes `github.com-tesseract` to use the specific key for this project.

## Alternative: HTTPS with Personal Access Token

If you prefer HTTPS instead of SSH:

1. Create a PAT at https://github.com/settings/tokens
2. Update remote: `git remote set-url origin https://github.com/justinbaird/tesseract-website.git`
3. Use PAT as password when pushing

## Changing the GitHub Account for This Repository

If you need to use a different GitHub account for this project:

```bash
# Update local user config
git config --local user.name "your-other-username"
git config --local user.email "your-other-email@example.com"

# Update remote URL if needed
git remote set-url origin https://github.com/your-other-username/tesseract-website.git
```

## Verify Configuration

Check your local Git config:
```bash
git config --local --list
```

## Troubleshooting

- **"Authentication failed"**: Make sure you're using a PAT, not your password
- **"Permission denied"**: Verify your PAT has the `repo` scope
- **Wrong account**: Check `git config --local user.name` and `git config --local user.email`

