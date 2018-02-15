const moment = require('moment'),
    fetch = require('node-fetch'),
    jsonfile = require('jsonfile'),
    querystring = require('querystring')
http = require('http')
mysql = require('promise-mysql');
var ember = [];
ember['helpers'] =[];
ember['helpers']['config'] = require('./functions/config.js');
ember['helpers']['commands'] = require('./functions/commands.js');
ember['config'] = ember.helpers.config.reloadConfig();


ember['db'] = mysql.createConnection({
	host: ember.config.mysql.host,
	user: ember.config.mysql.user,
	password: ember.config.mysql.password,
	database: ember.config.mysql.database
}).catch(function(err){
	if(ember.db && ember.db.end) ember.db.end();
	console.log(error);
});

var client = require('litecoin-promise');

var altcoin = new client.Client({
    port: ember.config.emberWallet.port,
    host: ember.config.emberWallet.host,
    pass: ember.config.emberWallet.password,
    user: ember.config.emberWallet.user,
    timeout: 30000
});
function checkTX(conn, user_id){
    altcoin.listTransactions(user_id).then(function(balance) {
        for (var e = 0; e < balance.length; e++) {
            var tx = balance[e];
            checkDB(conn, user_id, tx);
        }
    })
}

function checkDB(conn, user_id, tx){
    conn.query("SELECT count(*) as count FROM deposit WHERE txid = '" + tx.txid + "'")
        .then(function (count) {
            if (count[0].count == 0) {
                console.log(count[0]);
                console.log("SELECT count(*) as count FROM deposit WHERE txid = '" + tx.txid + "'")
                console.log(count[0].count);
                //console.log(user_id.user_id)
                if(tx.confirmations > 10)
                    conn.query("INSERT INTO deposit (user_id, amount, txid) VALUES (" + user_id + ", " + tx.amount + ", '" + tx.txid + "')")
            }
        })
}


setInterval(function() { // Starts the auto update of the bot
    ember.db
        .then(function(conn){
            conn.query("SELECT * FROM users where address is not null")
                .then(function(users){
                    var user_id = 0;
                    for(i = 0; i < users.length; i++){
                        user_id = users[i].user_id;
                        checkTX(conn, user_id)
                    }
                }).catch(function(err){
                console.log(err);
            })
        });
    ember.db.then(function(conn){
        conn.query("SELECT * FROM deposit where status = ''").then(function(unprocessed){
            for(i = 0; i<unprocessed.length; i++){
                var user_id = unprocessed[i].user_id;
                conn.query("UPDATE users SET balance = balance + " + unprocessed[i].amount + " where user_id = " + user_id);
                conn.query("UPDATE deposit SET status = 1");
            }
        })
    })
}, 12000);