const { Client } = require('discord.js-selfbot-v13');
const { Client: DiscordClient, GatewayIntentBits, ActivityType, EmbedBuilder } = require('discord.js');
const chalk = require("chalk");
const request = require('request');
const { solveHint, checkRarity } = require('pokehint')
const logChannelId = '1204345021914939482';

const selfBotClient = new Client({
  checkUpdate: false,
  captchaService: '2captcha',
  captchaKey: '608916c22fe4fa6a8b6a0e5a5e640da1',
});

const botClient = new DiscordClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const botToken = 'MTIwMDM5NDI1MDQwODQzMTY4Ng.Gkujpl.ii7zq329TEsOHrErXcRrifWFbdMSset4Zlhl4E'
const ownerID = '1162923811734302810'
let targetUserIds = ['1162923811734302810', '804918085713920001', '1200336556578328656'];
let allowedUserIds = ['1162923811734302810', '804918085713920001', '1200336556578328656','1100403273703362601'];
const botPrefix = "??"
const currentVersion = "v1.0.3"
const selfBotClients = Array(5).fill(null).map(() => new Client({ checkUpdate: false }));

botClient.on('ready', (c) => {
  botClient.user.setPresence({
    activities: [{ name: "With Pokemons!", type: ActivityType.Playing }],
    status: 'dnd',
  });
});

console.log(`
██████╗░░█████╗░██╗░░██╗███████╗  ██╗░░██╗██╗███╗░░██╗░██████╗░██████╗░░█████╗░███╗░░░███╗
██╔══██╗██╔══██╗██║░██╔╝██╔════╝  ██║░██╔╝██║████╗░██║██╔════╝░██╔══██╗██╔══██╗████╗░████║
██████╔╝██║░░██║█████═╝░█████╗░░  █████═╝░██║██╔██╗██║██║░░██╗░██║░░██║██║░░██║██╔████╔██║
██╔═══╝░██║░░██║██╔═██╗░██╔══╝░░  ██╔═██╗░██║██║╚████║██║░░╚██╗██║░░██║██║░░██║██║╚██╔╝██║
██║░░░░░╚█████╔╝██║░╚██╗███████╗  ██║░╚██╗██║██║░╚███║╚██████╔╝██████╔╝╚█████╔╝██║░╚═╝░██║
╚═╝░░░░░░╚════╝░╚═╝░░╚═╝╚══════╝  ╚═╝░░╚═╝╚═╝╚═╝░░╚══╝░╚═════╝░╚═════╝░░╚════╝░╚═╝░░░░░╚═╝

░█████╗░░█████╗░████████╗░█████╗░██╗░░██╗███████╗██████╗░
██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗██║░░██║██╔════╝██╔══██╗
██║░░╚═╝███████║░░░██║░░░██║░░╚═╝███████║█████╗░░██████╔╝
██║░░██╗██╔══██║░░░██║░░░██║░░██╗██╔══██║██╔══╝░░██╔══██╗
╚█████╔╝██║░░██║░░░██║░░░╚█████╔╝██║░░██║███████╗██║░░██║
░╚════╝░╚═╝░░╚═╝░░░╚═╝░░░░╚════╝░╚═╝░░╚═╝╚══════╝╚═╝░░╚═╝
`);


botClient.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase().startsWith('??settoken-')) {
    const tokenIndex = parseInt(message.content.slice('??settoken-'.length).trim(), 10);
    
    if (isNaN(tokenIndex) || tokenIndex <= 0 || tokenIndex > 5) {
      message.channel.send('Invalid token index. Please provide a number between 1 and 5.');
      return;
    }

    const newToken = message.content.split(' ')[1];

    if (!newToken) {
      message.channel.send('Please provide a valid token to update.');
      return;
    }

    const selfBotIndex = tokenIndex - 1; // Array index is one less than token index

    if (message.author.id === ownerID || allowedUserIds.includes(message.author.id)) {
      try {
        if (!selfBotClients[selfBotIndex]) {
          selfBotClients[selfBotIndex] = new Discord.Client();
        }

        await selfBotClients[selfBotIndex].login(newToken);
        selfBotClients[selfBotIndex].user.setStatus('invisible');
        message.channel.send(`Catcher token ${tokenIndex} updated successfully!`);
      } catch (error) {
        console.error(`Error updating catcher token ${tokenIndex}:`, error);
        message.channel.send(`Invalid Token Provided. Unable to update catcher token ${tokenIndex}.`);
      }
    } else {
      message.channel.send('Invalid command or missing permissions.');
    }
  }

