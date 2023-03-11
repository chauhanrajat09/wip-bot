const { SlashCommandBuilder } = require('@discordjs/builders');
const { MongoClient } = require('mongodb');
const { EmbedBuilder, Message } = require('discord.js');

const uri = process.env.MONGODB_URI;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Set yourself as AFK')
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for going AFK')
        .setRequired(false)
    ),

async execute(interaction) {
    console.log('AFK command invoked by user:', interaction.user.username);

    const { guildId, user } = interaction;
    const reason = interaction.options.getString('reason') || 'AFK';

    const client = new MongoClient(uri);
    try {
        await client.connect();
        const collection = client.db('afk').collection('statuses');
        const existingStatus = await collection.findOne({ guildId, userId: user.id });
        if (existingStatus) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Error')
                .setDescription('You already have an AFK status set.')
              .setThumbnail('https://image.pngaaa.com/438/3498438-middle.png');

            console.log(`AFK status already set for user ${user.username}`);
            return await interaction.reply({ embeds: [embed] });
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('AFK Status Set')
            .setDescription(" ```Your status has been set to AFK.``` ")
           .setThumbnail('https://media.tenor.com/EdsxVExcR6oAAAAi/pepe-leaving-leaving-pepe.gif')

            .addFields(
                { name: "User", value: `<@${user.id}>`},
                { name: "Reason", value: reason }
            ) 

        console.log(`AFK status set message sent to user ${user.username}`);
        const originalReply = await interaction.reply({ embeds: [embed] });

        if (!originalReply) {
            console.error('An error occurred while setting AFK status: Original interaction reply failed');
            return;
        }

        await collection.insertOne({
            guildId: guildId,
            userId: user.id,
            reason: reason,
            timestamp: new Date(),
        });

        console.log(`AFK status set for user ${user.username} with reason: ${reason}`);
    } catch (err) {
        console.error('An error occurred while setting AFK status:', err);
        const originalReply = interaction.replied ? interaction.fetchReply() : null;

        if (!originalReply) {
            console.error('An error occurred while setting AFK status: Original interaction reply failed');
            return;
        }

        return await interaction.followUp({
            content: 'An error occurred while setting AFK status.',
            ephemeral: true,
        });
    } finally {
        await client.close();
    }
},

}