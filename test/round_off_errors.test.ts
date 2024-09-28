import {expect, test} from 'vitest'
import {mathjsEvaluate} from "../src/lib/eval";


test('test eval 0.1 + 0.2', () => {
    const result = mathjsEvaluate('0.1 + 0.2', {}).result;
    expect(result).toEqual('0.3')
})
