var QueryBuilder = function(connection){

  var runQuery = function( query, params, next, resultsFilter ){

    connection.query(query,params,function(err,results){
      if(err) throw err;

      if(typeof next === 'function'){
        if(typeof resultsFilter === 'function'){
          results = resultsFilter(results);
        }
        next(results);
      }
      else {
        throw new Error('next() is not a function - queryBuilder()');
      }
    });

  }

  var handleMultipleQueries = function( queryArray, params, originalNext, multipleQueryResults ){
    var multipleQueryResults = multipleQueryResults || {};
    var query;
    var queries = queryArray.slice(0); //create copy, otherwise shift() will remove items from original array
    // var params = (params && params.slice) ? params.slice(0) : params;
    var currentParams; //"current" set of parameters - overrides params if available

    var recurse = function(queryResults){
      if(!query.name) throw new Error('Query name not defined');
      if(!query.query) throw new Error('Query not defined');
      multipleQueryResults[query.name] = queryResults; //add query results to final result object
      handleMultipleQueries( queries, params, originalNext, multipleQueryResults);
    }

    if(queries.length){
      query = queries.shift();
      currentParams = query.hasOwnProperty('params') ? query.params : params;
      // runQuery( query.query, currentParams, recurse, multipleQueryResults);
      runQuery( query.query, currentParams, recurse, (typeof query.resultsFilter === 'function') ? query.resultsFilter : null );
    }
    else {
      if(typeof originalNext === 'function'){
        originalNext( multipleQueryResults );
      }
      else {
        throw new Error('Callback is not a function');
      }
    }

  }

  var handler = function( query, params, next ){
    if(!query || !next ) throw new Error('Missing query or callback function');

    if( Array.isArray( query ) ){
      handleMultipleQueries( query, params, next );
    }
    else {
      runQuery( query, params, next );
    }
    
  }

  return handler;

};

module.exports = QueryBuilder;