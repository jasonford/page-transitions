Structurl = {};

(function () {
  var rootURL = '';
  var animationStartEvents = "animationstart MSAnimationStart webkitAnimationStart oAnimationStart".split(' ');
  var animationEndEvents = "animationend MSAnimationEnd webkitAnimationEnd oAnimationEnd".split(' ');
  window.addEventListener('load', function () {
    var states = [];

    window.addEventListener("tap", function (event) {
      var stateUpdate = './'
      var i = states.length - 1;
      while (i > 0 && states[i] && !states[i].container.contains(event.target)) {
        i -= 1;
        stateUpdate += '../';
      }
      history.pushState(null, null, stateUpdate);
      applyState();      
    });

    window.addEventListener('click', function (e) {
      var currentElement = event.target;
      var href = null;
      while (!href && currentElement && currentElement.getAttribute) {
        href = currentElement.getAttribute('href');
        currentElement = currentElement.parentNode;
      }
      if (href) {
        e.preventDefault();
        history.pushState(null, null, href);
        applyState();
      }
    });

    function applyState() {
      if (rootURL !== window.location.pathname.slice(0, rootURL.length)) {
        //  heal the state
        history.pushState(null, null, rootURL);
      }
      var pathname = window.location.pathname.slice(rootURL.length);
      var statesToRemove = states.concat([]);
      if (pathname[0] != '/') pathname = '/' + pathname;
      var statesToAdd = pathname.replace(/\/$/g, '').split('/');

      //  shift out all states that will stay
      var i=0;
      while (statesToRemove.length && statesToAdd[0] == statesToRemove[0].state) {
        i += 1;
        statesToAdd.shift();
        statesToRemove.shift();
      }

      //  some states need to be removed
      statesToRemove.forEach(function (state, index) {
        var exitAnimation = false;
        if (index == statesToRemove.length-1) {
          //  allow exit animation to apply to highest state (if animation is set up in css) then remove element
          animationStartEvents.forEach(function (eventName) {
            state.container.addEventListener(eventName, function () {
              exitAnimation = true;
            });
          });

          for (var i=0; i<state.container.children.length; i++) {
            var child = state.container.children[i];
            child.setAttribute("class", child.getAttribute("class") + " removing");
          }

          //  request 2 layers of animation frames to assess if animation started
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              if (exitAnimation) {
                animationEndEvents.forEach(function (eventName) {
                  state.container.addEventListener(eventName, function () {
                    document.body.removeChild(state.container);
                  });
                });
              }
              else {
                document.body.removeChild(state.container);
              }
            });
          });
        }
        else {
          document.body.removeChild(state.container);
        }
      });

      //  update states
      states = states.splice(0,i);

      statesToAdd.forEach(function (state) {
        //  add element and context
        var stateStrings = state.split('+', 1);
        var elementStateString = stateStrings[0];
        var contextStateString = stateStrings[1] || '';

        var parentState = states[states.length-1] || {};
        var contextFn = getContext(contextStateString);
        var elementFn = getElement(elementStateString);

        var context = contextFn(parentState.context, contextStateString, parentState.element);
        var element = elementFn(context, elementStateString);

        var container = document.createElement('div');
        container.setAttribute('class', 'transition-element-container');
        container.style.position = 'absolute';
        container.style.top = '0px';
        container.style.left = '0px';
        container.style.width = "100%";
        container.style.height = "100%";
        container.appendChild(element);

        states.push({
          state : state,
          container : container,
          element : element,
          context : context
        });

        document.body.appendChild(container);
      });
    }

    applyState();

    window.onpopstate = function (event) {
      //  back or forward pressed
      window.location.pathname.slice(0, rootURL.length);
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
      if ((new RegExp(p)).test(pattern)) {
        return Elements[p];
      }
    }
    return errorElement;
  }
  function getContext(pattern) {
    for (var p in Contexts) {
      if ((new RegExp(p)).test(pattern)) {
        return Contexts[p];
      }
    }
    return defaultContext;
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