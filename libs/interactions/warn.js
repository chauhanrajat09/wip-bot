const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const MovieSuggestion = require('../models/warn');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to warn')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for the warning')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const { user, guild } = interaction;
    const member = guild.members.cache.get(user.id);
    const { user: warnedUser, reason } = interaction.options.get('user', 'reason');
    const warnedMember = guild.members.cache.get(warnedUser.id);

    // Check if user is trying to warn themselves
    if (user.id === warnedUser.id) {
      return interaction.reply({ content: 'You cannot warn yourself!', ephemeral: true });
    }

    // Check if user is a moderator
    if (!member.permissions.has('KICK_MEMBERS')) {
      return interaction.reply({ content: 'You must be a moderator to warn others!', ephemeral: true });
    }

    // Check if warned user is a moderator
    if (warnedMember.permissions.has('KICK_MEMBERS')) {
      return interaction.reply({ content: 'You cannot warn a moderator!', ephemeral: true });
    }

    // Connect to database
    await mongo();

    // Create or update warning in database
    const warning = {
      userId: warnedUser.id,
      guildId: guild.id,
      reason,
      staffId: user.id,
      timestamp: new Date(),
    };

    await warnSchema.findOneAndUpdate(
      {
        userId: warnedUser.id,
        guildId: guild.id,
      },
      warning,
      {
        upsert: true,
      }
    );

    // Send embed with warning details
    const embed = new EmbedBuilder()
      .setTitle('User Warned')
      .setColor('#FF8C19')
      .setThumbnail(warnedUser.displayAvatarURL())
      .addFields(
        { name: 'User', value: warnedUser.toString() },
        { name: 'Moderator', value: user.toString() },
        { name: 'Reason', value: reason }
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
