module.exports = {
  name: "show",
  description: "Manda o quote requisitado",
  execute(message, args) {
    if (args[0] >= 1 && args[0] <= 90) {
      return message.reply(enviaMensagem(args[0]));
    }
  },
};
