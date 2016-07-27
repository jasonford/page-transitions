Structurl.defineRoot('/page-transitions');

Structurl.defineContexts({
  '' : function (contextString, parentContext, parentElement) {
    return (parentContext||'') + '/' + contextString;
  }
});

Structurl.defineElements({
  '.*' : function (context) {
    var element = document.createElement('span');
    element.innerHTML = context;
    return element;
  }
});