export type CalculatorStatement = String

export function cleanTextAreContent(textAreaContent: string): string[] {
    const cleanedTextAreaContent = textAreaContent
        .replace(/<div>/g, '')
        .replace(/<\/div>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replaceAll(/ +/g, ' ');

    const lines = cleanedTextAreaContent
        .split('<br>')
        .filter(line => line.trim().length > 0);

    return lines;
}
