var Discord = require('discord.js');
helper = require('../functions/commands.js');
module.exports ={
	help: "/activeusers <subcommand>",
	description: "This is the Help command to give information about each type of command.",
	dm_only: false,
	dm_allowed: true,
	status: true,
	command: function(msg, args="", ember=[]){
        var userids = [];
        console.log(msg.channel.guild.members);
        for (i = 0; i < msg.channel.guild.presences.keyArray().length; i++) {
            var userid = msg.channel.guild.presences.keyArray()[i];
            if (msg.channel.guild.presences.array()[i].status == "online") {
                userids.push(userid);
            }
        }
        //msg.channel.send(userids);
        //console.log(userids);
    }

};