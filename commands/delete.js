module.exports = {
  name: "delete",
  description: "Deleta um quote",
  execute(message, args) {
    if (!args[1]) return message.reply("Use: quote del <id>");

    let ID = args[1];

    db.get("quotes").find({ id: ID }).assign({ mensagem: "" }).write();

    let deletou = db.get("quotes").find({ id: ID }).value();

    if (deletou.mensagem == "") {
      return message.reply(`Quote #${ID} deletado com sucesso!`);
    } else {
      return message.reply(`Não foi possível remover o Quote #${ID}.`);
    }
  },
};
