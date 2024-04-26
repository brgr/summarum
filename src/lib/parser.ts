
export function parseTextAreaContent(textAreaContent: string): string[] {
    let cleanedTextAreaContent = textAreaContent
        .replace(/<div> *<br> *<\/div>/g, '<br>')
        .replace(/<div>/g, '<br>')
        // If we have an empty line, and then add stuff there, we'll get a <br> at the end of the line (before the closing </div>)
        // Here we remove that, so we don't get a wrong empty line in the result
        .replace(/<br><\/div>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replaceAll(/ +/g, ' ');

    if (cleanedTextAreaContent.startsWith('<br>')) {
        cleanedTextAreaContent = cleanedTextAreaContent.slice(4);
    }

    const lines = cleanedTextAreaContent
        .split(/<br>/)
        .map(line => line
            .replace(/<\/div>/g, '')
            .replace(/<div>/g, '')
        );

    return lines.map(line =>
        line.replace(/<span class="calculator-result"( contenteditable="false")?>.*?<\/span>/g, ''));
}
