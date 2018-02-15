module.exports ={
	help: "/balance",
	description: "Retrieve your balances from the wallet.",
	dm_only: false,
	dm_allowed: true,
	status: true,
	command: function(msg, args="", ember=[]){
		var Discord = require('discord.js');
		var wallet = require('../wallet-func.js').getOptions('EMB');
        var client = require('litecoin-promise');
        var altcoin = new client.Client({
			port: wallet.port,
            host: wallet.address,
            pass: wallet.password,
            user: wallet.username,
			timeout: 30000
        });

		ember.db.then(function(connection) {
            var embed = new Discord.RichEmbed()
                .setThumbnail(ember.config.general.logo)
                .setColor('0x7289DA')
                .setDescription(":money_with_wings: __***MyBalance***__\n")
                .addField(":chart_with_upwards_trend: __EmberCoin (POS):__", "Fetching EmberCoin", false)
                .addField("Add funds by sending Ember to:", "Fetching Address", false)
            msg.channel.send('', {
                embed
            }).then(function(message) {
                connection.query("SELECT count(*) as count FROM users where user_id = " + msg.author.id)
                    .then(function (count) {
                    	if(count[0].count == 0){
                    		connection.query("INSERT INTO users (user_id, balance) VALUES(" + msg.author.id + ", 0)")
								.then(function(result) {
									return result;
                                }).catch
                                (function(result){
									console.log(result);
								})
						}

                    }).then(function(){
                    	connection.query("SELECT * FROM users where user_id = " + msg.author.id)
							.then(function(result){
								console.log("44: "+result);
								if (result[0].address == "") {
                                    altcoin.getNewAddress(msg.author.id)
                                        .then(function (addr) {
                                            console.log("line 49:",addr);
                                            return altcoin.validateAddress(addr)
                                        })
                                        .then(function (address) {
                                            console.log("line 53:",address.address);
                                            connection.query("UPDATE users SET address = '" + address.address + "' where user_id=" + msg.author.id)
                                                .then(function (result2) {
                                                    var newEmbed = new Discord.RichEmbed()
                                                        .setThumbnail(ember.config.general.logo)
                                                        .setColor('0x7289DA')
                                                        .setDescription(":money_with_wings: __***MyBalance***__\n")
                                                        .addField(":chart_with_upwards_trend: __EmberCoin (POS):__", result[0].balance, false)
                                                        .addField("Add funds by sending Ember to:", address.address, false)
                                                    message.edit(newEmbed)
                                                    console.log(result2);

                                                }).catch(function (err) {
                                                console.log(err);
                                            })
                                        })
                                        .catch(function (err) {
                                            console.log(msg.author.username + " had an error checking their balance!", err);
                                        })
                                } else {
                                    var newEmbed = new Discord.RichEmbed()
                                        .setThumbnail(ember.config.general.logo)
                                        .setColor('0x7289DA')
                                        .setDescription(":money_with_wings: __***MyBalance***__\n")
                                        .addField(":chart_with_upwards_trend: __EmberCoin (POS):__", result[0].balance, false)
                                        .addField("Add funds by sending Ember to:", result[0].address, false)
                                    message.edit(newEmbed)
                                }
							})
				}).catch(function(err){
                    console.log("Error finding user: " + msg.author.username + ". UserID: "+ msg.author.id+ "  Error: " + err);
                });
            }).catch(console.error);

        });
	}
};