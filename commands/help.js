module.exports = {
    name: 'help',
    description: "Shows all commands and their usages",
    execute(message, prefix, commands, Discord) {

        var embed = new Discord.MessageEmbed()
            .setColor('#9399ff')
            .setTitle('Do you need help?')
            .setDescription("Commands and descriptions are below")
            .addField('prefix', `${prefix}`);
        
        let keys = Array.from(commands.keys()); //names
        for (const key of keys) {
            embed.addField(`${key}`, `${commands.get(key).description}`);
        }

        message.channel.send(embed);

    }
}