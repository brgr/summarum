import {expect, test} from 'vitest'
import {evaluateExpression, executeCalculations} from "../src/lib/eval";
import {CalculatorNumber, CalculatorSum, CalculatorVariable} from "../src/lib/parser";


test('test evaluateExpression simple number', () => {
    const result = evaluateExpression(CalculatorNumber(2), {})
    expect(result).toEqual(2)
})

test('test evaluateExpression simple variable', () => {
    const result = evaluateExpression(CalculatorVariable('x'), {x: 2})
    expect(result).toEqual(2)
})

test('test evaluateExpression sum of two numbers', () => {
    const result = evaluateExpression({kind: 'Sum', elements: [CalculatorNumber(2), CalculatorNumber(3)]}, {})
    expect(result).toEqual(5)
})

test('test evaluateExpression sum of two variables', () => {
    const result = evaluateExpression(CalculatorSum([CalculatorVariable('x'), CalculatorVariable('y')]), {x: 2, y: 3});
    expect(result).toEqual(5)
})

test('test evaluateExpression sum of a number and a variable', () => {
    const result = evaluateExpression(CalculatorSum([CalculatorNumber(2), CalculatorVariable('x')]), {x: 3});
    expect(result).toEqual(5)
})

test('test evaluateExpression product of two numbers', () => {
    const result = evaluateExpression({kind: 'Product', factors: [CalculatorNumber(2), CalculatorNumber(3)]}, {})
    expect(result).toEqual(6)
})

test('test evaluateExpression product of two variables', () => {
    const result = evaluateExpression({kind: 'Product', factors: [CalculatorVariable('x'), CalculatorVariable('y')]}, {x: 2, y: 3});
    expect(result).toEqual(6)
})

test('test evaluateCalcuations simple number', () => {
    const results = executeCalculations([CalculatorNumber(2)], {});
    expect(results).toEqual([2])
})

test('test evaluateCalcuations simple variable', () => {
    const results = executeCalculations([CalculatorVariable('x')], {x: 2});
    expect(results).toEqual([2])
})

test('test evaluateCalcuations simple variable assignment', () => {
    const results = executeCalculations([['x', CalculatorNumber(2)]], {});
    expect(results).toEqual([['x', 2]])
})

test('test evaluateCalcuations simple sum', () => {
    const results = executeCalculations([CalculatorSum([CalculatorNumber(2), CalculatorNumber(3)])], {});
    expect(results).toEqual([5])
})

test('test evaluateCalcuations simple product', () => {
    const results = executeCalculations([{kind: 'Product', factors: [CalculatorNumber(2), CalculatorNumber(3)]}], {});
    expect(results).toEqual([6])
})

test('test evaluateCalcuations simple sum of variables', () => {
    const results = executeCalculations([CalculatorSum([CalculatorVariable('x'), CalculatorVariable('y')])], {x: 2, y: 3});
    expect(results).toEqual([5])
})

test('test evaluateCalcuations self-assigned variable', () => {
    const results = executeCalculations([['x', CalculatorVariable('x')]], {x: 2});
    expect(results).toEqual([['x', 2]])
})
