const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const moment = require("moment");
const chalk = require("chalk");
const ayarlar = require("./ayarlar.json");
var prefix = ayarlar.prefix;

require('./util/eventLoader')(client);



const log = message => {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};



client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});

client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
}

client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});


//BOTU SESE SOKMA
client.on("ready", async() => {
    let botVoiceChannel = client.channels.cache.get(ayarlar.seskanal);
    console.log("Bot Ses Kanalına bağlandı!");
    if (botVoiceChannel)
        botVoiceChannel
        .join()
        .catch(err => console.error("Bot ses kanalına bağlanamadı!"));
});




client.login(ayarlar.token);

//GİRİŞ MESAJ

client.on("guildMemberAdd", member => {
    require("moment-duration-format");


    var üyesayısı = member.guild.members.cache.size
        .toString()
        .replace(/ /g, "    ");
    var üs = üyesayısı.match(/([0-999])/g);
    üyesayısı = üyesayısı.replace(/([a-zA-Z])/g, "bilinmiyor").toLowerCase();
    if (üs) {
        üyesayısı = üyesayısı.replace(/([0-9999])/g, d => {
            return {

            }[d];
        });
    }
    const kanal = member.guild.channels.cache.find(
        r => r.id === "KAYIT KANALI İD"
    );
    let user = client.users.cache.get(member.id);
    require("moment-duration-format");
    let memberDay = Date.now() - member.user.createdTimestamp;
    let createAt = moment
        .duration(memberDay)
        .format("Y [Yıl], M [ay], W [hafta], DD [gün]");
    let createAt2 = moment
        .duration(memberDay)
        .format("DD [gün], HH [saat], mm [dakika]");
    if (memberDay > 604800000) {}
    const kurulus = new Date().getTime() - user.createdAt.getTime();
    const gecen = moment
        .duration(kurulus)
        .format(
            ` YY **[Yıl,]** DD **[Gün,]** HH **[Saat,]** mm **[Dakika,]** ss **[Saniye]**`
        );
    var kontrol;
    if (kurulus < 1296000000)
        kontrol =
        "**🤨 Hesap **__Güvenilir Gözükmüyor.__**";
    if (kurulus > 1296000000)
        kontrol = "** 😀 __Hesap Güvenli.__**";
    moment.locale("tr");
    kanal.send(
        `
SANCTUS SUNUCUSUNA HOŞGELDİN

 Hoşgeldin <@` +
        member +
        `>  Seninle **${member.guild.memberCount}** Kişiyiz

  Sunucuya Kayıt Olmak İçin Sol Taraftaki <#KAYIT SES KANAL İD> Odalarına Geçiş Yapabilirsin      

   Tagımızı Alarak Bizi Mutlu Edebilirsin \`${ayarlar.tag}\` 

 Tagımızı Alırsan Çekilişlerde Kazanma Şansın Daha Fazla Olur

 Tagmızı Alırsan <@&tag rol id> Rolüne Sahip Olursun 

  Bu Roldeki Arkadaşlarım Seninle İlgilenecektir  <@&kayıtcı id> 

 Hesabın __**${createAt}**__ Önce Açılmış.

` +
        kontrol +
        `**`
    );
});


// OTOROL ve OTO İSİM

client.on("guilMemberAdd", member => {

    member.roles.add(ayarlar.kayıtsız);

    member.setNickname(ayarlar.kayıtsızisim)
});



//tag mesaj

client.on("message", sanctus => {
    if (sanctus.content.toLowerCase() === "tag") {
        //TAG
        sanctus.channel.send("Tagınız");
    }
});

client.on("message", sanctus => {
    if (sanctus.content.toLowerCase() === ".tag") {
        //TAG
        sanctus.channel.send("Tagınız");
    }
});


client.on("message", sanctus => {
    if (sanctus.content.toLowerCase() === "!tag") {
        //TAG
        sanctus.channel.send("Tagınız");
    }
});

//TAG ROL
client.on("userUpdate", async function(oldUser, newUser) {
    const guildID = ayarlar.sunucu //Sunucunuz
    const roleID = ayarlar.taglırolu //taglırolü
    const tag = ayarlar.tag
    const chat = ayarlar.genelchat // chat
    const log2 = ayarlar.taglog // log kanalı

    const guild = client.guilds.cache.get(guildID)
    const role = guild.roles.cache.find(roleInfo => roleInfo.id === roleID)
    const member = guild.members.cache.get(newUser.id)
    const embed = new Discord.MessageEmbed().setAuthor(member.displayName, member.user.avatarURL({ dynamic: true })).setColor('#ff0000').setTimestamp().setFooter('SANCTUS TAG ROL SİSTEMİ');
    if (newUser.username !== oldUser.username) {
        if (oldUser.username.includes(tag) && !newUser.username.includes(tag)) {
            member.roles.remove(roleID)
            client.channels.cache.get(log2).send(embed.setDescription(` ${newUser} isminden ${ayarlar.tag} çıkartarak ailemizden ayrıldı!`))
        } else if (!oldUser.username.includes(tag) && newUser.username.includes(tag)) {
            member.roles.add(roleID)
            client.channels.cache.get(chat).send(`Tebrikler, ${newUser} tag alarak ailemize katıldı ona sıcak bir **'Merhaba!'** diyin.(${tag})`)
            client.channels.cache.get(log2).send(embed.setDescription(`  ${newUser} ismine ${ayarlar.tag} alarak ailemize katıldı`))
        }
    }
    if (newUser.discriminator !== oldUser.discriminator) {
        if (oldUser.discriminator == "etiket yazınız" && newUser.discriminator !== "etiket yazınız") {
            member.roles.remove(roleID)
            client.channels.cache.get(log2).send(embed.setDescription(`  <@!' + newUser + '> etiketinden \`1903\` çıakrtarak ailemizden ayrıldı!`))
        } else if (oldUser.discriminator !== "etiket yazınız" && newUser.discriminator == "etiket yazınız") {
            member.roles.add(roleID)
            client.channels.cache.get(log2).send(embed.setDescription(`  <@!' + newUser + '> etiketine \`1903\` alarak ailemize katıldı`))
            client.channels.cache.get(chat).send(`Tebrikler, ${newUser} tag alarak ailemize katıldı ona sıcak bir **'Merhaba!'** diyin.(#0099)`)
        }
    }

})
client.on('ready', () => {
    client.channels.cache.get('867728635598077962').join();
});


//TAG ROL SİSTEMİ LROWSTAN ALINMIŞTIR BEN TARAFINDA DEĞİŞTİRİLMİŞTİR DEĞİŞTİRİLMİŞTİR


//sayaç