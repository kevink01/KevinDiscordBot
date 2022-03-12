const { Discord, client } = require('../../index')
const { delay } = require('../../Utility/functions.js')

module.exports = {
    name: 'unban',
    args: '<userID>',
    minArgs: 1,
    maxArgs: 1,
    permissions: 'BAN_MEMBERS',
    description: 'Unbans a user from server',
    examples: [
        '+unban usedID'
    ],
    async execute(message, args) {
        let user;
        try {
            user = await message.guild.bans.fetch(args[0]);
        } catch {
            await message.channel.send('Cannot find user');
            await delay(2000);
            message.channel.bulkDelete(2);
            return;
        };

        try {
            await message.guild.bans.remove(user.user.id);
            message.channel.send(`Successfully unbanned\n**\`${user.user.username}\`**`);
            await delay(1000);
            message.channel.bulkDelete(2);
        } catch {
            await message.channel.send('Unable to unban the user');
            await delay(2000);
            message.channel.bulkDelete(2);
            return;
        }
    }
}