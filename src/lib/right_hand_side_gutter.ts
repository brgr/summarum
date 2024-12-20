/**
 * This file here is basically the following file:
 * https://github.com/codemirror/view/blob/49e68f7cbe0440501fa666c600639fe281109d90/src/gutter.ts
 *
 * With two changes:
 *
 * 1. The gutter is put on the right hand side of the editor. For this, simply the line 150 is changed to put it after
 *    the editor instead of before.
 * 2. Multiple functions in the end, that would normally define extensions like the line number extension etc.,
 *    are removed, as they are already defined in the original gutter.ts file.
 *
 * Note that we had to re-add the whole gutter file to achieve putting it on the right hand side - I did not see
 * an easier/simpler way to do this.
 * I got the idea to create a new plugin for this from this discussion:
 * https://discuss.codemirror.net/t/is-it-possible-to-style-custom-gutter-on-right-side/3776.
 */
import {type Extension, Facet, MapMode, type RangeCursor, RangeSet, RangeValue} from "@codemirror/state"
import {BlockInfo, BlockType, Direction, EditorView, ViewPlugin, ViewUpdate, WidgetType} from "@codemirror/view"

/// A gutter marker represents a bit of information attached to a line
/// in a specific gutter. Your own custom markers have to extend this
/// class.
export abstract class GutterMarker extends RangeValue {
    /// @internal
    compare(other: GutterMarker) {
        return this == other || this.constructor == other.constructor && this.eq(other)
    }

    /// Compare this marker to another marker of the same type.
    eq(other: GutterMarker): boolean {
        return false
    }

    /// Render the DOM node for this marker, if any.
    toDOM?(view: EditorView): Node

    /// This property can be used to add CSS classes to the gutter
    /// element that contains this marker.
    elementClass!: string

    /// Called if the marker has a `toDOM` method and its representation
    /// was removed from a gutter.
    destroy(dom: Node) {
    }
}

GutterMarker.prototype.elementClass = ""
GutterMarker.prototype.toDOM = undefined
GutterMarker.prototype.mapMode = MapMode.TrackBefore
GutterMarker.prototype.startSide = GutterMarker.prototype.endSide = -1
GutterMarker.prototype.point = true

/// Facet used to add a class to all gutter elements for a given line.
/// Markers given to this facet should _only_ define an
/// [`elementclass`](#view.GutterMarker.elementClass), not a
/// [`toDOM`](#view.GutterMarker.toDOM) (or the marker will appear
/// in all gutters for the line).
export const gutterLineClass = Facet.define<RangeSet<GutterMarker>>()

/// Facet used to add a class to all gutter elements next to a widget.
/// Should not provide widgets with a `toDOM` method.
export const gutterWidgetClass =
    Facet.define<(view: EditorView, widget: WidgetType, block: BlockInfo) => GutterMarker | null>()

type Handlers = { [event: string]: (view: EditorView, line: BlockInfo, event: Event) => boolean }

interface GutterConfig {
    /// An extra CSS class to be added to the wrapper (`cm-gutter`)
    /// element.
    class?: string
    /// Controls whether empty gutter elements should be rendered.
    /// Defaults to false.
    renderEmptyElements?: boolean
    /// Retrieve a set of markers to use in this gutter.
    markers?: (view: EditorView) => (RangeSet<GutterMarker> | readonly RangeSet<GutterMarker>[])
    /// Can be used to optionally add a single marker to every line.
    lineMarker?: (view: EditorView, line: BlockInfo, otherMarkers: readonly GutterMarker[]) => GutterMarker | null
    /// Associate markers with block widgets in the document.
    widgetMarker?: (view: EditorView, widget: WidgetType, block: BlockInfo) => GutterMarker | null
    /// If line or widget markers depend on additional state, and should
    /// be updated when that changes, pass a predicate here that checks
    /// whether a given view update might change the line markers.
    lineMarkerChange?: null | ((update: ViewUpdate) => boolean)
    /// Add a hidden spacer element that gives the gutter its base
    /// width.
    initialSpacer?: null | ((view: EditorView) => GutterMarker)
    /// Update the spacer element when the view is updated.
    updateSpacer?: null | ((spacer: GutterMarker, update: ViewUpdate) => GutterMarker)
    /// Supply event handlers for DOM events on this gutter.
    domEventHandlers?: Handlers,
}

