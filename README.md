# page-transitions
Manage transitions between screens and application state

```javascript

//  "[* name patterns]" match path segments like:
//  /[element name pattern]+[context name pattern]/...

Structurl.defineElements({
  "[element name pattern]" : function (stringMatchingNamePattern, context) {
    var DOMelement = document.createDocumentFragment();
    //  ...do what you like with the fragment
    //  render a template... throw some div elements together if that's your style...
    //  probably want to render using a template engine... see handlebars example
    return DOMelement;
  }
});

Structurl.defineContexts({
  "[context name pattern]" : function (stringMatchingNamePattern, parentContext, parentELement) {
    var dataForNewContext = {'ooo':'aaaah'};
    return dataForNewContext;
  }
});
```

add transition="contentName contextName" attribute to any DOM element
