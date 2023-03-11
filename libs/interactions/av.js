const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Get the avatar of a mentioned user')
    .addUserOption(option => option.setName('user').setDescription('The user to get the avatar of')),

  async execute(interaction) {
    console.log(`Received avatar command from user: ${interaction.user.tag}`);
    await interaction.deferReply();

    const user = interaction.options.getUser('user') ?? interaction.user;
    console.log(`Getting avatar of user: ${user.tag}`);

    const embed = new EmbedBuilder()
      .setTitle(`Avatar of ${user.tag}`)
      .setColor('#0000FF')
      .setImage(user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }));

    console.log(`Sending avatar of user to user: ${interaction.user.tag}`);
    await interaction.reply({ embeds: [embed] });
  },
};
