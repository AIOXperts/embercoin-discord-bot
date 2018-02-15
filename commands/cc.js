var Discord = require('discord.js');
module.exports ={
	help: "/cc",
	description: "Returns the USD/EUR prices for various CryptoCurrencies.",
	channels: [ "bot-testing" ],
	dm_only: false,
	dm_allowed: true,
	command: function(msg, args="", ember=[]){
		Promise.all(requestMap())
			.then(e => Promise.all(e.map(single => single.json())))
			.then(e => {
				const resolvedCurrencies = e.map((single, index) => ({
					from: ember.general.currencies[index],
					resp: single
				}))
				// ALRIGHT! Now it's gettin' tricky. Just leave everything below this point if you don't 100% know what you're doing.
				const firstExchange = "**" + resolvedCurrencies[0].resp["EUR"] + " EUR** or **" + resolvedCurrencies[0].resp["USD"] + " USD**"
				const secondExchange = "**" + resolvedCurrencies[1].resp["EUR"] + " EUR** or **" + resolvedCurrencies[1].resp["USD"] + " USD**"
				const thirdExchange = "**" + resolvedCurrencies[2].resp["EUR"] + " EUR** or **" + resolvedCurrencies[2].resp["USD"] + " USD**"
				const fourthExchange = "**" + resolvedCurrencies[3].resp["EUR"] + " EUR** or **" + resolvedCurrencies[3].resp["USD"] + " USD**"
				const fifthExchange = "**" + resolvedCurrencies[4].resp["EUR"] + " EUR** or **" + resolvedCurrencies[4].resp["USD"] + " USD**"
				const sixthExchange = "**" + resolvedCurrencies[5].resp["EUR"] + " EUR** or **" + resolvedCurrencies[5].resp["USD"] + " USD**"
				const seventhExchange = "**" + resolvedCurrencies[6].resp["EUR"] + " EUR** or **" + resolvedCurrencies[6].resp["USD"] + " USD**"
				const eighthExchange = "**" + resolvedCurrencies[7].resp["EUR"] + " EUR** or **" + resolvedCurrencies[7].resp["USD"] + " USD**"
				const ninthExchange = "**" + resolvedCurrencies[8].resp["EUR"] + " EUR** or **" + resolvedCurrencies[8].resp["USD"] + " USD**"
				var embed = new Discord.RichEmbed()
					.setThumbnail(ember.config.general.logo)
					.setColor('0x7289DA')
					.setDescription(":money_with_wings: __***Current Crypto Currency Exchange***__\n***Note**: Info is provided by cryptocompare.com!\n")
					.addField(":chart_with_upwards_trend: __Bitcoin (POW):__", `Current exchange for ${resolvedCurrencies[0].from}\n` + firstExchange, false)
					.addField(":chart_with_upwards_trend: __Ethereum (POW):__", `Current exchange for ${resolvedCurrencies[1].from}\n` + secondExchange, false)
					.addField(":chart_with_upwards_trend: __Monero (POW):__", `Current exchange for ${resolvedCurrencies[2].from}\n` + thirdExchange, false)
					.addField(":chart_with_upwards_trend: __Litecoin (POW):__", `Current exchange for ${resolvedCurrencies[3].from}\n` + fourthExchange, false)
					.addField(":chart_with_upwards_trend: __QTUM (POS):__", `Current exchange for ${resolvedCurrencies[4].from}\n` + fifthExchange, false)
					.addField(":chart_with_upwards_trend: __XP (POS):__", `Current exchange for ${resolvedCurrencies[5].from}\n` + sixthExchange, false)
					.addField(":chart_with_upwards_trend: __EmberCoin (POS):__", `Current exchange for ${resolvedCurrencies[6].from}\n` + seventhExchange, false)
					.addField(":chart_with_upwards_trend: __AEON (POW):__", `Current exchange for ${resolvedCurrencies[7].from}\n` + eighthExchange, false)
					.addField(":chart_with_upwards_trend: __DOGE (POW):__", `Current exchange for ${resolvedCurrencies[8].from}\n` + ninthExchange, false)
					.setTimestamp()
				console.log('Crypto Currency Stats requested.')
				msg.channel.send('', {
					embed
				})
			})
			.catch(error => {
				console.log(error);
			});
	}
};