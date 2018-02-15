var Discord = require('discord.js');
module.exports ={
	help: "/getBlockCount",
	description: "Tip another user with a certain amount of coin.",
	dm_only: false,
	dm_allowed: true,
	status: true,
	command: function(msg, args="", ember=[]){
        var Discord = require('discord.js');
		args.shift();
        var wallet = require('../wallet-func.js').getOptions('EMB');
        var client = require('litecoin-promise');
        var altcoin = new client.Client({
            port: wallet.port,
            host: wallet.address,
            pass: wallet.password,
            user: wallet.username,
            timeout: 30000
        });
		msg.channel.send("Getting BlockCount from Ember Wallet.").then(
		    function(message){
                altcoin.getBlockCount().then(function(blockHeight) {
                    console.log(blockHeight);

                    message.edit("The BlockHeight is " + parseInt(blockHeight));
                }).catch(function(err){
                    message.edit("There was an error: " + err);
                    console.error(err);
                });
            }).catch(function(err){
            message.edit("There was an error: " + err);
        });



	}
};