if (message.content.toLowerCase().startsWith('??checktoken')) {
  // Extract the token from the message content
  const providedToken = message.content.slice('??checktoken'.length).trim();

  // Make a request to Discord API to check the validity of the provided token
  request.get(
    {
      headers: {
        authorization: providedToken,
      },
      url: 'https://canary.discord.com/api/v9/users/@me',
    },
    function (error, response, body) {
      if (error) {
        console.error('Error checking token:', error);
        message.channel.send('Error checking token. Please try again later.');
        return;
      }

      try {
        const bod = JSON.parse(body);

        if (String(bod.message) === '401: Unauthorized') {
          message.channel.send('The Provided Token is Invalid or Revoked.');
        } else {
          const username = bod.username; // Assuming the response includes the username field
          const avatarURL = `https://cdn.discordapp.com/avatars/${bod.id}/${bod.avatar}.png`;
          message.channel.send({
            embeds: [
              {
                title: `**__Token Information__**`,
                fields: [
                  {
                    name: 'Username',
                    value: username,
                    inline: false,
                  },
                  {
                    name: 'Token',
                    value: `\`\`\`${providedToken}\`\`\``,
                    inline: false,
                  },
                ],
                thumbnail: {
                  url: avatarURL,
                },
                color: 0x00eaff, // Green color
              },
            ],
          });
        }
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        message.channel.send('Error checking token. Please try again later.');
      }
    }
  );
}

  if (message.content.toLowerCase().startsWith('??changeavatar')) {
    const newAvatarURL = message.content.slice('??changeavatar'.length).trim();

    if (!newAvatarURL) {
      message.channel.send('Please provide a valid avatar URL to update.');
      return;
    }

    if (message.author.id === ownerID || allowedUserIds.includes(message.author.id)) {
      try {
        await botClient.user.setAvatar(newAvatarURL);
        await botClient.user.setPresence({ status: 'dnd' });
        message.channel.send('Bot avatar and presence updated successfully!');
      } catch (error) {
        console.error('Error updating bot avatar and presence:', error);
        message.channel.send('Failed to update bot avatar and presence.');
      }
    } else {
      message.channel.send('Invalid command or missing permissions.');
    }
  }

  if (message.content.toLowerCase() === '??current-tokens') {
    // Assuming selfBotClients is an array of your self-bot clients
    const selfBotInfo = selfBotClients.map((selfBotClient, index) => {
      const selfBotUsername = selfBotClient.user.username;
      const selfBotAvatarURL = selfBotClient.user.displayAvatarURL({ format: 'png', dynamic: true });
  
      const uptimeInSeconds = Math.floor(process.uptime());
      const uptimeFormatted = formatUptime(uptimeInSeconds);
  
      return {
        username: selfBotUsername,
        catchingStatus: uptimeFormatted,
        avatarURL: selfBotAvatarURL,
        index: index + 1,
      };
    });
  
    const embeds = selfBotInfo.map((info) => ({
      title: `Catcher Set ${info.index} Information`,
      fields: [
        {
          name: 'Username',
          value: info.username,
        },
        {
          name: 'Catching Status',
          value: info.catchingStatus,
        },
      ],
      thumbnail: {
        url: info.avatarURL,
      },
      color: 0x00eaff, // You can customize the color
    }));
  
    message.channel.send({ embeds });
  }
  
  function formatUptime(uptimeInSeconds) {
    const days = Math.floor(uptimeInSeconds / (24 * 60 * 60));
    const hours = Math.floor((uptimeInSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((uptimeInSeconds % (60 * 60)) / 60);
    const seconds = uptimeInSeconds % 60;
  
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }  

  if (message.content.toLowerCase().startsWith('??whitelist')) {
    const args = message.content.slice('??whitelist'.length).trim().split(/\s+/);
    const command = args.shift().toLowerCase();
    const userId = args.shift();

    if (command === 'add' && userId) {
      const userIdBigInt = BigInt(userId);

      if (!allowedUserIds.includes(userIdBigInt.toString())) {
        allowedUserIds.push(userIdBigInt.toString());
        message.channel.send(`User <@${userIdBigInt}> added to the whitelist.`);
      } else {
        message.channel.send(`User <@${userIdBigInt}> is already in the whitelist.`);
      }
    } else if (command === 'remove' && userId) {
      const userIdBigInt = BigInt(userId);

      if (allowedUserIds.includes(userIdBigInt.toString())) {
        allowedUserIds = allowedUserIds.filter((id) => id !== userIdBigInt.toString());
        message.channel.send(`User <@${userIdBigInt}> removed from the whitelist.`);
      } else {
        message.channel.send(`User <@${userIdBigInt}> is not in the whitelist.`);
      }
    } else if (command === 'show') {
  const ownerMention = `<@${ownerID}>`;
  const adminsMentions = allowedUserIds
    .filter(id => id !== ownerID)
    .map(id => `<@${id}>`)
    .join(', '); // Add a comma and space between admins

  const embed = {
    title: 'Whitelist Information',
    fields: [
      {
        name: `Owner`,
        value: ownerMention,
        inline: false,
      },
      {
        name: `Admins`,
        value: adminsMentions,
        inline: false,
      },
    ],
    color: 0x00eaff, // Light Blue color
  };

  message.channel.send({ embeds: [embed] });
} else {
  message.channel.send('Invalid command or missing user ID.');
}
  }
});

