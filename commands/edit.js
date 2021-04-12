module.exports = {
  name: "edit",
  description: "Edita um quote",
  execute(message, args) {
    if (!args[1]) return message.reply("Use: quote edit <id> <mensagem>");

    let MENSAGEM = message.content.slice(13),
      ID = args[0];

    MENSAGEM = `\n**Quote #${ID}**\n\n` + MENSAGEM;

    db.get("quotes").find({ id: ID }).assign({ mensagem: MENSAGEM }).write();

    let editou = db.get("quotes").find({ id: ID }).value();

    if (editou.mensagem == MENSAGEM) {
      message.reply(`Quote #${ID} editado com sucesso!`);
      return message.reply(enviaMensagem(ID));
    } else {
      return message.reply(`Não foi possível editar o Quote #${ID}.`);
    }
  },
};
