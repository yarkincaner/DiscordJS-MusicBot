const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const ytdl = require("ytdl-core");

const client = new Discord.Client();

const queue = new Map();

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
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue, false);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}loop`)) {
    execute(message, serverQueue, true);
    return;
  } else if (message.content.startsWith(`${prefix}volume`)) {
    volume(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}pause`)) {
    pause(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}resume`)) {
    resume(message, serverQueue);
    return;
  } else {
    message.channel.send("You need to enter a valid command!");
  }
});

async function execute(message, serverQueue, isLoop) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
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
        channelPicture: songInfo.videoDetails.thumbnails[1].url
  };

  if (!serverQueue) {
    const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true,
        loop: isLoop
    }

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      
      play(message.guild, queueContruct.songs[0]);
      
      const embed = new Discord.MessageEmbed()
        .setColor('#9399ff')
        .setTitle('Hands in the air!')
        .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL(true)}`)
        .setThumbnail(`${song.channelPicture}`)
        .addFields(
          //{ name: '\u200B', value: '\u200B'}, //Empty line
          { name: 'Song Title', value: `${song.title}`},
          { name: 'Volume', value: `${queueContruct.connection.dispatcher.volume}`, inline: true},
          { name: 'Duration', value: `${song.duration} seconds`, inline: true}
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

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      if(serverQueue.loop) {
        serverQueue.songs.push(serverQueue.songs.shift());
      } else {
        serverQueue.songs.shift();
      }
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);

  
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue) {
    return message.channel.send("The queue is already empty!");
  }
    
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
    
  if (!serverQueue)
    return message.channel.send("The queue is already empty!");
    
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function pause(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue) {
    return message.channel.send("The queue is already empty!");
  }

  serverQueue.connection.dispatcher.pause(true);
  const song = serverQueue.songs[0];
  message.channel.send(`${song.title} is paused!`);
}

function resume(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue) {
    return message.channel.send("The queue is already empty!");
  }

  serverQueue.connection.dispatcher.resume();
  const song = serverQueue.songs[0];
  message.channel.send(`${song.title} is paused!`);
}

function volume(message, serverQueue) {

  const args = message.content.split(" ");
  args[1] = parseFloat(args[1]);
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue) {
    return message.channel.send("The queue is already empty!");
  }
  
  if(!args[1]) {
    return message.channel.send(`Current Volume: ${serverQueue.connection.dispatcher.volume}`);
  }
  
  serverQueue.connection.dispatcher.setVolume(args[1]);
  message.channel.send(`Volume set to **${args[1]}**`);
}

client.login(token);