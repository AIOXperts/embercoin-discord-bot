var Discord = require('discord.js');
helper = require('../functions/commands.js');
module.exports ={
	help: "/help <subcommand>",
	description: "This is the Help command to give information about each type of command.",
	dm_only: false,
	dm_allowed: true,
	command: function(msg, args="", ember=[]){
		var prefix = ember.config.general.prefix;
			var embed = new Discord.RichEmbed()
				.setTitle("Help")
				.setThumbnail(ember.config.general.logo)
				.setColor('0x7289DA')
				.addField(prefix + "cc", "Lists a number of different currencies and their market values", false)
				.addField(prefix + "tip <amount> <user>", "Send some funds to another user", false)
				.addField(prefix + "rain <amount>", "Send funds to all users who are active", false)
				.addField(prefix + "balance", "Gets your current balance", false)
				.addField(prefix + "getblock", "Returns the current blockheight of Ember", false)
				.setTimestamp()
			  msg.channel.send({
				embed
			  });
	}
};