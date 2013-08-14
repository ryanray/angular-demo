var user = require('../routes/user.js');
var poolInstance = require('../lib/db.js');
var QueryBuilder = require('../lib/queryBuilder.js');

var query = function( query, params, next ){

    poolInstance.acquire(function(err, client) {
    var QB;
      if (err) {
          // handle error - this is generally the err from your
          // factory.create function  
          throw new Error("Pool acquire error " + err);
      }
      else {
        QB = new QueryBuilder( client );
        QB(query,params,function(results){
          next(results);
          poolInstance.release(client);
        });
      }
  });
};

var authenticateUserQuery = [
  {name: 'auth', query: 'SELECT id FROM user WHERE username=? AND password=?'}
]

var validateLogin = function(username, password, next){

  query(authenticateUserQuery, [username,password], function(results){
    console.log('\n\nIS AUTHENTICATED::: ', (results.auth.length > 0));
    if(parseInt(results.auth.length && results.auth[0].id, 10) > 0){
      user.getUserById(results.auth[0].id, function(results){
        results.isLoggedIn = true;
        next(results);
      });
    }
    else {
      next({isLoggedIn: false})
    }
  });

};

exports.login = function(req, res){
  // TODO: this doesn't have anything to do with a session yet - returns true if the db record can be found
  console.log(req.body.username, req.body.password);

  validateLogin(req.body.username, req.body.password, function(results){
    if(!results.isLoggedIn){
      results.errorMessage = 'Invalid username or password.';
    }
    res.send(results);
  });
}