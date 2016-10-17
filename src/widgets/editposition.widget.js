import { testRules } from '../rules';


export default class EditPositionWidget {
  constructor(options) {
    this.rules = [
      {
        'type':'regex',
        'regex' : /ATMpositionSelection/,
        'testOn' : function(){return window.location.href;},
        'enableOn' : true
      }
    ];
    this.tag = options.tag || {};
    this.clientId = options.clientId;
    this.selection = "";

    if(testRules(this.rules)){
      this.loadEditor();
    }
  }

  loadEditor() {
    var editor = document.createElement("ATMeditor");
    editor.innerHTML = this.editorHTML();
    document.body.appendChild(editor);
    this.loadMouseover();
    this.loadSelector();
    this.loadSave();
  }

  loadMouseover() {
    $('body').children().not(".ATMeditor").mouseover(function(e){
       e.stopPropagation();
      $(".hova").removeClass("hova");     
      $(e.target).addClass("hova");
      return false;
    }).mouseout(function(e) {
        $(this).removeClass("hova");
    });
  }

  loadSelector() {
    $('*').not('#ATMsaveSelection').click((e) => {
      e.stopPropagation();
      this.selection = $(e.target).attr("id");
      $(".selection").removeClass("selection");     
      $(e.target).addClass("selection");
      return false;
    });
  }

  loadSave() {
    document.getElementById("ATMsaveSelection").addEventListener("click", (event) => {
      event.preventDefault();
      $.ajax({
        url: "http://localhost:8080/api/selection/twitter",
        type: "post",
        processData: false,
        contentType: 'application/json',
        dataType:'json',
        data: JSON.stringify({ container: this.selection }),
        crossDomain: true,
        complete: function(data) {
          window.location = "http://localhost:8080/account/apps";
        }
      });
    });
  }

  editorHTML(){
    return `
      <div id="ATMeditor" style="position:fixed; border:1px solid #777; top:30px; right: 30px; width:200px; height:80px; padding:10px 10px 40px 10px; background:#fff;">
        <style>.hova { background-color: pink; }</style>
        <style>.selection { background-color: #98fb98!important; }</style>
        <p style="font-size:15px; background:#fff;">Select and click where you would like to see your Twitter feed appear.</p>
        <p style="background:#fff!important;"><a id="ATMsaveSelection" style="display:inline-block; padding:5px; background:#eee!important; margin: 5px 0;">Save</a></p>
      </div>
    `;
  }

}