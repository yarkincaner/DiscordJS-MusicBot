module.exports = {
    name: 'restart',
    description: "Restarts the bot",
    async execute(message, serverQueue, client, token) {

        if(message.author.id != '466989953063190529') {
            return message.channel.send("You cannot use this command");
        }

        await message.channel.send("Restarted!")
            .then(() => {
                if(serverQueue) {
                    serverQueue.connection.dispatcher.end();
                }
                client.destroy();
            })
            .then(() => client.login(token));
    }
}