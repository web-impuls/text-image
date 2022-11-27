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

    if (param.author.bot && !param.components || param.content == "Возникла ошибка, попробуйте ещё раз через 10 секунд, сервер перезагружается!") {

        return false;
    }




    // console.log(Object.keys(obj).length);


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



            obj[param.id + "-" + param.author.id] = {
                "userid": param3 || param.author.id,
                "content": neuro,
                "contentRus": param.content.replace(/<(.|\n)*?>/g, '').trim() || param2,
                "status": true

            };


            fs.writeFileSync(path, JSON.stringify(obj, null, 2), 'utf-8');

            if (!param.author.bot) {
                let quene = " Ваш номер в очереди - " + Object.keys(obj).length;

                param.reply("Картинка - " + param.content.replace(/\./g, '') + " - создаётся. Подождите примерно от 17 до 100 секунд!." + quene + " Это сообщение пропадёт через 8 секунд").then(m => {
                    setTimeout(() => m.delete(), 8000);
                }).catch();
            }

            objiteration(obj, param);



        });

}

function objiteration(param, param2, param3) {
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



    for (key in obj) {
        let neuro2 = obj[key].content;
        let userId = obj[key].userid;
        let contentRus = obj[key].contentRus;

        (async function() {

            let massText = massPromt[Math.floor(Math.random() * massPromt.length)];


            const browser = await puppeteer.launch({
                headless: true,
                timeout: 200000,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            // await page.setDefaultTimeout(0);


            // console.log(param);

            try {

                await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
                await page.goto('https://www.mage.space/', { waitUntil: 'networkidle2' });
                await page.waitForTimeout('#search-bar');
                await page.type('#search-bar', neuro2 + ' ' + massText);
                await page.click('#ZQvTCDloXyqgqlOiDvup');

                await page.waitForSelector('#mantine-R3bm-body > div > div.mantine-Container-root.mantine-bpygq5 > div > div.mantine-1avyp1d > div > figure > div > img');

                const imgSrc = await page.$eval('#mantine-R3bm-body > div > div.mantine-Container-root.mantine-bpygq5 > div > div.mantine-1avyp1d > div > figure > div > img', (el) => el.getAttribute('src'));

                let chanellId = param2.channelId;
                if (param2.author.bot) {
                    nameUs = param2.embeds[0]['description'].replace(/ .*/, '').replace(/\D/g, "");
                    // console.log(param);
                }
                const exampleEmbed9 = {
                    color: 0x0099ff,
                    description: `<@${nameUs || param2.author.id }> - Автор этого запроса`,
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



                let bmsg = await param2.channel.send({
                    content: `<@${param3 || userId}> ` + contentRus, //neuro
                    embeds: [exampleEmbed9],
                    components: [row]
                });

                await bmsg.react('👍');
                await bmsg.react('👎');

                // console.log(obj[key]);




                await browser.close();


            } catch (err) {

                param2.reply("Возникла ошибка, попробуйте ещё раз через 10 секунд, сервер перезагружается!");
                console.log(err);

            }

        })();

        delete obj[key];

        fs.writeFileSync(path, JSON.stringify(obj, null, 2), 'utf-8');


    }

}
