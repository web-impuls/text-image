const express = require('express');
const server = express();
const config = require('./config.json');
const Discord = require('discord.js');
const { Client, MessageActionRow, MessageButton } = require('discord.js');
config.cfg.intents = new Discord.Intents(config.cfg.intents);
let fetch = require('node-fetch');

const puppeteer = require('puppeteer');
const client = new Discord.Client(config.cfg);



server.all('/', (req, res) => {

    res.send('бот запускается');
});



exports.keepAlive = function() {
    server.listen(3001, () => {
        console.log('сервер готов');
    });
}

exports.TextImageRedirect = async function(param, param2) {
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
    let neuro = "";
    var source = 'auto';
    fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=' +
            source + "&tl=en&dt=t&q=" + encodeURI(param.content.replace(/<(.|\n)*?>/g, '').replace('..', '').trim() || param2))
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            // let perevod = data[0][0][0];
            neuro = data[0][0][0];
            // console.log(neuro);

            (async function() {
                const massPromt = [
                    'ray tracing, realistic shaded, super detailed picture, the smallest drawing of details, 4k, octane ,pastel halftones,in the style of Midjourney v4',

                    'golden hour, awesome atmosphere, 8 k, octane rendered, sharp focus, highly detailed, volumetric lighting, illustration, concept art, paint texture, intricate,super detailed picture, the smallest drawing of details, 4k, octane  ,pastel halftones,in the style of Midjourney v4',

                    'trending on artstation,super detailed picture, art by artgerm and greg rutkowski and alphonse mucha, pastel halftones,in the style of Midjourney v4',

                    'global illumination radiating a glowing aura global illumination ray tracing hdr render in unreal engine 5,super detailed picture, the smallest drawing of details, 4k, octane,pastel halftones art by! greg rutkowski magali villeneuve wlop! ilya kuvshinov!!,in the style of Midjourney v4',

                    'art by artgerm and greg rutkowski and alphonse mucha, super detailed picture, the smallest drawing of details, 4k, octane,pastel halftones,in the style of Midjourney v4',

                    'highly detailed, digital painting, artstation, concept art, sharp focus, illustration, cinematic lighting, high detail, artstation, octane render, 4 k resolution, masterpiece,pastel halftones ,in the style of Midjourney v4',

                    'insanely detailed,intricate detail, cinematic, 8 k, featured on artstation, pixiv,super detailed picture, the smallest drawing of details, 4k, octane ,realistic,pastel halftones',

                    'studio quality,super detailed picture, the smallest drawing of details, 4k, octane, illustration,pastel halftones, art by! greg rutkowski magali villeneuve wlop! ilya kuvshinov!! ,in the style of Midjourney v4',

                    'trending on pinterest, artstation,pastel halftones ,in the style of Midjourney v4',

                    'elegant, glowing lights, highly detailed, digital painting, artstation, concept art, smooth, sharp focus, illustration, alphonse muchas,super detailed picture,drawing of details, 4k, octanem,pastel halftones'
                ];
                let massText = massPromt[Math.floor(Math.random() * massPromt.length)];

                const browser = await puppeteer.launch({
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                });
                const page = await browser.newPage();
                await page.setDefaultTimeout(45000);

                try {

                    await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');

                    // await page.goto('https://www.mage.space/');
                    await page.goto('https://www.mage.space/', { waitUntil: 'networkidle2' });



                    await page.waitForTimeout('#search-bar');
                    //await page.$eval('#search-bar', el => el.value = neuro + ' ' + massText);
                    await page.type('#search-bar', neuro + ' ' + massText);

                    // await page.click('#__next > div > div > div > main > div > div > div.mantine-Group-root.mantine-5f6x53 > button:nth-child(1)');


                    // await page.click('#__next > div > div > div > main > div > div > div.mantine-1avyp1d > div > div > div:nth-child(3) > div.mantine-Group-root.mantine-5f6x53 > div > button.mantine-UnstyledButton-root.mantine-Button-root.mantine-q5ciiw');

                    // await page.click('#__next > div > div > div > main > div > div > div.mantine-1avyp1d > div > div > div:nth-child(2) > div.mantine-Group-root.mantine-5f6x53 > div > button.mantine-UnstyledButton-root.mantine-Button-root.mantine-q5ciiw');

                    await page.click('#ZQvTCDloXyqgqlOiDvup');

                    // setTimeout(async() => {
                    // }, "1000");

                    await page.waitForSelector('#mantine-R3bm-body > div > div.mantine-Container-root.mantine-bpygq5 > div > figure > div > img').then(() => {});

                    const imgSrc = await page.$eval('#mantine-R3bm-body > div > div.mantine-Container-root.mantine-bpygq5 > div > figure > div > img', (el) => el.getAttribute('src'));

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
                    console.log(err);

                }

                return false;


            })();
        });

    return false;
}
