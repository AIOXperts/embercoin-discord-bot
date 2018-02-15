var Discord = require('discord.js');
module.exports ={
	help: "/rain",
	description: "Rain to all users that aren't idle.",
	dm_only: false,
	dm_allowed: false,
	status: true,
	command: function(msg, args="", ember=[]){
		args.shift();
        var Discord = require('discord.js');
        var balance = 0;
        var embed = new Discord.RichEmbed()
            .setThumbnail(ember.config.general.logo)
            .setColor('0x7289DA')
            .setDescription(":money_with_wings: __***Processing a rain-storm from "+ msg.channel.username +"!***__\n")
            .addField("__There was an error in your request:__", "You attempted to rain more than you currently have available! ", false)
        msg.channel.send('', {
            embed
        }).then(function(message){
            if ( ember.helpers.commands.isFloat(args[0] )){
                var origAmount = args[0];
                ember.db.then(function(connection){
                    connection.query("SELECT * FROM users where user_id = " + msg.author.id)
                        .then(function (result)
                        {
                            balance = result[0].balance;
                            if(balance < origAmount || origAmount == 0){
                                var embed = new Discord.RichEmbed()
                                    .setThumbnail(ember.config.general.logo)
                                    .setColor('0x7289DA')
                                    .setDescription(":money_with_wings: __***Verification Issue!***__\n")
                                    .addField("__There was an error in your request:__", "You attempted to rain more than you currently have available! ", false)
                                    .addField("Details:", "Balance: " + balance + " | RainAmount: " + origAmount);
                                message.edit('', {
                                    embed
                                })
                            }else {
                                args.shift();
                                var userids = [];
                                for (i = 0; i < msg.channel.guild.presences.keyArray().length; i++) {
                                    var userid = msg.channel.guild.presences.keyArray()[i];
                                    if (msg.channel.guild.presences.array()[i].status == "online") {
                                        userids.push(userid);
                                    }
                                }
                                console.log(userids);
                                var amount = origAmount / (userids.length - 1);
                                userids.forEach(function (userid) {
                                    if (userid != msg.author.id) {
                                        connection.query("SELECT count(*) from users where user_id = " + userid)
                                            .then(function (result2)
                                            {
                                                if (result2[0]['count(*)'] > 0) {
                                                    connection.query("SELECT user_id, balance from users where user_id = " + userid)
                                                        .then(function (result3) {
                                                            connection.query("UPDATE users SET balance = " + (result3[0].balance + amount) + " WHERE user_id = " + userid).catch(function(err){
                                                                message.edit('There was an error updating your account from this this storm!');
                                                                console.log(err);
                                                            });
                                                        }).catch(function(err){
                                                            message.edit('There was an error processing this storm!');
                                                            console.log(err);
                                                    })
                                                } else {
                                                    connection.query("INSERT INTO users (user_id) VALUES (" + userid + ")")
                                                        .then(function (result) {
                                                         connection.query("UPDATE users SET balance = " + (amount) + " WHERE user_id = " + userid);
                                                    }).catch(function(err){
                                                     message.edit("There was an error updating your account");
                                                });
                                                }
                                            //console.log('sent');
                                            })
                                    }
                                })
                                connection.query("UPDATE users SET balance = " + (balance - origAmount) + " WHERE user_id = " + msg.author.id);
                                var embed = new Discord.RichEmbed()
                                    .setThumbnail(ember.config.general.logo)
                                    .setColor('0x7289DA')
                                    .setDescription(":money_with_wings: __***Rain Storm!***__\n")
                                    .addField("__EmberCoin (POS):__", "Just rained " + amount + " EMB to " + (userids.length-1) + " active users! ", false)
                                message.edit('', {
                                    embed
                                })
                            }
                        }).catch(function(err){
                        console.log(err);
                    });
                });
            }else{
                console.log('not a float');
            }
        })


	}
};