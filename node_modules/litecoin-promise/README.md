# node-litecoin-promise

# Summary

Add Promise support to [litecoin](https://github.com/gferrin/node-litecoin) package.
It is backward compatible with the original package. If no callback function is
passed in to a command a Promise is returned

# Installation

```
npm install litecoin-promise
```

# Example

```
var litecoin = require( 'litecoin-promise' ) ;

var client = new litecoin.Client({
  host: 'rcorbish.ydns.eu',
  port: 18332,
  user: 'bitcoinrpc',
  pass: 'password',
  timeout: 30000
});

// get a new address and return details about it
client.getNewAddress()
  .then( function(addr){
    return client.validateAddress( addr ) ;
  })
  .then( function(addrInfo){
    console.log( addrInfo ) ;
  })
  .catch( function(err){
    console.log( err ) ;
  }) ;
```
