# page-transitions
Manage transitions between screens and application state

```javascript

defineTransitionContent({
  contentName : function () {
    return DOMelement;
  }
});

defineTransitionContext({
  contextName : function (currentContext) {
    return dataForNewContext; //  default is to return currentContext[contextName]
  }
});
```

add transition="contentName contextName" attribute to any DOM element