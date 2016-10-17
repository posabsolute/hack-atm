var jsonpErrors = [];

export function JSONP(url,data,method,_jsonp, errors){
  //Set the defaults
  url = url || '';
  data = data || {};
  method = method || '';
  _jsonp = _jsonp || function(){};
  
  // Create errorCallback object if a callback funciton is passed
  // delete callback form data passed so it's not sent throught jsonp later
  var errorCallback;
  if(data.errorCallback){

    if(!errors) {errors = [];}

    errorCallback = {
      callback :data.errorCallback
    };
    delete data.errorCallback;
  }

  //Gets all the keys that belong
  //to an object
  var getKeys = function(obj){
    var keys = [];
    for(var key in obj){
      if (obj.hasOwnProperty(key)) {
        keys.push(key);
      }
      
    }
    return keys;
  };

  //Turn the data object into a query string.
  //Add check to see if the second parameter is indeed
  //a data object. If not, keep the default behaviour
  if(typeof data === 'object'){
    var queryString = '';
    var keys = getKeys(data);
    for(var i = 0; i < keys.length; i++){
      queryString += encodeURIComponent(keys[i]) + '=' + encodeURIComponent(data[keys[i]]);
      if(i !== keys.length - 1){ 
        queryString += '&';
      }
    }
    url += '?' + queryString;
  } else if(typeof data === 'function'){
    method = data;
    _jsonp = method;
  }

  //If no method was set and they used the _jsonp param in place of
  //the method param instead, we say method is _jsonp and set a
  //default method of "_jsonp"
  if(typeof method === 'function'){
    _jsonp = method;
    method = '_jsonp';
  }

  //Check to see if we have Date.now available, if not shim it for older browsers
  if(!Date.now){
    Date.now = function() { return new Date().getTime(); };
  }

  //Use timestamp + a random factor to account for a lot of requests in a short time
  //e.g. jsonp1394571775161 
  var timestamp = Date.now();
  var generatedFunction = 'jsonp'+Math.round(timestamp+Math.random()*1000001);

  //Generate the temp JSONP function using the name above
  //First, call the function the user defined in the _jsonp param [_jsonp(json)]
  //Then delete the generated function from the window [delete window[generatedFunction]]
  window[generatedFunction] = function(json){
    _jsonp(json);
    try 
    { 
        delete window[generatedFunction];
    } 
    catch(e) 
    { 
        window[generatedFunction] = undefined; 
    }
    
  };  

  //Check if the user set their own params, and if not add a ? to start a list of params
  //If in fact they did we add a & to add onto the params
  //example1: url = http://url.com THEN http://url.com?_jsonp=X
  //example2: url = http://url.com?example=param THEN http://url.com?example=param&_jsonp=X
  if(url.indexOf('?') === -1){ url = url+'?'; }
  else{ url = url+'&'; }

  // Set callback unique src to match callback function
  if(errorCallback){
    errorCallback.src = url+method+'='+generatedFunction;
    jsonpErrors.push(errorCallback);
  }
  //This generates the <script> tag
  var jsonpScript = document.createElement('script');
  jsonpScript.setAttribute("src", url+method+'='+generatedFunction);
  jsonpScript.setAttribute('async', 'async');
  jsonpScript.onerror = JSONPErrorCallback;
  document.getElementsByTagName("head")[0].appendChild(jsonpScript);
};

// Partial implementation, will not support multiple case scenarios if you call multiple time a same jsonp url
var JSONPErrorCallback = function(oError){
  // get all callbacks
  var errors = jsonpErrors;
  if(errors){
    for(i = 0; i < errors.length; i++){
      var currentError = errors[i],
          currentIndex = i;
      // Check if current jsonp url match any error in the stack
      if(oError.target.src === currentError.src){
        currentError.callback();
        // remove error from stack
        jsonpErrors.splice(currentIndex,currentIndex+1);
      }
    }
  }
};