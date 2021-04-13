module.exports = {
  name: "add",
  description: "Adiciona um quote com a mensagem enviada",
  usage: "<Mensagem>",
  aliases: ["adicionar", "criar"],
  execute(message, args) {
    const Discord = require("discord.js");
    const low = require("../node_modules/lowdb");
    const FileSync = require("../node_modules/lowdb/adapters/FileSync");
    const adapter = new FileSync("quote.json");
    const db = low(adapter);

    if (!args[0]) return message.reply("Use: quote add <mensagem>");

    let i,
      eParaCriar = true;
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
      db.get("quotes")
        .push({
          id: ID,
          mensagem: MENSAGEM,
        })
        .write();
    } else {
      db.get("quotes").find({ id: ID }).assign({ mensagem: MENSAGEM }).write();
    }

    return message.channel.send(enviaMensagem(ID))

    function enviaMensagem(ID) {
      let enviar = db.get("quotes").find({ id: ID }).value();

      if (enviar == undefined) {
        return message.reply(
          `Quote #${ID} não existe use: quote add <mensagem>`
        );
      } else if (enviar.mensagem == "") {
        return message.reply(
          `O Quote #${ID} está vazio. Use: quote edit <id> <mensagem>`
        );
      }

      const embed = new Discord.MessageEmbed()
        .setColor("#f5ff00")
        .setAuthor(
          "QuoteBot",
          "https://i.pinimg.com/originals/4d/59/75/4d5975b1a506f5b5f3bafe158e3ad260.jpg"
        )
        .setDescription(enviar.mensagem);

      return embed;
    }
  },
};
