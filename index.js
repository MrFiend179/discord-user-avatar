const Discord = require('discord.js');
const {MessageEmbed} = require('discord.js')
const fetch = require('axios')
const client = new Discord.Client({intents: ['GUILDS','GUILD_MESSAGES','MESSAGE_CONTENT','GUILD_MEMBERS',]});
require('dotenv').config()
const token = process.env.DISCORD_TOKEN

client.login(token) 
client.on('ready',()=>{
    console.log(`${client.user.username}#${client.user.discriminator} is now online`)
})
client.on('messageCreate',(message)=>{
    const prefix = '.';// prefix the bot will use
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    // default command to show use avatar if limited to guild or public only
    if (command === 'av') {
        var member = message.mentions.users.first()
        if (!member) {
          var member = message.author
        }
        var guildid = message.guild.id
        fetch.get(`https://discord.com/api/guilds/${guildid}/members/${member.id}`, {
            headers: {
              Authorization: `Bot ${client.token}`
            }
        })
        .then(res => {
          // In case if user doesnt have a seperate avatar for guild
          if(res.data.avatar === null){
            const embed12 = new Discord.MessageEmbed()
            .setAuthor({ name: `${member.username}#${member.discriminator}`, iconURL:member.avatarURL() })
            .setTitle('User Avatar')
            .setImage(member.avatarURL({ dynamic: true, size: 4096 }))
            .setColor('#50c878');
    
        if (member.avatarURL({ dynamic: true }).endsWith('.gif')) {
          embed12.image.gif = true;
        }
        message.channel.send({ embeds: [embed12] })

          }
          else{
          let url = `https://cdn.discordapp.com/guilds/${guildid}/users/${member.id}/avatars/${res.data.avatar}.gif?2048`
          const urlrplc = url.replace('?2048','?size=2048')
          //message.channel.send(url)
          console.log(url)
          const embed = new MessageEmbed()
          .setAuthor({ name: `${member.username}#${member.discriminator}`, iconURL:url })
          .setTitle('Server Avatar')
          .setColor('#50c878')
          .setImage(urlrplc)
            message.channel.send({ embeds: [embed] })
          }
        })
    }
    // Usage in case if both guild and public avatar is available 
    if(command === 'pav'){
        const user = message.mentions.users.first() || message.author;
    
        // Create a new embed
        const embed = new Discord.MessageEmbed()
            .setAuthor({ name: `${user.username}#${user.discriminator}`, iconURL: user.avatarURL({dynamic: true})})
            .setTitle('User Avatar')
            .setImage(user.avatarURL({ dynamic: true, size: 4096 }))
            .setColor('#50c878');
    
        if (user.avatarURL({ dynamic: true }).endsWith('.gif')) {
          embed.image.gif = true;
        }
        message.channel.send({ embeds: [embed] })
    }

})