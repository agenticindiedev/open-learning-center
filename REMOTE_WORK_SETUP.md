# Remote Work Setup: tmux + Terminus + Tailscale

This guide explains how to set up a remote development environment using **tmux**, **Terminus**, and **Tailscale** so you can continue working with Claude sessions from anywhere.

## 🎯 Overview

**The Problem**: When working with Claude in Cursor, your session is tied to your local machine. If you disconnect or switch devices, you lose context.

**The Solution**: Use tmux to persist terminal sessions, Tailscale to create a secure VPN between your devices, and Terminus to connect remotely.

**The Stack**:
- **tmux**: Terminal multiplexer that keeps sessions alive even when disconnected
- **Tailscale**: VPN that creates a secure mesh network between your devices
- **Terminus**: Terminal app that can SSH into remote machines

## 📋 Prerequisites

- macOS (primary development machine)
- Secondary device (Mac, iPad, iPhone, or another computer) for remote access
- Basic familiarity with terminal commands

---

## Step 1: Install Tailscale

Tailscale creates a secure VPN between your devices using WireGuard.

### On Your Primary Machine (Development Machine)

```bash
# Install via Homebrew
brew install tailscale

# Start Tailscale
sudo tailscale up

# Follow the prompts to authenticate with your Google/Microsoft/GitHub account
```

### On Your Remote Device

