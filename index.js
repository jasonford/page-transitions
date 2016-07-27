Structurl = {};

(function () {
  var rootURL = '';
  window.addEventListener('load', function () {
    var states = [];

    window.addEventListener("tap", function (event) {
      if (states.length < 2) return;

      var stateUpdate = './'
      var i = states.length - 1;
      while (states[i] && !states[i].container.contains(event.target)) {
        i -= 1;
        stateUpdate += '../';
      }
      //  TODO: prevent from backing up past the rootURL
      history.pushState(null, null, stateUpdate);
      applyState();      
    });

    function applyState() {
      if (rootURL !== window.location.pathname.slice(0, rootURL.length)) {
        throw new Error('provided root URL "'+ rootURL +' does not match the current root "' + window.location.pathname + '"');
      }
      var pathname = window.location.pathname.slice(rootURL.length);
      var statesToRemove = states.concat([]);
      var statesToAdd = pathname.replace(/\/$/g, '').split('/');

      //  shift out all states that will stay
      var i=0;
      while (statesToRemove.length && statesToAdd[0] == statesToRemove[0].state) {
        i += 1;
        statesToAdd.shift();
        statesToRemove.shift();
      }

      //  some states need to be removed
      statesToRemove.forEach(function (state) {
        // TODO: transition out state
        state.element.parentNode.remove(state.element);
      });

      //  update states
      states = states.splice(0,i);

      statesToAdd.forEach(function (state) {
        //  TODO: add element and context
        var stateStrings = state.split('+', 1);
        var elementStateString = stateStrings[0];
        var contextStateString = stateStrings[1] || '';

        var parentState = states[states.length-1] || {};
        var context = getContext(contextStateString)(contextStateString, parentState.context, parentState.element);
        var element = getElement(elementStateString)(elementStateString, context);

        var container = document.createElement('div');
        container.setAttribute('class', 'transition-element-container');
        container.style.position = 'absolute';
        container.style.top = '0px';
        container.style.left = '0px';
        container.style.width = "100%";
        container.style.height = "100%";
        container.appendChild(element);

        //  no pointer events for container, but pointer events from element
        container.style.pointerEvents = 'none';
        element.style.pointerEvents = 'all';

        states.push({
          state : state,
          container : container,
          element : element,
          context : context
        });

        document.body.appendChild(container);
      });
    }

    //  whenever an element with a transition attribute was
    //  tapped and the tap reaches the window
    //  add the transition attribute to the history state
    window.addEventListener('tap', function (event) {
      var currentElement = event.target;
      var transitionAttribute = null;
      while (!transitionAttribute && currentElement && currentElement.getAttribute) {
        transitionAttribute = currentElement.getAttribute('transition');
        currentElement = currentElement.parentNode;
      }

      if (transitionAttribute) {
        history.pushState(null, null, transitionAttribute);
        applyState();
      }
    });

    applyState();

    window.onpopstate = function (event) {
      //  back or forward pressed
      applyState();
    }
  });

  function errorElement(context) {
    var element = document.createElement('span');
    element.innerHTML = context;
    return element;
  }
  function defaultContext() {
    return {};
  }

  var Elements = {};
  var Contexts = {};

  function getElement(pattern) {
    for (var p in Elements) {
      if ((new RegExp('^'+p+'$')).test(pattern)) {
        return Elements[p];
      }
    }
    return errorElement;
  }
  function getContext(pattern) {
    for (var p in Contexts) {
      if ((new RegExp('\\+'+p+'$')).test(pattern)) {
        return Contexts[p];
      }
    }
    return Contexts[''] || defaultContext;
  }


  Structurl.defineElements = function (elements) {
    for (var element in elements) {
      Elements[element] = elements[element];
    }
  }

  Structurl.defineContexts = function (contexts) {
    for (var context in contexts) {
      Contexts[context] = contexts[context];
    }
  }

  Structurl.defineRoot = function (url) {
    rootURL = url;
  }
})();