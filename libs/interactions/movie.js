const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const MovieSuggestion = require('../models/movieSuggestion');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('moviesuggestion')
    .setDescription('Suggest a movie.')
    .addStringOption(option =>
      option.setName('movie')
        .setDescription('Enter the name of a movie you would like to suggest.')
        .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();

    const movieName = interaction.options.getString('movie');
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;

    console.log(`Movie suggestion "${movieName}" received from user ${userId} for server ${guildId}`);

    // Check if the user has already made a suggestion for this server
    const existingSuggestion = await MovieSuggestion.findOne({ userId, guildId });
    if (existingSuggestion) {
      // Send an embed message indicating that the user has already made a suggestion
      console.log(`User ${userId} has already made a suggestion for server ${guildId}`);
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('You Have Already Made a Suggestion')
        .setDescription('Sorry, you have already made a suggestion for this server.');
      return await interaction.editReply({ embeds: [embed] });
    }

    // Store the movie suggestion in the database
    console.log(`Storing movie suggestion "${movieName}" from user ${userId} for server ${guildId}`);
    const suggestion = new MovieSuggestion({ movie: movieName, userId, guildId });
    await suggestion.save();

    // Send a message confirming that the movie suggestion has been noted
    await interaction.editReply(`Thank you for your suggestion! We have noted "${movieName}" for this server.`);
    console.log(`Movie suggestion "${movieName}" from user ${userId} for server ${guildId} has been stored`);
  },
};
