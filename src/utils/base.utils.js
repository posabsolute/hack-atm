
export function shouldEnableWidgets() {
 // our code is not tested on ie8 & we must execute only in ie9 plus
  let enable = true;
  if (/(MSIE\ [0-8]\.\d+)/.test(navigator.userAgent)) {
    enable = false;
  }else if((navigator.platform.match(/(Win32|Win16|Win64|WinCE|Windows)/i)) && (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1)){ // disabled on safari windows
    enable = false;
  }
  return enable;
}


export function domReady(callback) {
  if (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive") {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
}

export function deepExtend(destination, source) {
  for (var property in source) {
    if (source[property] && source[property].constructor &&
     source[property].constructor === Object) {
      destination[property] = destination[property] || {};
      /*jshint -W059 */
      arguments.callee(destination[property], source[property]);
    } else {
      destination[property] = source[property];
    }
  }
  return destination;
}
