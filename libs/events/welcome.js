const Discord = require("discord.js");
module.exports = (client) => {
  const channelId = "1036867869356609606";
  const rulesChannel = "1059037616688861234";
  const rolesChannel = "1036858064298582036";
  
  client.on("guildMemberAdd", (member) => {
    console.log(`New member joined: ${member.username}`);

    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Welcome to our server!")
      .setDescription(
        `Welcome <@${member.id}>! Be sure to check out our ${member.guild.channels.cache
          .get(rulesChannel)
          .toString()} and ${member.guild.channels.cache.get(rolesChannel).toString()}`
      )
      .setThumbnail(member.user.displayAvatarURL({ format: "png" }));

    const channel = member.guild.channels.cache.get(channelId);
    channel.send(embed);
  });

  client.on("guildMemberRemove", (member) => {
    console.log(`Member left: ${member.username}`);

    const embed = new Discord.MessageEmbed()
      .setColor("#ff0000")
      .setTitle("Goodbye!")
      .setDescription(`Goodbye <@${member.id}>, come back soon!`)
      .setThumbnail(member.user.displayAvatarURL({ format: "png" }));

    const channel = member.guild.channels.cache.get(channelId);
    channel.send(embed);
  });
};
