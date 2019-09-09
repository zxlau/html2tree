var html = '<html><body><h1>test</h1> some text <div> <p>text</p></div></body></html>';

var parseHTML = (function () {
    var nodesStack = [],
        i = 0,
        len = html.length,
        stateFn = parseText,
        parseTree = { children: [] },
        alphaNumRx = /\w/,
        currentNode = parseTree,
        text = '',
        tag = '',
        newNode;

    function parseTag(token) {
        if (token === '/') {
            return parseCloseTag;
        }

        i--; //backtrack to first tag character
        return parseOpenTag;
    }

    function parseCloseTag(token) {
        if (token === '>') {
            if (currentNode.tag !== tag) {
                throw 'Wrong closed tag at char ' + i;
            }

            tag = '';

            nodesStack.pop();

            currentNode = currentNode.parentNode;

            return parseText;            
        }

        assertValidTagNameChar(token);

        tag += token;

        return parseCloseTag;
    }

    function parseOpenTag(token) {
        if (token === '>') {
            currentNode.children.push(newNode = { tag: tag, parentNode: currentNode,  children: []});
            nodesStack.push(currentNode = newNode);

            tag = '';

            return parseText;
        }

        assertValidTagNameChar(token);

        tag += token;

        return parseOpenTag;
    }

    function parseText(token) {
        if (token === '<') {

            if (text) {
                currentNode.children.push(text);
                text = '';
            }

            return parseTag;
        }

        text += token;

        return parseText;
    }

    function assertValidTagNameChar(c) {
        if (!alphaNumRx.test(c)) {
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
})();

console.log(parseHTML(html));