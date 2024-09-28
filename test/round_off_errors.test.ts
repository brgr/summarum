import {expect, test} from 'vitest'
import {mathjsEvaluate} from "../src/lib/eval";


test('test eval 0.1 + 0.2', () => {
    const results = mathjsEvaluate('0.1 + 0.2', {});
    expect(results).toEqual('0.3')
})
