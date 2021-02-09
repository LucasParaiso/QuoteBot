//adicionar o comando quote list
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

    if (!db.has("quotes").value()) {
        db.set("quotes", []).write();
    }
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
            return message.reply(`Use: quote [add/edit/list/del]`);
        }

        //Cria Quote - Use: criar <mensagem>
        if (opcao.startsWith('ad')) {
            if (!args[1]) return message.reply('Use: quote add <mensagem>');

            let i, eParaCriar = true;
            let MENSAGEM = message.content.slice(10);
            const verificaMensagem = db.get("quotes").map("mensagem").value();

            for (i = 0; i < verificaMensagem.length; i++) {
                if (verificaMensagem[i] == "") {
                    eParaCriar = false;
                    break;
                }
            }

            let ID = i + 1;
            ID = ID.toString();

            MENSAGEM = `\n**Quote #${ID}**\n\n` + MENSAGEM;

            if (eParaCriar) {
                db.get("quotes").push({
                    id: ID,
                    mensagem: MENSAGEM
                }).write()
            } else {
                db.get("quotes").find({id: ID}).assign({mensagem: MENSAGEM}).write();
            }

            const enviar = db.get("quotes").find({id: ID}).value();

            const embed = new Discord.MessageEmbed()
            .setColor('#f5ff00')
            .setAuthor('QuoteBot', 'https://cdn.discordapp.com/app-icons/808534981613322240/8d66d8deb855c7b32496abf07d80e14c.png?size=256')
            .setDescription(enviar.mensagem);

            if (enviar == undefined || enviar.mensagem == "") {
                return message.reply(`Não foi possível criar o Quote #${ID}`);
            } else {
                return message.reply(embed);
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

        //Lista todos os Quotes em uma mensagem no privado de quem mandou
        if (opcao.startsWith('list')) {
            const MENSAGENS = db.get("quotes").map("mensagem").value();
            let vazio = true;
            const acessoDM = client.users.cache.get(message.author.id);

            for (let i = 0; i < MENSAGENS.length; i++) {
                if (MENSAGENS[i].length > 1) {
                    const embed = new Discord.MessageEmbed()
                    .setColor('#f5ff00')
                    .setAuthor('QuoteBot', 'https://cdn.discordapp.com/app-icons/808534981613322240/8d66d8deb855c7b32496abf07d80e14c.png?size=256')
                    .setDescription(MENSAGENS[i]);

                    acessoDM.send(embed);
                    vazio = false
                }
            }
            if (!vazio) {
                return message.reply('Quotes enviados na sua DM');
            } else {
                return message.reply('Nenhum Quote encontrado, Use: quote add <mensagem>');
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
        
        const embed = new Discord.MessageEmbed()
        .setColor('#f5ff00')
        .setAuthor('QuoteBot', 'https://cdn.discordapp.com/app-icons/808534981613322240/8d66d8deb855c7b32496abf07d80e14c.png?size=256')
        .setDescription(enviar.mensagem);

        if (enviar == undefined) {
            return message.reply(`Quote #${ID} não existe use: quote add <mensagem>`);
        } else if (enviar.mensagem == "") {
            return message.reply(`O Quote #${ID} está vazio. Use: quote edit <id> <mensagem>`);  
        } else {
            return message.reply(embed);
        }
    }
   
});