**macOS/iPad/iPhone**: Install from App Store
**Linux**: `sudo apt install tailscale` or `sudo yum install tailscale`
**Windows**: Download from [tailscale.com](https://tailscale.com/download)

### Verify Connection

```bash
# On your primary machine, check your Tailscale IP
tailscale ip -4

# You should see something like: 100.x.x.x
```

Both devices should now appear in your Tailscale admin console: https://login.tailscale.com/admin/machines

---

## Step 2: Configure SSH on Your Primary Machine

Enable SSH so Terminus can connect remotely.

### Enable SSH on macOS

```bash
# Enable Remote Login (SSH)
sudo systemsetup -setremotelogin on

# Or via System Preferences:
# System Preferences → Sharing → Remote Login (enable)
```

### Configure SSH for Better Security

Edit `/etc/ssh/sshd_config`:

```bash
sudo nano /etc/ssh/sshd_config
```

Add/modify these settings:

```
# Use Tailscale IP only (more secure)
ListenAddress 100.x.x.x  # Replace with your Tailscale IP

# Disable password authentication (use keys only)
PasswordAuthentication no
PubkeyAuthentication yes

# Optional: Change default port (security through obscurity)
Port 2222
```

Restart SSH:

```bash
sudo launchctl stop com.openssh.sshd
sudo launchctl start com.openssh.sshd
```

### Generate SSH Key Pair (if you don't have one)

```bash
# On your remote device
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key to your primary machine
ssh-copy-id -p 2222 username@100.x.x.x  # Replace with your Tailscale IP
```

---

## Step 3: Install and Configure tmux

tmux keeps your terminal sessions alive even when disconnected.

### Install tmux

```bash
# macOS
brew install tmux

# Linux
sudo apt install tmux  # Debian/Ubuntu
sudo yum install tmux  # RHEL/CentOS
```

### Basic tmux Configuration

Create `~/.tmux.conf`:

```bash
# Enable mouse support
set -g mouse on

# Start windows and panes at 1, not 0
set -g base-index 1
setw -g pane-base-index 1

# Reload config with r
bind r source-file ~/.tmux.conf \; display "Config reloaded!"

# Split panes using | and -
bind | split-window -h
bind - split-window -v
unbind '"'
unbind %

# Switch panes using Alt-arrow without prefix
bind -n M-Left select-pane -L
bind -n M-Right select-pane -R
bind -n M-Up select-pane -U
bind -n M-Down select-pane -D

# Increase scrollback buffer
set -g history-limit 10000

# Enable 256 color mode
set -g default-terminal "screen-256color"

# Status bar customization
set -g status-position top
set -g status-bg colour235
set -g status-fg colour136
set -g status-left '#[fg=colour233,bg=colour241,bold] #S #[fg=colour241,bg=colour235,nobold]'
set -g status-right '#[fg=colour233,bg=colour241,bold] %d/%m #[fg=colour233,bg=colour245,bold] %H:%M:%S '
set -g status-right-length 50
set -g status-left-length 20
```

### Essential tmux Commands

```bash
# Start a new session
tmux

# Start a named session
tmux new -s claude-work

# List all sessions
tmux ls

# Attach to a session
tmux attach -t claude-work

# Detach from session (keeps it running)
# Press: Ctrl+b, then d

# Kill a session
tmux kill-session -t claude-work
```

**tmux Prefix Key**: Default is `Ctrl+b`. All tmux commands start with this prefix.

**Common Shortcuts**:
- `Ctrl+b d` - Detach from session
- `Ctrl+b c` - Create new window
- `Ctrl+b n` - Next window
- `Ctrl+b p` - Previous window
- `Ctrl+b %` - Split vertically
- `Ctrl+b "` - Split horizontally
- `Ctrl+b x` - Close pane
- `Ctrl+b [` - Enter copy mode (scroll history)

---

## Step 4: Install and Configure Terminus

Terminus is a modern terminal app that supports SSH connections.

### Install Terminus

**macOS**: Download from [Terminus website](https://eugeny.github.io/terminus/) or via Homebrew:

```bash
brew install --cask terminus
```

**Windows/Linux**: Download from [GitHub releases](https://github.com/Eugeny/terminus/releases)

### Configure SSH Connection in Terminus

1. Open Terminus
2. Click the **+** button to add a new connection
3. Select **SSH** connection type
4. Fill in the details:
   - **Name**: `Primary Dev Machine` (or any name)
   - **Host**: Your Tailscale IP (e.g., `100.x.x.x`)
   - **Port**: `2222` (or your custom SSH port)
   - **User**: Your macOS username
   - **Private Key**: Path to your SSH private key (usually `~/.ssh/id_ed25519`)

5. Click **Save**

### Connect via Terminus

1. Click on your saved connection
2. Terminus will connect via SSH using your Tailscale VPN
3. You're now connected to your primary machine remotely!

---

## Step 5: Workflow for Remote Claude Sessions

### Initial Setup (On Your Primary Machine)

1. **Start a tmux session**:
   ```bash
   tmux new -s claude-work
   ```

2. **Navigate to your project**:
   ```bash
   cd /Users/decod3rs/www/shipshitdev/oss/open-learning-center
   ```

3. **Open Cursor/your editor** (if needed):
   ```bash
   cursor .  # or code . for VS Code
   ```

4. **Start your work session** - Begin working with Claude in Cursor

### When You Need to Work Remotely

1. **On your remote device**, open Terminus
2. **Connect** to your primary machine via the SSH connection you configured
3. **Attach to your tmux session**:
   ```bash
   tmux attach -t claude-work
   ```
4. **Continue working** - Your terminal session is exactly as you left it!

### Best Practices

**Always use tmux for long-running work**:
```bash
# Instead of just opening a terminal, start tmux
tmux new -s project-name

# Or attach to existing session
tmux attach -t project-name
```

**Keep your session alive**:
- tmux sessions persist even if you disconnect
- Your terminal history, environment variables, and running processes stay intact
- You can detach (`Ctrl+b d`) and reattach anytime

**Multiple sessions for different projects**:
```bash
tmux new -s skool-project
tmux new -s other-project
tmux ls  # List all sessions
```

---

## Step 6: Advanced Configuration

### Auto-start tmux on SSH Login

Add to `~/.zshrc` or `~/.bashrc`:

```bash
# Auto-start tmux on SSH connections
if [ -z "$TMUX" ] && [ -n "$SSH_CONNECTION" ]; then
    tmux attach-session -t main || tmux new-session -s main
fi
```

### tmux Plugin Manager (Optional but Recommended)

Install TPM:

```bash
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
```

Add to `~/.tmux.conf`:

```bash
# List of plugins
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'
set -g @plugin 'tmux-plugins/tmux-resurrect'  # Save/restore sessions
set -g @plugin 'tmux-plugins/tmux-continuum'  # Auto-save sessions

# Initialize TMUX plugin manager (keep this line at the very bottom of tmux.conf)
run '~/.tmux/plugins/tpm/tpm'
```

Reload tmux config (`Ctrl+b r`) and install plugins (`Ctrl+b I`).

### Tailscale ACLs (Access Control Lists)

For additional security, configure Tailscale ACLs at https://login.tailscale.com/admin/acls:

```json
{
  "groups": {
    "group:admin": ["your-email@example.com"]
  },
  "hosts": {
    "dev-machine": "100.x.x.x"
  },
  "acls": [
    {
      "action": "accept",
      "src": ["group:admin"],
      "dst": ["dev-machine:22"]
    }
  ]
}
```

---

## 🔒 Security Considerations

1. **Use SSH keys, not passwords**: Disable password authentication
2. **Firewall rules**: Consider restricting SSH to Tailscale IPs only
3. **Keep Tailscale updated**: `brew upgrade tailscale`
4. **Monitor connections**: Check `tailscale status` regularly
5. **Use ACLs**: Configure Tailscale ACLs for fine-grained access control

---

## 🐛 Troubleshooting

### Can't connect via Terminus

1. **Check Tailscale status**:
   ```bash
   tailscale status
   ```
   Both devices should show as "online"

2. **Verify SSH is running**:
   ```bash
   sudo launchctl list | grep ssh
   ```

3. **Test SSH connection**:
   ```bash
   ssh -p 2222 username@100.x.x.x
   ```

4. **Check firewall**: macOS Firewall might block SSH

### tmux session not found

```bash
# List all sessions
tmux ls

# If session exists but can't attach, try:
tmux attach -t session-name

# If session is dead, start a new one:
tmux new -s session-name
```

### Tailscale not connecting

1. **Restart Tailscale**:
   ```bash
   sudo tailscale down
   sudo tailscale up
   ```

2. **Check Tailscale logs**:
   ```bash
   tailscale status --json
   ```

3. **Re-authenticate**:
   ```bash
   sudo tailscale up --reset
   ```

---

## 📚 Additional Resources

- **tmux**: [tmux Cheat Sheet](https://tmuxcheatsheet.com/)
- **Tailscale**: [Tailscale Documentation](https://tailscale.com/kb/)
- **Terminus**: [Terminus GitHub](https://github.com/Eugeny/terminus)
- **SSH**: [SSH Key Management](https://www.ssh.com/academy/ssh/key)

---

## ✅ Quick Reference

**Daily Workflow**:
1. On primary machine: `tmux new -s claude-work`
2. Work normally in Cursor with Claude
3. When remote: Open Terminus → Connect → `tmux attach -t claude-work`
4. Continue working seamlessly

**Essential Commands**:
```bash
# tmux
tmux new -s session-name    # New session
tmux attach -t session-name # Attach to session
tmux ls                     # List sessions
Ctrl+b d                    # Detach from session

# Tailscale
tailscale status            # Check connection status
tailscale ip -4            # Get your Tailscale IP

# SSH
ssh -p 2222 user@100.x.x.x  # Test SSH connection
```

---

**You're now set up for remote development!** 🚀

Your Claude sessions can continue seamlessly across devices using tmux persistence, Tailscale VPN security, and Terminus remote access.
