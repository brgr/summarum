import {BlockInfo, BlockType, Direction, EditorView, ViewPlugin, ViewUpdate, WidgetType} from "@codemirror/view";
import {gutterLineClass, GutterMarker, mygutter} from "./mygutter";
import {combineConfig, EditorState, type Extension, Facet, RangeSet, StateEffect, StateField} from "@codemirror/state";

type Handlers = { [event: string]: (view: EditorView, line: BlockInfo, event: Event) => boolean }

// TODO:
// I'm at the point where I recreated my own line number markers in output_math_gutter.ts - now I need to change that to our needs!


interface LineNumberConfig {
    /// How to display line numbers. Defaults to simply converting them
    /// to string.
    formatNumber?: (lineNo: number, state: EditorState) => string
}

interface MathOutputConfig {
    /// How to display line numbers. Defaults to simply converting them
    /// to string.
    formatResult?: (lineNumber: number, state: EditorState) => string
    // TODO: Do we need the following?
    /// Supply event handlers for DOM events on this gutter.
    domEventHandlers?: Handlers
}

/// Facet used to provide markers to the line number gutter.
export const lineNumberMarkers = Facet.define<RangeSet<GutterMarker>>({
    combine(input) {
        // console.log("this input", input)
        return input;
    }
})

const lineNumberMarkersThingy = lineNumberMarkers.compute(["selection"], state => {
    let linePos = state.doc.lineAt(state.selection.main.head).number
    console.log('thing pos', linePos)

    let totalLines = state.doc.lines;

    // create array of numbers of size of totalLines
    let ranges = Array.from({length: totalLines}, (_, i) => i + 1);
    console.log('ranges', ranges)

    let rangesForSet = ranges.map((lineNumber) => {
        let posAtLine = state.doc.line(lineNumber).from;
        let lineNumberToPrint = 0;
        if (lineNumber % 2 == 0) {
            lineNumberToPrint = lineNumber;
        }
        return new NumberMarker(lineNumberToPrint.toString()).range(state.doc.lineAt(posAtLine).from)
    });
    console.log('ranges', rangesForSet)
    let newRangeSet = RangeSet.of(
        rangesForSet
    );

    console.log('newRangeSet', newRangeSet)

    // TODO: I think now here we can recompute the mathjs stuff!
    // But still.... where/how do we handle the SCOPE ???
    // return RangeSet.of([new NumberMarker(linePos.toString()).range(state.doc.lineAt(0).from)])
    return newRangeSet
})

// Note: I don't think we need this
/// Facet used to create markers in the line number gutter next to widgets.
// export const lineNumberWidgetMarker = Facet.define<(view: EditorView, widget: WidgetType, block: BlockInfo) => GutterMarker | null>()


// A note on this: We need to define configs via this facet way. Tbh, I don't fully understand it and I'm not even sure
// that we need it. But it was done like this for lineNumberConfig, so I will do it also like this for now.
// What we basically do here is to just use our default config. I _think_ that a user could overwrite this config
// if needed.
const lineNumberConfig = Facet.define<LineNumberConfig, Required<LineNumberConfig>>({
    combine(values) {
        let defaults = {formatNumber: String};
        return combineConfig<Required<LineNumberConfig>>(values, defaults, {})
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

function formatNumber(view: EditorView, number: number) {
    return view.state.facet(lineNumberConfig).formatNumber(number, view.state)
}

export const myLineNumberGutter = mygutter({
    class: "cm-lineNumbers",
    renderEmptyElements: false,
    markers(view: EditorView) {
        console.log("markers")
        let inputs = view.state.facet(lineNumberMarkers);

        return inputs;

    },
    lineMarker(view, line, others) {
        // console.log("lineMarker")
        // console.log('others', others)
        if (others.some(m => m.toDOM)) return null
        let actualLine = view.state.doc.lineAt(line.from);
        let lineText = actualLine.text;
        // console.log('lineText', lineText)
        let number = formatNumber(view, -actualLine.number);
        // console.log('number', number)

        // lineNumberMarkers.

        return new NumberMarker(number)
        // return null
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
    lineMarkerChange: update => update.startState.facet(lineNumberConfig) != update.state.facet(lineNumberConfig),

    // A quick explanation on the spacers, as I understand them now: They calculate the width of the gutter.
    // This is important if we have numbers with different amount of digits (1-9, 10-99, 100-999, ...). We will need
    // the maximum width of the gutter to align the numbers correctly. For example, if down below our lines go over 100,
    // we don't want the space to switch suddenly, but to be always the same!
    // This is why we calculate the maxLineNumber and then use it to calculate the width of the gutter.
    initialSpacer(view: EditorView) {
        return new NumberMarker(formatNumber(view, maxLineNumber(view.state.doc.lines)))
    },
    updateSpacer(spacer: GutterMarker, update: ViewUpdate) {
        let max = formatNumber(update.view, maxLineNumber(update.view.state.doc.lines))
        return max == (spacer as NumberMarker).number ? spacer : new NumberMarker(max)
    },
    // domEventHandlers: state.facet(lineNumberConfig).domEventHandlers
});

export function myLineNumbers(): Extension {
    return [
        myLineNumberGutter,
        lineNumberConfig.of({formatNumber: number => number.toString()}),
        lineNumberMarkersThingy
    ]
}

function maxLineNumber(lines: number) {
    let last = 9
    while (last < lines) last = last * 10 + 9
    return last
}
