module.exports = {
    name: 'terminate',
    description: "Terminates the bot",
    async execute(message, client) {
        if (message.author.id === '466989953063190529') {
            await message.channel.send("Process terminated!")
                .then(() => {
                    client.destroy();
                })
                .then(() => {
                    process.exit(0);
                });
        }

        message.channel.send("You can't use this command!");
    }
}