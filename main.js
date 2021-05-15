const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const ytdl = require("ytdl-core");

const client = new Discord.Client();

const queue = new Map();

const fs = require('fs');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once("ready", () => {
  console.log("Ready!");
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("message", async message => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'play') {
    execute(message, serverQueue, false);
    return;
  } else if (command === 'skip') {
    client.commands.get('skip').execute(message, serverQueue);
    return;
  } else if (command === 'stop') {
    client.commands.get('stop').execute(message, serverQueue);
    return;
  } else if (command === 'loop') {
    execute(message, serverQueue, true);
    return;
  } else if (command === 'volume') {
    client.commands.get('volume').execute(message, serverQueue);
    return;
  } else if (command === 'pause') {
    client.commands.get('pause').execute(message, serverQueue);
    return;
  } else if (command === 'resume') {
    client.commands.get('resume').execute(message, serverQueue);
    return;
  } else if (command === 'restart') {
    client.commands.get('restart').execute(message, serverQueue, client, token);
    return;
  } else {
    message.channel.send("You need to enter a valid command!");
  }
});

async function execute(message, serverQueue, isLoop) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) {
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  }
  
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        duration: songInfo.videoDetails.lengthSeconds,
        channelPicture: songInfo.videoDetails.thumbnails[1].url,
        loop: isLoop,
        isPaused: false
  };

  if (!serverQueue) {
    const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
    }

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;

      client.commands.get('play').execute(message.guild, queueContruct.songs[0], ytdl, queue);

      const embed = new Discord.MessageEmbed()
        .setColor('#9399ff')
        .setTitle('Hands in the air!')
        .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL(true)}`)
        .setThumbnail(`${song.channelPicture}`)
        .addFields(
          //{ name: '\u200B', value: '\u200B'}, //Empty line
          { name: 'Song Title', value: `${song.title}`},
          { name: 'Volume', value: `${queueContruct.connection.dispatcher.volume}`, inline: true},
          { name: 'Duration', value: `${new Date(song.duration * 1000).toISOString().substr(11, 8)}`, inline: true}
        )
        .setImage(`${song.channelPicture}`)
        .setTimestamp()
        .setFooter(`${queueContruct.songs.length} songs left`);

      message.channel.send(embed);

    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

client.login(token);