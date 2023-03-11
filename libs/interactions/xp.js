const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.Gay;
const client = new MongoClient(uri);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addxp')
    .setDescription('Add XP to a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to add XP to')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount of XP to add')
        .setRequired(true)
    ),

  async execute(interaction) {
    // Defer the reply to immediately acknowledge the interaction
    await interaction.deferReply();

    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    try {
      await client.connect();

      const database = client.db();
      const ranks = database.collection('ranks');
      const query = { userID: user.id };
      const userRank = await ranks.findOne(query);

      if (userRank) {
        const newXp = userRank.Xp + amount;
        await ranks.updateOne(query, { $set: { Xp: newXp } });

        const embed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle(`${amount} XP added to ${user.username}'s rank!`)
          .setThumbnail(user.displayAvatarURL());

        await interaction.editReply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle(`${user.username} does not have a rank yet!`)
          .setThumbnail(user.displayAvatarURL());

        await interaction.editReply({ embeds: [embed] });
      }

      await client.close();

      await interaction.followUp(`XP addition for ${user.username} was successful!`);

    } catch (error) {
      console.error(`Error adding XP to ${user.username}'s rank: ${error}`);

      await interaction.followUp(`An error occurred while adding XP to ${user.username}'s rank.`);
    }
  }
};
