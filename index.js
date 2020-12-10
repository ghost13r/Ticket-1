const express = require("express");
const app = express();
app.listen(() => console.log("i'm ready"));
app.use('/ping', (req, res) => {
  res.send(new Date());
});
const Discord = require('discord.js');
const client = new Discord.Client({partials: ["MESSAGE", "USER", "REACTION"]});
client.on ('ready', () => {
console.log(`[${client.user.tag}] Is Ready`);
})
const enmap = require('enmap');
const prefix = "/"
client.login("NzQzNDI1MzI4MDIxNTA0MDUw.XzUeyg.6cvyu4WgnFEJO_dbZS_7gHe7oqA");

const settings = new enmap({
    name: "settings",
    autoFetch: true,
    cloneLevel: "deep",
    fetchAll: true
});

client.on ('message', async (Fathy) => {
  if (!Fathy.guild || Fathy.author.bot) return false;
  if (Fathy.content == prefix + 'ping') {
    const msg = await Fathy.channel.send (" BY Ghost");
    msg.delete ();
    Fathy.channel.send (`\`\`\`javascript\nDiscord API: ${Math.round (client.ping)}ms\nTime taken: ${msg.createdTimestamp - Fathy.createdTimestamp}\n\`\`\` `)
  }
})

client.on('message', async message => {
    if(message.author.bot) return;
    if(message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command == "ticket-setup") {

        let channel = message.mentions.channels.first();
        if(!channel) return message.reply("**Usage: `/ticket-setup #channel`**");

        let sent = await channel.send(new Discord.MessageEmbed()
            .setTitle("**Ticket Bot**")
            .setDescription("**React With 📩 To Create a Ticket**")
            .setFooter("made by <@478571955604160512>")
            .setColor("00ff00")
        );

        sent.react('📩');
        settings.set(`${message.guild.id}-ticket`, sent.id);

        message.channel.send("**Ticket System Setup Done :>**")
    }

    if(command == "close") {
        if(!message.channel.name.includes("ticket-")) return message.channel.send("**You cannot use that here :<**")
        message.channel.delete();
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    if(user.partial) await user.fetch();
    if(reaction.partial) await reaction.fetch();
    if(reaction.message.partial) await reaction.message.fetch();

    if(user.bot) return;

    let ticketid = await settings.get(`${reaction.message.guild.id}-ticket`);

    if(!ticketid) return;

    if(reaction.message.id == ticketid && reaction.emoji.name == '📩') {
        reaction.users.remove(user);

        reaction.message.guild.channels.create(`ticket-${user.username}`, {
            permissionOverwrites: [
                {
                    id: user.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                },
                {
                    id: reaction.message.guild.roles.everyone,
                    deny: ["VIEW_CHANNEL"]
                }
            ],
            type: 'text'
        }).then(async channel => {
            channel.send(`<@${user.id}>`, new Discord.MessageEmbed().setTitle("**Welcome to your ticket!**").setDescription("**Wait For Admin Response :>**").setColor("00ff00"))
        })
    }
});