const defaults = {
    class: "",
    renderEmptyElements: false,
    elementStyle: "",
    markers: () => RangeSet.empty,
    lineMarker: () => null,
    widgetMarker: () => null,
    lineMarkerChange: null,
    initialSpacer: null,
    updateSpacer: null,
    domEventHandlers: {}
}

const activeGutters = Facet.define<Required<GutterConfig>>()

/// Define an editor gutter. The order in which the gutters appear is
/// determined by their extension priority.
export function rightHandSideGutter(config: GutterConfig): Extension {
    return [gutters(), activeGutters.of({...defaults, ...config})]
}

const unfixGutters = Facet.define<boolean, boolean>({
    combine: values => values.some(x => x)
})

/// The gutter-drawing plugin is automatically enabled when you add a
/// gutter, but you can use this function to explicitly configure it.
///
/// Unless `fixed` is explicitly set to `false`, the gutters are
/// fixed, meaning they don't scroll along with the content
/// horizontally (except on Internet Explorer, which doesn't support
/// CSS [`position:
/// sticky`](https://developer.mozilla.org/en-US/docs/Web/CSS/position#sticky)).
export function gutters(config?: { fixed?: boolean }): Extension {
    let result: Extension[] = [
        gutterView,
    ]
    if (config && config.fixed === false) result.push(unfixGutters.of(true))
    return result
}

const gutterView = ViewPlugin.fromClass(class {
    gutters: SingleGutterView[]
    dom: HTMLElement
    fixed: boolean
    prevViewport: { from: number, to: number }

    constructor(readonly view: EditorView) {
        this.prevViewport = view.viewport
        this.dom = document.createElement("div")
        this.dom.className = "cm-gutters"
        this.dom.setAttribute("aria-hidden", "true")
        this.dom.style.minHeight = (this.view.contentHeight / this.view.scaleY) + "px"
        this.gutters = view.state.facet(activeGutters).map(conf => new SingleGutterView(view, conf))
        for (let gutter of this.gutters) this.dom.appendChild(gutter.dom)
        this.fixed = !view.state.facet(unfixGutters)
        if (this.fixed) {
            // FIXME IE11 fallback, which doesn't support position: sticky,
            // by using position: relative + event handlers that realign the
            // gutter (or just force fixed=false on IE11?)
            this.dom.style.position = "sticky"
        }
        this.syncGutters(false)
        // Insert after instead of before, to put the gutter at the right hand side.
        // view.scrollDOM.insertBefore(this.dom, view.contentDOM)
        view.scrollDOM.appendChild(this.dom)
    }

    update(update: ViewUpdate) {
        if (this.updateGutters(update)) {
            // Detach during sync when the viewport changed significantly
            // (such as during scrolling), since for large updates that is
            // faster.
            let vpA = this.prevViewport, vpB = update.view.viewport
            let vpOverlap = Math.min(vpA.to, vpB.to) - Math.max(vpA.from, vpB.from)
            this.syncGutters(vpOverlap < (vpB.to - vpB.from) * 0.8)
        }
        if (update.geometryChanged) {
            this.dom.style.minHeight = (this.view.contentHeight / this.view.scaleY) + "px"
        }
        if (this.view.state.facet(unfixGutters) != !this.fixed) {
            this.fixed = !this.fixed
            this.dom.style.position = this.fixed ? "sticky" : ""
        }
        this.prevViewport = update.view.viewport
    }

    syncGutters(detach: boolean) {
        let after = this.dom.nextSibling
        if (detach) this.dom.remove()
        let lineClasses = RangeSet.iter(this.view.state.facet(gutterLineClass), this.view.viewport.from)
        let classSet: GutterMarker[] = []
        let contexts = this.gutters.map(gutter => new UpdateContext(gutter, this.view.viewport, -this.view.documentPadding.top))
        for (let line of this.view.viewportLineBlocks) {
            if (classSet.length) classSet = []
            if (Array.isArray(line.type)) {
                let first = true
                for (let b of line.type) {
                    if (b.type == BlockType.Text && first) {
                        advanceCursor(lineClasses, classSet, b.from)
                        for (let cx of contexts) cx.line(this.view, b, classSet)
                        first = false
                    } else if (b.widget) {
                        for (let cx of contexts) cx.widget(this.view, b)
                    }
                }
            } else if (line.type == BlockType.Text) {
                advanceCursor(lineClasses, classSet, line.from)
                for (let cx of contexts) cx.line(this.view, line, classSet)
            } else if (line.widget) {
                for (let cx of contexts) cx.widget(this.view, line)
            }
        }
        for (let cx of contexts) cx.finish()
        if (detach) this.view.scrollDOM.insertBefore(this.dom, after)
    }

    updateGutters(update: ViewUpdate) {
        let prev = update.startState.facet(activeGutters), cur = update.state.facet(activeGutters)
        let change = update.docChanged || update.heightChanged || update.viewportChanged ||
            !RangeSet.eq(update.startState.facet(gutterLineClass), update.state.facet(gutterLineClass),
                update.view.viewport.from, update.view.viewport.to)
        if (prev == cur) {
            for (let gutter of this.gutters) if (gutter.update(update)) change = true
        } else {
            change = true
            let gutters = []
            for (let conf of cur) {
                let known = prev.indexOf(conf)
                if (known < 0) {
                    gutters.push(new SingleGutterView(this.view, conf))
                } else {
                    this.gutters[known].update(update)
                    gutters.push(this.gutters[known])
                }
            }
            for (let g of this.gutters) {
                g.dom.remove()
                if (gutters.indexOf(g) < 0) g.destroy()
            }
            for (let g of gutters) this.dom.appendChild(g.dom)
            this.gutters = gutters
        }
        return change
    }

    destroy() {
        for (let view of this.gutters) view.destroy()
        this.dom.remove()
    }
}, {
    provide: plugin => EditorView.scrollMargins.of(view => {
        let value = view.plugin(plugin)
        if (!value || value.gutters.length == 0 || !value.fixed) return null
        return view.textDirection == Direction.LTR
            ? {left: value.dom.offsetWidth * view.scaleX}
            : {right: value.dom.offsetWidth * view.scaleX}
    })
})

