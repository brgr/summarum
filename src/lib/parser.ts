
export function parseTextAreaContent(textAreaContent: string): string[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(textAreaContent, 'text/html');
    const divs = doc.getElementsByTagName('div');
    return Array.from(divs).map(div => div.textContent || '');
}
