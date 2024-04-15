import {type CalculatorStatement, type Expression} from "./parser";

export type CalculatorResult = [string, number] | number;

export function evaluateExpression(expression: Expression, variables: Record<string, number> = {}): number {
    console.log(expression, variables);

    if (expression.kind === 'Number') {
        return expression.value;
    } else if (expression.kind === 'Variable') {
        return variables[expression.name] ?? NaN;
    } else if (expression.kind === 'Sum') {
        return expression.elements.reduce((sum, expr) => sum + evaluateExpression(expr, variables), 0);
    } else if (expression.kind === 'Product') {
        return expression.factors.reduce((product, expr) => product * evaluateExpression(expr, variables), 1);
    }
    throw new Error(`Invalid expression: ${JSON.stringify(expression)}`);
}


export function executeCalculations(
    statements: CalculatorStatement[],
    variables: Record<string, number>
): CalculatorResult[] {
    const results: CalculatorResult[] = new Array(statements.length);

    for (let i = 0; i < results.length; i++) {
        const statement = statements[i];

        if (Array.isArray(statement)) {
            const [variable, expression] = statement;
            const result = evaluateExpression(expression, variables);
            variables[variable] = result;
            results[i] = [variable, result];
        } else {
            results[i] = evaluateExpression(statement, variables);
        }
    }

    return results;
}
