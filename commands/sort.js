module.exports = {
  name: "sortear",
  description: "Quote aleatório",
  execute(message, args) {
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