botClient.on('messageCreate', (message) => {
  if (message.author.id === '716390085896962058' && message.content.includes('https://verify.poketwo.net/captcha')) {
    targetUserIds.forEach(async (targetUserId) => {
      try {
        const targetUser = await botClient.users.fetch(targetUserId);

        if (targetUser) {
          await targetUser.send(`Received captcha: ${message.content}`);
        } else {
          console.error(`Target user with ID ${targetUserId} not found`);
        }
      } catch (error) {
        console.error(`Error sending DM to user with ID ${targetUserId}:`, error);
      }
    });
  }
});

const isCatchEventEnabled = {}; // Object to store catch event status for each self-bot client

// Initialize catch event status for each client
const initializeCatchStatus = () => {
  for (let i = 1; i <= 5; i++) {
    isCatchEventEnabled[`selfBotClient${i}`] = false;
  }
};

initializeCatchStatus();

botClient.on('messageCreate', async (message) => {
  if (message.author.bot) return; // Ignore messages from other bots

  // Command to start catch event for a specific self-bot client
  if (message.content.toLowerCase().startsWith('??start-catch-')) {
    startCatchEvent(message);
  }

  // Command to stop catch event for a specific self-bot client
  if (message.content.toLowerCase().startsWith('??stop-catch-')) {
    stopCatchEvent(message);
  }
});

// Function to start catch event for a specific self-bot client
const startCatchEvent = (message) => {
  const selfBotIndex = getSelfBotIndex(message.content);

  if (selfBotIndex > 0) {
    isCatchEventEnabled[`selfBotClient${selfBotIndex}`] = true;
    message.channel.send(`✅ Catching Started for Catcher Client ${selfBotIndex}!`);
  } else {
    message.channel.send('❌ Invalid command or missing permissions.');
  }
};

// Function to stop catch event for a specific self-bot client
const stopCatchEvent = (message) => {
  const selfBotIndex = getSelfBotIndex(message.content);

  if (selfBotIndex > 0) {
    isCatchEventEnabled[`selfBotClient${selfBotIndex}`] = false;
    message.channel.send(`✅ Catching Stopped for Catcher Client ${selfBotIndex}!`);
  } else {
    message.channel.send('❌ Invalid command or missing permissions.');
  }
};

// Function to get the self-bot index based on command content
const getSelfBotIndex = (content) => {
  const match = content.match(/(?:\d+)/); // Extract digits from the command
  return match ? parseInt(match[0]) : 0;
};

let congratulationsCounts = new Array(5).fill(0);
let shinyCounts = new Array(5).fill(0);

