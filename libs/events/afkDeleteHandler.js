const { MongoClient } = require('mongodb');
const { EmbedBuilder } = require('discord.js');
const uri = process.env.MONGODB_URI;

module.exports = function createAfkDeleteHandler(client) {
  return async function afkDeleteHandler(message) {
    console.log(`afkDeleteHandler triggered for message "${message.content}"`);

    if (message.author.bot) {
      console.log(`afkDeleteHandler ignored message from bot "${message.content}"`);
      return;
    }

    const { guild, content, author, channel } = message;

    const client = new MongoClient(uri);
    try {
      await client.connect();
      console.log(`afkDeleteHandler connected to MongoDB for message "${message.content}"`);

      const collection = client.db('afk').collection('statuses');
      const existingStatus = await collection.findOne({ guildId: guild.id, userId: author.id });
      if (!existingStatus) {
        console.log(`afkDeleteHandler ignored message for non-AFK user "${message.content}"`);
        return;
      }

      await collection.deleteOne({ guildId: guild.id, userId: author.id });
      console.log(`afkDeleteHandler deleted AFK status for user "${author.username}" in guild "${guild.name}"`);

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setDescription(`The AFK status for <@${author.id}> has been removed.`)
        .setThumbnail('https://media.tenor.com/hVRzRZnx-YsAAAAC/pepe-the-frog-sitting-chillin.gif');


      await channel.send({ embeds: [embed] });
      console.log(`afkDeleteHandler sent AFK deletion message for user "${author.username}" in guild "${guild.name}"`);
    } catch (err) {
      console.error(`An error occurred while deleting AFK status for message "${message.content}":`, err);
    } finally {
      await client.close();
      console.log(`afkDeleteHandler disconnected from MongoDB for message "${message.content}"`);
    }
  };
};
