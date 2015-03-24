/**
 * New node file
 */

var cassandra = require('cassandra-driver');
var logger = require("./logger");

function CassandraBaseHandler(){
	
	var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'mykeyspace'});
	
	function prepareStatement(cql,parameters){
		for(var i = 0 ; i < parameters.length;i++){
			cql = cql.replace('?', parameters[i]);
		}
		logger.debug("Statement is replaced :"  + cql);
		return cql;
	}
	
	function executeInternal(cql,parameters,statement,callback,thus){
		logger.debug('csql to be executed :' +  cql);
		logger.debug('parameters :' +  parameters);
		var pcql = prepareStatement(cql,parameters);
		client.execute(pcql,[], function (err, result) {
	           if (!err){
	               if (result.rows && result.rows.length > 0 ) {
	                   logger.debug("result.rows.length : " +  result.rows.length);
	               } else {
	                   logger.debug("No results from the cql : " + cql);
	               }
	               callback(result.rows,statement,thus);
	           }

	       }); 
	}
	
	return { execute : function(cql,parameters,statement,callback,thus){
		executeInternal(cql,parameters,statement,callback,thus);
	}};
	
}

module.exports = {
		getInstance : function(){
			return new CassandraBaseHandler();
		}	
}