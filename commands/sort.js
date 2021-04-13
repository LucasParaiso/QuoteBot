module.exports = {
  name: "sortear",
  aliases: ['sort', 'aleatorio', 'random', 'rand'],
  description: "Quote aleatório",
  usage: ' ',
  execute(message, args) {
    const Discord = require("discord.js");
    const low = require("../node_modules/lowdb");
    const FileSync = require("../node_modules/lowdb/adapters/FileSync");
    const adapter = new FileSync("quote.json");
    const db = low(adapter);

    let itens = db.get("quotes").value().length;
    let ID = Math.floor(Math.random() * itens) + 1;
    let Sorteado = db.get("quotes").find({ id: ID.toString() }).value();

    let aleatorio = new Discord.MessageEmbed()
      .setColor("#f5ff00")
      .setAuthor(
        "QuoteBot",
        "https://i.pinimg.com/originals/4d/59/75/4d5975b1a506f5b5f3bafe158e3ad260.jpg"
      )
      .setDescription(Sorteado.mensagem);

    message.reply(aleatorio);
  },
};
