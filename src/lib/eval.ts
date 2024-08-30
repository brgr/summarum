import {all, create} from 'mathjs'

const config = {}
const mathjs = create(all, config)

export function mathjsEvaluate(statements: string[]): number[] {
    // try {
    //     let result = mathjs.evaluate(statements);
    //
    //     if (result.length > 0 && mathjs.isResultSet(result[0])) {
    //         return result[0].entries;
    //     } else {
    //         return result;
    //     }
    // } catch (e) {
    //     return [];
    // }

    let scope = {};
    let results = [];

    for (let statement of statements) {
        try {
            results.push(mathjs.evaluate(statement, scope));
        } catch (e) {
            results.push(NaN);
        }
    }

    return results;
}