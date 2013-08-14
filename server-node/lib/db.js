//Set environment variables or hardcode below:
var options = {
  host: process.env.DB_HOST, // ex: '127.0.0.1'
  user: process.env.DB_USER, // ex: 'db'
  password: process.env.DB_PASS, // ex: 'password',
  database: process.env.DB_NAME  // ex: 'super_db'
}

console.log('\n\n\nDB CONFIG:\n',options);

if(!options.host, !options.user, !options.password, !options.database){
  // Big Scary Warning!
  console.error('\n\n\n **************************************\n', '**** WARNING - DB SETUP NOT FOUND ****\n'
    ,'**************************************\n', '* Set Database config in ./lib/db.js *\n'
    ,'**************************************\n\n\n');
}

// Create a MySQL connection pool with
// a max of 10 connections, a min of 2, and a 30 second max idle time
var poolModule = require('generic-pool');
var pool = poolModule.Pool({
    name     : 'mysql',
    create   : function(callback) {
        //var Client = require('mysql').Client;
        var Client = require('mysql').createConnection;
        var c = new Client(options);

        c.connect();

        // parameter order: err, resource
        // new in 1.0.6
        callback(null, c);
    },
    destroy  : function(client) { client.end(); },
    max      : 10,
    // optional. if you set this, make sure to drain() (see step 3)
    min      : 2, 
    // specifies how long a resource can stay idle in pool before being removed
    idleTimeoutMillis : 30000,
     // if true, logs via console.log - can also be a function
    log : false 
});

module.exports = pool;
