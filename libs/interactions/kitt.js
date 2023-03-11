const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Make the bot join your voice channel'),

    async execute(interaction) {
        // Check if the user is in a voice channel
        if (!interaction.member.voice.channel) {
            return interaction.reply({ content: 'You must be in a voice channel to use this command!', ephemeral: true });
        }

        // Join the user's voice channel
        const connection = await interaction.member.voice.channel.join();

        // Send a success message
        interaction.reply({ content: `Joined ${interaction.member.voice.channel.name}`, ephemeral: true });
    },
};
