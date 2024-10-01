import {BlockInfo, BlockType, Direction, EditorView, ViewPlugin, ViewUpdate, WidgetType} from "@codemirror/view";
import {gutterLineClass, GutterMarker, mygutter} from "./mygutter";
import {combineConfig, EditorState, type Extension, Facet, RangeSet} from "@codemirror/state";

type Handlers = {[event: string]: (view: EditorView, line: BlockInfo, event: Event) => boolean}

interface LineNumberConfig {
    /// How to display line numbers. Defaults to simply converting them
    /// to string.
    formatNumber?: (lineNo: number, state: EditorState) => string
    /// Supply event handlers for DOM events on this gutter.
    domEventHandlers?: Handlers
}

/// Facet used to provide markers to the line number gutter.
export const lineNumberMarkers = Facet.define<RangeSet<GutterMarker>>()

/// Facet used to create markers in the line number gutter next to widgets.
export const lineNumberWidgetMarker = Facet.define<(view: EditorView, widget: WidgetType, block: BlockInfo) => GutterMarker | null>()


const lineNumberConfig = Facet.define<LineNumberConfig, Required<LineNumberConfig>>({
    combine(values) {
        return combineConfig<Required<LineNumberConfig>>(values, {formatNumber: String, domEventHandlers: {}}, {
            domEventHandlers(a: Handlers, b: Handlers) {
                let result: Handlers = Object.assign({}, a)
                for (let event in b) {
                    let exists = result[event], add = b[event]
                    result[event] = exists ? (view, line, event) => exists(view, line, event) || add(view, line, event) : add
                }
                return result
            }
        })
    }
})


class NumberMarker extends GutterMarker {
    constructor(readonly number: string) { super() }

    eq(other: NumberMarker) { return this.number == other.number }

    toDOM() { return document.createTextNode(this.number) }
}

function formatNumber(view: EditorView, number: number) {
    return view.state.facet(lineNumberConfig).formatNumber(number, view.state)
}

export const myLineNumberGutter = mygutter({
    class: "cm-lineNumbers",
    renderEmptyElements: false,
    markers(view: EditorView) { return view.state.facet(lineNumberMarkers) },
    lineMarker(view, line, others) {
        if (others.some(m => m.toDOM)) return null
        return new NumberMarker(formatNumber(view, view.state.doc.lineAt(line.from).number))
    },
    widgetMarker: (view, widget, block) => {
        for (let m of view.state.facet(lineNumberWidgetMarker)) {
            let result = m(view, widget, block)
            if (result) return result
        }
        return null
    },
    lineMarkerChange: update => update.startState.facet(lineNumberConfig) != update.state.facet(lineNumberConfig),
    initialSpacer(view: EditorView) {
        return new NumberMarker(formatNumber(view, maxLineNumber(view.state.doc.lines)))
    },
    updateSpacer(spacer: GutterMarker, update: ViewUpdate) {
        let max = formatNumber(update.view, maxLineNumber(update.view.state.doc.lines))
        return max == (spacer as NumberMarker).number ? spacer : new NumberMarker(max)
    },
    // domEventHandlers: state.facet(lineNumberConfig).domEventHandlers
});

function maxLineNumber(lines: number) {
    let last = 9
    while (last < lines) last = last * 10 + 9
    return last
}
