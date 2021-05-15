module.exports = {
    name: 'resume',
    description: "Resumes the paused song",
    execute(message, serverQueue) {
        if (!message.member.voice.channel) {
            return message.channel.send(
                "You have to be in a voice channel to stop the music!"
            );
        }
        if (!serverQueue) {
            return message.channel.send("The queue is already empty!");
        }

        if(!serverQueue.songs[0].isPaused) {
            return message.channel.send("Song is already playing!");
        }

        serverQueue.connection.dispatcher.resume();
        serverQueue.songs[0].isPaused = false;
        message.channel.send(`${serverQueue.songs[0].title} is resumed!`);
    }
}