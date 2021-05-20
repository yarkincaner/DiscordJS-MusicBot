const Embed = require("../embed/embed")

module.exports = {
    name: 'song',
    description: "Shows the song that currently playing",
    execute(Discord, message, serverQueue) {
        if (!message.member.voice.channel) {
            return message.channel.send(
                "You have to be in a voice channel to stop the music!"
            );
        }
        if (!serverQueue) {
            return message.channel.send("The queue is already empty!");
        }

        let embed = new Embed(Discord, serverQueue.textChannel);
        embed.playEmbed(message.author, serverQueue.songs[0], serverQueue.connection, serverQueue.songs.length);
    }
}