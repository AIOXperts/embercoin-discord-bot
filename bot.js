//Requirements
var Discord = require('discord.js');
const moment = require('moment'),
	 fetch = require('node-fetch'),
	 jsonfile = require('jsonfile'),
	 querystring = require('querystring')
	 http = require('http')
	 mysql = require('promise-mysql');

	
//Configuration
var ember = [];
ember['helpers'] =[];
ember['helpers']['config'] = require('./functions/config.js');
ember['helpers']['commands'] = require('./functions/commands.js');
ember['config'] = ember.helpers.config.reloadConfig();
ember['client'] = new Discord.Client();
ember['emb'] =[];

//Load Wallet functions
ember['wallet'] = require('./wallet-func.js');


ember['db'] = mysql.createConnection({
	host: ember.config.mysql.host,
	user: ember.config.mysql.user,
	password: ember.config.mysql.password,
	database: ember.config.mysql.database
}).catch(function(err){
	if(ember.db && ember.db.end) ember.db.end();
	console.log(error);
});


function reloadCommands(){
	var activeCommands = [];
	var normalizedPath = require('path').join(__dirname, "commands");
	require('fs').readdirSync(normalizedPath).forEach(function(file){
		activeCommands.push(file.slice(0,-3));
		activeCommands[file.slice(0,-3)] = require("./commands/" + file);

	})
	return activeCommands;
}
ember['commands'] = reloadCommands();

// Bot settings
const aa_delay = '30000'; // The delay that will be used in the auto-update function of the bot
const version = "1.0";

const allowedChannels = [];
// End of settings


//Let's handle the magic of receiving the commands and passing them to the commands/<command>.js file.
ember.client.on('message', msg =>
{
	var prefix = ember['config'].general.prefix;
	if(msg.content.startsWith(prefix)){
		var msgcontent = msg.content.split(" ");
		msgcontent[0] = msgcontent[0].replace(prefix, "");
		if (ember.helpers.commands.isCommandActive(ember, msgcontent[0], msg.channel) && ember.helpers.commands.notBot(msg.author.username, ember.client)){
			if(ember.commands.indexOf(msgcontent[0])>= 0){
				ember.commands[msgcontent[0]].command(msg, msgcontent, ember);
			}
		}
	}
});



ember.client.on('ready', function() {

    setInterval(function() { // Starts the auto update of the bot
    }, aa_delay)  // Searches for the delay of the autoupdate in the bot settings
});

ember.client.login(ember.config.general.token);