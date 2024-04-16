import {expect, test} from 'vitest'
import {parseTextAreaContent} from "../src/lib/parser";

test('test cleanTextAreContent', () => {
    const results = parseTextAreaContent("2 + 3");
    expect(results).toEqual(["2 + 3"])
})

test('test cleanTextAreContent with div', () => {
    const results = parseTextAreaContent("x = 2<span class=\"calculator-result\">2</span><br /><br />y = x + 1<span class=\"calculator-result\">3</span>");
    expect(results).toEqual(["x = 2", "y = x + 1"])
})

test('test cleanTextAreContent with div not contenteditable', () => {
    const results = parseTextAreaContent("x = 2<span class=\"calculator-result\" contenteditable=\"false\">2</span>" +
        "<br /><br />y = x + 1<span class=\"calculator-result\" contenteditable=\"false\">3</span>");
    expect(results).toEqual(["x = 2", "y = x + 1"])
})