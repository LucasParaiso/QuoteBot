module.exports = {
  name: "list",
  description: "Lista todos os quotes na sua DM",
  execute(message, args) {
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
      acessoDM.send(enviaEmbed(MENSAGENS[i]));
    }

    return message.reply("Quotes enviados na sua DM");
  },
};
