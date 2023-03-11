const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cointoss')
    .setDescription('Flip a coin'),

  async execute(interaction) {
    console.log(`Received coin toss command from user: ${interaction.user.tag}`);
    await interaction.deferReply();

    const result = Math.floor(Math.random() * 2) == 0 ? 'Heads' : 'Tails';
    console.log(`Result: ${result}`);

    let embed;
    if (result === 'Heads') {
      embed = new EmbedBuilder()
        .setTitle('Coin Toss')
        .setThumbnail('https://qph.cf2.quoracdn.net/main-qimg-9c81a54813716fccd8e3608ab2f51dcf-lq')
        .setDescription('The coin landed on Heads.')

        .setColor('#FFFF00');
    } else {
      embed = new EmbedBuilder()
        .setTitle('Coin Toss')
        .setThumbnail('https://qph.cf2.quoracdn.net/main-qimg-148ae81e6fe0500e130fb547026a9b26-lq')
        .setDescription('The coin landed on Tails.')
        
        .setColor('#0000FF');
    }

    console.log(`Sending coin toss result to user: ${interaction.user.tag}`);
    await interaction.editReply({ embeds: [embed] });
  },
};
