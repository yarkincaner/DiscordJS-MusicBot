module.exports = {
    name: 'pause',
    description: "Pauses the current song",
    execute(message, serverQueue) {
        if (!message.member.voice.channel) {
            return message.channel.send(
                "You have to be in a voice channel to stop the music!"
            );
        }
        if (!serverQueue) {
            return message.channel.send("The queue is already empty!");
        }

        if(serverQueue.songs[0].isPaused) {
            return message.channel.send("Song is already paused!");
        }

        serverQueue.connection.dispatcher.pause(true);
        serverQueue.songs[0].isPaused = true;
        message.channel.send(`${serverQueue.songs[0].title} is paused`);
    }
}