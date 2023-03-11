const fetch = require('node-fetch');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dog')
    .setDescription('Sends a random dog picture or gif.'),
  async execute(interaction) {
    // Make a request to the Dog API to get a random dog image or gif
    const response = await fetch('https://api.thedogapi.com/v1/images/search');
    const data = await response.json();

    // Create an embed message with the dog image or gif
    const embed = new EmbedBuilder()
      .setTitle('Doggo!!')
      .setImage(data[0].url)
      .setColor('#FFC0CB');

    // Send the embed message as a reply to the interaction
    interaction.reply({ embeds: [embed] });
  },
};
