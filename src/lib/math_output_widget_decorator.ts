import {Decoration, type DecorationSet, EditorView, ViewPlugin, ViewUpdate, WidgetType} from "@codemirror/view"
import {syntaxTree} from "@codemirror/language"
import {mathjsEvaluate} from "./eval";

export const mathOutputPlugin = ViewPlugin.fromClass(
    class {
        decorations: DecorationSet

        constructor(view: EditorView) {
            this.decorations = mathOutputDecorations(view)
        }

        update(update: ViewUpdate) {
            if (update.docChanged || update.viewportChanged ||
                syntaxTree(update.startState) != syntaxTree(update.state)) {
                this.decorations = mathOutputDecorations(update.view)
            }
        }
    },
    {decorations: v => v.decorations}
)


class MathOutputWidget extends WidgetType {
    private readonly line: string;
    private readonly scope: object;

    constructor(line: string, scope: object) {
        super();

        this.line = line;
        this.scope = scope;
    }

    toDOM() {
        let wrap = document.createElement("span")

        console.log('this.line', this.line);

        let result = mathjsEvaluate(this.line, this.scope);

        wrap.textContent = " " + result
        wrap.setAttribute("aria-hidden", "true")
        wrap.className = "cm-math-output"
        wrap.style.color = "green"
        wrap.style.padding = "0 2px"
        // wrap.style.float = "right"
        // wrap.style.marginLeft = "auto"
        wrap.style.userSelect = "none";
        wrap.style.pointerEvents = "none";
        wrap.style.position = "absolute"
        wrap.style.right = "0"

        let bigWrap = document.createElement("span")
        let spanBefore = document.createElement("span")
        // We need this spanBefore, as otherwise the cursor is shown at the right of the editor, instead of at the
        // end of the line (where it's supposed to be)
        bigWrap.appendChild(spanBefore)
        bigWrap.appendChild(wrap)
        return bigWrap
    }

    ignoreEvent() {
        return false
    }

    resultingScope() {
        return this.scope
    }
}

function mathOutputDecorations(view: EditorView) {
    let widgets = []

    for (let {from, to} of view.visibleRanges) {
        // syntaxTree(view.state).iterate({
        //     from, to,
        //     enter: (node) => {
        //         // console.log('node.name', node.name)
        //
        //         if (node.name == "Number") {
        //             console.log('node', node)
        //
        //             let deco = Decoration.widget({
        //                 widget: new MathOutputWidget(),
        //                 side: 1
        //             })
        //             widgets.push(deco.range(node.to))
        //         }
        //     }
        // })

        console.log('view.state', view.state)
        console.log('view.state.doc', view.state.doc)
        console.log('view.state.doc.toString()', view.state.doc.toString())

        // let deco = Decoration.widget({
        //     widget: new MathOutputWidget(),
        //     side: 1
        // })
        // // widgets.push(deco.range(view.state.doc))

        let scope = {}

        for (let line = 1; line < view.state.doc.lines + 1; line++) {
            let lineStart = view.state.doc.line(line).from
            let lineEnd = view.state.doc.line(line).to
            let actualLine = view.state.doc.line(line).text;

            let mathOutputWidget = new MathOutputWidget(actualLine, scope);
            let deco = Decoration.widget({
                widget: mathOutputWidget,
                side: 1
            })
            scope = mathOutputWidget.resultingScope()
            console.log('scope', scope)
            widgets.push(deco.range(lineEnd))
        }
    }
    return Decoration.set(widgets)
}

