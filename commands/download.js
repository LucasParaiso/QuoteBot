module.exports = {
  name: "download",
  description: "Envia os quotes para downlaod",
  aliases: ['backup'],
  execute(message, args) {
    message.channel.send("Quotes", { files: ["./quote.json"] });
  },
};
