var cp = require('child_process');
const { stderr, stdout } = require('process');
module.exports = {
    name: 'restart',
    description: "Restarts the bot",
    async execute(message, client) {

        if(!message.member.permissions.has("ADMINISTRATOR")) {
            return message.channel.send("You cannot use this command!");
        }
        
        await message.channel.send("Restarting...")
            .then(() => {
                const child = cp.spawn('node', ['main.js', 'child', message.channel.id], {
                    detached: true,
                    stdio: 'inherit'
                });
                child.unref();
            })
            .then(() => {
                client.destroy();
            })
            .then(() => {
                process.exit(0);
            });
    }
}