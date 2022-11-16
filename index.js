const Discord = require('discord.js');
const { Client, MessageActionRow, MessageButton } = require('discord.js');
const config = require('./config.json');
const { keepAlive, getImage, TextImageRedirect } = require('./server');
config.cfg.intents = new Discord.Intents(config.cfg.intents);
const client = new Discord.Client(config.cfg);





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
        TextImageRedirect(interaction.message, interaction.message.content);
        setTimeout(async() => {
            await interaction.reply({ content: "Картинка - " + interaction.message.content + " - обновляется. Подождите несколько секунд!", ephemeral: true });
        }, "2500");


    }


})


keepAlive();
