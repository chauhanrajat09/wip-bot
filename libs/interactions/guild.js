const { SlashCommandBuilder } = require('@discordjs/builders');
const GuildModel = require('../models/guild');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Set up guild settings')
    .addBooleanOption(option =>
      option.setName('counting')
        .setDescription('Enable counting module')
        .setRequired(false))
    .addChannelOption(option =>
      option.setName('counting_channel')
        .setDescription('Counting channel')
        .setRequired(false))
    .addBooleanOption(option =>
      option.setName('buttonroles')
        .setDescription('Enable buttonroles module')
        .setRequired(false))
    .addChannelOption(option =>
      option.setName('buttonroles_channel')
        .setDescription('Buttonroles channel')
        .setRequired(false))
    .addBooleanOption(option =>
      option.setName('afk')
        .setDescription('Enable afk module')
        .setRequired(false))
    .addBooleanOption(option =>
      option.setName('movie')
        .setDescription('Enable movie module')
        .setRequired(false))
    .addBooleanOption(option =>
      option.setName('chat_gpt')
        .setDescription('Enable chat gpt module')
        .setRequired(false))
    .addNumberOption(option =>
      option.setName('chat_gpt_temp')
        .setDescription('Temperature for chat GPT module (default: 0.7)')
        .setRequired(false))
        
    .addBooleanOption(option =>
      option.setName('welcome')
        .setDescription('Enable welcome module')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('join_message')
        .setDescription('Join message for welcome module')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('leave_message')
        .setDescription('Leave message for welcome module')
        .setRequired(false)),
 async execute(interaction) {
  // Defer the reply
  await interaction.deferReply({ ephemeral: true });

  // Get the guild ID
  const guildID = interaction.guild.id;

  // Get the current guild document
  const guildDoc = await GuildModel.findOne({ guildID });

  // Update the settings based on the interaction options
  if (interaction.options.getBoolean('counting') !== null) {
    guildDoc.counting.enabled = interaction.options.getBoolean('counting');
    if (interaction.options.getChannel('counting_channel')) {
      guildDoc.counting.channel = interaction.options.getChannel('counting_channel').id;
    }
  }

  if (interaction.options.getBoolean('buttonroles') !== null) {
    guildDoc.buttonRoles.enabled = interaction.options.getBoolean('buttonroles');
    if (interaction.options.getChannel('buttonroles_channel')) {
      guildDoc.buttonRoles.channel = interaction.options.getChannel('buttonroles_channel').id;
    }
  }

  if (interaction.options.getBoolean('afk') !== null) {
    guildDoc.afk.enabled = interaction.options.getBoolean('afk');
  }

  if (interaction.options.getBoolean('movie') !== null) {
    guildDoc.movie.enabled = interaction.options.getBoolean('movie');
    if (interaction.options.getChannel('movie_channel')) {
      guildDoc.movie.channelID = interaction.options.getChannel('movie_channel').id;
    }
  }

  if (interaction.options.getBoolean('chat_gpt') !== null) {
    guildDoc.chatgpt.enabled = interaction.options.getBoolean('chat_gpt');
    if (interaction.options.getNumber('chat_gpt_temp')) {
      guildDoc.chatgpt.temperature = interaction.options.getNumber('chat_gpt_temp');
    }
  }

  if (interaction.options.getBoolean('welcome') !== null) {
    guildDoc.welcome.enabled = interaction.options.getBoolean('welcome');
    if (interaction.options.getString('join_message')) {
      guildDoc.welcome.welcomeMessage = interaction.options.getString('join_message');
    }
    if (interaction.options.getString('leave_message')) {
      guildDoc.welcome.leaveMessage = interaction.options.getString('leave_message');
    }
  }

  // Save the updated document
  await guildDoc.save();

  // Reply to the interaction
  await interaction.editReply('Guild settings updated.');
}



  }