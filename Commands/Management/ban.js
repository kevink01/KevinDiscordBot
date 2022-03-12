const { Discord, client } = require('../../index')
const { delay } = require('../../Utility/functions.js')

module.exports = {
    name: 'ban',
    args: '<user> [reason]',
    minArgs: 1,
    maxArgs: 2,
    permissions: 'BAN_MEMBERS',
    description: 'Ban a user from the server',
    examples: [
        `+ban @User -> Bans user with no reason
         +ban @User spam -> Bans user with reason \'spam\'`
    ],
    async execute(message, args) {
        let reason = args[1];
        if (!reason) reason = "Not specified";
        const user = await message.mentions.members.first() || await message.guild.members.cache.find(m => m.id === args[0]);
        if (!user) {
            await message.channel.send('Cannot find user');
            await delay(2000);
            message.channel.bulkDelete(2);
            return;
        }
        if (!user.bannable) {
            await message.channel.send('You cannot ban this member.');
            await delay(2000);
            message.channel.bulkDelete(2);
            return;
        }
        const embed = new Discord.MessageEmbed()
        .setColor("DARK_RED")
        .setAuthor(`${client.user.username}`, client.user.displayAvatarURL())
        .setTitle(`You were banned from ${message.guild.name}`)
        .addFields(
            { name: 'Reason:', value: `${reason}` }
        );
        await (await client.users.fetch(user.user.id)).send( { embeds: [embed] } ).catch(async () => {
            await message.channel.send('Unable to send message to user');
            await delay(1000);
            message.channel.bulkDelete(1);
        });
        user.ban({reason: reason});
        message.channel.send(`Successfully banned\n**\`${user.user.username}\`**`);
        await delay(1000);
        message.channel.bulkDelete(1);
    } 
}