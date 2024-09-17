// @ts-nocheck

function getTextSegments(element) {
  const textSegments = [];

  Array.from(element.childNodes).forEach((node) => {
    console.log('childNode:', node, 'nodeType:', node.nodeType);

    switch (node.nodeType) {
      case Node.TEXT_NODE:
        textSegments.push({text: node.nodeValue, node});
        break;

      case Node.ELEMENT_NODE:
        if (node.tagName === 'BR') {
          textSegments.push({text: '\n', node});
          break;
        }
        textSegments.splice(textSegments.length, 0, ...(getTextSegments(node)));
        break;

      default:
        throw new Error(`Unexpected node type: ${node.nodeType}`);
    }
  });

  console.log('textSegments:', textSegments);
  return textSegments;
}

export function updateEditor(editor, inputKey, inputType) {
  console.log('updateEditor');

  // For anchor node, focus node, etc., see here:
  // https://developer.mozilla.org/en-US/docs/Web/API/Selection

  // get input key
  // if (inputType === 'insertParagraph') {
  //   console.log('insertParagraph');
  //   return;
  // }

  // if editor has class .calculator-textarea
  if (
    editor.classList.contains('calculator-textarea') &&
    inputType === 'insertText' &&
    editor.childNodes.length === 2 &&
    editor.childNodes[0].nodeType === Node.TEXT_NODE &&
    editor.childNodes[1].nodeType === Node.ELEMENT_NODE &&
    editor.childNodes[1].classList.contains('editor-line')
  ) {
    // remove the text node
    let textNode = editor.childNodes[0];
    let editorLine = editor.childNodes[1];

    editor.removeChild(textNode);
    // place it in the first position of the editor-line
    editorLine.insertBefore(textNode, editorLine.firstChild);
  } else if (
    editor.childNodes.length === 0 &&
    editor.classList.contains('calculator-textarea')
  ) {
    // if editor is empty, add a div.editor-line
    let editorLine = document.createElement('div');
    editorLine.classList.add('editor-line');
    editorLine.setAttribute('contenteditable', 'true');
    editorLine.appendChild(document.createElement('br'));
    editor.appendChild(editorLine);
  }

  const textSegments = getTextSegments(editor);
  console.log('textSegments:', textSegments);
  const textContent = textSegments.map(({text}) => text).join('');

  // textContent.replace(/<strong>(.*?)<\/strong>/g, 'bold');

  const selection = window.getSelection();
  let anchorIndex = null;
  let focusIndex = null;
  let currentIndex = 0;

  console.log('selection:', selection);

  // TODO: What is an anchor node and a focus node?
  textSegments.forEach(({text, node}) => {
    console.log('node:', node);

    if (node === selection.anchorNode) {
      anchorIndex = currentIndex + selection.anchorOffset;
    }
    if (node === selection.focusNode) {
      focusIndex = currentIndex + selection.focusOffset;
    }

    // Because the node of newline is actually the div.editor-line (I guess the next div, but I'm not sure),
    // we need to set these indices manually for now. This is kind of a hack, maybe there is a better way?
    if (text === '\n') {
      anchorIndex = currentIndex;
      focusIndex = currentIndex;
    }

    currentIndex += text.length;
  });

  editor.innerHTML = renderText(editor, textContent);

  // Print all relevant information in one line
  console.log(`textContent: ${textContent}, anchorIndex: ${anchorIndex}, focusIndex: ${focusIndex}`);

  restoreSelection(editor, anchorIndex, focusIndex);
}

function restoreSelection(editor, absoluteAnchorIndex, absoluteFocusIndex) {
  const selection = window.getSelection();
  const textSegments = getTextSegments(editor);

  let anchorNode = editor;
  let anchorIndex = 0;
  let focusNode = editor;
  let focusIndex = 0;
  let currentIndex = 0;

  textSegments.forEach(({text, node}) => {
    const startIndexOfNode = currentIndex;
    const endIndexOfNode = startIndexOfNode + text.length;
    if (startIndexOfNode <= absoluteAnchorIndex && absoluteAnchorIndex <= endIndexOfNode) {
      anchorNode = node;
      anchorIndex = absoluteAnchorIndex - startIndexOfNode;
    }
    if (startIndexOfNode <= absoluteFocusIndex && absoluteFocusIndex <= endIndexOfNode) {
      focusNode = node;
      focusIndex = absoluteFocusIndex - startIndexOfNode;
    }
    currentIndex += text.length;
  });

  selection.setBaseAndExtent(anchorNode, anchorIndex, focusNode, focusIndex);
}

function renderText(editor, text) {
  // parse all div.editor-line from innerHTML (NOT with regex! but from DOM)
  let divs = editor.querySelectorAll('div.editor-line');
  console.log('count of divs:', divs.length);

  // for each div.editor-line, parse innerHTML into words
  for (let i = 0; i < divs.length; i++) {
    let div = divs[i];
    let innerHTML = div.innerHTML;
    console.log('innerHTML in renderText:', innerHTML);
    // let words = div.textContent.split(' ');

    // query all
    let all = div.childNodes;
    let words = Array.from(all).map(node => {
      if (node.tagName === 'BR' ||
        (node.childNodes && Array.from(node.childNodes).filter(n => n.tagName === 'BR').length > 0)) {
        return '<br>';
      }
      return node.textContent;
    });

    words = words.flat().join('').split(' ');

    // for each word, apply the styling
    for (let j = 0; j < words.length; j++) {
      let word = words[j];
      if (word === 'bold') {
        words[j] = `<strong>${word}</strong>`;
      } else if (word === 'red') {
        words[j] = `<span style='color:red'>${word}</span>`;
      } else if (word.match(/^\d+$/)) {
        words[j] = `<span style='color:blue'>${word}</span>`;
      }
    }

    // rejoin the words into innerHTML
    div.innerHTML = words.join(' ');
  }

  console.log('editor.innerHTML:', editor.innerHTML);

  return editor.innerHTML;

  // const words = text.split(/(\s+)/);
  //
  // const output = words.map((word) => {
  //   if (word === 'bold') {
  //     return `<strong>${word}</strong>`;
  //   } else if (word === 'red') {
  //     return `<span style='color:red'>${word}</span>`;
  //   } else if (word.match(/^\d+$/)) {
  //     return `<span style='color:blue'>${word}</span>`;
  //   } else {
  //     return word;
  //   }
  // });
  //
  // return output.join('');
}
