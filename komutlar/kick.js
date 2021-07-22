const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json')

exports.run = async (bot, message, args) => {
var prefix = ayarlar.prefix;             
    
  if (!message.member.permissions.has("KICK_MEMBERS")) return message.channel.send(new Discord.MessageEmbed() .setTitle("Hata!") .setDescription("**\<a:nani:858286151407239168> | Bu komutu kullanamazsınız!**"));

  
	let user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.client.users.cache.find(m => m.username === args.slice(0).join(" ")) || message.author;
  let reason = args.slice(1).join(' ');
  
  if (message.mentions.users.size < 1) return message.channel.send(new Discord.MessageEmbed() .setTitle("Hata!") .setDescription("**\<a:nani:858286151407239168> | Birini etiketlemeyi unuttunuz.**"));
  if (user.id === message.author.id) return message.channel.send('Kendini atamazsın.');
if (user.position > message.member.roles.highest.position) return message.channel.send(`Bu kullanıcının senin rollerinden/rolünden daha yüksek rolleri/rolü var.`);
			    if (!reason) reason = 'NONE'
    if (!user) return message.channel.send()
    let member = message.guild.member(user)
    if (!member) return message.channel.send()

 if (!message.guild.member(user).bannable) return message.channel.send(new Discord.MessageEmbed() .setTitle("Hata!") .setDescription("**\<a:nani:858286151407239168> | Etiketlediğiniz kişiyi atamıyorum.**"));

   if (!message.guild.member(user).bannable) return message.channel.send();
    message.guild.member(user).kick(reason);
message.channel.send(new Discord.MessageEmbed() .setTitle("Harika!") .setDescription(`<@${user.id}> Adlı kullanıcı \`${reason}\` sebeten dolayı atılmıştır`));


};

exports.conf = {
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'kick'
};