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

# 2️⃣ Installing

### 📦 Using the Template in Unraid (Recommended)

Run this command in the Unraid terminal:

```bash
wget -O /boot/config/plugins/dockerMan/templates-user/discord-n8n-bot.xml \
https://raw.githubusercontent.com/McHusky/discord-n8n-bot/unraid-templates/discord-n8n-bot.xml
```
Then in Unraid: 
1. Go to **Docker → Add Container**
2. Select the **discord-n8n-bot** template
3. Fill in the variables:

| Variable                         | Description                               |
| -------------------------------- |:-----------------------------------------:|
| DISCORD_TOKEN                    | Your Discord Bot Token                    |
| N8N_WEBHOOK_URL                  | Full n8n webhook URL                      |
| REQUIRE_MENTION (`true`/`false`) | `true` = bot responds only when mentioned |
| RALLOWED_CHANNEL_ID              | Optional: limit bot to a channel          |

4. Click **Apply** and start the container

### 🛠 Alternative Installation (Manual CLI)

If you prefer not to use the Unraid template, you can run the container manually.

### Pull the image

```bash
docker pull ghcr.io/mchusky/discord-n8n-bot:latest
```
Run the container
```
docker run -d \
  --name discord-n8n-bot \
  -e DISCORD_TOKEN="YOUR_DISCORD_TOKEN" \
  -e N8N_WEBHOOK_URL="YOUR_WEBHOOK_URL" \
  -e REQUIRE_MENTION="true" \
  -e ALLOWED_CHANNEL_ID="YOUR_CHANNEL_ID" \
  --restart unless-stopped \
  ghcr.io/mchusky/discord-n8n-bot:latest
```
**Optional: Restrict to specific channel**

If you want the bot to respond in all channels, remove the ALLOWED_CHANNEL_ID variable.

**Check logs**
```bash
docker logs -f discord-n8n-bot
```

You should see:
```bash
Logged in as <your bot name>
```

# 3️⃣ Configure n8n (with AI)

1. Open your n8n instance
2. Create a new workflow
3. Add a Webhook Trigger node
    * HTTP Method: **POST**
    * Path: such as `/discord-in`
4. Connect an LLM of your choice, e.g. Ollama on the same instance
    * Use this expression for message content:<br>`{{$json.body.message}}`
5. Use `Discord → Send a message` to answer using bot token or similar

---

# 🔄 Updating

If installed from GHCR:
```bash
docker pull ghcr.io/mchusky/discord-n8n-bot:latest
docker restart discord-n8n-bot
```

# 🐞 Troubleshooting
#### Bot is unresponsive

* Check that MESSAGE CONTENT INTENT is enabled
* Verify bot permissions in Discord
* See logs:
```bash
docker logs -f discord-n8n-bot
```
#### n8n unreachable

Exec into the container:
```bash
docker exec -it discord-n8n-bot sh
wget -qO- http://server:5678
```

# 🛡 Security Notes

- Never commit your Discord Bot Token.
- Do not expose n8n publicly unless secured.
- Keep your Unraid system updated.

---

# 📄 License

MIT
