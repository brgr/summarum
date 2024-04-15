import {expect, test} from 'vitest'
import {parseExpression, parseLine, parseTextArea} from "../src/lib/parser";

test('test parser', () => {
    const results = parseTextArea("x = 2<br><br><div>y = x + 1</div><div><br></div><div>z = y + z<br></div>")
    // expect(results).toEqual({x: '2', y: 'x + 1', z: 'y + z'})
    expect(results).toEqual(
        [
            ['x', {kind: 'Number', value: 2}],
            ['y', {kind: 'Sum', elements: [{kind: 'Variable', name: 'x'}, {kind: 'Number', value: 1}]}],
            ['z', {kind: 'Sum', elements: [{kind: 'Variable', name: 'y'}, {kind: 'Variable', name: 'z'}]}]
        ]
    )
})

test('test parser with too much whitespace', () => {
    const results = parseTextArea("x = 2<br><br><div>  y = x + 1</div><div><br></div><div>z = y + z<br></div>")
    expect(results).toEqual(
        [
            ['x', {kind: 'Number', value: 2}],
            ['y', {kind: 'Sum', elements: [{kind: 'Variable', name: 'x'}, {kind: 'Number', value: 1}]}],
            ['z', {kind: 'Sum', elements: [{kind: 'Variable', name: 'y'}, {kind: 'Variable', name: 'z'}]}]
        ]
    )
})

test('test parser with too much whitespace 2' , () => {
    const results = parseTextArea("x = 2<br><br><div>y = x + 1</div><div><br></div><div>z = x + x&nbsp;&nbsp;&nbsp;&nbsp; + x<br></div>")
    expect(results).toEqual(
        [
            ['x', {kind: 'Number', value: 2}],
            ['y', {kind: 'Sum', elements: [{kind: 'Variable', name: 'x'}, {kind: 'Number', value: 1}]}],
            ['z', {kind: 'Sum', elements: [{kind: 'Variable', name: 'x'}, {kind: 'Variable', name: 'x'}, {kind: 'Variable', name: 'x'}]}]
        ]
    )
})

test('parse expression, only a number', () => {
    const result = parseExpression('2');
    expect(result).toEqual({kind: 'Number', value: 2})
})

test('parse expression, only a variable', () => {
    const result = parseExpression('x');
    expect(result).toEqual({kind: 'Variable', name: 'x'})
})

test('parse expression, sum of two numbers', () => {
    const result = parseExpression('2 + 3');
    expect(result).toEqual({kind: 'Sum', elements: [{kind: 'Number', value: 2}, {kind: 'Number', value: 3}]})
})

test('parse expression, sum of two variables', () => {
    const result = parseExpression('x + y');
    expect(result).toEqual({kind: 'Sum', elements: [{kind: 'Variable', name: 'x'}, {kind: 'Variable', name: 'y'}]})
})

test('parse expression, sum of a number and a variable', () => {
    const result = parseExpression('2 + x');
    expect(result).toEqual({kind: 'Sum', elements: [{kind: 'Number', value: 2}, {kind: 'Variable', name: 'x'}]})
})

test('parse expression, sum of a variable and a number', () => {
    const result = parseExpression('x + 2');
    expect(result).toEqual({kind: 'Sum', elements: [{kind: 'Variable', name: 'x'}, {kind: 'Number', value: 2}]})
})

test('parse expression, sum of a variable and a sum', () => {
    const result = parseExpression('x + y + z');
    expect(result).toEqual({kind: 'Sum', elements: [{kind: 'Variable', name: 'x'}, {kind: 'Variable', name: 'y'}, {kind: 'Variable', name: 'z'}]})
})

test('parse expression with superfluous whitespace', () => {
    const result = parseExpression('  x  +  y  ');
    expect(result).toEqual({kind: 'Sum', elements: [{kind: 'Variable', name: 'x'}, {kind: 'Variable', name: 'y'}]})
})

test('parse assignment as expression, expect error', () => {
    expect(() => parseExpression('x = 2')).toThrow()
})


test('parse statement, only a number', () => {
    const result = parseLine('2');
    expect(result).toEqual({kind: 'Number', value: 2})
})

test('parse assignment in statement', () => {
    const result = parseLine('x = 2');
    expect(result).toEqual(['x', {kind: 'Number', value: 2}])
})