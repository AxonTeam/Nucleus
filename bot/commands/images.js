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

// Upload a image

async function uploadImage(userID, link, type, id) {
    delete require.cache[require.resolve('../../nucleusToken.json')];
    nucleusToken = require('../../nucleusToken.json').token;
    const data = { buffer: link, type: type.image || 'image', extension: type.ext || 'png' };
    if (id) {
        data.name = id;
    }
    console.log(data)
    let result;
    try {
        result = await request.post(`${baseURL}/api/images/`)
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

async function deleteImage(userID, imageID, imageType) {
    delete require.cache[require.resolve('../../nucleusToken.json')];
    nucleusToken = require('../../nucleusToken.json').token;
    const data = { type: imageType ? imageType : 'image'};
    let result;
    try {
        result = await request.delete(`${baseURL}/api/images/${imageID}`)
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
    label: 'images',
    execute: async(msg, args) => {
        if (checkArgs(args) && checkAttach(msg)) {
            return sendMessage(msg.channel, {
                embed: {
                    title: 'Invalid Usage',
                    description: 'See usable subcommands below\n*Psst. You can upload 1 image (in your message) instead of using the link*',
                    fields: [
                        {
                            name: 'upload',
                            value: '**Description:** Upload a image to the CDN\n**Usage:** `images upload (link) (image name) (image type) (image extension)`'
                        },
                        {
                            name: 'delete',
                            value: '**Description:** Delete a image you uploaded from the CDN\n**Usage:** `images delete (image id) (type)`'
                        }
                    ]
                }
            });
        }
        if (!config.owners.includes(msg.author.id) && !config.hasRoot.includes(msg.author.id)) {
            return null;
        }
        const auth = await authorize(msg, msg.author.id, true);
        if (!auth) {
            return null;
        }
        const User = await userModel.findOne( { ID: msg.author.id } ).exec();
        if (!User) {
            return sendMessage(msg.channel, 'No. Please generate a token');
        }
        if (args[0] === 'upload') {
            let link = args[1];
            let type = { image: args[3], ext: args[4] };
            let name = args[2]
            if (msg.attachments && msg.attachments.length > 0) {
                link = msg.attachments[0].url;
                type = { image: args[2], ext: args[3] };
                name = args[1]
            }
            const image = await uploadImage(msg.author.id, link, type, name);
            return sendMessage(msg.channel, image);
        }
        if (args[0] === 'delete') {
            const data = await deleteImage(msg.author.id, args[1], args[2] );
            return sendMessage(msg.channel, data);
        }
    },
    options: {
        description: 'Upload or delete a image',
        subcommands: [
            {
                label: 'upload',
                description: 'Upload a image to the CDN'
            },
            {
                label: 'delete',
                description: 'Delete one of your images from the CDN'
            }
        ],
    }
})
