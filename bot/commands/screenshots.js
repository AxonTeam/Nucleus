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

async function uploadSS(userID, link) {
    delete require.cache[require.resolve('../../nucleusToken.json')];
    nucleusToken = require('../../nucleusToken.json').token;
    const data = { buffer: link };
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

async function deleteSS(userID, imageID) {
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

module.exports = bot => ({
    label: 'screenshots',
    execute: async(msg, args) => {
        if (!args || !args[0] || !args[1]) {
            return sendMessage(msg.channel, {
                embed: {
                    title: 'Invalid Usage',
                    description: 'See usable subcommands below',
                    fields: [
                        {
                            name: 'upload',
                            value: '**Description:** Upload a screenshot to the CDN\n**Usage:** `screenshots upload (link)`'
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
            const image = await uploadSS(msg.author.id, args[1]);
            return sendMessage(msg.channel, image);
        }
        if (args[0] === 'delete') {
            const data = await deleteSS(msg.author.id, args[1]);
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
