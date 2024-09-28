import {expect, test} from 'vitest'
import {mathjsEvaluate} from "../src/lib/eval";

test('test mathjsEvaluate simple number', () => {
    const result = mathjsEvaluate('2', {}).result;
    expect(result).toEqual("2")
})

test('test mathjsEvaluate simple sum', () => {
    const result = mathjsEvaluate('2 + 3', {}).result;
    expect(result).toEqual("5")
})

test('test mathjsEvaluate variables', () => {
    expect(mathjsEvaluate('x + y', {}).result).toEqual("")
})

test('test mathjsEvaluate with defined variables', () => {
    const result = mathjsEvaluate("x + y", {x: 5, y: 10}).result;
    expect(result).toEqual("15")
})

test('test empty statement', () => {
    expect(mathjsEvaluate("", {}).result).toEqual("")
})

test('test text', () => {
    expect(mathjsEvaluate("hello", {}).result).toEqual("")
})

test('test mathjsEvaluate with defined variables and number', () => {
    expect(mathjsEvaluate("x + y + 5", {x: 5, y: 10}).result).toEqual("20")
});

test('test mathjsEvaluate resulting scope', () => {
    let {result, scope} = mathjsEvaluate("x = 10", {x: 5, y: 10});
    expect(scope).toEqual({x: 10, y: 10})
});
