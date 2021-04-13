const { prefix } = require("../config.json");

module.exports = {
  name: "help",
  description: "Lista todos os comandos e suas funcionalidades",
  aliases: ['comandos', 'ajuda'],
  usage: "<nome do comando>",
  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    if (!args.length) {
      data.push("Aqui está a lista de todos os meus comandos:\n");
      let tam = commands.size;
      data.push(commands.map((command) => command.name).join(","));

        console.log()

      let dataSplit = data[1].split(","), mensagem = [];
      for (let i = 0; i < tam; i++) {
        let nome = commands.get(dataSplit[i]) || commands.find((c) => c.aliases && c.aliases.includes(dataSplit[i]));
        mensagem[i] = `**${i + 1}. ${dataSplit[i]}** : ${nome.description}`;
      }      

      data[1] = (mensagem.toString().replace(/,/g, '\n'));
      data.push(
        `\nVocê pode usar \`${prefix}help <Nome do Comando>\` para obter informação de um comando específico`
      );

      return message.author
        .send(data, { split: true })
        .then(() => {
          if (message.channel.type === "dm") return;
          message.reply("Enviei todos os comandos na sua DM");
        })
        .catch((error) => {
          console.error(
            `Nao foi possivel mandar uma DM para ${message.author.tag}.\n`,
            error
          );
          message.reply(
            "Não tenho permissões para mandar mensagens no seu privado!"
          );
        });
    }
    const name = args[0].toLowerCase();
    const command =
      commands.get(name) ||
      commands.find((c) => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply("Esse comando não é válido!");
    }

    data.push(`**Comando:** ${command.name}`);

    if (command.aliases)
      data.push(`**Alternativas:** ${command.aliases.join(", ")}`);
    if (command.description) data.push(`**Descrição:** ${command.description}`);
    if (command.usage)
      data.push(`**Use:** ${prefix}${command.name} ${command.usage}`);

    message.channel.send(data, { split: true });
  },
};