import {all, create} from 'mathjs'

const config = {}
const mathjs = create(all, config)

export function mathjsEvaluate(statements: string[]): number[] {
    let scope = {};
    let results = [];

    for (let statement of statements) {
        try {
            let result = mathjs.evaluate(statement, scope);
            // math.format(ans, {precision: 14})  // '0.3'
            result = mathjs.format(result, {precision: 14});

            if (result === 'undefined') {
                result = NaN;
            }

            results.push(result);
        } catch (e) {
            results.push(NaN);
        }
    }

    return results;
}