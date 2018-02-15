var Discord = require('discord.js');
module.exports ={
	help: "/wallet",
	description: "Get info from the wallet's daemon.",
	dm_only: true,
	dm_allowed: true,
	command: function(msg, args="", ember=[]){
		altcoin
			.set('host', ember.config.emberWallet.host)
			.set({port: ember.config.emberWallet.port});

		altcoin.auth(ember.config.emberWallet.username, ember.config.emberWallet.password)
		altcoin.exec('getinfo', function(err, balance) {
			console.log(balance);
			var embed = new Discord.RichEmbed()
				.setThumbnail(ember.config.general.logo)
				.setColor('0x7289DA')
				.setDescription(":money_with_wings: __***EmberCoin Wallet***__\n")
				.addField(":chart_with_upwards_trend: __EmberCoin (POS):__", balance, false)

			msg.channel.send('', {
				embed
			})
		})
	}
};