import {expect, test} from 'vitest'
import {mathjsLanguage} from "../../src/lib/mathjs_lezer";

test('test mathjs language parser', () => {
    let x = mathjsLanguage.parser.parse("1 + 2")

    expect(x.type.name).toBe("MathJs")
    expect(x.children.length).toBe(1)

    let firstChild = x.topNode.firstChild;
    expect(firstChild.type.name).toBe("Number")
    expect(firstChild.from).toBe(0)
    expect(firstChild.to).toBe(1)

    let secondChild = x.topNode.firstChild.nextSibling;
    expect(secondChild.type.name).toBe("SomethingElse")
    expect(secondChild.from).toBe(2)
    expect(secondChild.to).toBe(3)

    let thirdChild = secondChild.nextSibling;
    expect(thirdChild.type.name).toBe("Number")
    expect(thirdChild.from).toBe(4)
    expect(thirdChild.to).toBe(5)
})

test('test mathjs language parser 2', () => {
    let x = mathjsLanguage.parser.parse("1+2")

    expect(x.type.name).toBe("MathJs")
    expect(x.children.length).toBe(1)

    let firstChild = x.topNode.firstChild;
    expect(firstChild.type.name).toBe("Number")
    expect(firstChild.from).toBe(0)
    expect(firstChild.to).toBe(1)

    let secondChild = x.topNode.firstChild.nextSibling;
    expect(secondChild.type.name).toBe("SomethingElse")
    expect(secondChild.from).toBe(1)
    expect(secondChild.to).toBe(2)

    let thirdChild = secondChild.nextSibling;
    expect(thirdChild.type.name).toBe("Number")
    expect(thirdChild.from).toBe(2)
    expect(thirdChild.to).toBe(3)
})
