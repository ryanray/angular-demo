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

var getUserQuery = [
  {name: 'user', query: 'SELECT * FROM user WHERE id=?', resultsFilter: function(results){
    var filtered = [];
    results.forEach(function(item){
      filtered.push({
        firstName: item.firstName,
        lastName: item.lastName,
        username: item.username
      })
    });
    return filtered;
  }},
  {name: 'phone', query: 'SELECT * FROM user_phone WHERE userid=?', resultsFilter: function(results){
      var filtered = [];
      results.forEach(function(item){
        if(item.phone){
          filtered.push(item.phone);
        }
      });
      return filtered;
    }
  },
  {name: 'email', query: 'SELECT * FROM user_email WHERE userid=?', resultsFilter: function(results){
      var filtered = [];
      results.forEach(function(item){
        if(item.email){
          filtered.push(item.email);
        }
      });
      return filtered;
    }
  }
];

var saveUserQueries = {
  saveUser: 'UPDATE user SET firstName=?, lastName=? WHERE id=?',
  saveEmail: 'UPDATE user_email SET email=? WHERE userid=?',
  savePhone: 'UPDATE user_phone SET phone=? WHERE userid=?'
};

exports.getUserById = function(id, next){
  query(getUserQuery, id, function(results){
    var user = results.user[0] || {};
    var phone = results.phone[0] || '';
    var email = results.email[0] || '';

    var finalResult = {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      phone: phone,
      email: email,
      id: id
    }
    next(finalResult);
  });
};

var saveUser = function(id, firstname, lastname, email, phone, next){

  query(saveUserQueries.saveUser,[firstname, lastname, id], function(results){
    query(saveUserQueries.saveEmail,[email, id], function(results){
      query(saveUserQueries.savePhone,[phone, id], function(results){
        next(results);
      });
    });
  });

}

exports.save = function(req, res){

  var body = req.body;

  saveUser(body.userId, body.firstName, body.lastName, body.email, body.phone, function(results){
    console.log('\n\n\n ::: SAVE USER RESPONSE SENT :::\n\n\n')
    res.send({success: true});
  });

}

exports.get = function(req, res){
  res.format({
    html: function(){
      console.log('RESOURCE UNAVAILABLE AS HTML - RENDERING HOME PAGE')
      res.render('index', { title: 'Express' });
    },
    json: function(){
      exports.getUserById(req.params.id, function(result){
        res.send(result);
      });
    }
  })
}