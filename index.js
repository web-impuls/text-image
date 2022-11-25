const Discord = require('discord.js');
const { Client, MessageActionRow, MessageButton } = require('discord.js');
const config = require('./config.json');
const { keepAlive, TextImageRedirect } = require('./server');
config.cfg.intents = new Discord.Intents(config.cfg.intents);
const client = new Discord.Client(config.cfg);
const dotenv = require('dotenv').config();

client.login(process.env.ACCESS_TOKEN);

client.on('ready', async(r) => {
    console.log('сообщение из сервера');
});
client.on('messageCreate', async(message) => {
    // блокируем пустое сообщение
    if (!message.content.replace(/<(.|\n)*?>/g, '').trim()) {
        return false;
    }
    //
    else if (message.content.includes("@here") || message.content.includes("@everyone")) return false;

    else if (message.content.substring(0, 2) === "..") {
        TextImageRedirect(message);
    }

    // отправляем текстовое сообщение
    else if (message.mentions.has(client.user.id)) {
        TextImageRedirect(message);
    }
    //
    else {
        return;
    }


});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton() && interaction.customId === "stable-dif") {
        const inId = interaction.user.id;

        TextImageRedirect(interaction.message, interaction.message.content, inId);
        // console.log(interaction.user.id);

        await interaction.reply({ content: "Картинка - " + interaction.message.content + " - обновляется. Подождите примерно 17 секунд!", ephemeral: true });




    }


})

keepAlive();