selfBotClients.forEach((selfBotClient, index) => {
  selfBotClient.on('messageCreate', async (message) => {
    // Check if the message is from the specified bot and contains the catch message
    if (
      message.author.id === '716390085896962058' &&
      message.content.includes('Congratulations') &&
      message.content.includes(`<@${selfBotClient.user.id}>! You caught a Level`)
    ) {
      const logChannel = botClient.channels.cache.get(logChannelId);

      if (logChannel) {
        congratulationsCounts[index]++;

        const match = message.content.match(/Congratulations <@(\d+)>! You caught a Level (\d+) (.+?)(?:<:.+?:\d+>)? \((\d+\.\d+%)\)!/);
        if (match) {
          const catcherID = match[1];
          const level = match[2];
          const pokemon = match[3];
          const IVPercentage = match[4];

          if (message.content.includes('✨')) {
            shinyCounts[index]++;
          }

          const avatarURL = selfBotClient.user.displayAvatarURL({ format: 'png', dynamic: true });
          const serverName = message.guild ? message.guild.name : 'Direct Message';

          if (!avatarURL) {
            const botAvatarURL = botClient.user.displayAvatarURL({ format: 'png', dynamic: true });
            sendCatchLog(logChannel, message, botAvatarURL, serverName, catcherID, level, pokemon, IVPercentage, index);
          } else {
            sendCatchLog(logChannel, message, avatarURL, serverName, catcherID, level, pokemon, IVPercentage, index);
          }
        }
      } else {
        console.error('Log channel not found.');
      }
    }
  });
});

function sendCatchLog(logChannel, message, thumbnailURL, serverName, catcherID, level, pokemon, IVPercentage, index) {
  logChannel.send({
    embeds: [
      {
        title: `Catch Logs –– Set ${index + 1}`,
        description: `> **Total Pokes**: ${congratulationsCounts[index]}\n\n> **Server**: ${serverName}\n\n> **Catcher:** <@${catcherID}>\n\n> **Pokemon**: ${pokemon}\n\n> **Level**: ${level}\n\n> **Total Shinies:** ${shinyCounts[index]}`,
        thumbnail: {
          url: thumbnailURL,
        },
        color: 0x00eaff, // You can customize the color
      },
    ],
  });
}

selfBotClients.forEach(selfBotClient => {
selfBotClient.on('messageCreate', async (message) => {
  if (
    message.embeds[0]?.title &&
    message.embeds[0].title.includes("wild pokémon has appeared") &&
    isCatchEventEnabled
  ) {
    let msg = ["h", "hint"];
    message.channel.send(
      "<@716390085896962058> " + msg[Math.round(Math.random())]
    );
    spawned_embed = message.embeds[0];
  } else if (message.content.includes("The pokémon is") && isCatchEventEnabled) {
    const pokemon = await solveHint(message);
    let msg = ["c", "catch"];
    message.channel.send(
      `<@716390085896962058> ${msg[Math.round(Math.random())]} ` + pokemon
    );
  }

  if (allowedUserIds.includes(message.author.id)) {
    const [command, ...args] = message.content.trim().split(/\s+/);

    if (command === 't') {
      selfBotClient.channels.cache.get(message.channel.id).send('<@716390085896962058> p');
    }

    if (command === 't1') {
      selfBotClient.channels.cache.get(message.channel.id).send('<@716390085896962058> p --sh');
    }

    if (command === 't2') {
      selfBotClient.channels.cache.get(message.channel.id).send('<@716390085896962058> p --leg --ub --my');
    }

    if (command === 't3') {
      selfBotClient.channels.cache.get(message.channel.id).send('<@716390085896962058> or iv');
    }

    if (command === 'tu') {
    selfBotClient.channels.cache.get(message.channel.id).send(`<@716390085896962058> t ${message.author}`);
    }

    if (command === 'tc') {
      selfBotClient.channels.cache.get(message.channel.id).send('<@716390085896962058> t c');
    }

    if (command === 'tadd') {
      const sayMessage = args.join(' ');

      if (sayMessage) {
        message.channel.send(`<@716390085896962058> t a ${sayMessage}`);
      } else {
        message.channel.send('Please provide a message for me to say.');
      }
    }

    if (command === '$') {
      selfBotClient.channels.cache.get(message.channel.id).send('<@716390085896962058> bal');
    }

    // New 'tq' command
    if (command === 'tq') {
      selfBotClient.channels.cache.get(message.channel.id).send('<@716390085896962058> q');
    }

    if (command === 'ti') {
      const sayMessage = args.join(' ');

      if (sayMessage) {
        message.channel.send(`<@716390085896962058> i ${sayMessage}`);
      } else {
        message.channel.send('Please provide a message for me to say.');
      }
    }

    if (command === 'taddbulk') {
      taddbulk(message, args);
    }

    if (command === 'tevent') {
      selfBotClient.channels.cache.get(message.channel.id).send('<@716390085896962058> event');
    }
      
    if (command === 'tr') {
        selfBotClient.channels.cache.get(message.channel.id).send('<@716390085896962058> redeem')
    }

    if(command === 'topen') {
      const sayMessage = args.join(' ');

      if (sayMessage) {
        message.channel.send(`<@716390085896962058> event open ${sayMessage}`);
      }
    }

    if (command === 'tredeem') {
      const sayMessage = args.join(' ');

      if (sayMessage) {
        message.channel.send(`<@716390085896962058> buy redeem ${sayMessage}`);
      }
    }

    if (command === 'tp') {
      const sayMessage = args.join(' ');

      if (sayMessage) {
        message.channel.send(`<@716390085896962058> p --${sayMessage}`);
      } else {
        message.channel.send('Please provide a message for me to say.');
      }
    }
  }
});
});

