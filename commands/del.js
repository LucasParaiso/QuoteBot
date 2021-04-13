module.exports = {
  name: "del",
  aliases: ["delete", "deletar"],
  description: "Deleta um quote",
  usage: ' ',
  execute(message, args) {
    const Discord = require("discord.js");
    const low = require("lowdb");
    const FileSync = require("lowdb/adapters/FileSync");
    const adapter = new FileSync("quote.json");
    const db = low(adapter);

    if (!args[0]) return message.reply("Use: quote del <id>");

    let ID = args[0];

    db.get("quotes").find({ id: ID }).assign({ mensagem: "" }).write();

    let deletou = db.get("quotes").find({ id: ID }).value();

    if (deletou.mensagem == "") {
      return message.reply(`Quote #${ID} deletado com sucesso!`);
    } else {
      return message.reply(`Não foi possível remover o Quote #${ID}.`);
    }
  },
};
