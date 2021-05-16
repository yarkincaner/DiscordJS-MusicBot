const Discord = require('discord.js');

module.exports = {
    name: 'play',
    description: "plays the passed youtube link",
    execute(author, guild, song, ytdl, queue) {
        const serverQueue = queue.get(guild.id);
        if (!song) {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
        }

        const dispatcher = serverQueue.connection
            .play(ytdl(song.url))
            .on("finish", () => {

                if(!song.loop) {
                    serverQueue.songs.shift();
                }

                this.execute(author, guild, serverQueue.songs[0], ytdl, queue);
            })
            .on("error", error => console.error(error));

            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

            var embed = new Discord.MessageEmbed()
                .setColor('#9399ff')
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
                .setFooter(`${serverQueue.songs.length} songs left`);
            serverQueue.textChannel.send(embed);
            serverQueue.textChannel.send(`Start playing: **${song.title}**`);
    }
}