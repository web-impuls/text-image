const Discord = require('discord.js');
const { Client, MessageActionRow, MessageButton } = require('discord.js');
const config = require('./config.json');
const { keepAlive } = require('./server');
config.cfg.intents = new Discord.Intents(config.cfg.intents);
const client = new Discord.Client(config.cfg);


keepAlive();
