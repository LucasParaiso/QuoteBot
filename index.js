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

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
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
});
