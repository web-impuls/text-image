const Discord = require('discord.js');
const { Client, MessageActionRow, MessageButton } = require('discord.js');
const config = require('./config.json');
const { keepAlive, getImage, TextImageRedirect } = require('./server');
config.cfg.intents = new Discord.Intents(config.cfg.intents);
const client = new Discord.Client(config.cfg);
const fs = require('fs');





client.login(config.token);

client.on('ready', async(r) => {
    console.log('тестовое сообщение');
});

client.on('messageCreate', async(message) => {
    // блокируем пустое сообщение
    if (!message.content.replace(/<(.|\n)*?>/g, '').trim()) {
        return false;
    }
    //
    else if (message.content.includes("@here") || message.content.includes("@everyone")) return false;
    // очищаем текст
    // отправляем картинку
    else if (message.content.substring(0, 2) === "..") {
        getImage(message);
    }

    // отправляем текстовое сообщение
    else if (message.content.startsWith("#") || message.content.substring(0, 1) === "#" || message.content.startsWith("?") || message.content.substring(0, 1) === "?" || message.mentions.has(client.user.id)) {
        TextImageRedirect(message);

        //chatVoice(message);

    }
    //
    else {
        return;
    }


});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton() && interaction.customId === "stable-dif") {
        TextImageRedirect(interaction.message, interaction.message.content);
        await interaction.reply({ content: "Картинка - " + interaction.message.content + " - обновляется. Подождите несколько секунд!", ephemeral: true });

    }


})


keepAlive();