const request = require('superagent');
const userModel = require('../../models/user');
const authorize = require('../functions/authorize');
const sendMessage = require('../functions/sendMessage');
// Config
const config = require('../../config');
let baseURL = config.url || 'cdn.axonteam.org';
const port = config.port || 80;
let nucleusToken;

if (port !== 80) {
    baseURL = `${baseURL}:${port}`;
}

// Upload a screenshot

async function uploadS(userID, link, ext) {
    delete require.cache[require.resolve('../../nucleusToken.json')];
    nucleusToken = require('../../nucleusToken.json').token;
    const data = { buffer: link, extension: ext || 'png' };
    let result;
    try {
        result = await request.post(`${baseURL}/api/screenshots/`)
            .send(JSON.stringify(data))
            .set('uid', userID)
            .set('id', 'Nucleus')
            .set('token', nucleusToken)
            .set('Accept', 'application/json')
            .set('Content-type', 'application/json');
    } catch (err) {
        return {
            embed: {
                title: 'An error has occured. Check below',
                description: `\`\`\`js\n${err.message ? err.message : err}\`\`\``,
            }
        }
    }
    if (result.text) {
        return result.text;
    }
    return result;
}

// Delete a image

async function deleteS(userID, imageID) {
    delete require.cache[require.resolve('../../nucleusToken.json')];
    nucleusToken = require('../../nucleusToken.json').token;
    let result;
    try {
        result = await request.delete(`${baseURL}/api/screenshots/${imageID}`)
            .set('uid', userID)
            .set('id', 'Nucleus')
            .set('token', nucleusToken)
            .set('Accept', 'application/json')
            .set('Content-type', 'application/json');
    } catch (err) {
        return {
            embed: {
                title: 'An error has occured. Check below',
                description: `\`\`\`js\n${err.message ? err.message : err}\`\`\``,
            }
        }
    }

    if (result.text) {
        return result.text;
    }
    return result;
}

function checkArgs(args) {
    if (!args || !args[0] || !args[1]) {
        return true;
    }
}

function checkAttach(msg) {
    if (!msg.attachments || msg.attachments.length === 0) {
        return true;
    }
}

module.exports = bot => ({
    label: 'screenshots',
    execute: async(msg, args) => {
        if (checkArgs(args) && checkAttach(msg)) {
            return sendMessage(msg.channel, {
                embed: {
                    title: 'Invalid Usage',
                    description: 'See usable subcommands below\n*Psst. You can upload 1 (in you message) image instead of using the link*',
                    fields: [
                        {
                            name: 'upload',
                            value: '**Description:** Upload a screenshot to the CDN\n**Usage:** `screenshots upload (link) (image extension)`'
                        },
                        {
                            name: 'delete',
                            value: '**Description:** Delete a screenshot you uploaded from the CDN\n**Usage:** `screenshots delete (id of the image)`'
                        }
                    ]
                }
            });
        }
        const auth = await authorize(msg, msg.author.id, true);
        if (!auth) {
            return null;
        }
        const User = await userModel.findOne( { ID: msg.author.id } ).exec();
        if (!User) {
            return sendMessage(msg.channel, 'No. Please generate a token.');
        }
        if (args[0] === 'upload') {
            let link = args[1];
            let ext = args[2]
            if (msg.attachments && msg.attachments.length > 0) {
                link = msg.attachments[0].url;
                ext = args[1]
            }
            const image = await uploadS(msg.author.id, link, ext);
            return sendMessage(msg.channel, image);
        }
        if (args[0] === 'delete') {
            const data = await deleteS(msg.author.id, args[1]);
            return sendMessage(msg.channel, data);
        }
    },
    options: {
        description: 'Upload or delete a screenshot',
        subcommands: [
            {
                label: 'upload',
                description: 'Upload a screenshot to the CDN'
            },
            {
                label: 'delete',
                description: 'Delete one of your screenshots from the CDN'
            }
        ],
    }
})
