module.exports = {
  name: "show",
  aliases: ['s', 'S'],
  usage: '<id>',
  description: "Mostra o quote requisitado",
  execute(message, args) {
    const Discord = require("discord.js");
    const low = require("../node_modules/lowdb");
    const FileSync = require("../node_modules/lowdb/adapters/FileSync");
    const adapter = new FileSync("quote.json");
    const db = low(adapter);

    let ID = args[0];
    let enviar = db.get("quotes").find({ id: ID }).value();

    if (enviar == undefined) {
      return message.reply(`Quote #${ID} não existe use: quote add <mensagem>`);
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

    return message.reply(embed);
  },
};
