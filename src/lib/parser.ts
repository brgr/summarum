
export type CalculatorNumber = {
    kind: 'Number';
    value: number;
};

export function CalculatorNumber(value: number): CalculatorNumber {
    return {kind: 'Number', value};
}

export type CalculatorVariable = {
    kind: 'Variable';
    name: string;
};

export function CalculatorVariable(name: string): CalculatorVariable {
    return {kind: 'Variable', name};
}

export type CalculatorSum = {
    kind: 'Sum';
    elements: Expression[];
};

export function CalculatorSum(elements: Expression[]): CalculatorSum {
    return {kind: 'Sum', elements};
}

export type CalculatorProduct = {
    kind: 'Product';
    factors: Expression[];
};

export type Expression = CalculatorNumber | CalculatorVariable | CalculatorSum | CalculatorProduct;
// TODO: Change this to a well-defined type
export type VariableAssignment = [string, Expression];
export type CalculatorStatement = VariableAssignment | Expression;

export function expressionToString(expression: Expression): string {
    if (expression.kind === 'Number') {
        return expression.value.toString();
    } else if (expression.kind === 'Variable') {
        return expression.name;
    } else if (expression.kind === 'Sum') {
        return expression.elements.map(expressionToString).join(' + ');
    } else if (expression.kind === 'Product') {
        return expression.factors.map(expressionToString).join(' * ');
    }
    return '';
}

export function parseExpression(expression: string): Expression {
    if (expression.includes('=')) {
        throw new Error('Expression cannot contain "=" sign. An equal sign is used for variable assignment, ' +
            'which is part of a statement, but not an expression.');
    }

    const tokens = expression
        .trim()
        .replaceAll('  ', ' ')
        .split(' ');

    const stack: Expression[] = [];
    let i = 0;

    while (i < tokens.length) {
        const token = tokens[i];

        if (token === '+') {
            const right = parseExpression(tokens[i + 1]);
            const left = stack.pop();
            if (left && left.kind === 'Sum') {
                left.elements.push(right);
                stack.push(left);
            } else {
                stack.push({kind: 'Sum', elements: [left!, right]});
            }
            i += 2;
        } else if (token === '*') {
            const right = parseExpression(tokens[i + 1]);
            const left = stack.pop();
            if (left && left.kind === 'Product') {
                left.factors.push(right);
                stack.push(left);
            } else {
                stack.push({kind: 'Product', factors: [left!, right]});
            }
            i += 2;
        } else {
            if (token.match(/^[0-9]+$/)) {
                stack.push({kind: 'Number', value: parseInt(token)});
            } else {
                stack.push({kind: 'Variable', name: token});
            }
            i++;
        }
    }

    return stack[0];
}

export function parseLine(line: string): CalculatorStatement {
    if (line.includes('=')) {
        const [variable, value] = line.split('=');
        const expression = parseExpression(value.trim());
        return [variable.trim(), expression];
    } else {
        return parseExpression(line.trim());
    }
}

export function parseTextArea(textAreaContent: string): CalculatorStatement[] {
    const cleanTextAreaContent = textAreaContent
        .replace(/<div>/g, '')
        .replace(/<\/div>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replaceAll(/ +/g, ' ');

    const lines = cleanTextAreaContent
        .split('<br>')
        .filter(line => line.trim().length > 0);
    return lines.map(parseLine);
}
