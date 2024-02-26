const { Client, Message } = require('discord.js-selfbot-v13');
const { Client: DiscordClient, GatewayIntentBits, ActivityType, EmbedBuilder } = require('discord.js');
const chalk = require("chalk");
const request = require('request');
const logChannelId = '1208789625712418856';

const selfBotClient = new Client({
  checkUpdate: false,
});

const botClient = new DiscordClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const botToken = 'MTIwODc4NjEzNzMyNjU1MTA3MA.GWJHqJ.TIzue3yFErpbwbHlxBYeLJhuUxHyVD3h-d5frc'
const ownerID = '1162923811734302810'
let targetUserIds = ['1162923811734302810', '804918085713920001', '1200336556578328656'];
let allowedUserIds = ['1162923811734302810', '804918085713920001', '1200336556578328656','1100403273703362601'];
const botPrefix = "??"
const currentVersion = "v1.0.3"

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

  if (message.content.toLowerCase().startsWith('??settoken')) {
    const newToken = message.content.slice('??settoken'.length).trim();

    if (!newToken) {
      message.channel.send('Please provide a valid token to update.');
      return; // Stop further execution
    }

    if (newToken && (message.author.id === ownerID || allowedUserIds.includes(message.author.id))) {
      try {
        await selfBotClient.login(newToken);
        selfBotClient.user.setStatus('invisible');
        message.channel.send('Catcher token updated successfully!');
      } catch (error) {
        console.error('Error updating catcher token:', error);
        message.channel.send('Invalid Token Provided. Unable to update catcher token.');
      }
    } else {
      message.channel.send('Invalid command or missing permissions.');
    }
  }

  if (message.content.toLowerCase().startsWith('??setcreator')) {
    const creatorToken = message.content.slice('??setcreator'.length).trim();

    if (!creatorToken) {
      message.channel.send('Please provide a valid token to update.');
      return; // Stop further execution
    }

    if (creatorToken && (message.author.id === ownerID || allowedUserIds.includes(message.author.id))) {
      try {
        await selfBotClient.login(creatorToken);
        selfBotClient.user.setStatus('invisible');
        message.channel.send('Set Creator token updated successfully!');
      } catch (error) {
        console.error('Error updating set creator token:', error);
        message.channel.send('Invalid Token Provided. Unable to update set creator token.');
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

  if (message.content.toLowerCase() === '??current-token') {
  const selfBotUsername = selfBotClient.user.username;
  const selfBotAvatarURL = selfBotClient.user.displayAvatarURL({ format: 'png', dynamic: true });

  const uptimeInSeconds = Math.floor(process.uptime());
  const uptimeFormatted = formatUptime(uptimeInSeconds);

  message.channel.send({
    embeds: [
      {
        title: 'Current Catcher\'s Information',
        fields: [
          {
            name: 'Username',
            value: selfBotUsername,
          },
          {
            name: 'Catching Status',
            value: uptimeFormatted,
          },
        ],
        thumbnail: {
          url: selfBotAvatarURL,
        },
        color: 0x00eaff, // You can customize the color
      },
    ],
  });
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

let isCatchEventEnabled = false;

botClient.on('messageCreate', async (message) => {
  if (message.author.bot) return; // Ignore messages from other bots

  // Command to start catch event
  if (message.content.toLowerCase() === '??start catch') {
    isCatchEventEnabled = true;
    message.channel.send('✅ Catching Started!');
  }

  // Command to stop catch event
  if (message.content.toLowerCase() === '??stop catch') {
    isCatchEventEnabled = false;
    message.channel.send('✅ Catching Stopped!');
  }
});

let congratulationsCount = 0;
let shinyCount = 0;

selfBotClient.on('messageCreate', async (message) => {
  // Check if the message is from the specified bot and contains the catch message
  if (
    message.author.id === '716390085896962058' &&
    message.content.includes('Congratulations') &&
    message.content.includes(`<@${selfBotClient.user.id}>! You caught a Level`)
  ) {
    const logChannel = botClient.channels.cache.get(logChannelId);

    if (logChannel) {
      congratulationsCount++;

      const match = message.content.match(/Congratulations <@(\d+)>! You caught a Level (\d+) (.+?)(?:<:.+?:\d+>)? \((\d+\.\d+%)\)!/);
      if (match) {
        const catcherID = match[1];
        const level = match[2];
        const pokemon = match[3];
        const IVPercentage = match[4];

        if (message.content.includes('✨')) {
          shinyCount++;
        }

        const avatarURL = selfBotClient.user.displayAvatarURL({ format: 'png', dynamic: true });
        const serverName = message.guild ? message.guild.name : 'Direct Message';

        if (!avatarURL) {
          const botAvatarURL = botClient.user.displayAvatarURL({ format: 'png', dynamic: true });
          sendCatchLog(logChannel, message, botAvatarURL, serverName, catcherID, level, pokemon, IVPercentage);
        } else {
          sendCatchLog(logChannel, message, avatarURL, serverName, catcherID, level, pokemon, IVPercentage);
        }
      }
    } else {
      console.error('Log channel not found.');
    }
  }
});

function sendCatchLog(logChannel, message, thumbnailURL, serverName, catcherID, level, pokemon, IVPercentage) {
  logChannel.send({
    embeds: [
      {
        title: 'Catch Logs –– Set 1',
        description: `> **Total Pokes**: ${congratulationsCount}\n\n> **Server**: ${serverName}\n\n> **Catcher:** <@${catcherID}>\n\n> **Pokemon**: ${pokemon}\n\n> **Level**: ${level}\n\n> **Total Shinies:** ${shinyCount}`,
        thumbnail: {
          url: thumbnailURL,
        },
        color: 0x00eaff, // You can customize the color
      },
    ],
  });
}

selfBotClient.on('messageCreate', async (message) => {
  if (isCatchEventEnabled && message.author.id === '854233015475109888') {
    const colonIndex = message.content.indexOf(':');

    if (colonIndex !== -1) {
      const messageAfterColon = message.content.substring(colonIndex + 1).trim();
      selfBotClient.channels.cache.get(message.channel.id).send(`<@716390085896962058> c ${messageAfterColon}`);
    }
  }
});

selfBotClient.on('messageCreate', async (message) => {
  if (message.content.includes("Please pick a starter pokémon")) {
    message.channel.send("<@716390085896962058> pick charmander");
  } else if (
    message.embeds[0]?.footer &&
    message.embeds[0].footer.text.includes("Terms") &&
    message?.components[0]?.components[0]
  ) {
    // Assuming you still want to handle button interactions
    const buttonComponent = message.components[0].components[0];
    
    if (buttonComponent) {
      message.clickButton(buttonComponent);
      setTimeout(() => {
        message.channel.send("<@716390085896962058> i");
      }, 3000);
    }
  }

  // Ensure to use the correct prefix or adjust the condition
  if (message.content.toLowerCase().startsWith('??set create')) {
    const args = message.content.slice('??set create'.length).trim().split(/ +/);
    const SetNumber = args[0]; // Adjust index based on your command structure
    console.log('Command Args:', args);
    console.log('SetNumber:', SetNumber);

    try {
      const template = await selfBotClient.fetchGuildTemplate(
        "https://discord.new/YCGGMe4AankG"
      );

      const createdGuild = await template.createGuild(`SET ${SetNumber}`);

      const introductionChannel = createdGuild.channels.cache.filter(
        (channel) =>
          channel.type === "GUILD_TEXT" &&
          channel.name.includes("general")
      );

      try {
        const commandChannel = createdGuild.channels.cache.filter(
          (channel) => channel.type === "GUILD_TEXT" && channel.name.includes("cmds")
        );

        if (commandChannel.size > 0) {
          const createdInvite = await introductionChannel.first().createInvite();

          // Log details in botClient's log channel
          const botLogChannel = botClient.channels.cache.get(logChannelId);
          if (botLogChannel && botLogChannel.isText()) {
            botLogChannel.send(
              `Server created by ${message.author.tag}.\nInvite: ${createdInvite}\nLog Webhook: ${createdWebhook.url}\nGuild ID: ${createdGuild.id}`
            );
          } else {
            console.error('Error: Bot log channel not found or not a text channel.');
          }

          // Send details in an embed
          const embed = new EmbedBuilder()
            .setTitle('Server Created')
            .setDescription(`Server created by ${message.author.tag}`)
            .addFields({ name: 'Invite', value: createdInvite })
            .addFields({ name: 'Guild ID', value: createdGuild.name })
            .setColor('#00ff00'); // You can change the color as needed

          commandChannel.first().send({ embeds: [embed] });
        }
      } catch (error) {
        console.error('Error in inner try block:', error);
      }
    } catch (error) {
      console.error('Error in outer try block:', error);
    }
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

    async function taddbulk(message, args) {
      const tradeConfirmationString = "Are you sure you want to trade";

      // Check if the message content matches the target
      if (message.content === 'taddbulk') {
        const sendMessage = async (content) => {
          await message.channel.send(content);
          await new Promise(resolve => setTimeout(resolve, 12000)); // Wait for 12 seconds
        };

        try {
          const sayMessage = args.join(', ');

          await sendMessage(`<@716390085896962058> t aa --${sayMessage}`);
          await sendMessage(`<@716390085896962058> t c`);
          await new Promise(resolve => setTimeout(resolve, 12000)); // Wait for 12 seconds

          // Fetch messages in the channel
          const messages = await message.channel.messages.fetch();

          // Find the target message
          const targetMessageAreYouSure = messages.find(msg => msg.content.includes(tradeConfirmationString));

          if (targetMessageAreYouSure) {
            // Click the button and react to the target message
            await targetMessageAreYouSure.clickButton();
            await targetMessageAreYouSure.react("✅");

            // Wait for the interaction to complete
            await new Promise(resolve => setTimeout(resolve, 6000)); // Wait for 6 seconds
          } else {
            console.log('Target message not found.');
          }
        } catch (err) {
          console.log(err);
          // Handle the error or continue with the rest of your logic
        }
      }
    }
    if (message.content.startsWith('taddbulk')) {
      // Execute the 'taddbulk' logic
      await taddbulk(message, args);
    }

    if (command === 'tevent') {
      selfBotClient.channels.cache.get(message.channel.id).send('<@716390085896962058> event');
    }

    if (command === 'tr') {
      selfBotClient.channels.cache.get(message.channel.id).send('<@716390085896962058> redeem');
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