import { JSONP } from '../utils/jsonp.utils';

export function getClientConfigs(){
	return new Promise( function (resolve, reject) {
		JSONP('http://localhost:8080/api/configs', {
	    errorCallback : function(){
	      console.log("jsonp config error");
	    }
	  },
	  function(data){
	   	resolve(data);
	  });
	});
}
