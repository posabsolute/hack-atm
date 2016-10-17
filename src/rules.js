/* Test that you can enable the tag */

export function testRules(rules = []){
  var test;
  if(rules.length){
    for(var i=0; i<rules.length; i++) {
      var rule = rules[i];
      switch (rule.type) {
        case "func":
          test = testFunction(rule);
          break;
        case "regex":
          test = testRegex(rule);
          break;
      }
      if(!test){ return false; }
    }
  }
  return true;
}

function testFunction(rule){
  return rule.func(rule);
}

function testRegex(rule){
  return rule.enableOn === rule.regex.test(rule.testOn(rule));
}
