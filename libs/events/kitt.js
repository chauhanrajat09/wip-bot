const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Make the bot join your voice channel'),

    async execute(bot, message) {
  // Make sure user is in a voice channel
  if (!message.member.voice.channel) {
    return message.channel.send({ content: 'You must be in a voice channel to use this command!', ephemeral: true });
  }

  // Check if bot is already in the same voice channel
  if (bot.voice.connections.has(message.guild.id)) {
    const connection = bot.voice.connections.get(message.guild.id);
    if (connection.joinConfig.channelId === message.member.voice.channelId) {
      return message.channel.send({ content: 'I am already in your voice channel!', ephemeral: true });
    } else {
      await connection.destroy();
    }
  }

  // Check if the voice channel is full and the bot does not have the "Move Members" permission
  if (message.member.voice.channel.full && !message.member.voice.channel.permissionsFor(message.guild.me).has('MOVE_MEMBERS')) {
    return message.channel.send({ content: 'The voice channel is full and I cannot join!', ephemeral: true });
  }

  // Join the user's voice channel
  const connection = await message.member.voice.channel.join();

  // Send a success message
  message.channel.send({ content: `Joined ${message.member.voice.channel.name}`, ephemeral: true });
}

};