function asArray<T>(val: T | readonly T[]) {
    return (Array.isArray(val) ? val : [val]) as readonly T[]
}

function advanceCursor(cursor: RangeCursor<GutterMarker>, collect: GutterMarker[], pos: number) {
    while (cursor.value && cursor.from <= pos) {
        if (cursor.from == pos) collect.push(cursor.value)
        cursor.next()
    }
}

class UpdateContext {
    cursor: RangeCursor<GutterMarker>
    i = 0

    constructor(readonly gutter: SingleGutterView, viewport: { from: number, to: number }, public height: number) {
        this.cursor = RangeSet.iter(gutter.markers, viewport.from)
    }

    addElement(view: EditorView, block: BlockInfo, markers: readonly GutterMarker[]) {
        let {gutter} = this, above = (block.top - this.height) / view.scaleY, height = block.height / view.scaleY
        if (this.i == gutter.elements.length) {
            let newElt = new GutterElement(view, height, above, markers)
            gutter.elements.push(newElt)
            gutter.dom.appendChild(newElt.dom)
        } else {
            gutter.elements[this.i].update(view, height, above, markers)
        }
        this.height = block.bottom
        this.i++
    }

    line(view: EditorView, line: BlockInfo, extraMarkers: readonly GutterMarker[]) {
        let localMarkers: GutterMarker[] = []
        advanceCursor(this.cursor, localMarkers, line.from)
        if (extraMarkers.length) localMarkers = localMarkers.concat(extraMarkers)
        let forLine = this.gutter.config.lineMarker(view, line, localMarkers)
        if (forLine) localMarkers.unshift(forLine)

        let gutter = this.gutter
        if (localMarkers.length == 0 && !gutter.config.renderEmptyElements) return
        this.addElement(view, line, localMarkers)
    }

    widget(view: EditorView, block: BlockInfo) {
        let marker = this.gutter.config.widgetMarker(view, block.widget!, block), markers = marker ? [marker] : null
        for (let cls of view.state.facet(gutterWidgetClass)) {
            let marker = cls(view, block.widget!, block)
            if (marker) (markers || (markers = [])).push(marker)
        }
        if (markers) this.addElement(view, block, markers)
    }

    finish() {
        let gutter = this.gutter
        while (gutter.elements.length > this.i) {
            let last = gutter.elements.pop()!
            gutter.dom.removeChild(last.dom)
            last.destroy()
        }
    }
}

