const { Discord } = require('../../index')
const { delay } = require('../../Utility/functions.js')
const schema = require('../../Mongoose/schema.js')

module.exports = {
    name: 'mute',
    args: '<user> <duration> [reason]',
    minArgs: 2,
    maxArgs: 3,
    permissions: 'MUTE_MEMBERS',
    description: 'Muting a user',
    examples: [
        `+mute userID 5m -> Mutes a user for 5 minutes
         +mute user@ 2h Annoying -> Mutes a user for 2 hours (Reason: Annoying)
         Note: minimum is between 1m and 14d`
    ],
    async execute(message, args) {
        const maxTime = 1000 * 60 * 60 * 24 * 14;   // 14 Days

        const user = await message.mentions.members.first() || await message.guild.members.cache.find(m => m.id === args[0]);
        if (!user) {
            await message.channel.send('Cannot find user');
            console.log(message);
            console.log(message.channel);
            await delay(2000);
            message.channel.bulkDelete(2);
            return;
        }

        const mutedRole = schema.server.findOne( { guild: message.guild.id } ).then(result => mutedRole = result.muted);
        if (!mutedRole) {
            await message.channel.send('Technical ');
            await delay(1000);
            message.channel.bulkDelete(2);
            return;
        }

        if (user.isCommunicationDisabled() || user.roles.cache.has(mutedRole)) {
            await message.channel.send('User is already muted. Please try again.');
            await delay(1000);
            message.channel.bulkDelete(2);
            return;
        }
        
        const durationChoice = args[1].substring(args[1].length - 1);
        let num = args[1].substring(0, args[1].length - 1);
        if (isNaN(num)) {
            await message.channel.send('Please provide a number');
            await delay(1000);
            message.channel.bulkDelete(2);
            return;
        }
        let numConvert = parseInt(num);
        let duration = 1000 * 60; // Minimum of 1 minute
        switch(durationChoice) {
            case 'm':
                duration *= numConvert;
                break;
            case 'h':
                duration *= 60 * numConvert;
                break;
            case 'd':
                duration *= 60 * 24 * numConvert;
                break;
            default:
                await message.channel.send('Not a valid unit of measurement.');
                await delay(1000);
                message.channel.bulkDelete(2);
                return;
        }
        if (duration > maxTime) {
            await message.channel.send('Too long of a duration.');
            await delay(1000);
            message.channel.bulkDelete(2);
            return;
        }

    }
}