<p align="left">
  <img src="https://raw.githubusercontent.com/mchusky/discord-n8n-bot/main/icon.png" width="64" align="left" style="margin-right:15px;" />
</p>

# discord-n8n-bot

![GHCR](https://img.shields.io/badge/GHCR-available-blue)
![Unraid](https://img.shields.io/badge/Unraid-template-orange)

A lightweight Discord Gateway bot that relays messages to a local n8n webhook.

The bot maintains a persistent WebSocket connection to Discord and forwards incoming messages to an n8n webhook endpoint.  
This enables seamless integration between Discord and self-hosted AI workflows (e.g. Ollama) without exposing any inbound ports to the internet.

---

## Features

- Discord Gateway (no polling)
- No public ports required
- Optional channel restriction
- Optional mention-only mode
- Designed for self-hosted Unraid environments

---

# Requirements

- Unraid with Docker enabled
- A Discord Bot Token
- MESSAGE CONTENT INTENT enabled
- A running n8n instance with a configured webhook
- Network access from the container to n8n

---

# 1️⃣ Create a Discord Bot

## Step 1 – Open Developer Portal

Go to: https://discord.com/developers/applications

## Step 2 – Create Application

- Click **New Application**
- Choose a name (e.g. Homelab AI)
- Create

## Step 3 – Add Bot

- Go to **Bot**
- Click **Add Bot**
- Confirm

## Step 4 – Enable Required Intents

Under **Bot → Privileged Gateway Intents** enable:

- ✅ MESSAGE CONTENT INTENT

Save changes.

Without this, the bot cannot read message content.

## Step 5 – Invite the Bot to your Server

Go to: **OAuth2 → URL Generator**

Select: 

**Scopes**
- bot

**Bot Permissions**
- Send Messages
- View Channels
- Read Message History

Copy the generated URL and open it in your browser to invite the bot.

## Step 6 – Copy the Bot Token

Under **Bot → Token → Reset Token → Copy**

⚠️ Keep this token secret.

---

# 2️⃣ Install on Unraid

## Using the Template (Recommended)

Run this command in the Unraid terminal:

```bash
wget -O /boot/config/plugins/dockerMan/templates-user/discord-n8n-bot.xml \
https://raw.githubusercontent.com/McHusky/discord-n8n-bot/unraid-templates/discord-n8n-bot.xml
```
Then: **Docker → Add Container**

Select template: **discord-n8n-bot**

Fill in the variables:

| Variable                     | Description                             |
| ---------------------------- |:---------------------------------------:|
| DISCORD_TOKEN                | Your Discord Bot Token                  |
| N8N_WEBHOOK_URL              | Full n8n webhook URL                    |
| REQUIRE_MENTION (true/false) | true = bot responds only when mentioned |
| RALLOWED_CHANNEL_ID          | Optional channel restriction            |

Start the container.

---

# Security Notes

- Never commit your Discord Bot Token.
- Do not expose n8n publicly unless secured.
- Keep your Unraid system updated.

---

# License

MIT
