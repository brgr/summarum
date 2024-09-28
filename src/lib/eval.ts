import {all, create} from 'mathjs'

const config = {}
const mathjs = create(all, config)

export function mathjsEvaluate(line: string, scope: object) {
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
    return result;
}
