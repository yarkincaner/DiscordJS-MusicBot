const Embed = require("../embed/embed");
var loopCounter = 0;

module.exports = {
    name: 'play',
    description: "plays the passed youtube link",
    execute(author, guild, song, ytdl, queue, Discord) {
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
                    loopCounter = 0;
                } else {
                    loopCounter++;
                }

                this.execute(author, guild, serverQueue.songs[0], ytdl, queue, Discord);
            })
            .on("error", error => console.error(error));

        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

        //if(loopCounter == 0) {
        //    let embed = new Embed(Discord, serverQueue.textChannel);
        //    embed.playEmbed(author, song, dispatcher, serverQueue.songs.length);
        //}

    }
}