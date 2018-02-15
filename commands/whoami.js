var Discord = require('discord.js');
module.exports ={
	help: "/whoami",
	description: "Testing Command",
	channels: [ "bot-testing" ],
	dm_only: false,
	dm_allowed: true,
	command: function(msg, args="", ember=[]){
		if(ember.config.general.admins.indexOf(msg.author.id) >= 0){
			msg.channel.send("This command is not setup yet");
		}
	}
};