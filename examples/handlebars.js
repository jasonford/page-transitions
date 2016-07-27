//  use the handlebars templating engine
//  find templates from inside of script tags
//  if no template found, find templates from prefix plus

(function () {
  var appRoot = {};

  Structurl.defineElements({
    '.*' : function (context, elementString) {
      //  use pre-compiled handlebars templates
      var element = document.createDocumentFragment();
      template = Handlebars.templates[elementString];
      element.appendChild(template())
      return element;
    }
  });

  Structurl.defineContexts({
    '.*'  : function (parentContext, contextString, parentElement) {
      if (parentContext) {
        return parentContext[contextString];
      }
      else {
        return appRoot;
      }
    }
  });
})();