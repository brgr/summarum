import {EditorView, ViewUpdate} from "@codemirror/view";
import {type Extension, StateField} from "@codemirror/state";
import {mathjsEvaluate} from "./eval";
import {GutterMarker, rightHandSideGutter} from "./right_hand_side_gutter";

/**
 * Keeps track of the output / results of the math expressions in the gutter.
 *
 * Every line is supposed to be a math expression, and thus every line gets a result (an output).
 *
 * In reality, however, not every line is going to be a math expression - some lines will be comments for example.
 * When we cannot calculate the result of a line, we will store `undefined` as the result.
 */
let mathResultsState = StateField.define({
    create(): Record<number, string | undefined> {
        return {
            1: undefined
        }
    },

    // TODO: In the future, improve this!
    // This works now well! I can still optimize it a lot:
    // 1. I can store the scope of each line, and update only from the edited line forward
    // 2. I could even store where variables are kept, and only update these lines
    // But for now, this is good enough!
    update(value, tr) {
        if (tr.docChanged) {
            let newDoc = tr.newDoc;
            let lines = newDoc.lines;

            let resultValue: Record<number, string> = {}

            let scope = {};

            for (let i = 1; i <= lines; i++) {
                let line = newDoc.line(i);
                let lineText = line.text;
                let result = mathjsEvaluate(lineText, scope);
                resultValue[i] = result.result;
            }

            return resultValue;

        }
        return value;
    }
})

class NumberMarker extends GutterMarker {
    constructor(readonly number: string) {
        super()
    }

    eq(other: NumberMarker) {
        return this.number == other.number
    }

    toDOM() {
        return document.createTextNode(this.number)
    }
}

export const mathResultsGutter = rightHandSideGutter({
    class: "cm-mathResults",
    renderEmptyElements: false,
    lineMarker(view, line, _others) {
        let mathOutputStateField = view.state.field(mathResultsState);
        let lineNumber: number = view.state.doc.lineAt(line.from).number;
        let outputNumber = mathOutputStateField[lineNumber] ?? "";
        return new NumberMarker(outputNumber)
    },

    // The spacers calculate the width of the gutter.
    // This is important if we have numbers with different amount of digits (1-9, 10-99, 100-999, ...). We will need
    // the maximum width of the gutter to align the numbers correctly. For example, if down below our lines go over 100,
    // we don't want the space to switch suddenly, but to be always the same!
    // This is why we calculate the maxLineNumber and then use it to calculate the width of the gutter.
    initialSpacer(view: EditorView) {
        return new NumberMarker(maxLineNumber(view.state.doc.lines).toString())
    },
    updateSpacer(spacer: GutterMarker, update: ViewUpdate) {
        let max = maxLineNumber(update.view.state.doc.lines).toString()
        return max == (spacer as NumberMarker).number ? spacer : new NumberMarker(max)
    },
});

export function mathResults(): Extension {
    return [
        mathResultsState,
        mathResultsGutter,
    ]
}

function maxLineNumber(lines: number) {
    let last = 9
    while (last < lines) last = last * 10 + 9
    return last
}
