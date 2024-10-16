import {EditorView, ViewUpdate} from "@codemirror/view";
import {type Extension, StateField} from "@codemirror/state";
import {mathjsEvaluate} from "./eval";
import {GutterMarker, rightHandSideGutter} from "./right_hand_side_gutter";

let mathOutputState = StateField.define({
    create(): Record<number, string | undefined> {
        return {
            1: undefined
        }
    },

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

export const myLineNumberGutter = rightHandSideGutter({
    class: "cm-lineNumbers",
    renderEmptyElements: false,
    // markers(view: EditorView) {
    //     let inputs = view.state.facet(lineNumberMarkers);
    //     return inputs;
    //
    // },
    lineMarker(view, line, others) {
        // // console.log("lineMarker")
        // // console.log('others', others)
        // if (others.some(m => m.toDOM)) return null
        // let actualLine = view.state.doc.lineAt(line.from);
        // let lineText = actualLine.text;
        // // console.log('lineText', lineText)
        // let number = formatNumber(view, -actualLine.number);
        // // console.log('number', number)
        //
        // // lineNumberMarkers.
        //
        // return new NumberMarker(number)
        // // return null

        let mathOutputStateField = view.state.field(mathOutputState);

        let lineNumber: number = view.state.doc.lineAt(line.from).number;


        console.log('mathOutputStateField', mathOutputStateField)
        console.log('lineNumber', lineNumber)
        let outputNumber = mathOutputStateField[lineNumber] ?? "";
        console.log('outputNumber', outputNumber)
        return new NumberMarker(outputNumber)
    },
    widgetMarker: (view, widget, block) => {
        // TODO: I don't think we need this
        // console.log("widgetMarker")
        // for (let m of view.state.facet(lineNumberWidgetMarker)) {
        //     let result = m(view, widget, block)
        //     if (result) return result
        // }
        return null
    },

    // A quick explanation on the spacers, as I understand them now: They calculate the width of the gutter.
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
    // domEventHandlers: state.facet(lineNumberConfig).domEventHandlers
});

export function myLineNumbers(): Extension {
    return [
        mathOutputState,
        myLineNumberGutter,
    ]
}

function maxLineNumber(lines: number) {
    let last = 9
    while (last < lines) last = last * 10 + 9
    return last
}
