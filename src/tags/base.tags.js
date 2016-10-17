import { testRules } from '../rules';


export default class TagsLoader {
  constructor(options) {
    this.tags = options.tags || {};
    this.clientId = options.clientId;
    this.loadTags();
  }

  loadTags() {
    this.tags.forEach((tag) => {
      if(testRules(tag.rules) && tag.status){
        this.appendTag(tag);
      }
    });
  }

  appendTag(tag) {
    try{
      if(tag.container){
        var container = document.getElementById(tag.container);
      }
      this.insertAndExecute(tag.script, container);
    } catch(e){
      console.log(`error loading ${tag.name}`);
    }
  }

  insertAndExecute(script, container = document.body) {
    let domelement = document.createElement('atm');
    domelement.innerHTML = script;
    container.appendChild(domelement);
    var scripts = [];

    let ret = domelement.childNodes;

    domelement.querySelectorAll("*").forEach((el) => {
      console.log(el);
      if ( scripts && this.nodeName( el, "script" ) && (!el.type || el.type.toLowerCase() === "text/javascript") ) {
            scripts.push( el.parentNode ? el.parentNode.removeChild( el ) : el );
      }

    });
    console.log(script, "fuxk");
    for(script in scripts)
    {
      this.evalScript(scripts[script]);
    }
  }

  nodeName( elem, name ) {
    return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
  }

  evalScript( elem ) {
    let data = ( elem.text || elem.textContent || elem.innerHTML || "" );

    var head = document.getElementsByTagName("head")[0] || document.documentElement,
    script = document.createElement("script");
    script.type = "text/javascript";
    script.appendChild( document.createTextNode( data ) );
    head.insertBefore( script, head.firstChild );
    head.removeChild( script );

    if ( elem.parentNode ) {
        elem.parentNode.removeChild( elem );
    }
  }

}