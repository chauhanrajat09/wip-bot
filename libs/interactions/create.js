const { SlashCommandBuilder } = require('@discordjs/builders');
const GuildModel = require('../models/guild');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setupsample')
    .setDescription('Create a sample of guild settings'),
  async execute(interaction) {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      // if user is not an admin, show an error message and return
      await interaction.reply({
        content: 'You do not have permission to use this command.',
        ephemeral: true
      });
      return;
    }

    try {
      const guildID = interaction.guildId;

      // Check if guild already exists in database
      const existingGuildSettings = await GuildModel.findOne({ guildID: guildID });
      if (existingGuildSettings) {
        await interaction.reply('Guild settings already exist for this server.');
        return;
      }

      const sampleGuildSettings = new GuildModel({
        guildID: guildID,
        counting: {
          enabled: false,
          channel: null,
          count: 0
        },
        buttonRoles: {
          enabled: false,
          channel: null,
          roles: new Map()
        },
        welcome: {
          enabled: false,
          welcomeMessage: null,
          leaveMessage: null
        },
        afk: {
          enabled: false,
          timeout: 0
        },
        movie: {
          enabled: false,
          channelID: null,
          message: null
        },
        chatgpt: {
          enabled: false,
          temperature: 0.5
        }
      });

      await sampleGuildSettings.save();

      await interaction.reply('Sample of guild settings created successfully!');
    } catch (error) {
      console.log(error);
      await interaction.reply('There was an error creating the sample of guild settings.');
    }
  },
};