async function taddbulk(message, args) {
  const tradeConfirmationString = "Are you sure you want to trade";

  const sendMessage = async (content) => {
    await selfBotClient.channels.cache.get(message.channel.id).send(content);
    await new Promise(resolve => setTimeout(resolve, 12000));
  };

  try {
    // Example usage:
    await sendMessage(`<@716390085896962058> t <@${message.author.id}>`);
    await sendMessage(`<@716390085896962058> t aa --limit 3000`);
    await sendMessage(`<@716390085896962058> t c`);
    await new Promise(resolve => setTimeout(resolve, 12000));

    const messages = await selfBotClient.channels.cache.get(message.channel.id).messages.fetch();
    const targetMessageAreYouSure = messages.find(message => message.content.includes(tradeConfirmationString));

    await targetMessageAreYouSure.clickButton();
    await targetMessageAreYouSure.react("✅");
    await new Promise(resolve => setTimeout(resolve, 6000));
  } catch (err) {
    console.log(err);
  }
}

botClient.on('ready', () => {
  const name = botClient.user.tag;
  const currentTime = new Date().toLocaleTimeString();

  const logEmbed = new EmbedBuilder()
    .addFields({ name: 'Bot Name', value: botClient.user.username })
    .addFields({ name: 'Bot Prefix', value: botPrefix })
    .addFields({ name: 'Bot Version', value: currentVersion })
    .addFields({ name: 'Developer', value: `**King Alpha**`})
    .setThumbnail(botClient.user.displayAvatarURL())
    .setColor('#00eaff');

  const logChannel = botClient.channels.cache.get(logChannelId);
  if (logChannel) {
    logChannel.send({ embeds: [logEmbed] });
    logChannel.send('**LOADED COMMANDS!**');
  } else {
    console.error('Invalid log channel ID or channel not found.');
  }

  console.log(chalk.yellow(`=> [${currentTime}]. Logged in as ${name}`));
  console.log(chalk.black.bold(`Ｉｎｆｏｒｍａｔｉｏｎ : `));
  console.log(chalk.green(`Bot Name: ${botClient.user.username} `));
  console.log(chalk.green(`Bot Prefix: ${botPrefix}`));
  console.log(chalk.blue(`Bot Version: ${currentVersion}`));
  console.log("");
  console.log(chalk.red("@Developer: King Alpha"));
  console.log("_______________________________________");
});

botClient.on('error', (error) => {
  console.error(chalk.red('[ERROR - BOT]', error));

  const logChannel = botClient.channels.cache.get(logChannelId);
  if (logChannel) {
    const errorEmbed = new EmbedBuilder()
      .setTitle('Error - Bot')
      .setDescription(`\`\`\`${error}\`\`\``)
      .setColor('#ff0000'); // Red color for error

    logChannel.send({ embeds: [errorEmbed] }).catch(console.error);
  }
});

selfBotClient.on('error', (error) => {
  console.error(chalk.red('[ERROR - SELFBOT]', error));

  const logChannel = botClient.channels.cache.get(logChannelId);
  if (logChannel) {
    const errorEmbed = new EmbedBuilder()
      .setTitle('Error - SelfBot')
      .setDescription(`\`\`\`${error}\`\`\``)
      .setColor('#ff0000'); // Red color for error

    logChannel.send({ embeds: [errorEmbed] }).catch(console.error);
  }
});

botClient.login(botToken);