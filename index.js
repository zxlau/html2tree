let html =  `<body>
              <div>
                <p>123</p>
              </div>
              <div>
                <span>456</span>
              </div>
            </body>`

let html2tree = (function() {
  let tag = '',
      newNode,
      parseTree = { children: [] },
      currentNode = parseTree,
      reg = /\w/,
      text = '',
      i = 0,
      nodesStack = [],
      len = html.length,
      stateFn = parseText;

  function parseOpenTag(token) {
    if(token === '>') {
      newNode = { tag: tag, parentNode: currentNode, children: [] };
      currentNode.children.push(newNode);
      tag = '';
      return parseText;
    }
    validTagNameChar(token);
    tag += token;
    return parseOpenTag;
  }
  function parseText(token) {
    if(token === '<') {
      if(text) {
        currentNode.children.push(text);
        text = '';
      }
      return parseTag;
    }
    text += token;
    return parseText;
  }
  function parseTag(token) {
    if(token === '/') {
      return parseCloseTag;
    }
    i--;
    return parseOpenTag
  }
  function parseCloseTag(token) {
    if(token === '>') {
      if (currentNode.tag !== tag) {
        throw 'Wrong closed tag at char ' + i;
      }
      tag = '';
      nodesStack.pop();
      currentNode = currentNode.parentNode;
      return parseText; 
    }
  }
  function validTagNameChar(c) {
    if (!reg.test(c)) {
      throw 'Invalid tag name char at ' + i;
    }
  }
  return function (html) {
    for (; i < len; i++) {
      stateFn = stateFn(html[i]);
    }
    if (currentNode = nodesStack.pop()) {
      throw 'Unbalanced tags: ' + currentNode.tag + ' is never closed.';
    }
    return parseTree;
  };
})()

console.log(html2tree(html));









