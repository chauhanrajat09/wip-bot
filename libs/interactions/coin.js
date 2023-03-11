const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const choices = ['rock', 'paper', 'scissors'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play rock paper scissors')
    .addStringOption(option =>
      option.setName('choice')
        .setDescription('Choose rock, paper or scissors')
        .setRequired(true)
        .addChoices([
          ['Rock', 'rock'],
          ['Paper', 'paper'],
          ['Scissors', 'scissors'],
        ])
    ),

  async execute(interaction) {
    console.log(`Received RPS command from user: ${interaction.user.tag}`);
    await interaction.deferReply();

    const userChoice = interaction.options.getString('choice');
    console.log(`User's choice: ${userChoice}`);

    const botChoice = choices[Math.floor(Math.random() * 3)];
    console.log(`Bot's choice: ${botChoice}`);

    let result;
    if (userChoice === botChoice) {
      result = 'It\'s a tie!';
    } else if (
      (userChoice === 'rock' && botChoice === 'scissors') ||
      (userChoice === 'paper' && botChoice === 'rock') ||
      (userChoice === 'scissors' && botChoice === 'paper')
    ) {
      result = 'You win!';
    } else {
      result = 'I win!';
    }
    console.log(`Result: ${result}`);

    const embed = new EmbedBuilder()
      .setTitle('Rock Paper Scissors')
      .addFields(
        { name: 'Your Choice', value: userChoice },
        { name: 'My Choice', value: botChoice },
        { name: 'Result', value: result }
      )
      .setColor('#00FFFF');

    console.log(`Sending RPS result to user: ${interaction.user.tag}`);
    await interaction.editReply({ embeds: [embed] });
  },
};
