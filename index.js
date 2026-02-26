import { Client, GatewayIntentBits, Partials } from "discord.js";

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
const ALLOWED_CHANNEL_ID = process.env.ALLOWED_CHANNEL_ID; // optional
const REQUIRE_MENTION = (process.env.REQUIRE_MENTION ?? "true").toLowerCase() === "true";

if (!DISCORD_TOKEN) throw new Error("DISCORD_TOKEN fehlt");
if (!N8N_WEBHOOK_URL) throw new Error("N8N_WEBHOOK_URL fehlt");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel],
});

client.on("ready", () => console.log(`✅ Logged in as ${client.user.tag}`));

client.on("messageCreate", async (msg) => {
  try {
    if (msg.author.bot) return;

    if (ALLOWED_CHANNEL_ID && msg.channelId !== ALLOWED_CHANNEL_ID) return;

    if (REQUIRE_MENTION) {
      const mentioned = msg.mentions.users.has(client.user.id);
      if (!mentioned) return;
    }

    const cleaned = msg.content.replace(new RegExp(`<@!?${client.user.id}>`, "g"), "").trim();
    if (!cleaned) return;

    await msg.channel.sendTyping();

    const payload = {
      message: cleaned,
      discord: {
        channelId: msg.channelId,
        messageId: msg.id,
        author: { id: msg.author.id, username: msg.author.username },
      },
    };

    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ n8n error:", res.status, text);
      await msg.reply("Sorry, n8n hat einen Fehler zurückgegeben.");
    }
  } catch (e) {
    console.error("❌ error:", e);
  }
});

client.login(DISCORD_TOKEN);
