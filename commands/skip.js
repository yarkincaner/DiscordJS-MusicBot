module.exports = {
    name: 'skip',
    description: "shifts the first element in the queue (skips the current song)",
    execute(message, serverQueue) {
        if (!message.member.voice.channel) {
            return message.channel.send(
                "You have to be in a voice channel to stop the music!"
            );
        }
        if (!serverQueue) {
            return message.channel.send("The queue is already empty!");
        }

        if (serverQueue.songs[0].loop) {
            serverQueue.songs.shift();
        }
        serverQueue.connection.dispatcher.end();
    }
}