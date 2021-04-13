const fs = require("fs");
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("quote.json");
const db = low(adapter);

const client = new Discord.Client();
client.commands = new Discord.Collection();

client.once("ready", () => {
  console.log("Pronto!");
});

client.login(token);

client.on("guildCreate", () => {
  db.set(guild.id, []).write();

  if (!db.has("quotes").value()) {
    db.set("quotes", []).write();
  }
});

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("message", async (message) => {
  if (message.author.bot) return;

  const args = message.content.split(/ +/);
  const prefixo = args.shift();
  const commandName = args.shift().toLowerCase();

  if (parseInt(commandName)) {
    return message.reply(enviaMensagem(commandName));
  }

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;

  if (command.args && !args.length) {
    let reply = `Informações insuficientes, `;
    if (command.usage) {
      reply += `\nUse: \`${prefix}${command.name} ${command.usage}\``;
    }
    return message.channel.send(reply);
  }

  try {
    command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply("Houve um erro na execução desse comando!");
  }

  function enviaMensagem(ID) {
    const enviar = db.get("quotes").find({ id: ID }).value();

    if (enviar == undefined) {
      return `Quote #${ID} não existe use: quote add <mensagem>`;
    } else if (enviar.mensagem == "") {
      return `O Quote #${ID} está vazio. Use: quote edit <id> <mensagem>`;
    }

    const embed = new Discord.MessageEmbed()
      .setColor("#f5ff00")
      .setAuthor(
        "QuoteBot",
        "https://i.pinimg.com/originals/4d/59/75/4d5975b1a506f5b5f3bafe158e3ad260.jpg"
      )
      .setDescription(enviar.mensagem);

    return embed;
  }
});
