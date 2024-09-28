import {expect, test} from 'vitest'
import {mathjsEvaluate} from "../src/lib/eval";

test('test mathjsEvaluate simple number', () => {
    const results = mathjsEvaluate('2', {});
    expect(results).toEqual("2")
})

test('test mathjsEvaluate simple sum', () => {
    const results = mathjsEvaluate('2 + 3', {});
    expect(results).toEqual("5")
})

test('test mathjsEvaluate variables', () => {
    expect(mathjsEvaluate('x + y', {})).toEqual("")
})

test('test mathjsEvaluate with defined variables', () => {
    const results = mathjsEvaluate("x + y", {x: 5, y: 10});
    expect(results).toEqual("15")
})

test('test empty statement', () => {
    expect(mathjsEvaluate("", {})).toEqual("")
})

test('test text', () => {
    expect(mathjsEvaluate("hello", {})).toEqual("")
})
