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
            return message.reply(`Use: quote [add/edit/list/download/del]`);
        }

        const itens = db.get('quotes').value().length

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

            if (enviar == undefined || enviar.mensagem == "") {
                return message.reply(`Não foi possível criar o Quote #${ID}`);
            } else {
                return message.reply(enviaMensagem(ID));
            }
            
        }

        //Edita Quote - Use: editar <id> <mensagem>
        if (opcao.startsWith('edit')) {
            if (!args[2]) return message.reply('Use: quote edit <id> <mensagem>');

            let MENSAGEM = message.content.slice(13), ID = args[1];

            MENSAGEM = `\n**Quote #${ID}**\n\n` + MENSAGEM;

            db.get("quotes").find({id: ID}).assign({mensagem: MENSAGEM}).write();

            let editou = db.get("quotes").find({id: ID}).value();

            if (editou.mensagem == MENSAGEM) {
                message.reply(`Quote #${ID} editado com sucesso!`);
                return message.reply(enviaMensagem(ID))
            } else {
                return message.reply(`Não foi possível editar o Quote #${ID}.`);
            }
        }

        //Lista todos os Quotes em uma mensagem no privado de quem mandou
        if (opcao.startsWith('list')) {
            const MENSAGENS = db.get("quotes").map("mensagem").value();
            const acessoDM = client.users.cache.get(message.author.id);
            
            const Data = new Date()
            let data = Data.toLocaleDateString('pt-br', {month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'})
            data = data.split(" ")
            data[4] = data[3]
            data[3] = "às"
            acessoDM.send('Quotes enviados em **`' + data.toString().replace(/,/g, ' ') + '`**')

            for (let i = 0; i < MENSAGENS.length; i++) {
                acessoDM.send(enviaEmbed(MENSAGENS[i]))
            }

            return message.reply('Quotes enviados na sua DM');
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

        //Mostra todos os comandos e suas utilizacoes
        if (opcao.startsWith('help')) {
            const mensagem = '```md\n1. quote add <mensagem>       : < Adiciona um quote com a mensagem >\n2. quote edit <id> <mensagem> : < Edita um quote ja existente >\n3. quote list                 : < Lista todos os quotes no privado >\n4. quote del <id>             : < Deleta um quote existente >\n5. quote <id>                 : < Mostra o quote no chat >\n6. ola                        : < O bot e educado! >\n```'

            return message.reply(mensagem);
        }

        //Manda o link para adicionar o bot a um servidor
        if (opcao.startsWith('link')) {
            message.channel.send('https://discord.com/oauth2/authorize?client_id=807816311463346186&scope=bot');
        }

        //Sortea um quote
        if (opcao.startsWith('alea') || opcao.startsWith('sort')) {
            let ID = Math.floor(Math.random() * (itens)) + 1
            let Sorteado = db.get('quotes').find({id: ID.toString()}).value()
            
            let aleatorio = new Discord.MessageEmbed()
            .setColor('#f5ff00')
            .setAuthor('QuoteBot', 'https://i.pinimg.com/originals/4d/59/75/4d5975b1a506f5b5f3bafe158e3ad260.jpg')
            .setDescription(Sorteado.mensagem);

            message.reply(aleatorio)
        }

        //Manda o quote requisitado
        if (opcao >= 1 && opcao <= itens) {
            return message.reply(enviaMensagem(args[0]))
        }

        //Envia o arquivo quote.json
        if (opcao.startsWith('down')) {
            message.channel.send("Testing message.", { files: ["./quote.json"] });
        }
    }
});

function enviaMensagem(ID) {
    let enviar = db.get('quotes').find({id: ID}).value();
    
    if (enviar == undefined) {
        return message.reply(`Quote #${ID} não existe use: quote add <mensagem>`);
    } else if (enviar.mensagem == "") {
        return message.reply(`O Quote #${ID} está vazio. Use: quote edit <id> <mensagem>`);
    }

     const embed = new Discord.MessageEmbed()
    .setColor('#f5ff00')
    .setAuthor('QuoteBot', 'https://i.pinimg.com/originals/4d/59/75/4d5975b1a506f5b5f3bafe158e3ad260.jpg')
    .setDescription(enviar.mensagem);

    return embed
}

function enviaEmbed(quote) {

    const embed = new Discord.MessageEmbed()
    .setColor('#f5ff00')
    .setAuthor('QuoteBot', 'https://i.pinimg.com/originals/4d/59/75/4d5975b1a506f5b5f3bafe158e3ad260.jpg')
    .setDescription(quote);

    return embed
}
