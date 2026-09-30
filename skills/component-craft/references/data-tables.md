# Data tables and dense interfaces

Use this for dashboards, operational tools and data-heavy comparison. Preserve the project's table library, data contracts and brand system. Craft comes from making a difficult decision easier: stable columns, explicit units, informative states and precise feedback.

## Choose semantics from the interaction

Use a native `<table>` with a caption, header cells and appropriate `scope` for tabular comparisons. Put actual buttons, links and inputs inside cells for actions. Do not make an entire row a button containing other controls. A row detail link and a selection checkbox have separate names and targets.

Use an ARIA grid only when the task genuinely needs spreadsheet-like cell navigation or editing, and the implementation supplies the complete keyboard model. Adding `role="grid"` alone removes useful native expectations without implementing navigation. Prefer the project's tested grid component. Consult the [WAI table pattern](https://www.w3.org/WAI/ARIA/apg/patterns/table/) and [grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) for the chosen model.

## Define what the data means

| Decision | Required behavior |
| --- | --- |
| Numeric columns | Align values and units consistently; use tabular numerals. Distinguish zero, missing, unavailable and loading |
| Sorting | Put a named button in the header and update `aria-sort` on the active sorted header. Keep focus on the initiating control; use a stable tie-breaker |
| Filtering | Show active filters, resulting count and clear/reset controls. Distinguish an empty dataset from no matching results |
| Selection | Key selection by stable record ID. State whether “select all” means visible page or all filtered results. Explain what survives filtering and pagination |
| Bulk actions | Show selected count and scope near the action; disabled controls explain prerequisites. Preserve recoverable selection after a failed request |
| Async results | Keep prior data visibly marked during refresh when useful. Ignore stale responses; reconcile removed records and preserve a valid focus destination |
| Row actions | Use specific names such as “Edit SKU 123.” Avoid making keyboard users traverse invisible hover-only controls |
| Charts | Label axes, units and periods; provide a textual summary and accessible data alternative. Do not encode series or status by color alone |

Announce meaningful sort/filter completion through a concise status region when the changed content otherwise goes unnoticed. Avoid reading the full table after every change. Keep raw values for calculations and sort; format only presentation using the user's locale.

## Compose for narrow views

Determine which columns must remain together for the task. A labeled local horizontal scroll region can preserve comparison more faithfully than splitting every record into a card. Keep its scrollbar or another clear scroll cue visible, and make it keyboard scrollable when needed. A sticky identifying column must not cover focused controls or consume the entire narrow view.

Reflow search, filters and actions separately from the table. Use progressive column disclosure with a reachable detail view when secondary data can move; do not silently remove decision-critical values. Test enlarged text, long identifiers, translated headers and short landscape views. Density should improve comparison without shrinking hit areas or hiding labels.

Virtualize only when measured record volume justifies it. Test focus when rows unmount, announced positions/counts, selection across pages and access to offscreen content. Pagination is often a simpler accessible alternative. Do not claim browser find or assistive-technology access to data that is not rendered.

## Verify a real decision

Compare two actual records, sort, filter to zero results, restore results, select across pages, run an available bulk action and recover from an error. Check keyboard focus, pending requests arriving out of order, row removal, narrow-screen scrolling and zoom. Record what was observed; a static table screenshot cannot establish selection or editing behavior.
