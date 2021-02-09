const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('quote.json');
const db = low(adapter);

const client = new Discord.Client();

client.once('ready', () => {
	console.log('Pronto!');
});

client.login(token);

client.on("guildCreate", () => {
    db.set(guild.id, []).write();
});

client.on('message', async message => {
    if (message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    //Olá!
	if (command === 'ola') {
        message.channel.send(`Olá ${message.author}!`);
        return;
    } 

    if (command === 'quote') {
        let opcao = args[0];

        if (opcao == undefined) {
            return message.reply(`Use: quote [add/edit/del]`);
        }

        //Cria Quote - Use: criar <mensagem>
        //***Não funciona direito com mais de uma palavra***
        if (opcao.startsWith('ad')) {
            if (!args[1]) return message.reply('Use: quote add <mensagem>');

            let MENSAGEM = message.content.slice(10);

            let ID = (db.get("quotes").size().value() + 1).toString();

            if (db.get("quotes").find({id: ID}).value() != undefined) {
                return message.reply(`Quote já criado, caso queira edita-lo use: editar <id> <mensagem>`)
            }

            MENSAGEM = `\nQuote #${ID}\n\n` + MENSAGEM;

            db.get("quotes").push({
                id: ID,
                mensagem: MENSAGEM
            }).write()

            let enviar = db.get("quotes").find({id: ID}).value();

            if (enviar == undefined) {
                return message.reply(`Não foi possível criar o Quote #${ID}`);
            } else {
                return message.reply(enviar.mensagem);
            }
        }

        //Edita Quote - Use: editar <id> <mensagem>
        if (opcao.startsWith('edit')) {
            if (!args[2]) return message.reply('Use: quote edit <id> <mensagem>');

            let MENSAGEM = message.content.slice(13), ID = args[1];

            MENSAGEM = `Quote #${ID}\n` + MENSAGEM;

            db.get("quotes").find({id: ID}).assign({mensagem: MENSAGEM}).write();

            let editou = db.get("quotes").find({id: ID}).value();

            if (editou.mensagem == MENSAGEM) {
                return message.reply(`Quote #${ID} editado com sucesso!`);
            } else {
                return message.reply(`Não foi possível editar o Quote #${ID}.`);
            }
        }

        //Deleta Quote
        if (opcao.startsWith('del')) {
            if (!args[1]) return message.reply('Use: quote del <id>');

            let ID = args[1];

            db.get("quotes").find({id: ID}).assign({mensagem: ""}).write();

            let deletou = db.get("quotes").find({id: ID}).value();

            if (deletou.mensagem == "") {
                    return message.reply(`Quote #${ID} deletado com sucesso!`);
            } else {
                    return message.reply(`Não foi possível remover o Quote #${ID}.`)
            }
        }
        let ID = args[0];
        let enviar = db.get('quotes').find({id: ID}).value();
        
        if (enviar == undefined) {
            return message.reply(`Quote #${ID} não existe use: quote add <mensagem>`);
        } else if (enviar.mensagem == "") {
            return message.reply(`O Quote #${ID} está vazio. Use: quote edit <id> <mensagem>`);  
        } else {
            return message.reply(enviar.mensagem);
        }
    }
});
