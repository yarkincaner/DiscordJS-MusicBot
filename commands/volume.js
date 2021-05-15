module.exports = {
    name: 'volume',
    description: "!volume: Returns the current song's volume\n!volume x: Sets the current song's volume to x",
    execute(message, serverQueue) {
        if (!message.member.voice.channel) {
            return message.channel.send(
                "You have to be in a voice channel to stop the music!"
            );
        }
        if (!serverQueue) {
            return message.channel.send("The queue is already empty!");
        }

        const args = message.content.split(" ");

        if(!args[1]) {
            return message.channel.send(`Current Volume: ${serverQueue.connection.dispatcher.volume}`);
        }

        x = parseFloat(args[1]);
        serverQueue.connection.dispatcher.setVolume(x);
        message.channel.send(`Volume set to **${x}**`);
    }
}