const logger = require("../logger");
const Discord = require("discord.js");
const GuildModel = require("../models/guild");
let lastUser = null;
const sad = ('true')
module.exports = async (e) => {
  logger.info(`MessageCreate interaction for user [discordSnowflake=${e.author.id}]`);

  if (e.author.bot === true) {
    logger.info(`Ignoring message from bot [discordSnowflake=${e.author.id}]`);
    return;
  }

  try {
    const guild = await GuildModel.findOne({ guildID: e.guild.id });
    if (!guild) {
      logger.warn(`Guild not found in database [guildID=${e.guild.id}]`);
      return;
    }
    const { enabled } = guild.counting;
    if (!enabled) {
      logger.info(`Module is disabled for this guild [guildID=${guild.id}]`);
      return;
    }
    const { channel, count } = guild.counting;
    if (e.channel.id !== channel) {
      logger.info(`Ignoring message in non-counting channel [channelID=${e.channel.id}]`);
      return;
    }
    if (Number(e.content) !== count + 1) {
      logger.info(`User miscounted [discordSnowflake=${e.author.id}]`);
      const embed = new Discord.EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Miscounted!")
        .setDescription(
          `<@${e.author.id}>, you miscounted. Next number was ${count + 1}. Restarting from 0.`
        )
        .setThumbnail(
          "https://media.tenor.com/VzjRFZU38sgAAAAC/sad-frog.gif"
        );
      await e.channel.send({ embeds: [embed] });
      await GuildModel.findOneAndUpdate(
        { guildID: e.guild.id },
        { $set: { "counting.count": 0 } },
        { upsert: true }
      );
      logger.info(`Count reset to 0 in database [guildID=${e.guild.id}]`);
      lastUser = null;
    } else if (e.author.id === lastUser) {
      logger.info(`Same user sent the next number [discordSnowflake=${e.author.id}]`);
      const embed = new Discord.EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Same user!")
        .setDescription(
          `<@${e.author.id}>, you sent the next number again! Please wait for someone else to send the next number.`
        )
        .setThumbnail(
          "https://media.tenor.com/vEqGjhEN5cwAAAAi/pepe-the-frog-angry.gif"
        );
      await e.channel.send({ embeds: [embed] });
    } else {
      logger.info(`User counted correctly [discordSnowflake=${e.author.id}]`);
      await e.react("✅");
      await GuildModel.findOneAndUpdate(
        { guildID: e.guild.id },
        { $set: { "counting.count": count + 1 } },
        { upsert: true }
      );
      logger.info(`Count updated to ${count + 1} in database [guildID=${e.guild.id}]`);
      lastUser = e.author.id;
    }
  } catch (err) {
    logger.error(`Failed to handle counting message: ${err}`);
  }
};
