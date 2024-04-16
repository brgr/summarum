import {expect, test} from 'vitest'
import {cleanTextAreContent} from "../src/lib/parser";

test('test cleanTextAreContent', () => {
    const results = cleanTextAreContent("2 + 3");
    expect(results).toEqual(["2 + 3"])
})