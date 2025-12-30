require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const SOURCE_VC_ID = process.env.SOURCE_VC_ID;
const DEST_VC_ID = process.env.DEST_VC_ID;
const DEST_VC_NAME = process.env.DEST_VC_NAME;

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

async function renameDestVC(guild, newName) {
  const channel = guild.channels.cache.get(DEST_VC_ID);
  if (!channel) return;
  if (channel.name === newName) return;

  try {
    await channel.setName(newName);
    console.log(`Renamed destination VC to: ${newName}`);
  } catch (err) {
    console.error("Failed to rename VC:", err.message);
  }
}

client.on("voiceStateUpdate", async (oldState, newState) => {
  if (
    oldState.channelId !== SOURCE_VC_ID &&
    newState.channelId !== SOURCE_VC_ID
  ) return;

  const member = newState.member;
  if (!member) return;

  if (newState.serverMute || newState.serverDeaf) return;

  const mutedOrDeafened = newState.selfMute || newState.selfDeaf;

  if (mutedOrDeafened && newState.channelId === SOURCE_VC_ID) {
    try {
      await member.voice.setChannel(DEST_VC_ID);
      console.log(`Moved ${member.user.tag} to destination VC.`);

      await renameDestVC(newState.guild, DEST_VC_NAME);
    } catch (err) {
      console.error(`Failed to move ${member.user.tag}:`, err.message);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Bot is running"));
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
