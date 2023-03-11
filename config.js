

module.exports = {
  discordToken: process.env.DISCORD_TOKEN,
  discordClientId: process.env.CLIENT_ID,
  shouldCreateCommands: process.env.SHOULD_CREATE_COMMANDS === 'true',
  countingChannel: process.env.COUNTING_CHANNEL,
  guildid: process.env.guildid,
};