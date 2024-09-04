// @ts-nocheck

function getTextSegments(element) {
  const textSegments = [];
  Array.from(element.childNodes).forEach((node) => {
    switch (node.nodeType) {
      case Node.TEXT_NODE:
        textSegments.push({text: node.nodeValue, node});
        break;

      case Node.ELEMENT_NODE:
        textSegments.splice(textSegments.length, 0, ...(getTextSegments(node)));
        break;

      default:
        throw new Error(`Unexpected node type: ${node.nodeType}`);
    }
  });
  return textSegments;
}

export function updateEditor(editor) {
  console.log('updateEditor');

  const sel = window.getSelection();
  const textSegments = getTextSegments(editor);
  const textContent = textSegments.map(({text}) => text).join('');
  let anchorIndex = null;
  let focusIndex = null;
  let currentIndex = 0;
  textSegments.forEach(({text, node}) => {
    if (node === sel.anchorNode) {
      anchorIndex = currentIndex + sel.anchorOffset;
    }
    if (node === sel.focusNode) {
      focusIndex = currentIndex + sel.focusOffset;
    }
    currentIndex += text.length;
  });

  editor.innerHTML = renderText(textContent);

  restoreSelection(editor, anchorIndex, focusIndex);
}

function restoreSelection(editor, absoluteAnchorIndex, absoluteFocusIndex) {
  const sel = window.getSelection();
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

  sel.setBaseAndExtent(anchorNode, anchorIndex, focusNode, focusIndex);
}

function renderText(text) {
  const words = text.split(/(\s+)/);
  const output = words.map((word) => {
    if (word === 'bold') {
      return `<strong>${word}</strong>`;
    } else if (word === 'red') {
      return `<span style='color:red'>${word}</span>`;
    } else if (word.match(/^\d+$/)) {
      return `<span style='color:blue'>${word}</span>`;
    } else {
      return word;
    }
  })
  return output.join('');
}
