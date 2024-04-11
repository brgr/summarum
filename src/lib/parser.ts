export function parseTextArea(textAreaContent: string): Record<string, string> {
    console.log("called");
    const results: Record<string, string> = {};

    const cleanTextAreaContent = textAreaContent
        .replace(/<div>/g, '')
        .replace(/<\/div>/g, '');

    const lines = cleanTextAreaContent.split('<br>');

    lines.forEach(line => {
        if (line.includes('=')) {
            const [variable, value] = line.split('=');
            results[variable.trim()] = value.trim();
        }
    });

    return results;
}
