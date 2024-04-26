import {expect, test} from 'vitest'
import {parseTextAreaContent} from "../src/lib/parser";

test('test cleanTextAreContent', () => {
    const results = parseTextAreaContent("2 + 3");
    expect(results).toEqual(["2 + 3"])
})

test('test cleanTextAreContent with div', () => {
    const results = parseTextAreaContent("<div>x = 2</div><div>y = x + 1</div>");
    expect(results).toEqual(["x = 2", "y = x + 1"])
})

test('test cleanTextAreContent with div not contenteditable', () => {
    const results = parseTextAreaContent("<div>x = 2</div>" +
        "<div>y = x + 1</div>");
    expect(results).toEqual(["x = 2", "y = x + 1"])
})

test('test cleanTextAreContent with div not contenteditable, with syntactically wrong input', () => {
    const results = parseTextAreaContent("" +
        "<div>x = </div>" +
        "<div>y = x + 1</div>");
    expect(results).toEqual([
        "x = ",
        "y = x + 1"
    ])
})

test('test cleanTextAreContent with divs', () => {
    const results = parseTextAreaContent(
        "<div>x = 2</div>" +
        "<div>y = 3</div>" +
        "<div>z = x + y</div>");
    expect(results).toEqual([
        "x = 2",
        "y = 3",
        "z = x + y"
    ])
})

test('test cleanTextAreContent with divs and empty line', () => {
    const results = parseTextAreaContent(
        "<div>x = 2</div>" +
        "<div>y = 3</div>" +
        "<div><br></div>" +
        "<div>z = x + y</div>");
    expect(results).toEqual([
        "x = 2",
        "y = 3",
        "",
        "z = x + y"
    ])
})

test('test cleanTextAreContent with divs and empty line and whitespace', () => {
    const results = parseTextAreaContent(
        "<div>x = 2</div>" +
        "<div>y = 3</div>" +
        "<div>     <br> </div>" +
        "<div>z = x + y</div>");
    expect(results).toEqual([
        "x = 2",
        "y = 3",
        "",
        "z = x + y"
    ])
})

test('test cleanTextAreaContent with multiple divs and empty lines', () => {
    const textAreaContent =
        "<div>x = 2</div>" +
        "<div>y = 3</div>" +
        "<div><br></div>" +
        "<div><br></div>" +
        "<div>10<br></div>" +
        "<div>z = x + y</div>";

    const results = parseTextAreaContent(textAreaContent);

    expect(results).toEqual([
        "x = 2",
        "y = 3",
        "",
        "",
        "10",
        "z = x + y"
    ])
})
