const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const MovieSuggestion = require('../models/movieSuggestion');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('randommovie')
    .setDescription('Get a random movie suggestion.'),
  async execute(interaction) {
    const guildId = interaction.guild.id;

    console.log(`Retrieving a random movie suggestion for server ${guildId}`);

    // Get all movie suggestions for this server
    const movieSuggestions = await MovieSuggestion.find({ guildId });

    // If there are no movie suggestions, send a message indicating that there are no suggestions
    if (movieSuggestions.length === 0) {
      console.log(`No movie suggestions found for server ${guildId}`);
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('No Movie Suggestions Found')
        .setDescription('Sorry, there are no movie suggestions for this server.')
        .setThumbnail('https://media.tenor.com/VzjRFZU38sgAAAAC/sad-frog.gif');
      return await interaction.reply({ embeds: [embed] });
    }

    // Choose a random movie suggestion from the list
    const randomIndex = Math.floor(Math.random() * movieSuggestions.length);
    const randomMovie = movieSuggestions[randomIndex];

    console.log(`Random movie suggestion "${randomMovie.movie}" retrieved for server ${guildId}`);

    // Delete the random movie suggestion from the database
    await MovieSuggestion.findOneAndDelete({ _id: randomMovie._id });

    // Send an embed message with the random movie suggestion
    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('Movie Suggestion Found')
      .setDescription('Here is a movie suggestion for you:')
      .addFields(
        { name: 'by User', value: `<@${randomMovie.userId}>` },
        { name: 'Movie', value: randomMovie.movie },
      );
    await interaction.reply({ embeds: [embed] });
  },
};
