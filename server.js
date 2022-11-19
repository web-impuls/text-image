const express = require('express');
const server = express();
const config = require('./config.json');
const Discord = require('discord.js');
const { Client, MessageActionRow, MessageButton } = require('discord.js');
config.cfg.intents = new Discord.Intents(config.cfg.intents);


const tr = require("googletrans").default;
const puppeteer = require('puppeteer');
const client = new Discord.Client(config.cfg);




server.all('/', (req, res) => {
    res.send('бот запускается? новый деплой');
});



exports.keepAlive = function() {
    server.listen(3001, () => {
         client.login(config.token);

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
            TextImageRedirect(interaction.message, interaction.message.content);

            await interaction.reply({ content: "Картинка - " + interaction.message.content + " - обновляется. Подождите примерно 17 секунд!", ephemeral: true });


        }


    })
        console.log('сервер готов');
    });
}

const TextImageRedirect = function(param, param2) {
    param.content = param.content.replace(/<(.|\n)*?>/g, '');
    param.channel.sendTyping();
    if (param.author.bot && !param.components || param.content == "Возникла ошибка, попробуйте ещё раз!") return false;
    // console.log(param);
    if (!param.author.bot) {
        param.reply("Картинка - " + param.content.replace(/\./g, '') + " - создаётся. Подождите примерно 17 секунд! Это сообщение пропадёт через 8 секунд").then(m => {
            setTimeout(() => m.delete(), 8000);
        }).catch();
    }
    clearTimeout;
    tr(param.content.replace(/<(.|\n)*?>/g, '').replace('..', '').trim() || param2, "en")
        .then(function(result) {

            let neuro = result.text;

            (async function() {
                const massPromt = [
                    'highly detailed, d & d, highly detailed, digital painting, trending on artstation, concept art, sharp focus, illustration, global illumination, ray tracing, realistic shaded, art by artgerm and greg rutkowski,super detailed picture, the smallest drawing of details, 4k, octane ,pastel halftones',

                    'golden hour, awesome atmosphere, dean cornwell, norman rockwell, 8 k, octane rendered, sharp focus, highly detailed, volumetric lighting, illustration, concept art, paint texture, intricate, ruan jia, steve mccurry - n 9,super detailed picture, the smallest drawing of details, 4k, octane  ,pastel halftones',

                    'andrei riabovitchev, marc simonetti, and sakimichan, trending on artstation,super detailed picture, the smallest drawing of details, 4k, octane ,pastel halftones',

                    'behance hd, artstation, deviantart, global illumination radiating a glowing aura global illumination ray tracing hdr render in unreal engine 5,super detailed picture, the smallest drawing of details, 4k, octane,pastel halftones',

                    'digital painting, highly detailed, artstation, sharp focus, illustration, concept art, ruan jia, steve mccurry, amazing composition, fractal flame,super detailed picture, the smallest drawing of details, 4k, octane,pastel halftones',

                    'ultra-detailed, uhd 8k cryengine, octane render,super detailed picture, the smallest drawing of details, 4k, octane,highly detailed, digital painting, artstation, concept art, sharp focus, illustration, cinematic lighting, art by artgerm and greg rutkowski and alphonse mucha and simon stalenhag, high detail, artstation, octane render, 4 k resolution, masterpiece,pastel halftones',

                    'insanely detailed, by dan mumford, yusuke murata, makoto shinkai, ross tran, intricate detail, cinematic, 8 k, featured on artstation, pixiv,super detailed picture, the smallest drawing of details, 4k, octane ,realistic,pastel halftones',

                    'detailed portrait, cell shaded, 4 k, concept art, ilya kuvshinov, artgerm, krenz cushart, greg rutkowski,cinematic dramatic atmosphere, sharp focus, volumetric lighting, cinematic lighting, studio quality,super detailed picture, the smallest drawing of details, 4k, octane, illustration,pastel halftones',

                    'chilling eastern europen forrest. night, horroristic shadows, higher contrasts, (((lumnious))), theatrical, character concept art by ruan jia, (((thomas kinkade))), and j.dickenson, trending on pinterest, artstation,pastel halftones',

                    'elegant, glowing lights, highly detailed, digital painting, artstation, concept art, smooth, sharp focus, illustration, alphonse muchas,super detailed picture,drawing of details, 4k, octanem,pastel halftones'
                ];
                let massText = massPromt[Math.floor(Math.random() * massPromt.length)];

                const browser = await puppeteer.launch({
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                });
                const page = await browser.newPage();

                try {

                    await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');

                    await page.goto('https://replicate.com/stability-ai/stable-diffusion/versions/8abccf52e7cba9f6e82317253f4a3549082e966db5584e92c808ece132037776/');
                    await page.waitForTimeout('input[name="prompt"]');
                    await page.$eval('input[name="prompt"]', el => el.value = '');
                    await page.type('input[name="prompt"]', neuro + ' ' + massText, { delay: 5 });
                    // await page.$eval('input[name="num_inference_steps"]', el => el.value = '');
                    // await page.type('input[name="num_inference_steps"]', '30', { delay: 5 });
                    await page.$eval('input[name="guidance_scale"]', el => el.value = '');
                    await page.type('input[name="guidance_scale"]', '20', { delay: 5 });
                    await page.click('#run > div > div > div > div.flex-1.min-w-0.pr-lh > form > button.form-button.mr-2.relative');

                    // setTimeout(async() => {
                    // }, "1000");
                    await page.waitForSelector('#run > div > div > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div > div > a > img');
                    const imgSrc = await page.$eval('#run > div > div > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div > div > a > img', (el) => el.getAttribute('src'));

                    const exampleEmbed9 = {
                        color: 0x0099ff,
                        description: `<@${param.author.id}> - ` + param.content.replace(/<(.|\n)*?>/g, '').replace(/\./g, '').trim(),
                        image: {
                            url: imgSrc,
                        },
                    }


                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                            .setCustomId("stable-dif") // It is better to have a unique ID for the buttons
                            .setLabel('')
                            .setEmoji('🔄')
                            .setStyle('SECONDARY'), //PRIMARY, SECONDARY, ALERT or SUCCESS
                        );
                    let bmsg = await param.channel.send({
                        content: param.content.replace(/<(.|\n)*?>/g, '').replace(/\./g, '').trim(), //neuro
                        embeds: [exampleEmbed9],
                        components: [row]
                            // embeds: [exampleEmbed9], 
                            // components: [row] 
                    });
                    await bmsg.react('👍');
                    await bmsg.react('👎');



                    // setTimeout(async() => {
                    //     param.delete();
                    // }, "1000");




                    await browser.close();

                } catch (err) {

                    param.reply("Возникла ошибка, попробуйте ещё раз!");

                }

                return false;


            })();

        })
        .catch(function(error) {
            console.log(error);
        });

    return false;
}
