import {expect, test} from 'vitest'
import {parseTextAreaContent} from "../src/lib/parser";


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
        "      ",
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


// <div class="calculator-textarea s-16n4bFnZIZsn" contenteditable=""><div style="height: 36px;">3</div><div style="height: 36px;">4<br></div></div>
test('test cleanTextAreaContent with multiple divs and empty lines', () => {
    const textAreaContent =
        "<div style=\"height: 36px;\">3</div>" +
        "<div style=\"height: 36px;\">4<br></div>";


    // TODO: I think I got the jsdom stuff now. Now I just need to make it work!
    //  Note: Maybe it makes sense to just always use jsdom? Then the actual behavior will always be the same, no?
    const results = parseTextAreaContent(textAreaContent);

    expect(results).toEqual([
        "3",
        "4"
    ])
})