import {expect, test} from 'vitest'
import {parseTextArea} from "../src/lib/parser";

test('test parser', () => {
    const results = parseTextArea("x = 2<br><br><div>y = x + 1</div><div><br></div><div>z = y + z<br></div>")
    expect(results).toEqual({x: '2', y: 'x + 1', z: 'y + z'})
})

test('test parser with too much whitespace', () => {
    const results = parseTextArea("x = 2<br><br><div>  y = x + 1</div><div><br></div><div>z = y + z<br></div>")
    expect(results).toEqual({x: '2', y: 'x + 1', z: 'y + z'})
})

test('test parser with too much whitespace 2' , () => {
    const results = parseTextArea("x = 2<br><br><div>y = x + 1</div><div><br></div><div>z = x + x&nbsp;&nbsp;&nbsp;&nbsp; + x<br></div>")
    expect(results).toEqual({x: '2', y: 'x + 1', z: 'x + x + x'})
})