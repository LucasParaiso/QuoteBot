module.exports = {
  name: "add",
  description: "Adiciona um quote com a mensagem enviada",
  args: true,
  usage: '<Mensagem>',
  aliases: ['adicionar', 'criar'],
  execute(message, args, db) {
    const func = require('../index')
    if (!args[0]) return message.reply("Use: quote add <mensagem>");

    let i,
      eParaCriar = true;
    let MENSAGEM = message.content.slice(10);
    const verificaMensagem = db.get("quotes").map("mensagem").value();

    for (i = 0; i < verificaMensagem.length; i++) {
      if (verificaMensagem[i] == "") {
        eParaCriar = false;
        break;
      }
    }

    let ID = i + 1;
    ID = ID.toString();

    MENSAGEM = `\n**Quote #${ID}**\n\n` + MENSAGEM;

    if (eParaCriar) {
      db.get("quotes")
        .push({
          id: ID,
          mensagem: MENSAGEM,
        })
        .write();
    } else {
      db.get("quotes").find({ id: ID }).assign({ mensagem: MENSAGEM }).write();
    }

    const enviar = db.get("quotes").find({ id: ID }).value();

    if (enviar == undefined || enviar.mensagem == "") {
      return message.reply(`Não foi possível criar o Quote #${ID}`);
    } else {
      return message.reply(func.enviaMensagem(ID));
    }
  },
};
