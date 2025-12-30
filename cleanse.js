require("dotenv").config();
const { Client, GatewayIntentBits, ChannelType } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  if (process.env.DELETE_ALL_VOICE_CHANNELS !== "true") {
    console.log("gg");
    return;
  }

  for (const guild of client.guilds.cache.values()) {
    console.log(`gg`);

    const channels = guild.channels.cache.filter(
      c =>
        c.type === ChannelType.GuildVoice ||
        c.type === ChannelType.GuildStageVoice
    );

    for (const channel of channels.values()) {
      try {
        await channel.delete("Mass voice channel deletion");
        console.log(`gg`);
      } catch (err) {
        console.error(`gg`);
      }
    }
  }

  console.log("Finished deleting voice channels.");
});

client.login(process.env.DISCORD_TOKEN);
