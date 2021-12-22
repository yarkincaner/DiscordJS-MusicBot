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
                }

                this.execute(author, guild, serverQueue.songs[0], ytdl, queue, Discord);
            })
            .on("error", error => console.error(error));

        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    }
}