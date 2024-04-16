
export function parseTextAreaContent(textAreaContent: string): string[] {
    const cleanedTextAreaContent = textAreaContent
        .replace(/<div>/g, '')
        .replace(/<\/div>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replaceAll(/ +/g, ' ');


    const lines = cleanedTextAreaContent
        .split(/<br\s*\/?>/g)
        .filter(line => line.trim().length > 0);

    return lines.map(line => line.replace(/<span class="calculator-result"( contenteditable="false")?>.*?<\/span>/g, '').trim());
}
