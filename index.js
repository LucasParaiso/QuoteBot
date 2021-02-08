const Discord = require('discord.js');
const { prefix, token, quotes } = require('./config.json');

const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.login(token);

client.on('message', message => {
    if (message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

	if (command === 'ola') {
        message.channel.send(`Olá ${message.author}!`);

    } else if (command === 'quote') {
        if (!args.length) {
            return message.channel.send(`Você não selecionou qual quote você quer <quote (id)>, ${message.author}!`);
        }
        
        if (quotes[args[0]] != undefined) {
            message.reply(`${quotes[args[0]]}`);
        } else {
            message.reply('Quote não adicionado...')
        }

    }
});