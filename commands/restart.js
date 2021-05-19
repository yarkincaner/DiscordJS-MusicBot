module.exports = {
    name: 'restart',
    description: "Restarts the bot",
    async execute(message, serverQueue, client, token) {

        if(!message.member.permissions.has("ADMINISTRATOR")) {
            return message.channel.send("You cannot use this command!");
        }

        await message.channel.send("Restarting...")
            .then(() => {
                // if(serverQueue) {
                //     serverQueue.connection.dispatcher.end();
                // }
                
                client.destroy();
            })
            .then(() => {
                client.login(token);
                message.channel.send("Restarted!");
            });
    }
}