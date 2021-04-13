module.exports = {
  name: "edit",
  aliases: ["editar"],
  description: "Edita um quote",
  usage: "<id> <mensagem>",
  execute(message, args) {
    const Discord = require("discord.js");
    const low = require("../node_modules/lowdb");
    const FileSync = require("../node_modules/lowdb/adapters/FileSync");
    const adapter = new FileSync("quote.json");
    const db = low(adapter);
    const itens = db.get("quotes").map("mensagem").value();

    if (!args[1]) return message.reply("Use: quote edit <id> <mensagem>");
    let ID = args[0];

    if (ID <= 0 || ID > itens.length)
      return message.reply("Use: quote edit <id> <mensagem>");

    let MENSAGEM = message.content.slice(14);

    MENSAGEM = `\n**Quote #${ID}**\n\n` + MENSAGEM;

    db.get("quotes").find({ id: ID }).assign({ mensagem: MENSAGEM }).write();

    let editou = db.get("quotes").find({ id: ID }).value();

    if (editou.mensagem == MENSAGEM) {
      message.reply(`Quote #${ID} editado com sucesso!`);
      return message.reply(enviaMensagem(ID));
    } else {
      return message.reply(`Não foi possível editar o Quote #${ID}.`);
    }

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
