
// TODO: I need to begin parsing into well-defined types
type VariableAssignment = [string, string];


function parseLine(line: string): VariableAssignment | undefined {
    let lineResult: VariableAssignment | undefined = undefined;

    if (line.includes('=')) {
        const [variable, value] = line.split('=');
        lineResult = [variable, value];
    }

    return lineResult;
}

export function parseTextArea(textAreaContent: string): Record<string, string> {
    const results: Record<string, string> = {};

    const cleanTextAreaContent = textAreaContent
        .replace(/<div>/g, '')
        .replace(/<\/div>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replaceAll(/ +/g, ' ');

    const lines = cleanTextAreaContent.split('<br>');

    lines.forEach(line => {
        const lineResult = parseLine(line);
        if (lineResult) {
            const [variable, value] = lineResult;
            results[variable.trim()] = value.trim();
        }
    });

    return results;
}
