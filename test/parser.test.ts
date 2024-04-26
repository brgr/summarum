import {expect, test} from 'vitest'
import {parseTextAreaContent} from "../src/lib/parser";

test('test cleanTextAreContent', () => {
    const results = parseTextAreaContent("2 + 3");
    expect(results).toEqual(["2 + 3"])
})

test('test cleanTextAreContent with div', () => {
    const results = parseTextAreaContent("<div>x = 2</div><br /><br /><div>y = x + 1</div>");
    expect(results).toEqual(["x = 2", "y = x + 1"])
})

test('test cleanTextAreContent with div not contenteditable', () => {
    const results = parseTextAreaContent("<div>x = 2</div>" +
        "<br /><div>y = x + 1</div>");
    expect(results).toEqual(["x = 2", "y = x + 1"])
})

test('test cleanTextAreContent with div not contenteditable, with syntactically wrong input', () => {
    const results = parseTextAreaContent("<div>x = </div>" +
        "<br /><br /><div>y = x + 1</div>");
    expect(results).toEqual(["x = ", "y = x + 1"])
})