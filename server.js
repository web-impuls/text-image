const express = require('express');
const server = express();
const config = require('./config.json');
const Discord = require('discord.js');
const { Client, MessageActionRow, MessageButton } = require('discord.js');
config.cfg.intents = new Discord.Intents(config.cfg.intents);
let fetch = require('node-fetch');
const fs = require('fs');
const puppeteer = require('puppeteer');
const { Cluster } = require('puppeteer-cluster');
const client = new Discord.Client(config.cfg);


const path = `bd.json`;
const obj = JSON.parse(fs.readFileSync(path)) || {};
const time = new Date().getTime() / 1000;
const upObj = [];
let nameUs = "";


server.all('/', (req, res) => {

    res.send('бот запускается');
});



exports.keepAlive = function() {
    server.listen(3001, () => {
        console.log('сервер готов');
    });
}

exports.TextImageRedirect = async function(param, param2, param3) {
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
                    'super detailed picture, 4k, octane ,pastel halftones, Midjourney v4 style color scheme, extremly detailed digital paintingin',

                    'awesome atmosphere, 8 k, octane rendered, sharp focus, highly detailed, volumetric lighting, illustration, concept art, paint texture, intricate,super detailed picture, the smallest drawing of details, 4k, octane  ,pastel halftones, Midjourney v4 style color scheme, extremly detailed digital paintingin',

                    'super detailed picture, art by greg rutkowski and alphonse mucha, pastel halftones, Midjourney v4 style color scheme , extremly detailed digital paintingin',

                    'global illumination , super detailed picture, the smallest drawing of details, 4k, octane,pastel halftones art by! greg rutkowski magali villeneuve wlop! ilya kuvshinov!!,Midjourney v4 style color scheme, extremly detailed digital paintingin',

                    'greg rutkowski and alphonse mucha, super detailed picture, the smallest drawing of details, 4k, octane,Midjourney v4 style color scheme, extremly detailed digital painting',

                    'highly detailed, digital painting, artstation, concept art, sharp focus, illustration, cinematic lighting, high detail, artstation, octane render, 4 k resolution, masterpiece,pastel halftones , Midjourney v4 style color scheme, extremly detailed digital paintingin',

                    'insanely detailed,intricate detail, cinematic, 8 k, featured on artstation, pixiv,super detailed picture, the smallest drawing of details, 4k, octane, extremly detailed digital paintingin, Midjourney v4 style color scheme',

                    'studio quality,super detailed picture, the smallest drawing of details, 4k, octane, illustration,pastel halftones, art by! greg rutkowski magali villeneuve wlop! ilya kuvshinov!! , extremly detailed digital painting, Midjourney v4 style color scheme',

                    'trending on pinterest, artstation, pastel halftones , extremly detailed digital painting ,Midjourney v4 style color scheme',

                    'elegant, glowing lights, highly detailed, digital painting, artstation, concept art, smooth, sharp focus, illustration, alphonse muchas,super detailed picture,drawing of details, 4k, octanem, extremly detailed digital painting ,Midjourney v4 style color scheme'
                ];
                let massText = massPromt[Math.floor(Math.random() * massPromt.length)];

                const urls = ['https://www.mage.space/'];
                (async() => {

                    const cluster = await Cluster.launch({
                        concurrency: Cluster.CONCURRENCY_PAGE,
                        maxConcurrency: 100,
                        monitor: false,
                        timeout: 100000,
                        puppeteerOptions: {
                            headless: true,
                            args: ['--no-sandbox', '--disable-setuid-sandbox'],
                            // defaultViewport: false,
                            // userDataDir: "./tmp",
                        },
                    });



                    cluster.on("taskerror", (err, data) => {
                        console.log(`Error crawling ${data}: ${err.message}`);
                    });

                    await cluster.task(async({ page, data: url }) => {

                        try {
                            // await page.waitForNavigation({ waitUntil: "domcontentloaded" });
                            page.setDefaultNavigationTimeout(60000);

                            await page.goto(url);

                            // page = await browser.newPage();

                            await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');

                            // await page.goto('https://www.mage.space/');



                            await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
                            await page.goto('https://www.mage.space/', { waitUntil: 'networkidle2' });
                            await page.waitForTimeout('#search-bar');
                            await page.type('#search-bar', neuro + ' ' + massText);

                            // await page.click('#__next > div > div > div > main > div > div > div.mantine-Group-root.mantine-5f6x53 > button:nth-child(1)');


                            // await page.click('#__next > div > div > div > main > div > div > div.mantine-1avyp1d > div > div > div:nth-child(3) > div.mantine-Group-root.mantine-5f6x53 > div > button.mantine-UnstyledButton-root.mantine-Button-root.mantine-q5ciiw');

                            // await page.click('#__next > div > div > div > main > div > div > div.mantine-1avyp1d > div > div > div:nth-child(2) > div.mantine-Group-root.mantine-5f6x53 > div > button.mantine-UnstyledButton-root.mantine-Button-root.mantine-q5ciiw');

                            await page.click('#ZQvTCDloXyqgqlOiDvup');

                            // setTimeout(async() => {
                            // }, "1000");

                            await page.waitForSelector('#mantine-R3bm-body > div > div.mantine-Container-root.mantine-bpygq5 > div > div.mantine-1avyp1d > div > figure > div > img', { timeout: 100000 }).then(() => {});

                            const imgSrc = await page.$eval('#mantine-R3bm-body > div > div.mantine-Container-root.mantine-bpygq5 > div > div.mantine-1avyp1d > div > figure > div > img', (el) => el.getAttribute('src'));

                            if (param.author.bot) {
                                nameUs = param.embeds[0]['description'].replace(/ .*/, '').replace(/\D/g, "");
                                // console.log(param.embeds[0]['description']);
                                // nameUs = param2.embeds[0]['description'].replace(/ .*/, '').replace(/\D/g, "");

                            }
                            const exampleEmbed9 = {
                                color: 0x0099ff,
                                // description: `<@655120325717000222> - Автор этого запроса`,
                                description: `<@${nameUs || param.author.id}> - Автор этого запроса`,
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
                                content: `<@${ param3 || param.author.id}> ` + param.content.replace(/<(.|\n)*?>/g, '').replace('..', '').trim() || param2, //neuro
                                embeds: [exampleEmbed9],
                                components: [row]
                                    // embeds: [exampleEmbed9], 
                                    // components: [row] 
                            });
                            // await param.channel.send(massText);

                            await bmsg.react('👍');
                            await bmsg.react('👎');

                        } catch (err) {

                            param.reply("Возникла ошибка, попробуйте ещё раз!").then(m => {
                                setTimeout(() => m.delete(), 10000);
                            }).catch();
                            console.log(err);

                        }
                    });

                    for (const url of urls) {
                        await cluster.queue(url);
                    }

                    await cluster.idle();
                    await cluster.close();
                })();

                return false;


            })();
        });

    return false;
}
