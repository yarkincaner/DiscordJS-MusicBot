module.exports = {
    name: 'stop',
    description: "Deletes every song in the queue",
    execute(message, serverQueue) {

        if (!message.member.voice.channel) {
            return message.channel.send(
                "You have to be in a voice channel to stop the music!"
            );
        }
        if (!serverQueue) {
            return message.channel.send("The queue is already empty!");
        }

        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();

    }
}