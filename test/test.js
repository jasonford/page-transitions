Structurl.defineRoot('/page-transitions/test/');

Structurl.defineContexts({
  '.*' : function (parentContext, contextString, parentElement) {
    return (parentContext||'') + '/' + contextString;
  }
});

Structurl.defineElements({
  '.*' : function (context, elementString) {
    var element = document.createDocumentFragment();
    var a = document.createElement('pre');
    a.innerHTML = context;
    a.style.marginTop = (context.length * 10) + 'px';
    a.setAttribute('href', 'next!/');
    element.appendChild(a);
    return element;
  }
});