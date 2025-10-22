require("dotenv").config(); // Loads your .env file
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const SOURCE_VC_ID = "1420401881678741577";
const DEST_VC_ID = "1426493443080716389";

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  if (oldState.channelId !== SOURCE_VC_ID && newState.channelId !== SOURCE_VC_ID) return;

  const member = newState.member;
  if (!member) return;

  if (newState.serverMute || newState.serverDeaf) return;

  const mutedOrDeafened = newState.selfMute || newState.selfDeaf;

  if (mutedOrDeafened && newState.channelId === SOURCE_VC_ID) {
    try {
      await member.voice.setChannel(DEST_VC_ID);
      console.log(`Moved ${member.user.tag} to destination VC.`);
    } catch (err) {
      console.error(`Failed to move ${member.user.tag}:`, err.message);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
