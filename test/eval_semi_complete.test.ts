import {expect, test} from 'vitest'
import {mathjsEvaluate} from "../src/lib/eval";

test('test unfinished statement', () => {
    expect(mathjsEvaluate(["x = 10", "y = "])).toEqual([10, NaN]);
})


test('test unfinished statement 2', () => {
    expect(mathjsEvaluate(["x = 10", "y = ", "x"])).toEqual([10, NaN, 10]);
})

test('test unfinished statement', () => {
    expect(mathjsEvaluate(["x = 10", "y = 5", "x + "])).toEqual([10, 5, NaN]);
})
