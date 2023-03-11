const fetch = require('node-fetch');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cat')
    .setDescription('Sends a random cat picture or gif.'),
  async execute(interaction) {
    // Make a request to the Cat API to get a random cat image or gif
    const response = await fetch('https://api.thecatapi.com/v1/images/search');
    const data = await response.json();

    // Create an embed message with the cat image or gif
    const embed = new EmbedBuilder()
      .setTitle('need cat? get cat!')
      .setImage(data[0].url)
      .setColor('#FFC0CB');

    // Send the embed message as a reply to the interaction
    interaction.reply({ embeds: [embed] });
  },
};
