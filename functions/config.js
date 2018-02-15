var jsonfile = require('jsonfile'),
	file = "config.json";
module.exports ={
	reloadConfig: function(){
		return jsonfile.readFileSync(file);
	},
	saveConfig: function(){
		jsonfile.writeFileSync(file, config, {spaces: 2});
		config = jsonfile.readFileSync(file);
		return config;
	},
	debug: true,
};