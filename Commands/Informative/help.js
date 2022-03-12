const { Discord, client } = require('../../index');
const path = require('path');
const fs = require('fs');

module.exports = {
    name: 'help',
    maxArgs: 0,
    description: 'Find out more information about commands!',
    execute(message, args) {
        let commands = [];
        const readFiles = (directory) => {
            const files = fs.readdirSync(path.join(__dirname, directory));
            for (const file of files) {
                const fullPath = path.join(__dirname, directory, file);
                const stats = fs.lstatSync(fullPath);
                if (stats.isDirectory()) {
                    readFiles(path.join(directory, file));
                }
                else {
                    let { description } = require(fullPath);
                    commands.push([file.substring(0, file.indexOf('.js')), description]);
                } 
            }
        }

        readFiles('../../Commands');
        const select = new Discord.MessageSelectMenu()
            .setPlaceholder('Select a command')
            .setCustomId('Help Menu');
        for (let i = 0; i < commands.length; i++) {
            select.addOptions([
                {
                    label: commands[i][0],
                    value: commands[i][0],
                    description: commands[i][1]
                }
            ])
        }
        const menu = new Discord.MessageActionRow()
            .addComponents(
                select
            );

        message.channel.send({ content: 'Please select a command for more information', components: [menu] });
    }
}