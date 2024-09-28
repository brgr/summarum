import {all, create} from 'mathjs'

const config = {}
const mathjs = create(all, config)

interface MathJsResult {
    result: string;
    scope: object;
}

/**
 * If the evaluation fails, the result will be an empty string.
 *
 * Note that `scope` is passed by reference, so it will be modified in place.
 * This is only done because `mathjs` does it like this. Since we prefer to return it, that is what we do as well.
 * Still, it is also modified in place!
 */
export function mathjsEvaluate(line: string, scope: object): MathJsResult {
    let result = ""
    try {
        result = mathjs.evaluate(line, scope)
        // math.format(ans, {precision: 14})  // '0.3'
        result = mathjs.format(result, {precision: 14});
    } catch (e) {
        // We don't want to log the error, as we just don't evaluate it in case of error
        // console.error(e)
    }

    if (result === undefined || result === 'undefined') {
        result = "";
    }

    return {result, scope};
}
