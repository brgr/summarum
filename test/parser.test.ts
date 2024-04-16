import {expect, test} from 'vitest'
import {parseTextAreaContent} from "../src/lib/parser";

test('test cleanTextAreContent', () => {
    const results = parseTextAreaContent("2 + 3");
    expect(results).toEqual(["2 + 3"])
})