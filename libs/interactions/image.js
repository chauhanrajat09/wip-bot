const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const mongoose = require("mongoose");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Prompt = mongoose.model("Prompt", {
  prompt: String,
  userId: String,
});


module.exports = {
  data: new SlashCommandBuilder()
    .setName("generateimage")
    .setDescription("Generate a image based on a prompt")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("The prompt for the image generation")
        .setRequired(true)
    )
    .toJSON(),
  async execute(interaction) {
  console.log(`Received generateimage command from ${interaction.user.tag}`);
  await interaction.deferReply();
  const prompt = interaction.options.getString("prompt");
  const userId = interaction.user.id;

  // Store the prompt value and user ID in MongoDB
  await Prompt.create({ prompt, userId });
  console.log(`Prompt '${prompt}' stored in MongoDB with user ID ${userId}`);

  const response = await openai.createImage({
    prompt: prompt,
    n: 2,
    size: "1024x1024",
  });
  const imageUrls = response.data.data.map((imageData) => imageData.url);
  console.log(`Generated ${imageUrls.length} images`);
  const embed = new EmbedBuilder()
    .setColor("#F8C300")
    .setTitle(`Generated images`)
    .addFields(
      { name: "Prompt", value: prompt },
      { name: "by User", value: `<@${interaction.user.id}>` }
    );
  for (const imageUrl of imageUrls) {
    embed.setImage(imageUrl);
    await interaction.followUp({ embeds: [embed] });
  }
}


};