const { MongoClient } = require('mongodb');
const { EmbedBuilder } = require('discord.js');
const moment = require('moment');

const uri = process.env.MONGODB_URI;

module.exports = function afkHandler(client) {
  client.on('messageCreate', async (message) => {
    console.log(`afkHandler triggered for message "${message.content}"`);

    if (message.author.bot) {
      console.log(`afkHandler ignored message from bot "${message.content}"`);
      return;
    }

    const { guild, content } = message;
    const user = message.mentions.users.first();
    if (!user) {
      console.log(`afkHandler ignored message without user mention "${message.content}"`);
      return;
    }

    const client = new MongoClient(uri);
    try {
      await client.connect();
      console.log(`afkHandler connected to MongoDB for message "${message.content}"`);

      const collection = client.db('afk').collection('statuses');
      const existingStatus = await collection.findOne({ guildId: guild.id, userId: user.id });
      if (!existingStatus) {
        console.log(`afkHandler ignored message for non-AFK user "${message.content}"`);
        return;
      }

      const now = moment();
      const timestamp = moment(existingStatus.timestamp);
      const duration = moment.duration(now.diff(timestamp));
      const durationStr = duration.humanize(true);

const embed = new EmbedBuilder()
  .setColor('#F4C430')
  .addFields(
    { name: 'User', value: `<@${user.id}>` },
    { name: 'Reason', value: existingStatus.reason },
    { name: 'Last seen', value: durationStr + ' ago' }
  )
  .setThumbnail(user.displayAvatarURL());



      await message.channel.send({ embeds: [embed] });
      console.log(`afkHandler sent AFK message for user "${user.username}" in guild "${guild.name}"`);
    } catch (err) {
      console.error(`An error occurred while checking AFK status for message "${message.content}":`, err);
    } finally {
      await client.close();
      console.log(`afkHandler disconnected from MongoDB for message "${message.content}"`);
    }
  });
};
