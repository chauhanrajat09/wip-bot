const axios = require("axios");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { Interaction } = require("discord.js");
const { MongoClient } = require("mongodb");

const OPENAI_API_URL = "https://api.openai.com/v1/completions";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = "text-davinci-003";
const MONGODB_URI = process.env.MONGODB_URI;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Chat with GPT-3")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message you want to send to GPT-3")
        .setRequired(true)
    )
    .toJSON(),
  async execute(interaction) {
    await interaction.deferReply();
    const message = interaction.options.getString("message");
    const requestData = {
      model: OPENAI_MODEL,
      prompt: message,
      temperature: 0,
      max_tokens: 2048,
    };
    const response = await axios.post(OPENAI_API_URL, requestData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    });
    const completion = response.data.choices[0].text.trim();
    
    // Save the chat request to MongoDB
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();
    const collection = db.collection("chat_requests");
    const chatRequest = {
      user: interaction.user.id,
      message: message,
      timestamp: new Date(),
    };
    await collection.insertOne(chatRequest);
    client.close();

   await interaction.editReply(`\`${message}\`: ${completion}`);

  },
};
