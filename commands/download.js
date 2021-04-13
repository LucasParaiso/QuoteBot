module.exports = {
  name: "download",
  description: "Envia os quotes para downlaod",
  aliases: ['backup', 'down'],
  usage: ' ',
  execute(message, args) {
    message.channel.send("Quotes", { files: ["./quote.json"] });
  },
};
