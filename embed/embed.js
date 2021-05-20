class Embed {
    constructor(Discord, channel) {
        this.Discord = Discord;
        this.channel = channel;
    }

    playEmbed(author, song, dispatcher, queueLength) {

        var embed = new this.Discord.MessageEmbed()
            .setColor('#748cdc')
            .setTitle('Hands in the air!')
            .setAuthor(`${author.username}`, `${author.displayAvatarURL(true)}`)
            .setThumbnail(`${song.channelPicture}`)
            .addFields(
                //{ name: '\u200B', value: '\u200B'}, //Empty line
                { name: 'Song Title', value: `${song.title}`},
                { name: 'Volume', value: `${dispatcher.volume}`, inline: true},
                { name: 'Duration', value: `${new Date(song.duration * 1000).toISOString().substr(11, 8)}`, inline: true}
            )
            .setImage(`${song.channelPicture}`)
            .setTimestamp(`${song.date}`)
            .setFooter(`${queueLength} songs left`);
        this.channel.send(embed);

    }

    goodbye() {
        var embed = new this.Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Goodbye! I will miss u ❤️')
            .setImage('https://media.giphy.com/media/79ZFYdMsStRYI/giphy.gif');
        this.channel.send(embed);
    }

    hello() {
        const embed = new this.Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Hey! Are you ready for party?')
            .setDescription('')
            .setImage('https://media1.tenor.com/images/cf40f4758a6c79f0744b13ad867d5974/tenor.gif?itemid=18233486');
            //.setImage('https://media.giphy.com/media/blSTtZehjAZ8I/giphy.gif');
        this.channel.send(embed);
    }

    ping(message, client) {
        const embed = new this.Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Pong!')
            .setDescription(`⌚Latency is ${Date.now() - message.createdTimestamp}ms. ⌛API latency is ${Math.round(client.ws.ping)}ms`);
        this.channel.send(embed);
    }
}

module.exports = Embed;