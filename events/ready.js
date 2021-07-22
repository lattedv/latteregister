const chalk = require('chalk');
const moment = require('moment');
const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');

var prefix = ayarlar.prefix;

module.exports = client => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] LATTE ALTYAPI: Aktif, Komutlar yüklendi!`);
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] LATTE ALTYAPI: ${client.user.username} İsmi İle Giriş Yapıldı!`);
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] LATTE ALTYAPI: HER DAİM SİZLERLE`);//BURALARI DEĞİŞTİRE BİLİRSİNİZ 
  client.user.setStatus("dnd");
  //idle : Boşta dnd : rahatsız Etmeyin online : çevrimiçi
 client.user.setActivity("Latte🧡Diaz", { type: "WATCHING" });
  // PLAYING : oynuyur LISTENING : dinliyor  WATCHING : İZLİOR 
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] LATTE ALTYAPI: Oyun ismi ayarlandı!`);
};


