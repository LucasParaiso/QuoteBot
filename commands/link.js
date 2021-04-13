module.exports = {
  name: "link",
  description: "Link para adicionar o QuoteBot em outros servidores",
  usage: ' ',
  execute(message, args) {
    message.channel.send(
      "https://discord.com/oauth2/authorize?client_id=807816311463346186&scope=bot"
    );
  },
};