class SingleGutterView {
    dom: HTMLElement
    elements: GutterElement[] = []
    markers: readonly RangeSet<GutterMarker>[]
    spacer: GutterElement | null = null

    constructor(public view: EditorView, public config: Required<GutterConfig>) {
        this.dom = document.createElement("div")
        this.dom.className = "cm-gutter" + (this.config.class ? " " + this.config.class : "")
        for (let prop in config.domEventHandlers) {
            this.dom.addEventListener(prop, (event: Event) => {
                let target = event.target as HTMLElement, y
                if (target != this.dom && this.dom.contains(target)) {
                    while (target.parentNode != this.dom) target = target.parentNode as HTMLElement
                    let rect = target.getBoundingClientRect()
                    y = (rect.top + rect.bottom) / 2
                } else {
                    y = (event as MouseEvent).clientY
                }
                let line = view.lineBlockAtHeight(y - view.documentTop)
                if (config.domEventHandlers[prop](view, line, event)) event.preventDefault()
            })
        }
        this.markers = asArray(config.markers(view))
        if (config.initialSpacer) {
            this.spacer = new GutterElement(view, 0, 0, [config.initialSpacer(view)])
            this.dom.appendChild(this.spacer.dom)
            this.spacer.dom.style.cssText += "visibility: hidden; pointer-events: none"
        }
    }

    update(update: ViewUpdate) {
        let prevMarkers = this.markers
        this.markers = asArray(this.config.markers(update.view))
        if (this.spacer && this.config.updateSpacer) {
            let updated = this.config.updateSpacer(this.spacer.markers[0], update)
            if (updated != this.spacer.markers[0]) this.spacer.update(update.view, 0, 0, [updated])
        }
        let vp = update.view.viewport
        return !RangeSet.eq(this.markers, prevMarkers, vp.from, vp.to) ||
            (this.config.lineMarkerChange ? this.config.lineMarkerChange(update) : false)
    }

    destroy() {
        for (let elt of this.elements) elt.destroy()
    }
}

class GutterElement {
    dom: HTMLElement
    height: number = -1
    above: number = 0
    markers: readonly GutterMarker[] = []

    constructor(view: EditorView, height: number, above: number, markers: readonly GutterMarker[]) {
        this.dom = document.createElement("div")
        this.dom.className = "cm-gutterElement"
        this.update(view, height, above, markers)
    }

    update(view: EditorView, height: number, above: number, markers: readonly GutterMarker[]) {
        if (this.height != height) {
            this.height = height
            this.dom.style.height = height + "px"
        }
        if (this.above != above)
            this.dom.style.marginTop = (this.above = above) ? above + "px" : ""
        if (!sameMarkers(this.markers, markers)) this.setMarkers(view, markers)
    }

    setMarkers(view: EditorView, markers: readonly GutterMarker[]) {
        let cls = "cm-gutterElement", domPos = this.dom.firstChild
        for (let iNew = 0, iOld = 0; ;) {
            let skipTo = iOld, marker = iNew < markers.length ? markers[iNew++] : null, matched = false
            if (marker) {
                let c = marker.elementClass
                if (c) cls += " " + c
                for (let i = iOld; i < this.markers.length; i++)
                    if (this.markers[i].compare(marker)) {
                        skipTo = i;
                        matched = true;
                        break
                    }
            } else {
                skipTo = this.markers.length
            }
            while (iOld < skipTo) {
                let next = this.markers[iOld++]
                if (next.toDOM) {
                    next.destroy(domPos!)
                    let after = domPos!.nextSibling
                    domPos!.remove()
                    domPos = after
                }
            }
            if (!marker) break
            if (marker.toDOM) {
                if (matched) domPos = domPos!.nextSibling
                else this.dom.insertBefore(marker.toDOM(view), domPos)
            }
            if (matched) iOld++
        }
        this.dom.className = cls
        this.markers = markers
    }

    destroy() {
        this.setMarkers(null as any, []) // First argument not used unless creating markers
    }
}

function sameMarkers(a: readonly GutterMarker[], b: readonly GutterMarker[]): boolean {
    if (a.length != b.length) return false
    for (let i = 0; i < a.length; i++) if (!a[i].compare(b[i])) return false
    return true
}
