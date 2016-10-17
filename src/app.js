import { getClientConfigs } from "./confs/base.conf";
import { deepExtend, domReady, shouldEnableWidgets } from "./utils/base.utils";
import TagLoader from "./tags/base.tags";
import * as privateWidgets from "./widgets/private.widgets";

var clientID = 123123123;

class TagManager {
  constructor(clientID) {
    this.clientID = clientID;
  }

  init() {
    getClientConfigs(clientID).then((clientOptions) => {
      this.options = deepExtend(defaultOptions, clientOptions);
      this.load();
    });

    return this;
  }

  load() {
    window.addEventListener("message", (event) => {
      this.handleTagsResponse(event);
    }, false);

    if(!shouldEnableWidgets()){
      return;
    }

    domReady(() => {
      this.loadTags();
      this.loadWidgets();
    });
  }

  loadTags() {
    let tagLoader = new TagLoader(this.options);
  }

  loadWidgets() {
    Object.keys(privateWidgets).forEach((widget) => {
      new privateWidgets[widget](this.options);
    });
  }

  handleTagsResponse (event){
    var data;
    if(event && event.data){
      try {
        data = JSON.parse(event.data);
      } catch (e) {
        return false;
      }
    }
  }
}

let defaultOptions = {};

let tagManager = new TagManager(clientID).init();