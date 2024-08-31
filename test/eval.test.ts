import {expect, test} from 'vitest'
import {mathjsEvaluate} from "../src/lib/eval";

test('test mathjsEvaluate simple number', () => {
    const results = mathjsEvaluate(['2']);
    expect(results).toEqual(["2"])
})

test('test mathjsEvaluate simple sum', () => {
    const results = mathjsEvaluate(['2 + 3']);
    expect(results).toEqual(["5"])
})

test('test mathjsEvaluate variables', () => {
    expect(mathjsEvaluate(['x + y'])).toEqual([NaN]);
})

test('test mathjsEvaluate with defined variables', () => {
    const results = mathjsEvaluate(["x = 10", "y = 5", "x + y"]);
    expect(results).toEqual(["10", "5", "15"])
})

test('test empty statement', () => {
    expect(mathjsEvaluate([""])).toEqual([NaN]);
})

test('test empty statement 2', () => {
    expect(mathjsEvaluate(["", ""])).toEqual([NaN, NaN]);
})

test('test empty statement 3', () => {
    expect(mathjsEvaluate(["", "2"])).toEqual([NaN, "2"]);
})

test('test empty statement 4', () => {
    expect(mathjsEvaluate(["2", ""])).toEqual(["2", NaN]);
})

test('test text', () => {
    expect(mathjsEvaluate(["hello"])).toEqual([NaN]);
})