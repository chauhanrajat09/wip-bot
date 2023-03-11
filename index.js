const { Client, GatewayIntentBits, Collection } = require('discord.js');
const logger = require('./libs/logger');
const { discordToken } = require('./libs/config');
const { ready, interactionCreate, messageCreate } = require('./libs/events');
const keep_alive = require('./keep_alive.js');
const initializeInteractions = require('./libs/interactions/init/initializeInteractions');
const afkHandler = require('./libs/events/afkHandler.js');
const createAfkDeleteHandler = require('./libs/events/afkDeleteHandler.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('ready', async () => {
  logger.info('Bot is ready and connected to Discord');
  await afkHandler(client); // call afkHandler with the client
});

client.on('messageCreate', async (message) => {
  const afkDeleteHandler = createAfkDeleteHandler(client);
  await afkDeleteHandler(message); // call afkDeleteHandler with the message
  messageCreate(message);
});

(async () => {
  logger.info(`Bot beginning startup`);

  const commands = await initializeInteractions();
  client.commands = new Collection(commands.map(command => [command.data.name, command]));

  client.on('ready', ready);
  client.on('interactionCreate', interactionCreate);

  logger.info('Authenticating with Discord');
  await client.login(discordToken);
  logger.info('Completed Discord authentication');
})();