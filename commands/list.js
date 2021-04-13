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

    for (let i = 0; i < MENSAGENS.length; i++) {
      if (MENSAGENS[i] != "") {
        let embed = new Discord.MessageEmbed()
          .setColor("#f5ff00")
          .setAuthor(
            "QuoteBot",
            "https://i.pinimg.com/originals/4d/59/75/4d5975b1a506f5b5f3bafe158e3ad260.jpg"
          )
          .setDescription(MENSAGENS[i]);

        acessoDM.send(embed);
      }
    }

    return message.reply("Quotes enviados na sua DM");
  },
};
