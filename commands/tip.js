var Discord = require('discord.js');
module.exports ={
	help: "/tip",
	description: "Tip another user with a certain amount of coin.",
	channels: [ "emberbot-testing" ],
	dm_only: false,
	dm_allowed: true,
	status: true,
	command: function(msg, args="", ember=[]){
        var Discord = require('discord.js');
		args.shift();
		msg.channel.send("Processing a Tip from "+ msg.author.username)
            .then(function(message){
                if ( ember.helpers.commands.isFloat(args[0] ))
                {
                    var amount = args[0];
                    var balance = 0;
                    ember.db.then(function(connection){
                        connection.query("SELECT balance from users where user_id = " + msg.author.id)
                            .then(function(result)
                            {
                                balance = result[0].balance;
                                if(balance < amount){
                                    var embed = new Discord.RichEmbed()
                                        .setThumbnail(ember.config.general.logo)
                                        .setColor('0x7289DA')
                                        .setDescription(":money_with_wings: __***Verification Issue!***__\n")
                                        .addField("__There was an error in your request:__", "You attempted to tip more than you currently have available! ", false)
                                        .addField("Details:", "Balance: " + balance + " | Tip Amount: " + amount);
                                    message.edit('', {
                                        embed
                                    })
                                }else {
                                    args.shift();

                                    var userRec = ember.helpers.commands.getUser(ember, args)[0].slice(2, -1)
                                    console.log(userRec);
                                    connection.query("SELECT count(*) from users where user_id = " + userRec)
                                        .then( function (result)
                                        {

                                            if (result[0]['count(*)'] > 0) {
                                                connection.query("SELECT user_id, balance from users where user_id = " + userRec)
                                                    .then( function (result2)
                                                    {
                                                        console.log('add ' + amount + " to " + result2[0].balance + " on user " + userRec);
                                                        connection.query("UPDATE users SET balance = " + (parseFloat(result2[0].balance) + parseFloat(amount)) + " WHERE user_id = " + userRec)
                                                            .then(function() {
                                                                connection.query("UPDATE users SET balance = " + (balance - amount) + " WHERE user_id = " + msg.author.id);
                                                            })
                                                            .catch(function(err)
                                                            {
                                                                console.log(userRec);
                                                                if(err) throw err;
                                                            });
                                                    }).catch(function(err){
                                                        console.log(err);
                                                })
                                            } else {
                                                connection.query("INSERT INTO users (user_id) VALUES (" + userRec + ")")
                                                    .then(function () {
                                                        connection.query("UPDATE users SET balance = " + (amount) + " WHERE user_id = " + userRec)
                                                            .then( function() {
                                                                connection.query("UPDATE users SET balance = " + (balance - amount) + " WHERE user_id = " + msg.author.id);
                                                            }).catch(function(err){
                                                                console.log(userRec);
                                                                if(err) throw err;
                                                        });
                                                })
                                            }
                                            var embed = new Discord.RichEmbed()
                                                .setThumbnail(ember.config.general.logo)
                                                .setColor('0x7289DA')
                                                .setDescription(":money_with_wings: __***Tipping Funds!***__\n")
                                                .addField("__EmberCoin (POS):__", "Just tipped " + amount + " EMB to " + ember.helpers.commands.getUserFromID(ember, userRec) + "! ", false)
                                            message.edit('', {
                                                embed
                                            })
                                        })
                                }
                            });
                    })


                }else{
                    console.log('not a float');
                    message.edit("Verification issue: You did not provide a value input, needs to be a float. Examples: 5 5.0 0.5 etc");
                }
            }).catch(function(err){
            message.edit("There was an error: " + err);
        });



	}
};