const Embed = require("../embed/embed")

module.exports = {
    name: 'ping',
    description: "Shows the latency on connection",
    execute(message, client, Discord) {
        let embed = new Embed(Discord, message.channel);
        embed.ping(message, client);
    }
}