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

const Embed = require("./embed/embed");

client.on("ready", () => {
  console.log("Ready!");
  client.user.setPresence({
    activity: {
      name: `"${prefix}help" for help`
    }
  })
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("guildCreate", guild => {
  let channelID;
  let channels = guild.channels.cache;

  channelLoop:
  for (let key in channels) {
      let c = channels[key];
      if (c[1].type === "text") {
          channelID = c[0];
          break channelLoop;
      }
  }

  let channel = guild.channels.cache.get(guild.systemChannelID || channelID);
  let embed = new Embed(Discord, channel);
  embed.hello();
});

client.on("guildDelete", async guild => {
  // let channelID;
  // let channels = guild.channels.cache;

  // channelLoop:
  // for (let key in channels) {
  //     let c = channels[key];
  //     if (c[1].type === "text") {
  //         channelID = c[0];
  //         break channelLoop;
  //     }
  // }
  
  // //let channel = guild.channels.cache.get(guild.systemChannelID || channelID);
  // const fetchedChannel = await client.channels.fetch(channelID);
  // let embed = new Embed(Discord, fetchedChannel);
  // embed.goodbye();
  queue.clear();
  console.log("Queue cleared!");
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
  } else if (command === 'song') {
    client.commands.get('song').execute(Discord, serverQueue.textChannel, message, serverQueue)
    return;
  } else if (command === 'help') {
    client.commands.get('help').execute(message, prefix, client.commands, Discord);
    return;
  } else {
    message.channel.send(`You need to enter a valid command! Use ${prefix}help if you need any help.`);
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
        date: songInfo.videoDetails.publishDate,
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

      client.commands.get('play').execute(message.author, message.guild, queueContruct.songs[0], ytdl, queue, Discord);

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

function validURL(input) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

  return !!pattern.test(input);
}

client.login(token);