module.exports = {
  name: "list",
  aliases: ["listar"],
  usage: " ",
  description: "Lista todos os quotes na sua DM",
  execute(message, args, client) {
    const Discord = require("discord.js");
    const low = require("../node_modules/lowdb");
    const FileSync = require("../node_modules/lowdb/adapters/FileSync");
    const adapter = new FileSync("quote.json");
    const db = low(adapter);

    const MENSAGENS = db.get("quotes").map("mensagem").value();
    const acessoDM = client.users.cache.get(message.author.id);

    const Data = new Date();
    let data = Data.toLocaleDateString("pt-br", {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
    data = data.split(" ");
    data[4] = data[3];
    data[3] = "às";

    acessoDM.send(
      "Quotes enviados em **`" + data.toString().replace(/,/g, " ") + "`**"
    );
    let enviar = []
        
    for (let i = 0; i < MENSAGENS.length; i++) {
      if (MENSAGENS[i] != "") {
        enviar += '\n\n--------------------\n'
        enviar += MENSAGENS[i]
      }
    }
    acessoDM.send(enviar, { split: true })
    return message.reply("Quotes enviados na sua DM");
  },
};
