module.exports = {
    name: 'play',
    description: "plays the passed youtube link",
    execute(guild, song, ytdl, queue) {
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

                this.execute(guild, serverQueue.songs[0], ytdl, queue);
            })
            .on("error", error => console.error(error));

            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            serverQueue.textChannel.send(`Start playing: **${song.title}**`);
    }
}