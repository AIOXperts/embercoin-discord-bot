var config = require('../config.json');
module.exports ={
	channelAllowed: function(channel) {
		if ( allowedChannels.indexOf(channel) != -1){
			return 1;
		} else {
			return 0;
		}
	},
	isDM: function(channel){
		if(channel == "dm"){
			return 1;
		}else{
			return 0;
		}
	},
	isACommand: function(cmd){
		console.log(config['commands'].hasOwnProperty(cmd));
		if(config['commands'].hasOwnProperty(cmd) == true ){
			return true;
		}else{
			return false;
		}
	},
	isCommandActive: function(ember, cmd, channel)
	{
		if(cmd != "undefined"){
			if(ember.commands[cmd]['status'] == true){
				if(module.exports.isDM(channel.type)){ // config['commands'][cmd]['dm-only'] == true
					console.log('dm, allow message');
					return true;
				}else{
					return true;
				}
			}else{
				//if(config.debug){
					channel.send("debug is on, command is disabled");
				//}
				return false;
			}
		}else{
			console.log("not a command");
			return false;
		}
	},
	notBot: function(username, client){
		if(username != client.user.username){
			return true;
		}else{
			return false;
		}
	},

	getCommandStatus: function(cmd){
		console.log(config['commands'][cmd]);
		return config['commands'][cmd]['status'];
	},

	setCommandStatus: function(cmd, status){
		config['commands'][cmd]['status'] = status;
		console.log("Command: " + cmd + " was set to " + status);
		return saveConfig();
	},

	getChannel: function(channelname){
		var channel = channelname.replace(/#/g, '');
		if(client.channels.find('name', channel)){
			console.log('found channel ' + channel);
			return "<#"+client.channels.find('name', channel).id+">";
		}else{
			console.log('didn\'t find channel ' + channel);
			return channel;
		}
	},

	formatSaying: function(msg){
		msg = msg.replace(/^(?:[#][a-zA-Z0-9\-]{1,20})/g, function(match, contents, offset, input_string)
			{
				return getChannel(match);
			});
		msg = msg.replace(/@(?:[A-Za-z0-9]{1,9}\s?)(?:[A-Za-z0-9_]*)#+([0-9]{1,4})/g, function(match, contents, offset, input_string)
			{
				return getUser(match);
			});
		return msg;
	},
    getUserFromID: function (ember, args){

        if(ember.client.users.find('id', args)){
            console.log('found user ' + args);
            return "<@"+args+">";
        }else{
            console.log('didn\'t find user ' + args);
            return args;
        }
    },
    getUser: function (ember, args){
		var user = '';
		if(args.length = 1) {
            var regexPatt = /^([<][@])(\d{15,20})([>])$/g;
        	if(regexPatt.test(args))
			{
				console.log('found it');
                return args;
			}
		}else {
            for (var i = 0, len = args.length; i < len; i++) {
                user += args[i] + " ";
            }
            user = user.slice(1,-1);
        }

		if(ember.client.users.find('username', user)){
			console.log('found user ' + user);
			return "<@"+ember.client.users.find('username', user).id+">";
		}else{
			console.log('didn\'t find user ' + user);
			return user;
		}
	},
    isFloat: function (val){
        var floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
        if (!floatRegex.test(val))
            return false;

        val = parseFloat(val);
        if (isNaN(val))
            return false;
        return true;
    },

}