const Discord = require('discord.js');

exports.run = async(yashinu, message, args) => {
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(new Discord.MessageEmbed().setColor("BLUE").setDescription(`**\<a:nani:858286151407239168> | Bu komutu kullanabilmek için gerekli yetkiye sahip değilsin!**`)).then(beta => beta.delete({timeout: 3000}));
  if (!args[0] || isNaN(args[0])) return message.reply(`**\<a:nani:858286151407239168> |  Temizlenecek mesaj miktarını belirtmelisin!**`).then(beta2 => beta2.delete({timeout: 3000}));;
  message.delete();
  let rexussayi = Number(args[0]);
  let rexussilinen = 0;
  for (var i = 0; i < (Math.floor(rexussayi/100)); i++) {
    message.channel.bulkDelete(100).then(r => rexussilinen+=r.size);
    rexussayi = rexussayi-100;
  };
  if (rexussayi > 0)  message.channel.bulkDelete(rexussayi).then(r => rexussilinen+=r.size);
  message.channel.send(`**\<a:yes:858286551761813504> | \`\`${args[0]}\`\` adet mesaj silindi.**`).then(beta3 => beta3.delete({timeout: 5000}));
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["temizle", "sil"],
  permLevel: 0
};

exports.help = { 
  name: 'sil',
  description: 'Belirtilen miktarda mesajı temizler. (Beta <3)',
  usage: 'temizle <miktar>',
  kategori: 'yetkili'
};