import React, { useState, useEffect, useRef } from "react";
// ─────────────────────────────────────────────────────────────
// MATH11160 SHIFT BOARD v3 — HD EXAM EDITION
// New in v3:
//  • Exam Room: the REAL 2020 & 2024 final papers, fully worked,
//    with self-marking → mock /40 score and an HD line.
//  • Which Method?: a cue → method decision guide for every
//    exam question type (your "how do I know what to do" system).
//  • Practice Range rebuilt to work offline (no flaky API call).
//  • Storage hardened so progress saves everywhere.
//  • Formula sheet expanded to the full exam toolkit.
// Built from your actual tutorial PDFs + past exam papers.
// ─────────────────────────────────────────────────────────────
const WEEKS = [
  { n: 1, title: "Functions & Graphs", tag: "mining", blurb: "Inputs and outputs — like ore in, concentrate out. Domain, range, inverse functions.", example: "Crusher throughput: tonnes in → product out", examQ: "Q1" },
  { n: 2, title: "Polynomial Functions", tag: "golf", blurb: "Lines and parabolas. The flight of a golf ball is a quadratic.", example: "Ball flight height vs distance = parabola", examQ: "Q1" },
  { n: 3, title: "Exponentials & Logs", tag: "mining", blurb: "Growth and decay curves. Equipment value, ore grade decline, compound interest.", example: "Truck value depreciating 20% per year", examQ: "Q1" },
  { n: 4, title: "Trig & Hyperbolic", tag: "golf", blurb: "Angles, waves, launch angles. Sin, cos, tan, identities and trig equations.", example: "Launch angle vs carry distance off the tee", examQ: "Q1" },
  { n: 5, title: "Calculus I — Limits & Derivatives", tag: "mining", blurb: "Rates of change. How fast is the stockpile growing right now?", example: "Conveyor feed rate at an exact instant", examQ: "Q2" },
  { n: 6, title: "Calculus II — Differentiation Techniques", tag: "golf", blurb: "Chain, product, quotient rules. Tangent and normal lines.", example: "Clubhead speed at impact (slope of the swing curve)", examQ: "Q2" },
  { n: 7, title: "Calculus III — Max/Min & Applications", tag: "mining", blurb: "Optimisation. Critical points, 1st & 2nd derivative tests.", example: "Haul road gradient that minimises fuel burn", examQ: "Q2" },
  { n: 8, title: "Calculus IV — Integration", tag: "mining", blurb: "Adding up small pieces. Reverse of differentiation.", example: "Total tonnes hauled from a varying feed rate", examQ: "Q3" },
  { n: 9, title: "Calculus V — Definite Integration", tag: "golf", blurb: "Area under curves, area between curves, kinematics.", example: "Total distance from a speed-time graph", examQ: "Q3" },
  { n: 10, title: "Vectors", tag: "mining", blurb: "Magnitude and direction. Dot product, cross product, forces.", example: "Drag-line bucket force split into components", examQ: "Q4" },
  { n: 11, title: "Complex Numbers", tag: "mining", blurb: "Real + imaginary parts. Rectangular, polar and exponential forms.", example: "AC power calcs on site electrics", examQ: "Q4" },
  { n: 12, title: "Systems of Linear Equations", tag: "mining", blurb: "Solving several unknowns at once with Gauss elimination.", example: "Blending ore grades to hit a target spec", examQ: "Q4" },
];
// ── REAL questions from your tutorial PDFs ───────────────────
const QBANK = {
  1: [
    {
      src: "4.1 Q1 · Plot",
      q: "Plot y = −x² + x + 2 as a graph in the range [−4, 4] for x.",
      hook: "⛳ Shape analogy only: this curve is SHAPED like a ball flight (up, over, down). The numbers are not metres, and the parts below zero have no golf meaning — the skill being practised is the charting.",
      hint: "Build a table: pick x values, calculate y for each, plot the dots, join them.",
      steps: [
        { do: "Understand the job", math: "y = −x² + x + 2", why: "This is a recipe: feed in an x, it spits out a y. 'Plot' means do this many times and draw the dots. x² just means x times x." },
        { do: "Start with the easiest value", math: "x = 0  →  y = −0 + 0 + 2 = 2", why: "Always try x = 0 first — most terms vanish. First dot: (0, 2)." },
        { do: "A couple more easy ones", math: "x = 1 → y = −1 + 1 + 2 = 2     x = 2 → y = −4 + 2 + 2 = 0", why: "Dots at (1, 2) and (2, 0) — the curve touches the ground at x = 2." },
        { do: "Negative x — THE TRAP", math: "x = −4:  (−4)² = +16, then  y = −16 + (−4) + 2 = −18", why: "Square FIRST (negative × negative = positive), THEN the minus out front flips it. This is where marks get lost." },
        { do: "Find the other ground-touch", math: "x = −1 → y = −1 + (−1) + 2 = 0", why: "Dot at (−1, 0). The two landing points are x = −1 and x = 2." },
        { do: "Plot and join", why: "Smooth curve through the dots: an upside-down U peaking just past x = 0.5 — exactly the chart above." },
      ],
      ans: "Downward parabola: lands at x = −1 and x = 2, peak near (0.5, 2.25)"
    },
    {
      src: "4.1 Q2a · Domain",
      q: "Determine the domain of y = √(x + 2)",
      hook: "⛏️ Rule-rhyme, not a model: the same way a stockpile can't hold negative tonnes, a square root can't hold a negative number. Same 'no negatives' rule — that's the whole connection.",
      hint: "Whatever is inside the √ must be zero or bigger. Write that rule down, then solve it.",
      steps: [
        { do: "Know what 'domain' means", why: "The list of x values you're allowed to feed in without the maths breaking. That's literally all it is." },
        { do: "Spot the danger", math: "√(x + 2)", why: "Square roots can't take negatives — try √(−4) on the Casio and it errors. So the INSIDE must be zero or bigger." },
        { do: "Write the rule", math: "x + 2 ≥ 0", why: "The symbol ≥ means 'greater than or equal to'." },
        { do: "Get x alone: subtract 2 from BOTH sides", math: "x ≥ −2", why: "Whatever you do to one side, do to the other — like taking equal weight off both sides of a scale." },
        { do: "Write it in interval notation", math: "[−2, ∞)", why: "Square bracket = −2 itself IS included (√0 = 0, no error). Round bracket always sits next to ∞ — you can never reach infinity. Matches the green zone above." },
      ],
      ans: "Domain = [−2, ∞)"
    },
    {
      src: "4.1 Q2b · Domain",
      q: "Determine the domain of y = −x² + 4",
      hook: "⛳ Any swing speed gives SOME ball flight — can anything here actually break?",
      hint: "Run the checklist: square root? fraction? log? If none, nothing can break.",
      steps: [
        { do: "Run the danger checklist", math: "−x² + 4", why: "Square root? No. Fraction with x on the bottom? No. Log? No. Nothing on the danger list." },
        { do: "Confirm squaring is always safe", math: "(−7)² = 49 ✓    0² = 0 ✓    3² = 9 ✓", why: "Squaring works for ANY number. Adding 4 and flipping the sign are safe too." },
        { do: "Answer", math: "(−∞, ∞)", why: "Every real number is a legal input — the whole number line is green." },
      ],
      ans: "Domain = all real numbers, (−∞, ∞)"
    },
    {
      src: "4.1 Q2c · Domain",
      q: "Determine the domain of y = (x² + x − 2) / (x² − 3x + 2)",
      hook: "⛏️ Tonnes per truck with zero trucks — the calc blows up. Bottoms of fractions can never be zero.",
      hint: "Only the BOTTOM matters. Factor it to find which x values make it zero — those are banned.",
      steps: [
        { do: "Spot the danger", math: "bottom: x² − 3x + 2", why: "Fractions break when the BOTTOM hits zero (5 ÷ 0 = error on the Casio). The top can be anything — only the bottom can hurt you." },
        { do: "Factor the bottom", math: "x² − 3x + 2 = (x − 1)(x − 2)", why: "Find two numbers that MULTIPLY to +2 and ADD to −3. That's −1 and −2. (Check by expanding back out.)" },
        { do: "Find the banned values", math: "(x − 1)(x − 2) = 0  →  x = 1  or  x = 2", why: "Two things multiply to zero only when at least ONE of them is zero." },
        { do: "Answer", math: "all x except 1 and 2", why: "Those two inputs blow up the fraction — the punched holes on the number line above. Everything else is fine." },
      ],
      ans: "All reals except x = 1 and x = 2"
    },
    {
      src: "4.1 Q2d · Domain",
      q: "Determine the domain of y = √(∛(27x³))",
      hook: "⛏️ Two roots stacked — a cube root feeding a square root. Only the square root is fussy.",
      hint: "Simplify the cube root first: ∛(27x³) is just 3x. Then apply the square-root rule to 3x.",
      steps: [
        { do: "Know your roots", math: "∛(−8) = −2 ✓     √(−4) = error ✗", why: "Cube roots happily take negatives (−2 × −2 × −2 = −8). Square roots don't. Only the OUTER √ is fussy here." },
        { do: "Simplify the inside first", math: "∛(27x³) = ∛27 × ∛(x³) = 3x", why: "∛27 = 3 because 3×3×3 = 27. And cube root undoes cubing, so ∛(x³) = x." },
        { do: "Apply the square-root rule", math: "3x ≥ 0", why: "The question is now just: domain of √(3x)." },
        { do: "Divide both sides by 3", math: "x ≥ 0   →   [0, ∞)", why: "Dividing by a POSITIVE number is safe — the ≥ keeps pointing the same way." },
      ],
      ans: "Domain = [0, ∞)"
    },
    {
      src: "4.1 Q3a · Combined",
      q: "Given f(x) = −2x² and g(x) = √(x³ − 2x²), determine 3f(x) + 2g(x) and its domain.",
      hook: "⛏️ Two feeds blended into one stream — the fussiest machine limits the inputs.",
      hint: "Write out 3 lots of f plus 2 lots of g. Then: the combined domain = whatever the fussiest machine demands.",
      steps: [
        { do: "Read the notation", math: "f(x) = −2x²      g(x) = √(x³ − 2x²)", why: "f and g are just NAMES for two recipes. f(x) is NOT multiplication — read it as 'f of x'." },
        { do: "Build the combo", math: "3f + 2g = −6x² + 2√(x³ − 2x²)", why: "3 lots of f's output plus 2 lots of g's output. The expression is done — now the domain." },
        { do: "Which machine is fussy?", math: "f: safe for all x      g: inside must be ≥ 0", why: "Squaring never breaks, so f has no rules. g has a square root." },
        { do: "Factor g's inside: pull out x²", math: "x³ − 2x² = x²(x − 2)", why: "Both terms contain x². Check it: x² × x = x³ ✓ and x² × (−2) = −2x² ✓." },
        { do: "Reason out the sign", math: "x² ≥ 0 always  →  need  x − 2 ≥ 0  →  x ≥ 2", why: "A square is never negative, so the (x − 2) part alone decides whether the product is ≥ 0." },
        { do: "Answer", math: "domain [2, ∞)", why: "When machines work together, the fussiest one sets the limit for the whole circuit." },
      ],
      ans: "−6x² + 2√(x³ − 2x²), domain [2, ∞)"
    },
    {
      src: "4.1 Q3b · Combined",
      q: "Given f(x) = −2x² and g(x) = √(x³ − 2x²), determine f(x) × g(x) and its domain.",
      hook: "⛏️ Same two machines, outputs multiplied this time. The domain logic doesn't change.",
      hint: "Multiply the recipes together. The domain is still set by the fussy one (g).",
      steps: [
        { do: "Multiply the recipes", math: "f × g = −2x² √(x³ − 2x²)", why: "A number sitting right next to a root means multiply." },
        { do: "Domain unchanged", math: "x²(x − 2) ≥ 0  →  x ≥ 2", why: "Multiplying outputs doesn't change which INPUTS are legal — g still demands x ≥ 2 (same factoring as Q3a)." },
        { do: "Answer", math: "domain [2, ∞)", why: "Fussiest machine rules, same as before." },
      ],
      ans: "−2x²√(x³ − 2x²), domain [2, ∞)"
    },
    {
      src: "4.1 Q3c · Combined",
      q: "Given f(x) = √(x − 2) and g(x) = √(x + 2), determine f(x)/g(x) and its domain.",
      hook: "⛏️ One output divided by another — BOTH root rules apply, PLUS the no-zero-bottom rule.",
      hint: "Three rules: f's inside ≥ 0, g's inside ≥ 0, and g (on the bottom) can't be zero. Strictest combination wins.",
      steps: [
        { do: "Careful — NEW recipes", math: "f = √(x − 2)      g = √(x + 2)", why: "Different f and g from Q3a/b. Always re-read the givens." },
        { do: "Rule 1 and Rule 2: both roots happy", math: "f needs x ≥ 2      g needs x ≥ −2", why: "Each root's inside must be ≥ 0." },
        { do: "Rule 3: bottom can't be zero", math: "√(x + 2) = 0 at x = −2  →  x = −2 banned", why: "g sits on the BOTTOM of the fraction. Rules 2 and 3 together say x > −2 (strictly greater)." },
        { do: "Tightest rule wins", math: "x ≥ 2", why: "Anything that is ≥ 2 is automatically > −2, so x ≥ 2 covers all three rules at once." },
        { do: "Answer", math: "√(x−2)/√(x+2) = √(x²−4)/(x+2),  domain [2, ∞)", why: "Your tutor also shows the tidied form — same function, neater writing." },
      ],
      ans: "√(x²−4)/(x+2), domain [2, ∞)"
    },
    {
      src: "4.1 Q3d · Composite",
      q: "Given f(x) = √(x − 2) and g(x) = √(x + 2), determine h(x) = g(f(x)) and its domain.",
      hook: "⛏️ Machines in SERIES: x goes through f first, and f's OUTPUT becomes g's feed.",
      hint: "g(f(x)) means: wherever recipe g has an x, drop the WHOLE of f(x) in its place.",
      steps: [
        { do: "Read g(f(x)) inside-out", why: "x goes into f FIRST. Whatever comes out of f then goes into g. Two machines in a line — see the circuit above." },
        { do: "Drop f into g", math: "h(x) = √( √(x − 2) + 2 )", why: "Wherever g had an x, the whole of f(x) goes instead. Yes, a root inside a root — that's normal for composites." },
        { do: "Inner machine's rule", math: "x − 2 ≥ 0  →  x ≥ 2", why: "If f can't run, nothing downstream runs." },
        { do: "Outer machine — check it", math: "√(x−2) + 2  is always ≥ 2", why: "A square root is NEVER negative, and we add 2 on top. Always safe — no new restriction." },
        { do: "Answer", math: "domain [2, ∞)", why: "Only the inner machine's rule matters here." },
      ],
      ans: "h(x) = √(√(x−2) + 2), domain [2, ∞)"
    },
    {
      src: "4.1 Q3e · Composite",
      q: "Given f(x) = √(x − 2) and g(x) = √(x + 2), determine h(x) = g(f(x)²) and its domain.",
      hook: "⛏️ Same series circuit, but f's output gets SQUARED on the way to g — and squaring undoes the root.",
      hint: "f(x)² means (√(x−2))² — and squaring a square root gives back what was inside: x − 2.",
      steps: [
        { do: "Follow the circuit order", math: "x → f → square it → g", why: "Exactly as drawn in the diagram above." },
        { do: "Squaring undoes the root", math: "f(x)² = (√(x − 2))² = x − 2", why: "Square and square-root are opposite operations — like reverse and drive." },
        { do: "Feed that into g", math: "h = √( (x − 2) + 2 ) = √x", why: "The −2 and +2 cancel. Everything collapses down to √x." },
        { do: "Domain — the subtle bit", math: "x ≥ 2   (NOT x ≥ 0)", why: "x still had to pass through machine f FIRST, and f demands x ≥ 2. You can't skip the first machine in the line. (Treating √x as a brand-new standalone function would give [0, ∞) — your tutor notes both views.)" },
      ],
      ans: "h(x) = √x, domain [2, ∞) with f as input"
    },
    {
      src: "4.1 Q4 · Translations",
      q: "Given y = f(x) = x³, find and plot: a) g(x) = f(x) − 9, b) g(x) = f(x + 1), c) g(x) = ⅓f(x)",
      hook: "⛳ Same swing, different tee position — translations slide or squash the curve without changing its character.",
      hint: "Number OUTSIDE = slide up/down. Number INSIDE the brackets = slide left/right (backwards!). Fraction out front = squash.",
      steps: [
        { do: "Learn the three move types", why: "OUTSIDE the recipe = slide up/down. INSIDE the brackets = slide left/right, and it works BACKWARDS. A fraction out the front = squash the height." },
        { do: "a) −9 outside: slide DOWN 9", math: "g(x) = x³ − 9", why: "Run the recipe, then subtract 9 from every output. Same shape, 9 lower — the grey dashed curve on the chart." },
        { do: "b) +1 inside: slide LEFT 1", math: "g(x) = (x + 1)³ = x³ + 3x² + 3x + 1", why: "THE TRAP: +1 inside moves it LEFT, not right. To get the old x = 0 output you now only need x = −1. The yellow curve. (The expansion uses 'cube of a binomial' from your Algebra Kit.)" },
        { do: "c) ⅓ out front: squash to ⅓ height", math: "g(x) = ⅓x³", why: "Every output becomes a third of what it was — same S-shape, flatter. The green curve." },
      ],
      ans: "a) x³ − 9 (down 9) · b) (x+1)³ (left 1) · c) ⅓x³ (squashed)"
    },
    {
      src: "4.1 Q5 · Reflections",
      q: "Given f(x) = ⅕x³ − 3, find and plot: a) g(x) = f(−x), b) g(x) = −f(x)",
      hook: "⛳ f(−x) = a leftie hitting your exact shot (left-right mirror). −f(x) = the flight reflected in a water hazard (top-bottom mirror).",
      hint: "For f(−x): swap every x for (−x), then tidy up. For −f(x): minus the WHOLE recipe and distribute it.",
      steps: [
        { do: "a) Swap every x for (−x)", math: "f(−x) = ⅕(−x)³ − 3", why: "ONLY the x gets swapped — the −3 at the end stays put." },
        { do: "Simplify (−x)³", math: "(−x)³ = −x³   →   g(x) = −⅕x³ − 3", why: "(−x)(−x)(−x): the first pair makes +x², times the third makes −x³. ODD powers keep the minus. This mirrors the curve across the y-axis — yellow on the chart." },
        { do: "b) Minus the WHOLE recipe", math: "−f(x) = −(⅕x³ − 3) = −⅕x³ + 3", why: "THE TRAP: the minus hits BOTH terms inside the brackets, so −3 becomes +3. Forgetting that flip is the classic mark-loser. This mirrors across the x-axis — green on the chart." },
      ],
      ans: "a) −⅕x³ − 3 · b) −⅕x³ + 3"
    },
    {
      src: "4.2 Q1 · Segmented",
      q: "Plot the segmented function: y = −x for −3 ≤ x < −1; y = x² for −1 ≤ x < 1; y = x for 1 ≤ x ≤ 3",
      hook: "⛏️ A crusher with three operating modes depending on feed size — each rule only applies in its own zone.",
      hint: "Three mini-tables, one per zone. Use ONLY that zone's rule. Watch < vs ≤ at the boundaries.",
      steps: [
        { do: "Read the zones", math: "−3 ≤ x < −1 means: from −3 (included) up to −1 (NOT included)", why: "One function, three rules — which rule you use depends on where x sits. Like crusher settings by feed size." },
        { do: "Zone 1 (orange): y = −x", math: "x = −3 → 3      x = −2 → 2", why: "Flip the sign. A straight line sloping DOWN as you move right." },
        { do: "Zone 2 (yellow): y = x²", math: "x = −1 → 1      x = 0 → 0      x = 0.5 → 0.25", why: "Square the input. A little bowl bottoming at (0, 0)." },
        { do: "Zone 3 (green): y = x", math: "x = 1 → 1      x = 3 → 3", why: "Output equals input. A straight line sloping UP." },
        { do: "Check the joins", math: "at x = −1: zone 1 was heading to 1, zone 2 starts at 1 ✓", why: "The pieces meet smoothly at both boundaries — see the chart. Final shape: a soft V with a bowl in the middle." },
      ],
      ans: "Three-piece graph joining smoothly at x = −1 and x = 1"
    },
    {
      src: "4.2 Q2 · Periodic",
      q: "Given the periodic function y = x³, −1 ≤ x ≤ 1, plot its graph and find its period.",
      hook: "⛏️ Swing shift roster: the same pattern repeats forever. The period is one full cycle — like a 2-week roster.",
      hint: "The pattern lives on one window of x. Period = width of that window. Then copy-paste the shape forever.",
      steps: [
        { do: "Know what 'periodic' means", why: "The function is defined on one window, and that exact shape repeats endlessly left and right — like your roster cycling." },
        { do: "Period = window width", math: "p = 1 − (−1) = 1 + 1 = 2", why: "Right end minus left end. Careful with the double negative: minus a negative is a plus." },
        { do: "Draw one cycle, then copy-paste", math: "S-curve from (−1, −1) through (0, 0) to (1, 1)", why: "Repeat that identical S every 2 units in both directions — exactly the chart above." },
      ],
      ans: "Period = 2; the x³ S-curve repeating every 2 units"
    },
    {
      src: "4.2 Q3 · Periodic",
      q: "Given the periodic function y = 1 − x², −1 ≤ x ≤ 1, plot its graph and find its period.",
      hook: "⛏️ Another roster, different pattern — one hump repeated forever, like stockpiles lined up along the pad.",
      hint: "Same method: period = window width, then repeat the shape.",
      steps: [
        { do: "Period first", math: "p = 1 − (−1) = 2", why: "Same window as the last question." },
        { do: "Shape of one cycle", math: "x = ±1 → y = 0      x = 0 → y = 1", why: "Ground level at both edges, peak of 1 in the middle. One hump." },
        { do: "Sanity-check a midpoint", math: "x = 0.5 → y = 1 − 0.25 = 0.75 ✓", why: "Sits nicely on the hump. Now repeat it every 2 units — the row of stockpiles on the chart." },
      ],
      ans: "Period = 2; repeating humps peaking at y = 1"
    },
    {
      src: "4.2 Q4 · Implicit",
      q: "Given x²/16 + y²/9 = 1, plot its graph.",
      hook: "⛏️ The oval haul loop around the pit — 8 wide, 6 tall. But y isn't by itself, so rearrange before plotting.",
      hint: "Get y² alone first, then square-root both sides — and KEEP the ± when you do.",
      steps: [
        { do: "Why rearrange at all?", why: "You can only build a table from 'y = something'. Right now y is tangled inside the equation — so untangle it." },
        { do: "Isolate the y term", math: "y²/9 = 1 − x²/16", why: "Subtract x²/16 from both sides." },
        { do: "Clear the 9", math: "y² = 9(16 − x²)/16", why: "Multiply BOTH sides by 9, then tidy the bracket." },
        { do: "Square-root both sides — keep the ±", math: "y = ±(3/4)√(16 − x²)", why: "CRITICAL: both (+3)² and (−3)² equal 9, so undoing a square gives TWO answers. Never drop the ±." },
        { do: "What the ± means", why: "Each x gives TWO y values — the orange top half and yellow bottom half on the chart. Strictly, that means this is NOT a function. That's the lesson hiding in this question." },
        { do: "Legal x values", math: "16 − x² ≥ 0  →  −4 ≤ x ≤ 4", why: "The root's inside must be ≥ 0. The loop spans −4 to 4 across and −3 to 3 up — see the labelled corners." },
      ],
      ans: "Ellipse: y = ±(3/4)√(16 − x²), x ∈ [−4, 4], y ∈ [−3, 3]"
    },
    {
      src: "4.2 Q5 · Rearrange & plot",
      q: "Given √x − √y = 1, plot its graph.",
      hook: "⛳ Two tangled measurements — untangle to get y alone, then chart it. The √x means x can't go negative.",
      hint: "Move √y to one side by itself, then square both sides to free the y.",
      steps: [
        { do: "Get √y alone", math: "√x − 1 = √y", why: "Shuffle terms so the y-piece sits by itself on one side." },
        { do: "Square both sides", math: "y = (√x − 1)²", why: "Squaring undoes the root on y. (Expanded it's x − 2√x + 1, but the compact form is easier to plot.)" },
        { do: "Legal inputs", math: "x ≥ 0", why: "There's a √x in the recipe — start the table at zero." },
        { do: "Build the table", math: "x=0→1     x=1→0     x=4→1     x=9→4", why: "Easy values: pick x's that are perfect squares so √x comes out clean." },
        { do: "Read the shape", why: "Starts at (0, 1), dips to touch the ground at (1, 0), then climbs away slowly — see the labelled chart." },
      ],
      ans: "y = (√x − 1)², for x ≥ 0 — dips to 0 at x = 1, then rises"
    },
    {
      src: "4.2 Q6 · Parametric",
      q: "A parametric function is defined by x = 2t − 1 and y = t² + 1. Draw its graph in [−3, 3] for t.",
      hook: "⛳ Launch monitor mode: both x and y are tracked against TIME t — two gauges, one clock.",
      hint: "Build a 3-row table: t across the top, then x calculated from t, then y calculated from t.",
      steps: [
        { do: "Know what 'parametric' means", why: "Instead of y depending on x directly, BOTH x and y depend on a third variable t (think: time). Every moment gives a position reading and a height reading." },
        { do: "Row 1 — pick the t values", math: "t = −3, −2, −1, 0, 1, 2, 3", why: "Whole numbers across the given range." },
        { do: "Row 2 — x = 2t − 1", math: "x = −7, −5, −3, −1, 1, 3, 5", why: "Double t, subtract 1. Climbs steadily — the orange straight line." },
        { do: "Row 3 — y = t² + 1", math: "y = 10, 5, 2, 1, 2, 5, 10", why: "Square t, add 1. Symmetric because squaring kills the minus — the green parabola, lowest at (0, 1)." },
        { do: "Plot both against t", why: "Exactly how your tutorial draws it: two curves on one chart, the clock t along the bottom." },
      ],
      ans: "x vs t: straight line. y vs t: parabola, minimum (0, 1)"
    },
    {
      src: "4.2 Q7 · Parametric",
      q: "A parametric function is defined by x = √(3t² + 4) and y = 3 − 2t. Draw its graph in [−2, 2] for t.",
      hook: "⛏️ Two gauges, one clock — tabulate t, then read each gauge in turn.",
      hint: "Same 3-row table. Bonus: 3t² + 4 is ALWAYS positive, so the root never breaks.",
      steps: [
        { do: "Safety-check the root first", math: "3t² + 4 ≥ 4 always", why: "t² can't be negative, so the inside never drops below 4. Every t is legal — no domain drama." },
        { do: "x gauge: x = √(3t² + 4)", math: "t=−2 → √16 = 4     t=0 → √4 = 2     t=2 → 4", why: "Symmetric shallow U, lowest at (0, 2) — the orange curve." },
        { do: "y gauge: y = 3 − 2t", math: "t=−2 → 3+4 = 7     t=0 → 3     t=2 → −1", why: "Watch the sign trap: 3 − 2(−2) = 3 + 4. Minus times minus is plus. The green downhill line." },
        { do: "Plot both against t", why: "Orange U and green line, clock along the bottom — matches the chart." },
      ],
      ans: "x: symmetric curve, min (0, 2). y: straight line 7 down to −1"
    },
    {
      src: "4.2 Q8 · Parametric circle",
      q: "A parametric function is defined by x = 2sin t and y = 2cos t. Draw its graph in [−π, π] for t.",
      hook: "⛏️ A point on the rim of a rotating mill drum — both positions driven by the rotation angle. Plot it: you get the circle.",
      hint: "CASIO FIRST: −π to π = −180° to 180°. Set Angle Unit to Degree, table in 30° steps.",
      steps: [
        { do: "Set the Casio BEFORE anything", math: "[−π, π]  =  [−180°, 180°]", why: "π radians = 180°. Set Angle Unit to DEGREE (SHIFT → SETUP). Wrong mode = every single number wrong." },
        { do: "Treat sin/cos as buttons for now", why: "Week 4 covers them properly. Today they're just calculator buttons that turn an angle into a number between −1 and 1." },
        { do: "x gauge: x = 2sin t", math: "t=0° → 0     t=90° → 2     t=−90° → −2", why: "Table in 30° steps across the range." },
        { do: "y gauge: y = 2cos t", math: "t=0° → 2     t=±90° → 0     t=±180° → −2", why: "Cos starts at its peak; sin starts at zero." },
        { do: "Pair up and plot the (x, y) dots", why: "They trace a perfect circle of radius 2 — the drum rim. The chart labels which angle lands where: t=0° at the top, t=90° at the right." },
        { do: "Why it MUST be a circle", math: "x² + y² = 4sin²t + 4cos²t = 4 × 1 = 4", why: "sin² + cos² = 1 always (the famous Week 4 identity), and x² + y² = 4 is the equation of a radius-2 circle." },
      ],
      ans: "A circle of radius 2 centred at the origin"
    },
    {
      src: "4.2 Q9 · Parametric ellipse",
      q: "A parametric function is defined by x = 4cos t and y = 3sin t. Draw its graph in [−π, π] for t.",
      hook: "⛏️ A ute lapping the oval haul loop — t marks how far around the lap it is. (Honesty check: a round drum rim can only trace a CIRCLE, so the Q8 drum picture doesn't stretch. An oval track does.)",
      hint: "Identical method to Q8 — degree mode, 30° steps. The multipliers 4 and 3 stretch the circle into an oval.",
      steps: [
        { do: "Same method as Q8", why: "Degree mode, 30° steps. Two changes: the multipliers differ (4 and 3) and sin/cos have swapped axes. Picture a ute lapping the oval loop instead of a point on a round drum." },
        { do: "x gauge: x = 4cos t", math: "t=0° → 4     t=±90° → 0     t=±180° → −4", why: "Swings between −4 and 4 — the 8-wide part." },
        { do: "y gauge: y = 3sin t", math: "t=0° → 0     t=90° → 3     t=−90° → −3", why: "Swings between −3 and 3 — the 6-tall part." },
        { do: "Plot and connect the dots", math: "16 = 4²  and  9 = 3²", why: "An oval, widest at (±4, 0), tallest at (0, ±3) — EXACTLY the same shape as Q4's x²/16 + y²/9 = 1. Two descriptions, one haul loop. Not a coincidence." },
      ],
      ans: "Ellipse spanning x ∈ [−4, 4], y ∈ [−3, 3] — same as Q4"
    },
    {
      src: "4.2 Q10 · Inverse",
      q: "Given y = f(x) = 2√x − 1, determine its inverse function and domain.",
      hook: "⛏️ Running the plant backwards: you know the output, find the input.",
      hint: "Peel the operations off x one at a time, in reverse order, doing the opposite of each. Then swap the letters.",
      steps: [
        { do: "Know what an inverse is", why: "The recipe run BACKWARDS: take a y, recover the x that made it. (The ⁻¹ is just notation for 'inverse' — it does NOT mean a power.)" },
        { do: "List what f does to x, in order", math: "① square root   ② ×2   ③ −1", why: "To reverse, undo in REVERSE order — like taking PPE off in the opposite order you put it on." },
        { do: "Undo the −1: add 1 to both sides", math: "y + 1 = 2√x", why: "Last operation comes off first." },
        { do: "Undo the ×2: divide both sides by 2", math: "(y + 1)/2 = √x" },
        { do: "Undo the √: square both sides", math: "x = (y + 1)² / 4", why: "Squaring the fraction squares top and bottom." },
        { do: "Swap the letters x and y", math: "f⁻¹(x) = ¼(x + 1)²", why: "Convention: functions always take x as the input, so relabel. Domain: squaring never breaks → all real numbers, (−∞, ∞)." },
        { do: "Faith check", math: "f(4) = 2√4 − 1 = 3      f⁻¹(3) = ¼(4)² = 4 ✓", why: "Forwards then backwards lands you exactly where you started." },
      ],
      ans: "f⁻¹(x) = ¼(x + 1)², domain (−∞, ∞)"
    },
    {
      src: "4.2 Q11 · Inverse",
      q: "Given y = f(x) = x³ − 10, determine its inverse function and domain.",
      hook: "⛏️ Same drill: undo the machine. To undo a cube, take a cube root. (This is literally exam Q1a from 2024 — see the Exam Room.)",
      hint: "The recipe does two things: cube, then subtract 10. Undo backwards: add 10, then cube-root.",
      steps: [
        { do: "List what f does, in order", math: "① cube   ② −10", why: "Undo in reverse: add 10 first, then un-cube." },
        { do: "Undo the −10: add 10", math: "y + 10 = x³" },
        { do: "Undo the cube: cube-root both sides", math: "x = ∛(y + 10)", why: "Match the undo to the operation — CUBE root, not square root. (Casio: usually SHIFT + the √ key.)" },
        { do: "Swap the letters", math: "f⁻¹(x) = ∛(x + 10)", why: "Domain: cube roots accept ANY number, even negatives → (−∞, ∞)." },
        { do: "Faith check", math: "f(2) = 8 − 10 = −2      f⁻¹(−2) = ∛8 = 2 ✓", why: "Round trip complete." },
      ],
      ans: "f⁻¹(x) = ∛(x + 10), domain (−∞, ∞)"
    },
    {
      src: "4.3 Q1 · 3D distance",
      q: "Find the distance between each pair of 3D points: a) O(0,0,0) & J(−1,3,−5); b) A(2,0,1) & B(0,3,−1); c) A(−3,1,2) & G(0,0,−3); d) C(0,2,0) & H(2,0,−5); e) E(4,3,−1) & J(1,5,2).",
      hook: "⛏️ Straight-line distance between two survey pegs in 3D — exactly 2D Pythagoras with one extra term for the third axis (think bench level / depth).",
      hint: "Use the 3D distance formula: subtract matching coordinates, square each, add them, square-root. Watch the double negatives.",
      steps: [
        { do: "The rule: 3D distance formula", math: "d = √[(x₂−x₁)² + (y₂−y₁)² + (z₂−z₁)²]", why: "Pythagoras with a third term for z. Order of subtraction doesn't matter — you square it, so signs vanish." },
        { do: "a) O(0,0,0) → J(−1,3,−5)", math: "√[(−1)² + 3² + (−5)²] = √(1+9+25) = √35 ≈ 5.92", why: "Square each gap (negatives become positive), add, root." },
        { do: "b) A(2,0,1) → B(0,3,−1)", math: "√[(0−2)² + (3−0)² + (−1−1)²] = √(4+9+4) = √17 ≈ 4.12" },
        { do: "c) A(−3,1,2) → G(0,0,−3)", math: "√[(0−(−3))² + (0−1)² + (−3−2)²] = √(9+1+25) = √35 ≈ 5.92", why: "0 − (−3) = +3 — minus a negative is a plus." },
        { do: "d) C(0,2,0) → H(2,0,−5)", math: "√[2² + (−2)² + (−5)²] = √(4+4+25) = √33 ≈ 5.74" },
        { do: "e) E(4,3,−1) → J(1,5,2)", math: "√[(1−4)² + (5−3)² + (2−(−1))²] = √(9+4+9) = √22 ≈ 4.69" },
      ],
      ans: "a) √35 · b) √17 · c) √35 · d) √33 · e) √22"
    },
    {
      src: "4.3 Q2 · 3D surface",
      q: "Plot the 3D graph of z² = x² + y² for −2 ≤ x ≤ 2 and −2 ≤ y ≤ 2.",
      hook: "⛏️ This is a double cone (two ice-cream cones tip-to-tip) — like a conical stockpile a stacker builds, plus its mirror image below ground.",
      hint: "Rearrange for z (keep the ±), then build a grid of z values across the x–y square. The ± gives an upper and a lower cone.",
      steps: [
        { do: "Rearrange for z — keep the ±", math: "z² = x² + y²  →  z = ±√(x² + y²)", why: "Undoing a square gives TWO surfaces: a top (+) and a bottom (−)." },
        { do: "Read what the shape is", math: "z = distance from the z-axis = √(x²+y²)", why: "At each (x, y), z equals how far you are from the centre line — that traces a cone." },
        { do: "Sample a few grid points", math: "(0,0): z = 0 (the tips)   (2,0): z = ±2   (2,2): z = ±√8 ≈ ±2.83", why: "Values grow as you move away from the centre. Build the full table over −2…2." },
        { do: "Picture it", why: "Two cones meeting at the origin: the + half opens upward, the − half opens downward — a sand-pile and its reflection." },
      ],
      ans: "Double cone z = ±√(x²+y²): tips at the origin, radius equals height"
    },
  ],
  2: [
    {
      src: "5.1 Q1 · Line (3 forms)",
      q: "A straight line crosses A(−3, 2) and B(3, −1). Write it in slope-intercept form, two-point form, and general form.",
      hook: "⛏️ One haul-road grade described three different ways — same road, three bits of paperwork. They must all simplify to the same line.",
      hint: "Find the slope first (rise/run). Then slot it into each form and simplify — all three should land on the same equation.",
      steps: [
        { do: "Slope first", math: "a = (−1 − 2)/(3 − (−3)) = −3/6 = −½", why: "Rise over run. Careful: 3 − (−3) = 6." },
        { do: "Slope-intercept y = ax + b", math: "2 = −½(−3) + b → 2 = 3/2 + b → b = ½  →  y = −½x + ½", why: "Sub a point in to find b, the y-intercept." },
        { do: "Two-point form", math: "y − 2 = (−½)(x + 3)  →  y = −½x + ½", why: "y − y₁ = [(y₂−y₁)/(x₂−x₁)](x − x₁). Same line." },
        { do: "General form Ax + By = 1", math: "x + 2y = 1  →  y = −½x + ½", why: "All three agree — that's your built-in check." },
      ],
      ans: "y = −½x + ½  ·  general form: x + 2y = 1"
    },
    {
      src: "5.1 Q2 · Line from slope + point",
      q: "A line has slope 0.5 and passes through A(4, 3). Write it in slope-intercept and point-slope form.",
      hook: "⛳ You know the steepness of the slope and one spot on it — pin down the whole line.",
      hint: "Point-slope is fastest: y − y₁ = a(x − x₁). Then rearrange to y = ax + b.",
      steps: [
        { do: "Point-slope form", math: "y − 3 = ½(x − 4)", why: "Drop slope ½ and the point (4, 3) straight in." },
        { do: "Expand to slope-intercept", math: "y = ½x − 2 + 3 = ½x + 1", why: "−½ × 4 = −2." },
      ],
      ans: "y = ½x + 1"
    },
    {
      src: "5.1 Q3 · Normal line",
      q: "A line is parallel to f(x) = −x + 3. Find the line normal (perpendicular) to it passing through (1, 5).",
      hook: "⛏️ A cross-drain cut at right angles to the bench face — perpendicular means flip-and-negate the slope.",
      hint: "Slope of f is −1. Perpendicular slope = −1/(−1) = 1. Then point-slope through (1, 5).",
      steps: [
        { do: "Original slope", math: "f(x) = −x + 3  →  slope = −1", why: "The coefficient of x." },
        { do: "Perpendicular slope = negative reciprocal", math: "c = −1/(−1) = 1", why: "Flip the fraction and change the sign." },
        { do: "Point-slope through (1, 5)", math: "y − 5 = 1(x − 1)  →  y = x + 4" },
      ],
      ans: "y = x + 4"
    },
    {
      src: "5.1 Q4 · Line + its normal",
      q: "A line crosses (2, 4) and (4, 1). a) Find the line. b) Find the line normal to it through (0, 7).",
      hook: "⛏️ Two pegs give you the road; then lay a cross-drain at right angles through a new point.",
      hint: "a) slope = rise/run, then point-slope. b) perpendicular slope = −1 ÷ (slope from a).",
      steps: [
        { do: "a) Slope", math: "a = (1 − 4)/(4 − 2) = −3/2" },
        { do: "a) Point-slope", math: "y − 4 = −3/2(x − 2)  →  y = −3/2 x + 7" },
        { do: "b) Perpendicular slope", math: "c = −1/(−3/2) = 2/3", why: "Flip −3/2 → −2/3, change sign → +2/3." },
        { do: "b) Through (0, 7)", math: "y − 7 = 2/3(x − 0)  →  y = 2/3 x + 7" },
      ],
      ans: "a) y = −3/2 x + 7 · b) y = 2/3 x + 7"
    },
    {
      src: "5.1 Q5 · Transform a line",
      q: "Given f(x) = −x + 5, find: a) f(x)+10, b) f(x−3), c) 2f(x), d) ½f(x), e) −f(x), f) f(−x).",
      hook: "⛳ Same straight putt, nudged and mirrored — slides, stretches and flips.",
      hint: "Outside number = up/down. Inside (x−3) = right 3. A multiplier scales it. −f flips vertically; f(−x) flips horizontally.",
      steps: [
        { do: "a) +10 outside → up 10", math: "−x + 5 + 10 = −x + 15" },
        { do: "b) f(x−3) → right 3", math: "−(x−3) + 5 = −x + 8", why: "Replace x with x−3, then expand. Right = minus inside." },
        { do: "c) 2f(x) → stretch ×2", math: "2(−x+5) = −2x + 10" },
        { do: "d) ½f(x) → squash", math: "½(−x+5) = −½x + 5/2" },
        { do: "e) −f(x) → flip vertical", math: "−(−x+5) = x − 5", why: "The minus hits BOTH terms." },
        { do: "f) f(−x) → flip horizontal", math: "−(−x) + 5 = x + 5" },
      ],
      ans: "a) −x+15 b) −x+8 c) −2x+10 d) −½x+5/2 e) x−5 f) x+5"
    },
    {
      src: "5.1 Q6 · Water bill (linear)",
      q: "Water costs 17.5 cents/kilolitre plus a fixed monthly base charge. A bill is $55 for 60 kL. Find the linear function linking usage x and charge y.",
      hook: "⛏️ Fixed callout + a rate per unit — same shape as equipment hire: base fee plus dollars per hour.",
      hint: "Rate = slope = $0.175/kL. Use the point (60, 55) in point-slope to find the base charge.",
      steps: [
        { do: "Identify the slope (rate)", math: "a = 17.5 c/kL = $0.175/kL", why: "Convert cents to dollars." },
        { do: "Point-slope through (60, 55)", math: "y − 55 = 0.175(x − 60)" },
        { do: "Expand", math: "y = 0.175x − 10.5 + 55 = 0.175x + 44.5", why: "The +44.5 is the fixed base charge in dollars." },
      ],
      ans: "y = 0.175x + 44.5 (dollars)"
    },
    {
      src: "5.1 Q7 · Quiz score (linear)",
      q: "Each quiz starts at 80 base points; each of 10 quizzes adds 10 for a correct answer. a) Alan scored 140 — how many correct? b) Annie scored 170 — how many correct?",
      hook: "⛏️ Base bonus plus a flat rate per task — like a shift bonus plus pay per load.",
      hint: "Model y = 10x + 80, then solve for x at each score.",
      steps: [
        { do: "Build the model", math: "y = 10x + 80", why: "80 base, +10 per correct answer x." },
        { do: "a) 140 points", math: "140 = 10x + 80 → 10x = 60 → x = 6" },
        { do: "b) 170 points", math: "170 = 10x + 80 → 10x = 90 → x = 9" },
      ],
      ans: "a) 6 correct · b) 9 correct"
    },
    {
      src: "5.1 Q8 · Car value (linear decay)",
      q: "A car costs $25,000 and loses 10% of its ORIGINAL value per year (no compounding). Find the linear value function v(t).",
      hook: "⛏️ Straight-line depreciation of a ute — a fixed dollar drop each year, not a percentage of the shrinking value.",
      hint: "10% of the original each year = a constant dollar drop = the slope. Start point is (0, 25000).",
      steps: [
        { do: "Slope = constant yearly drop", math: "a = −10% × 25000 = −$2500/yr", why: "No compounding → the SAME dollars come off every year." },
        { do: "Point-slope from (0, 25000)", math: "v = −2500t + 25000", why: "Worth $25,000 at t = 0." },
      ],
      ans: "v = −2500t + 25000 (dollars)"
    },
    {
      src: "Week 2 · Exercises 5.2 Q1",
      q: "Given y = x² − 5x + 6, find the vertex, the y-intercept and the x-intercepts.",
      hook: "⛏️ This parabola opens UP — like the sag of a power line strung between two pylons. The vertex is the LOWEST point of the sag. (Ball flights are the upside-down parabolas — don't mix them up.)",
      hint: "Vertex x = −b/2a. y-intercept is just c. x-intercepts come from factoring.",
      steps: [
        { do: "Name the players", math: "a = 1,  b = −5,  c = 6", why: "Match the equation to the template y = ax² + bx + c." },
        { do: "Vertex x-coordinate", math: "x = −b/2a = −(−5)/(2×1) = 5/2", why: "Minus a negative makes a positive — watch that sign." },
        { do: "Vertex y: sub x = 5/2 back in", math: "y = (5/2)² − 5(5/2) + 6 = 25/4 − 50/4 + 24/4 = −1/4", why: "Vertex V(2.5, −0.25) — the turning point marked on the chart." },
        { do: "y-intercept: set x = 0", math: "y = 6  →  point (0, 6)", why: "Everything with an x vanishes — the y-intercept is always just c." },
        { do: "x-intercepts: factor and solve", math: "(x − 2)(x − 3) = 0  →  x = 2 and x = 3", why: "Two numbers that multiply to +6 and add to −5: that's −2 and −3. Both crossings marked on the chart." },
      ],
      ans: "Vertex (5/2, −1/4) · y-int (0,6) · x-ints (2,0) and (3,0)"
    },
    {
      src: "Week 2 · Exercises 5.2 Q2",
      q: "A quadratic has vertex V(1, 2) and y-intercept 3. Find its equation.",
      hook: "⛏️ You know the lowest point of the sag, V(1, 2), and where the cable crosses the y-axis (3) — rebuild the cable's formula. (This is exam Q1b from 2024 — worth 4 marks!)",
      hint: "Fastest route: use vertex form y = a(x − h)² + k with the vertex, then the y-intercept gives a.",
      steps: [
        { do: "Start from VERTEX form", math: "y = a(x − h)² + k  with vertex (h, k) = (1, 2)", why: "When you're handed the vertex, this form is far quicker than y = ax² + bx + c." },
        { do: "Drop the vertex in", math: "y = a(x − 1)² + 2", why: "h = 1 and k = 2 slot straight in." },
        { do: "Use the y-intercept to find a", math: "at x = 0, y = 3:   3 = a(0 − 1)² + 2 = a + 2  →  a = 1", why: "The curve passes through (0, 3), so those values must fit." },
        { do: "Expand back to standard form", math: "y = (x − 1)² + 2 = x² − 2x + 1 + 2 = x² − 2x + 3", why: "Use (a−b)² = a² − 2ab + b². Check on the chart: vertex (1, 2), y-intercept 3 ✓." },
      ],
      ans: "y = x² − 2x + 3"
    },
    {
      src: "Week 2 · Exercises 5.2 Q3",
      q: "A quadratic has a minimum value of −3 and crosses the x-axis at A(−1, 0) and B(3, 0). Find it.",
      hook: "⛏️ Power-line sag: you know where the cable touches the ground (the two crossings) and how low it dips (−3). Rebuild the cable's formula.",
      hint: "Roots give you the factors: y = a(x+1)(x−3). The minimum value then pins down a.",
      steps: [
        { do: "Use the roots as factors", math: "y = a(x + 1)(x − 3) = a(x² − 2x − 3)", why: "If x = −1 and x = 3 make y = 0, then (x+1) and (x−3) are factors." },
        { do: "Vertex sits halfway between the roots", math: "x = (−1 + 3)/2 = 1", why: "Parabolas are symmetric, so the minimum is at the midpoint of the roots." },
        { do: "Minimum is −3 at x = 1", math: "−3 = a(1+1)(1−3) = a(2)(−2) = −4a  →  a = 3/4", why: "Sub the vertex in and solve for a." },
        { do: "Write it out", math: "y = (3/4)(x² − 2x − 3)" },
      ],
      ans: "y = (3/4)(x² − 2x − 3)"
    },
    {
      src: "Week 2 · Exercises 5.2 Q4",
      q: "A quadratic is f(x) = x² + 1 shifted right by 2 units. Find its expression.",
      hook: "⛳ Same ball-flight shape, just teed up 2 metres further along — a horizontal slide.",
      hint: "Shift right by 2 = replace x with (x − 2). Then expand.",
      steps: [
        { do: "Right shift = replace x with (x − 2)", math: "g(x) = f(x − 2) = (x − 2)² + 1", why: "THE TRAP: 'right' means MINUS inside the bracket." },
        { do: "Expand", math: "(x − 2)² + 1 = x² − 4x + 4 + 1 = x² − 4x + 5", why: "Using (a − b)² = a² − 2ab + b²." },
      ],
      ans: "g(x) = x² − 4x + 5"
    },
    {
      src: "Week 2 · Exercises 5.2 Q5",
      q: "Find the points of intersection between y = x² − 3x + 5 and y = 2x − 1.",
      hook: "⛏️ A valley-shaped pit profile (the parabola) with a straight haul ramp (the line) drawn across it — the crossings are where the ramp meets the pit wall. Curves cross where their y values match.",
      hint: "Both expressions equal y, so set them equal to each other and solve the quadratic that appears.",
      steps: [
        { do: "Set the two recipes equal", math: "x² − 3x + 5 = 2x − 1", why: "At a crossing point, both rules must give the SAME y for the same x." },
        { do: "Move everything to the left", math: "x² − 5x + 6 = 0", why: "Subtract 2x from both sides, add 1 to both sides. Now it's a standard quadratic equalling zero." },
        { do: "Factor and solve", math: "(x − 3)(x − 2) = 0  →  x = 3 or x = 2", why: "Multiply to +6, add to −5: the numbers are −3 and −2." },
        { do: "Find each y — use the LINE", math: "x=3 → y = 2(3)−1 = 5      x=2 → y = 2(2)−1 = 3", why: "y = 2x − 1 is the easier recipe to substitute into. Crossings: (3, 5) and (2, 3) — both marked on the chart." },
      ],
      ans: "Intersections at (3, 5) and (2, 3)"
    },
    {
      src: "Week 2 · Exercises 5.2 Q6",
      q: "A 4 m simply-supported beam carries a uniform load w. Bending moment M = −½wx² + ½wl·x (with l = 4). a) Where is M maximum? b) Where is M half the maximum?",
      hook: "⛏️ Where does a loaded beam (or a haul-bridge deck) bend the most? At the vertex of this quadratic. Real engineering, same parabola maths.",
      hint: "Max is at the vertex x = −b/2a. For half-max, set M = ½·M_max and solve the quadratic.",
      steps: [
        { do: "Put l = 4 in", math: "M = −½wx² + 2wx", why: "½wl·x = ½w(4)x = 2wx." },
        { do: "a) Vertex location", math: "x = −b/2a = −(2w)/(2 × −½w) = 2", why: "Maximum bending at the middle of the beam — physically sensible." },
        { do: "a) Maximum value", math: "M_max = −½w(2)² + 2w(2) = −2w + 4w = 2w" },
        { do: "b) Set M = w (half of 2w)", math: "−½wx² + 2wx = w  →  x² − 4x + 2 = 0", why: "Divide through by w, tidy to standard form." },
        { do: "b) Quadratic formula", math: "x = (4 ± √(16 − 8))/2 = 2 ± √2", why: "Two spots, symmetric about the middle." },
      ],
      ans: "a) M_max = 2w at x = 2 m · b) x = 2 ± √2 m"
    },
    {
      src: "5.3 Q1 · Cubic",
      q: "Solve x³ − 3x² − 6x + 8 = 0.",
      hook: "⛏️ Three depths where a cut meets grade — a cubic has up to three roots. Find one, then factor down to a quadratic.",
      hint: "Test small whole numbers (factors of 8: ±1, ±2, ±4). Once one root works, factor it out and solve the leftover quadratic.",
      steps: [
        { do: "Find one root by trial", math: "x = 1:  1 − 3 − 6 + 8 = 0 ✓", why: "Test factors of the constant 8. x = 1 works, so (x − 1) is a factor." },
        { do: "Factor it down", math: "x³ − 3x² − 6x + 8 = (x − 1)(x² − 2x − 8)", why: "Divide out (x − 1)." },
        { do: "Factor the quadratic", math: "x² − 2x − 8 = (x − 4)(x + 2)", why: "Multiply to −8, add to −2: that's −4 and +2." },
        { do: "All three roots", math: "x = 1, 4, −2" },
      ],
      ans: "x = 1, 4, −2"
    },
    {
      src: "5.3 Q2 · Cubic",
      q: "Solve x³ + 6x² + 3x − 10 = 0.",
      hook: "⛏️ Same drill: hunt one root, then break the cubic into a quadratic you can factor.",
      hint: "Test factors of 10 (±1, ±2, ±5). Factor out the winner, solve the rest.",
      steps: [
        { do: "Trial root", math: "x = 1:  1 + 6 + 3 − 10 = 0 ✓", why: "(x − 1) is a factor." },
        { do: "Factor down", math: "= (x − 1)(x² + 7x + 10)" },
        { do: "Factor the quadratic", math: "x² + 7x + 10 = (x + 2)(x + 5)", why: "Multiply to 10, add to 7." },
        { do: "Roots", math: "x = 1, −2, −5" },
      ],
      ans: "x = 1, −2, −5"
    },
    {
      src: "5.3 Q3 · Cone (cubic)",
      q: "A right circular cone has equal height and base radius. Its volume is 100 m³. Find the height.",
      hook: "⛏️ A conical stockpile where the angle of repose makes height = radius. Solve a cubic for its size.",
      hint: "V = ⅓πr²h. With h = r, that's ⅓πr³. Solve for r (= h).",
      steps: [
        { do: "Volume formula", math: "V = ⅓πr²h", why: "Standard cone volume." },
        { do: "Use h = r", math: "100 = ⅓πr³", why: "Height equals radius, so r²h = r³." },
        { do: "Solve for r", math: "r³ = 300/π ≈ 95.49  →  r = ∛95.49 ≈ 4.57 m", why: "Multiply by 3, divide by π, cube-root." },
      ],
      ans: "h = r ≈ 4.57 m"
    },
  ],
  3: [
    {
      src: "6.1 Q1 · Place value as powers",
      q: "Decompose 21507, 711 and 412.542 by digits using powers of 10, and state the order of each.",
      hook: "⛏️ Every number is secretly a sum of powers of 10 — like reading a tonnage as ten-thousands + thousands + hundreds. The 'order' is just the biggest power.",
      hint: "Each digit sits in a place worth a power of 10. Order = the exponent of the leftmost (biggest) place.",
      steps: [
        { do: "Decompose 21507", math: "2×10⁴ + 1×10³ + 5×10² + 0×10 + 2×10⁰", why: "Each place is ten times the one to its right." },
        { do: "Decompose 711", math: "7×10² + 1×10 + 1×10⁰" },
        { do: "Decompose 412.542", math: "4×10² + 1×10 + 2×10⁰ + 5×10⁻¹ + 4×10⁻² + 2×10⁻³", why: "Digits after the point use negative powers." },
        { do: "Order = biggest power present", math: "21507 → 4 · 711 → 2 · 412.542 → 2" },
      ],
      ans: "Orders: 4, 2, 2"
    },
    {
      src: "6.1 Q2 · Binary → decimal",
      q: "Convert binary 1111 and 10110101 to decimal.",
      hook: "⛏️ Binary is base-2 place value — each slot is a power of 2 instead of 10. Like a row of on/off switches.",
      hint: "Each 1 contributes its power of 2; add them up. Rightmost slot is 2⁰.",
      steps: [
        { do: "1111₂ — powers of 2", math: "1×2³ + 1×2² + 1×2¹ + 1×2⁰ = 8+4+2+1 = 15" },
        { do: "10110101₂", math: "128 + 0 + 32 + 16 + 0 + 4 + 0 + 1 = 181", why: "Powers from 2⁷ down: 1·128, 0, 1·32, 1·16, 0, 1·4, 0, 1·1." },
      ],
      ans: "1111₂ = 15 · 10110101₂ = 181"
    },
    {
      src: "6.1 Q3 · Decimal → binary",
      q: "Convert decimal 19 and 499 to binary.",
      hook: "⛏️ Reverse of Q2: repeatedly divide by 2 and collect the remainders, read bottom-to-top.",
      hint: "Divide by 2, write the remainder (0 or 1), repeat on the quotient. Read the remainders upward.",
      steps: [
        { do: "19: divide by 2, track remainders", math: "19→1, 9→1, 4→0, 2→0, 1→1", why: "Remainders read upward give the bits." },
        { do: "Read bottom-up", math: "19 = 10011₂" },
        { do: "499 the same way", math: "499 = 111110011₂", why: "Check: 256+128+64+32+16+2+1 = 499 ✓." },
      ],
      ans: "19 = 10011₂ · 499 = 111110011₂"
    },
    {
      src: "6.1 Q4 · Plot exp + reflection",
      q: "Plot y = (1/100)e^(2x) on [−2, 2], then use it to plot y = (1/100)e^(−2x).",
      hook: "⛏️ Exponential blast-off — and its mirror image. The second curve is the first reflected across the y-axis.",
      hint: "Table the first curve. The second is f(−x): the same curve flipped left-to-right.",
      steps: [
        { do: "First curve grows fast", math: "f(x) = (1/100)e^(2x): f(0)=0.01, f(2)≈0.55", why: "Tiny near the left, shoots up on the right." },
        { do: "Second = reflection f(−x)", math: "g(x) = (1/100)e^(−2x) = f(−x)", why: "Replacing x with −x mirrors the graph across the y-axis." },
        { do: "So g decays instead", math: "g(0)=0.01, g(−2)≈0.55, g(2)≈0", why: "Same shape facing the other way — see the chart." },
      ],
      ans: "f grows to the right; g = f(−x) is its mirror, decaying to the right"
    },
    {
      src: "6.2 Q1 · Log rules",
      q: "Given log2 ≈ 0.3010, log3 ≈ 0.4771, log7 ≈ 0.8451, find log12, log15, log49, log(1/98), log(1/280).",
      hook: "⛏️ Break big logs into the small logs you already know — like costing a job from known unit rates. The log laws are your rate card.",
      hint: "Use log(ab)=log a+log b, log(a/b)=log a−log b, log(aⁿ)=n·log a, and log10 = 1.",
      steps: [
        { do: "log12 = log(3·2²)", math: "log3 + 2log2 ≈ 0.4771 + 0.6020 = 1.0791" },
        { do: "log15 = log(30/2) = log3 + log10 − log2", math: "≈ 0.4771 + 1 − 0.3010 = 1.1761" },
        { do: "log49 = log7²", math: "2log7 ≈ 1.6902" },
        { do: "log(1/98) = −log(2·49)", math: "−(log2 + 2log7) ≈ −0.3010 − 1.6902 = −1.9912" },
        { do: "log(1/280) = −log(4·7·10)", math: "−(2log2 + log7 + 1) ≈ −0.6020 − 0.8451 − 1 = −2.4471" },
      ],
      ans: "1.0791 · 1.1761 · 1.6902 · −1.9912 · −2.4471"
    },
    {
      src: "6.2 Q2 · Evaluate (cancel laws)",
      q: "Evaluate: a) 2 − log₈(8√8);  b) 10^(log(x²−5)).",
      hook: "⛳ A log and its own base undo each other — like a swing and its mirror, they cancel. Spot the cancel and the work melts away.",
      hint: "a) Write 8√8 as a single power of 8. b) 10^(log …) collapses straight to the inside.",
      steps: [
        { do: "a) 8√8 as a power of 8", math: "8√8 = 8 · 8^(1/2) = 8^(3/2)", why: "√8 = 8^(1/2); add the indices." },
        { do: "a) Take log₈", math: "log₈(8^(3/2)) = 3/2, so 2 − 3/2 = 1/2", why: "log_b(bⁿ) = n." },
        { do: "b) Base-10 and log cancel", math: "10^(log(x²−5)) = x² − 5", why: "10^(log A) = A — they are inverse operations." },
      ],
      ans: "a) 1/2 · b) x² − 5"
    },
    {
      src: "6.2 Q3 · Plot y = log₂ x^(3/2)",
      q: "Plot y = log₂ x^(3/2) on [0.2, 128] (linear and log scales).",
      hook: "⛏️ A log curve: rises fast then flattens — like early gains on a new pit that taper off.",
      hint: "Bring the power down first: log₂ x^(3/2) = (3/2)log₂ x. Then table a few x's.",
      steps: [
        { do: "Power rule for logs", math: "y = (3/2) log₂ x", why: "log(aⁿ) = n log a brings the 3/2 out the front." },
        { do: "Table key points", math: "x=1→0, x=2→1.5, x=8→4.5, x=128→10.5", why: "log₂ of powers of 2 comes out clean." },
        { do: "Read the shape", why: "Negative for x<1, zero at x=1, rising then flattening — the classic log curve." },
      ],
      ans: "y = (3/2)log₂ x: 0 at x=1, 10.5 at x=128"
    },
    {
      src: "6.2 Q4 · Plot a log curve",
      q: "Plot y = (1/3)log x on [1, 100] (linear and log scales).",
      hook: "⛏️ Another slow-rising log — doubling x barely nudges y. Diminishing returns in picture form.",
      hint: "Just table values with the calculator's log button, then divide by 3.",
      steps: [
        { do: "Table values", math: "x=1→0, x=10→0.333, x=100→0.667", why: "log10 = 1, log100 = 2, scaled by 1/3." },
        { do: "Read the shape", why: "Starts at 0, climbs ever more slowly — a gentle log curve." },
      ],
      ans: "0 at x=1, ≈0.667 at x=100"
    },
    {
      src: "6.2 Q5 · Log-log parametric plot",
      q: "Plot x = 2×10^(0.2t) and y = 0.5×10^(0.1t²) for t ∈ [0, 5] (linear and double-log scales).",
      hook: "⛏️ Two quantities both exploding with time — best viewed on log paper, where exponentials straighten into lines.",
      hint: "Table t, compute x and y (both grow fast). On log-log axes the relationship reads far more easily.",
      steps: [
        { do: "Table both gauges", math: "t=0: (2, 0.5)   t=2.5: (6.32, 2.11)   t=5: (20, 158.1)", why: "Both rise steeply — y especially, because of the t² in its exponent." },
        { do: "Why log scales help", why: "On a log axis, constant-ratio growth becomes a straight line, so a curved blow-up becomes readable." },
      ],
      ans: "Both rise sharply; they straighten out on log-log axes"
    },
    {
      src: "6.3 Q1 · Solve exp/log equations",
      q: "Solve: a) 0.5 = 50×10^(−3x); b) log(x²+100) − 1 = log(2x); c) 2^(x+3) = 4^x; d) log₂(4x)+1 = log₄ x³; e) e^(−x²+1) = 3e^(−2x).",
      hook: "⛏️ Five ways to dig the unknown out of an exponent or a log — logs pull exponents down; matching the base lets you compare powers directly.",
      hint: "a) isolate the power, match base 10. b) combine logs, drop them. c) write 4 = 2². d) convert to base 2, collect. e) take ln of both sides → quadratic.",
      steps: [
        { do: "a) Isolate, then match base", math: "0.01 = 10^(−3x) → 10^(−2) = 10^(−3x) → −2 = −3x → x = 2/3", why: "Equal bases ⇒ equal exponents." },
        { do: "b) Combine logs, drop them", math: "log((x²+100)/10) = log(2x) → x²+100 = 20x → (x−10)² = 0 → x = 10", why: "Same log on both sides ⇒ the insides are equal." },
        { do: "c) Make the bases match", math: "2^(x+3) = (2²)^x = 2^(2x) → x+3 = 2x → x = 3" },
        { do: "d) Convert to base 2 and collect", math: "log₂x + 3 = (3/2)log₂x → 3 = ½log₂x → log₂x = 6 → x = 64", why: "log₄x³ = 3·(log₂x / 2)." },
        { do: "e) ln both sides → quadratic", math: "−x²+1 = ln3 − 2x → x² − 2x + (ln3 − 1) = 0 → x = 1 ± √(2 − ln3) ≈ 1.95 or 0.05", why: "ln cancels the e's; finish with the quadratic formula." },
      ],
      ans: "a) 2/3 · b) 10 · c) 3 · d) 64 · e) ≈1.95 or 0.05"
    },
    {
      src: "6.3 Q2 · Compound interest (Lisa)",
      q: "Lisa deposits $3500 for 3 years at 5.5% compounded annually. a) Compound amount? b) Compound interest? c) How long to reach $5000?",
      hook: "⛏️ Money growing on itself — the exact compound formula behind the exam's interest question.",
      hint: "S = P(1+r)ⁿ. Interest = S − P. For the time, take logs.",
      steps: [
        { do: "a) Compound amount", math: "S = 3500(1.055)³ = $4109.84" },
        { do: "b) Interest = S − P", math: "4109.84 − 3500 = $609.84" },
        { do: "c) Solve for n", math: "5000 = 3500(1.055)ⁿ → 1.055ⁿ = 10/7 → n = log(10/7)/log(1.055) ≈ 6.65 → 7 years", why: "Logs bring n down from the exponent; round up to finish the year." },
      ],
      ans: "a) $4109.84 · b) $609.84 · c) ≈7 years"
    },
    {
      src: "6.3 Q3 · Find the rate (Bill)",
      q: "Bill deposits $4000 for 3 years compounded annually and earns $911.55 interest. a) Find the annual rate. b) How long to reach $6000?",
      hook: "⛏️ Work the compound formula backwards to find the hidden rate — exactly the exam Q1c skill.",
      hint: "Interest gives you (1+r)³. Cube-root for r. Then logs for the time.",
      steps: [
        { do: "a) Interest formula", math: "911.55 = 4000[(1+r)³ − 1] → (1+r)³ = 1.22789" },
        { do: "a) Cube-root", math: "1+r = 1.22789^(1/3) ≈ 1.071 → r ≈ 7.1%" },
        { do: "b) Time to $6000", math: "6000 = 4000(1.071)ⁿ → 1.071ⁿ = 1.5 → n = log1.5/log1.071 ≈ 5.9 → 6 years" },
      ],
      ans: "a) ≈7.1% · b) ≈6 years"
    },
    {
      src: "6.3 Q4 · Population growth",
      q: "A city of 300,000 grows 0.75%/yr. a) Population in 5 and 10 years? b) What rate reaches 400,000 in 10 years?",
      hook: "⛏️ Same growth model as the exam's population question — plug, project, then solve backwards for the rate.",
      hint: "S = P(1+r)ⁿ. For part b, isolate (1+r) with a 10th root.",
      steps: [
        { do: "a) Project forward", math: "5 yr: 300000(1.0075)⁵ ≈ 311,420   10 yr: 300000(1.0075)¹⁰ ≈ 323,275" },
        { do: "b) Required rate", math: "(1+r)¹⁰ = 400000/300000 = 4/3 → 1+r = (4/3)^(1/10) → r ≈ 2.919%", why: "Take the 10th root (raise to power 1/10)." },
      ],
      ans: "a) ≈311,420 then ≈323,275 · b) ≈2.92%/yr"
    },
    {
      src: "6.3 Q5 · Radioactive decay",
      q: "A radioactive element has 21 g left after 30 days, with a half-life of 91 days. Find the initial amount.",
      hook: "⛏️ Decay is growth's mirror — same exponential maths, negative rate. The half-life sets the decay constant.",
      hint: "Half-life T gives λ = ln2/T. Then N = N₀e^(−λt); solve for N₀.",
      steps: [
        { do: "Decay constant from half-life", math: "λ = ln2/T = 0.6931/91 ≈ 0.0076 per day" },
        { do: "Decay formula", math: "N = N₀e^(−λt) → 21 = N₀e^(−0.0076×30) = N₀e^(−0.228) ≈ 0.796 N₀" },
        { do: "Solve for N₀", math: "N₀ = 21/0.796 ≈ 26.38 g" },
      ],
      ans: "≈ 26.38 g"
    },
    {
      src: "6.3 Q6 · Earthquake energy",
      q: "Estimate the energy released by earthquakes of magnitude 8.5 and 7.3 using E = 10^(1.44Ms + 5.24), and compare them.",
      hook: "⛏️ The Richter scale is logarithmic — each step is a huge jump in energy. Powers of 10 doing real work.",
      hint: "Plug each Ms into the formula, then divide the two energies for the ratio.",
      steps: [
        { do: "Ms = 8.5", math: "E = 10^(1.44×8.5 + 5.24) = 10^17.48 ≈ 3.02×10¹⁷ J ≈ 302 PJ" },
        { do: "Ms = 7.3", math: "E = 10^(1.44×7.3 + 5.24) = 10^15.75 ≈ 5.65×10¹⁵ J ≈ 5.65 PJ" },
        { do: "Ratio", math: "302 / 5.65 ≈ 53.5", why: "A 1.2-magnitude difference ≈ 54× the energy." },
      ],
      ans: "302 PJ vs 5.65 PJ — about 54× more energy"
    },
  ],
  4: [
    {
      src: "7.1 Q1 · Translating cosine",
      q: "Use cos x on [−π, π] and the translation rules to get cos(x − π/4) and cos(x + π/4). Plot to show the shifts.",
      hook: "⛳ Same wave, slid sideways — like teeing off a few seconds earlier or later. A number inside the bracket = a horizontal shift.",
      hint: "cos(x − c) slides the whole curve RIGHT by c; cos(x + c) slides it LEFT.",
      steps: [
        { do: "cos(x − π/4): shift RIGHT by π/4", math: "the peak at x=0 moves to x = π/4", why: "Minus inside ⇒ delay ⇒ move right." },
        { do: "cos(x + π/4): shift LEFT by π/4", math: "the peak at x=0 moves to x = −π/4", why: "Plus inside ⇒ advance ⇒ move left." },
        { do: "Plot all three", why: "Three identical waves; the outer two are offset by ±π/4 — see the chart." },
      ],
      ans: "cos(x−π/4): right π/4 · cos(x+π/4): left π/4"
    },
    {
      src: "7.1 Q2 · Combine sin & cos (same freq)",
      q: "Combine 2sin3x + 5cos3x and 2sin3x − 5cos3x each into a single sinusoid C·sin(3x + φ).",
      hook: "⛏️ Two oscillations at the SAME frequency (like two vibration sources on a mill) merge into one clean wave. Formula 7.3 does it.",
      hint: "A·sin + B·cos = C·sin(ax + φ), with C = √(A²+B²) and φ = arctan(B/A).",
      steps: [
        { do: "Amplitude C", math: "C = √(2² + 5²) = √29 ≈ 5.39" },
        { do: "Phase φ", math: "φ = arctan(5/2) = 1.1903 rad" },
        { do: "Write the first one", math: "2sin3x + 5cos3x = √29 sin(3x + 1.1903)" },
        { do: "Second: B = −5", math: "C = √29, φ = arctan(−5/2) = −1.1903 → √29 sin(3x − 1.1903)", why: "Same amplitude, opposite phase shift." },
      ],
      ans: "√29 sin(3x + 1.1903) and √29 sin(3x − 1.1903)"
    },
    {
      src: "7.1 Q3 · Combine (with scaling)",
      q: "Given f(x) = −2sin2x and g(x) = 4cos2x, write 3f(x) + 2g(x) as a single sinusoid.",
      hook: "⛏️ Scale and merge two same-frequency waves into one — watch the signs.",
      hint: "Simplify to A·sin2x + B·cos2x, then C = √(A²+B²), φ = arctan(B/A).",
      steps: [
        { do: "Combine", math: "3(−2sin2x) + 2(4cos2x) = −6sin2x + 8cos2x", why: "A = −6, B = 8." },
        { do: "Amplitude", math: "√((−6)² + 8²) = √100 = 10  (take −10 to keep φ standard)" },
        { do: "Phase", math: "φ = −arctan(4/3) = −0.9273" },
        { do: "Result", math: "−10 sin(2x − 0.9273)" },
      ],
      ans: "−10 sin(2x − 0.9273)"
    },
    {
      src: "7.1 Q4 · Read the wave's spec",
      q: "For y = −2sin(3x + π/4) and y = 3sin(0.5t − π/6), state amplitude, phase, angular & ordinary frequency, and period.",
      hook: "⛏️ Reading a wave's spec sheet — amplitude (size), phase (shift), frequency (how often), period (one cycle).",
      hint: "Match to A·sin(ωx + φ): A = |coeff|, ω = number on the variable, φ = inside constant, f = ω/2π, T = 2π/ω.",
      steps: [
        { do: "First — A, φ, ω", math: "A = 2, φ = π/4, ω = 3", why: "Amplitude is the size; phase is the inside constant." },
        { do: "First — f and T", math: "f = 3/2π ≈ 0.48/s, T = 2π/3" },
        { do: "Second — A, φ, ω", math: "A = 3, φ = −π/6, ω = 0.5" },
        { do: "Second — f and T", math: "f = 0.5/2π ≈ 0.08/s, T = 4π" },
      ],
      ans: "y₁: A=2, φ=π/4, ω=3, T=2π/3 · y₂: A=3, φ=−π/6, ω=0.5, T=4π"
    },
    {
      src: "7.1 Q5 · Read the wave's spec (2)",
      q: "For y = 4sin(0.2x − 2π/3) and y = −5sin(4t + 3π/4), state amplitude, phase, angular & ordinary frequency, and period.",
      hook: "⛏️ Same spec-sheet reading, two more waves — lock in the pattern.",
      hint: "A = |coeff|, ω = number on the variable, φ = inside constant, f = ω/2π, T = 2π/ω.",
      steps: [
        { do: "First", math: "A = 4, φ = −2π/3, ω = 0.2, f ≈ 0.03/s, T = 10π" },
        { do: "Second", math: "A = 5, φ = 3π/4, ω = 4, f ≈ 0.64/s, T = π/2" },
      ],
      ans: "y₁: A=4, ω=0.2, T=10π · y₂: A=5, ω=4, T=π/2"
    },
    {
      src: "7.1 Q6 · Combine different freqs",
      q: "Given f(x) = −2sin3x and g(x) = 3cosx, find and plot 3f(x) + 4g(x).",
      hook: "⛏️ Different frequencies won't merge into one clean wave (formula 7.3 fails) — so you tabulate and plot.",
      hint: "Write the combined expression, then build a value table and join the dots.",
      steps: [
        { do: "Combine (can't use 7.3)", math: "−6sin3x + 12cosx", why: "Different ω (3 vs 1) ⇒ no single-sinusoid form." },
        { do: "Tabulate & plot", why: "Compute at sample x's and join — a complex repeating wave." },
      ],
      ans: "−6sin3x + 12cosx (plot from a table)"
    },
    {
      src: "7.1 Q7 · Combine different freqs (2)",
      q: "Given f(x) = 3sin2x and g(x) = 4cos3x, find and plot 3f(x) − 2g(x).",
      hook: "⛏️ Again two different frequencies — tabulate and plot.",
      hint: "Combine the expression, build a table.",
      steps: [
        { do: "Combine", math: "9sin2x − 8cos3x" },
        { do: "Plot from a table", why: "Mixed frequencies → composite waveform." },
      ],
      ans: "9sin2x − 8cos3x (plot from a table)"
    },
    {
      src: "7.1 Q8 · Plot a composite",
      q: "If sin2x and cos0.5x are defined on [−π, π], plot 2sin2x − 3cos0.5x.",
      hook: "⛏️ Build the combined wave point by point over the range.",
      hint: "Let f = sin2x, g = cos0.5x; tabulate h = 2f − 3g.",
      steps: [
        { do: "Define the combo", math: "h(x) = 2sin2x − 3cos0.5x" },
        { do: "Tabulate & plot on [−π, π]", why: "Two different frequencies — a composite curve." },
      ],
      ans: "h(x) = 2sin2x − 3cos0.5x (plot from a table)"
    },
    {
      src: "7.1 Q9 · Plot a sum",
      q: "If sinx and cos3x are defined on [−π, π], plot 4sinx + 2cos3x.",
      hook: "⛳ A slow swing plus a fast ripple — add them point by point.",
      hint: "Tabulate 4sinx + 2cos3x across the range.",
      steps: [
        { do: "Combine & tabulate", math: "4sinx + 2cos3x" },
        { do: "Plot", why: "A smooth sine with a 3× ripple riding on it — see the chart." },
      ],
      ans: "4sinx + 2cos3x (plot from a table)"
    },
    {
      src: "7.1 Q10 · Plot a sum of three",
      q: "If y₁ = −2sin3x, y₂ = 3cosx, y₃ = 3cos0.5x on [0, 2π], plot y₁ + y₂ + y₃.",
      hook: "⛏️ Three waves stacked — like three vibration sources combining on site.",
      hint: "Add all three at each x and plot the result.",
      steps: [
        { do: "Sum", math: "f(x) = −2sin3x + 3cosx + 3cos0.5x" },
        { do: "Tabulate on [0, 2π] & plot", why: "A rich composite waveform." },
      ],
      ans: "f(x) = −2sin3x + 3cosx + 3cos0.5x (plot from a table)"
    },
    {
      src: "7.2 Q1 · Inverse trig in [0, π]",
      q: "Evaluate (angles in [0, π]): (a) arcsin(1/2); (b) arccos(−√3/2); (c) arctan(√3/3); (d) arccot(−1); (e) arcsec(√2); (f) arccsc(−2).",
      hook: "⛏️ Inverse trig hands you back the ANGLE. Restricting to [0, π] keeps you in quadrants I and II.",
      hint: "Ask 'which angle in [0, π] gives this value?' Lean on the special angles (30°, 45°, 60°…).",
      steps: [
        { do: "(a) arcsin(1/2)", math: "π/6 (also 5π/6 in [0, π])" },
        { do: "(b) arccos(−√3/2)", math: "5π/6", why: "cos negative ⇒ quadrant II." },
        { do: "(c) arctan(√3/3)", math: "π/6", why: "√3/3 = 1/√3 = tan30°." },
        { do: "(d) arccot(−1)", math: "3π/4" },
        { do: "(e) arcsec(√2)", math: "π/4", why: "sec = √2 ⇒ cos = 1/√2 ⇒ π/4." },
        { do: "(f) arccsc(−2)", math: "no angle in [0, π]", why: "csc x ≥ 0 on (0, π), so a negative value can't occur." },
      ],
      ans: "(a) π/6 (or 5π/6) (b) 5π/6 (c) π/6 (d) 3π/4 (e) π/4 (f) none in [0,π]"
    },
    {
      src: "7.2 Q2 · Principal values",
      q: "Find the principal-value angle: (a) arcsin(√3/2); (b) arccos(−√3/2); (c) arctan(−√3).",
      hook: "⛏️ 'Principal value' = the calculator's single preferred answer, inside each function's standard range.",
      hint: "arcsin & arctan live in [−π/2, π/2]; arccos lives in [0, π].",
      steps: [
        { do: "(a) arcsin(√3/2)", math: "π/3", why: "Inside [−π/2, π/2]." },
        { do: "(b) arccos(−√3/2)", math: "5π/6", why: "arccos range [0, π]; negative ⇒ QII." },
        { do: "(c) arctan(−√3)", math: "−π/3", why: "arctan range (−π/2, π/2); negative input ⇒ negative angle." },
      ],
      ans: "(a) π/3 (b) 5π/6 (c) −π/3"
    },
    {
      src: "7.2 Q3 · General solutions",
      q: "Find ALL general solutions for: (a) arcsin(1/2); (b) arccos(−√3/2); (c) arctan(√3/3); (d) arccot(−1); (e) arcsec(√2); (f) arccsc(−2).",
      hook: "⛏️ Trig repeats forever, so each inverse value has infinitely many angles — tack on multiples of 2π.",
      hint: "Find the two base angles in one cycle, then add +2nπ (n = 0, ±1, ±2, …).",
      steps: [
        { do: "(a) base π/6 and 5π/6", math: "π/6 + 2nπ  and  5π/6 + 2nπ" },
        { do: "(b) 5π/6 and 7π/6", math: "5π/6 + 2nπ  and  7π/6 + 2nπ" },
        { do: "(c) π/6 and 7π/6", math: "π/6 + 2nπ  and  7π/6 + 2nπ" },
        { do: "(d) 3π/4 and 7π/4", math: "3π/4 + 2nπ  and  7π/4 + 2nπ" },
        { do: "(e) π/4 and 7π/4", math: "π/4 + 2nπ  and  7π/4 + 2nπ" },
        { do: "(f) 7π/6 and 11π/6", math: "7π/6 + 2nπ  and  11π/6 + 2nπ" },
      ],
      ans: "each = its base angle + 2nπ (n = 0, ±1, ±2, …)"
    },
    {
      src: "7.2 Q4 · Compound angles",
      q: "Given α = arcsin(√2/2) and β = arccos(−1/2) (principal values), evaluate: (a) sin(α+β); (b) cos(α−β); (c) tan(β/2); (d) cos2β.",
      hook: "⛏️ Build the needed sin/cos from each angle's quadrant, then feed the addition formulas. Pure identity work — exam-flavoured.",
      hint: "α is in QI (sin & cos positive). β is in QII (sin +, cos −). Get all four pieces, then apply the formulas.",
      steps: [
        { do: "Find the pieces", math: "sinα = cosα = √2/2;  cosβ = −1/2, sinβ = √3/2", why: "α = 45°, β = 120°." },
        { do: "(a) sin(α+β) = sinαcosβ + cosαsinβ", math: "= (√2/2)(−1/2) + (√2/2)(√3/2) = √2(√3 − 1)/4" },
        { do: "(b) cos(α−β) = cosαcosβ + sinαsinβ", math: "= same = √2(√3 − 1)/4" },
        { do: "(c) tan(β/2) = sinβ/(1 + cosβ)", math: "= (√3/2)/(1/2) = √3" },
        { do: "(d) cos2β = 2cos²β − 1", math: "= 2(1/4) − 1 = −1/2" },
      ],
      ans: "(a) √2(√3−1)/4 (b) √2(√3−1)/4 (c) √3 (d) −1/2"
    },
    {
      src: "7.3 Q1 · Trig equation",
      q: "Solve cos2x − 2sinxcosx = 0 for x in [−π/2, π/2].",
      hook: "⛏️ Double-angle cleanup: turn everything into tan, factor, solve.",
      hint: "Use cos2x = cos²x − sin²x and 2sinxcosx = sin2x; divide by cos²x to get a quadratic in tanx.",
      steps: [
        { do: "Expand cos2x", math: "cos²x − sin²x − 2sinxcosx = 0" },
        { do: "Divide by cos²x", math: "1 − tan²x − 2tanx = 0 → tan²x + 2tanx − 1 = 0" },
        { do: "Quadratic in tanx", math: "tanx = −1 ± √2" },
        { do: "Solve in range", math: "x = arctan(−1+√2) = 22.5°,  arctan(−1−√2) = −67.5°" },
      ],
      ans: "x = 22.5° and −67.5°"
    },
    {
      src: "7.3 Q2 · Trig equation",
      q: "Solve 3tanx − 4sinx = 0 for x in [0, π].",
      hook: "⛏️ Hidden common factor: write tan as sin/cos, then pull out sinx.",
      hint: "Multiply by cosx, factor out sinx.",
      steps: [
        { do: "Write tan as sin/cos, ×cosx", math: "3sinx − 4sinxcosx = 0" },
        { do: "Factor sinx", math: "sinx(3 − 4cosx) = 0" },
        { do: "Solve each factor", math: "3 − 4cosx = 0 → cosx = 3/4 → x ≈ 41.41°", why: "sinx = 0 gives the trivial x = 0 and π." },
      ],
      ans: "x ≈ 41.41° (plus trivial 0 and π)"
    },
    {
      src: "7.3 Q3 · Trig equation",
      q: "Solve cos²x − 2sinx = −1 for x in [0, π].",
      hook: "⛏️ Convert cos² to sin² so it's all one function, then it's a quadratic in sinx.",
      hint: "Use cos²x = 1 − sin²x. THE TRAP: that's cos SQUARED — not cos2x, which is 1 − 2sin²x.",
      steps: [
        { do: "Replace cos²x", math: "1 − sin²x − 2sinx = −1 → sin²x + 2sinx − 2 = 0" },
        { do: "Quadratic in sinx", math: "sinx = −1 ± √3 → sinx = √3 − 1 ≈ 0.732 (reject −1−√3)" },
        { do: "Solve in [0, π]", math: "x ≈ 47.06° (and 132.94° also satisfies it)" },
      ],
      ans: "x ≈ 47.06° (and 132.94°)"
    },
    {
      src: "7.3 Q4 · Trig equation",
      q: "Solve 3tanx − cotx = 0 for x in [−π/2, π/2].",
      hook: "⛏️ Turn cot into 1/tan, clear it, then solve for tan².",
      hint: "Multiply by tanx (since tanx·cotx = 1).",
      steps: [
        { do: "×tanx", math: "3tan²x − 1 = 0" },
        { do: "Solve", math: "tan²x = 1/3 → tanx = ±√3/3" },
        { do: "Angles", math: "x = ±30°" },
      ],
      ans: "x = 30° and −30°"
    },
    {
      src: "7.3 Q5 · Trig equation",
      q: "Solve sinxcosx − 1 = sinx − cosx for x in [−π/2, π/2].",
      hook: "⛏️ Factor by grouping — a shared factor (cosx − 1) appears on both sides.",
      hint: "Rearrange, then factor sinx(cosx−1) on the left and −(cosx−1) on the right.",
      steps: [
        { do: "Rearrange", math: "sinxcosx − sinx = −cosx + 1" },
        { do: "Factor both sides", math: "sinx(cosx − 1) = −(cosx − 1)" },
        { do: "Divide by (cosx − 1)", math: "sinx = −1 → x = −90°" },
      ],
      ans: "x = −90°"
    },
    {
      src: "7.3 Q6 · Trig equation",
      q: "Solve 2sin²(x/2) = cosx for x in [−π/2, π/2].",
      hook: "⛏️ Use the double-angle link between x and x/2.",
      hint: "cosx = cos(2·x/2) = 1 − 2sin²(x/2). Substitute.",
      steps: [
        { do: "Replace cosx", math: "2sin²(x/2) = 1 − 2sin²(x/2)" },
        { do: "Solve for sin(x/2)", math: "4sin²(x/2) = 1 → sin(x/2) = ±1/2 → x/2 = ±30°" },
        { do: "Double it", math: "x = ±60°" },
      ],
      ans: "x = 60° and −60°"
    },
    {
      src: "7.3 Q7 · Trig equation",
      q: "Solve cos²x + 4cosx = 1 for x in [0, π].",
      hook: "⛏️ Straight quadratic in cosx — let t = cosx.",
      hint: "t² + 4t − 1 = 0; keep only the root with |t| ≤ 1.",
      steps: [
        { do: "Let t = cosx", math: "t² + 4t − 1 = 0 → t = −2 ± √5" },
        { do: "Keep the valid root", math: "cosx = −2 + √5 ≈ 0.236 (reject −2−√5)" },
        { do: "Angle", math: "x ≈ 76.35°" },
      ],
      ans: "x ≈ 76.35°"
    },
    {
      src: "7.3 Q8 · Trig equation",
      q: "Solve 2cscx = tanx + cotx for x in [−π/2, π/2].",
      hook: "⛏️ The right side collapses: tan + cot = 1/(sinx cosx). Big simplification.",
      hint: "Write everything over sin and cos; tanx + cotx = 1/(sinx cosx).",
      steps: [
        { do: "Combine the right side", math: "tanx + cotx = 1/(sinx cosx)" },
        { do: "Equation becomes", math: "2/sinx = 1/(sinx cosx) → 2 = 1/cosx → cosx = 1/2" },
        { do: "Angles", math: "x = ±60°" },
      ],
      ans: "x = 60° and −60°"
    },
    {
      src: "7.4 Q1 · Prove identity",
      q: "Prove 1 − tanh²x = sech²x.",
      hook: "⛏️ Hyperbolic identities mirror the trig ones (with a sign twist). Prove via the eˣ definitions.",
      hint: "Write tanh and sech with eˣ; common denominator; simplify.",
      steps: [
        { do: "Definitions", math: "tanhx = (eˣ−e⁻ˣ)/(eˣ+e⁻ˣ), sechx = 2/(eˣ+e⁻ˣ)" },
        { do: "Compute 1 − tanh²x", math: "= [(eˣ+e⁻ˣ)² − (eˣ−e⁻ˣ)²]/(eˣ+e⁻ˣ)² = 4/(eˣ+e⁻ˣ)²", why: "The numerator is a difference of squares — it collapses to 4." },
        { do: "Recognise sech²x", math: "sech²x = 4/(eˣ+e⁻ˣ)² ✓" },
      ],
      ans: "Proved: 1 − tanh²x = sech²x"
    },
    {
      src: "7.4 Q2 · Prove identity",
      q: "Prove coth²x − 1 = csch²x.",
      hook: "⛏️ Same approach as Q1, with the minus version of the denominator.",
      hint: "Use cothx = (eˣ+e⁻ˣ)/(eˣ−e⁻ˣ), cschx = 2/(eˣ−e⁻ˣ).",
      steps: [
        { do: "Compute coth²x − 1", math: "= [(eˣ+e⁻ˣ)² − (eˣ−e⁻ˣ)²]/(eˣ−e⁻ˣ)² = 4/(eˣ−e⁻ˣ)²" },
        { do: "Recognise csch²x", math: "csch²x = 4/(eˣ−e⁻ˣ)² ✓" },
      ],
      ans: "Proved: coth²x − 1 = csch²x"
    },
    {
      src: "7.4 Q3 · Prove identity",
      q: "Prove sinh2x = 2 sinhx coshx.",
      hook: "⛏️ The hyperbolic double-angle, straight from the definitions.",
      hint: "sinh2x = (e^(2x) − e^(−2x))/2; expand 2 sinhx coshx and compare.",
      steps: [
        { do: "Expand the right side", math: "2·[(eˣ−e⁻ˣ)/2]·[(eˣ+e⁻ˣ)/2] = (e^(2x) − e^(−2x))/2", why: "Difference of squares: (eˣ)² − (e⁻ˣ)²." },
        { do: "Recognise sinh2x", math: "sinh2x = (e^(2x) − e^(−2x))/2 ✓" },
      ],
      ans: "Proved: sinh2x = 2 sinhx coshx"
    },
    {
      src: "7.4 Q4 · Solve (hyperbolic)",
      q: "Solve coshx − sinhx = e^(−x² + 3x).",
      hook: "⛏️ coshx − sinhx simplifies to a single exponential — then just match exponents.",
      hint: "coshx − sinhx = e^(−x). Set the exponents equal.",
      steps: [
        { do: "Simplify the left side", math: "coshx − sinhx = (eˣ+e⁻ˣ)/2 − (eˣ−e⁻ˣ)/2 = e^(−x)" },
        { do: "Match exponents", math: "e^(−x) = e^(−x²+3x) → −x = −x² + 3x" },
        { do: "Solve", math: "x² − 4x = 0 → x(x − 4) = 0 → x = 0 or 4" },
      ],
      ans: "x = 0 and x = 4"
    },
  ],
  5: [
    {
      src: "10.1 Q1 · Limits by substitution",
      q: "Evaluate: (a) lim_{x→1}(2x−1); (b) lim_{x→2}(x²−2x+5); (c) lim_{x→3}(x−2)/(x+2); (d) lim_{x→−2}(3x+1)/(x²+6); (e) lim_{x→6}√(x²−2x−8); (f) lim_{x→5}(2x−1)/(2x); (g) lim_{x→−1}(x−|x|).",
      hook: "⛏️ The easy kind of limit: if the function is well-behaved, it's just 'plug the number in'.",
      hint: "For continuous functions, lim_{x→a} f(x) = f(a). Substitute — unless you hit 0/0.",
      steps: [
        { do: "(a)–(d) substitute directly", math: "(a) 1 · (b) 5 · (c) 1/5 · (d) −5/10 = −1/2" },
        { do: "(e) substitute under the root", math: "√(36 − 12 − 8) = √16 = 4" },
        { do: "(f) substitute", math: "(10 − 1)/10 = 9/10" },
        { do: "(g) resolve |x| first", math: "at x=−1, |x| = 1: −1 − 1 = −2", why: "For x<0, |x| = −x, so x − |x| = 2x = −2." },
      ],
      ans: "1 · 5 · 1/5 · −1/2 · 4 · 9/10 · −2"
    },
    {
      src: "10.1 Q2 · Harder limits (∞ and 0/0)",
      q: "Evaluate: (a) lim_{x→∞}(x+2)/(x−1); (b) lim_{x→∞}(x+3)/(3x²+2x−3); (c) lim_{x→∞}(−x+3)/(2x−5); (d) lim_{x→∞}(x³+3x²−7)/(x²−1); (e) lim_{x→0}(x+2)/x; (f) lim_{x→−4}(x+4)/(x²+2x−8); (g) lim_{x→1}(x²−1)/(x−1); (h) lim_{x→2}(x−2)/(√(x²+5)−3); (i) lim_{x→2} x(x−2)/(√(x+2)−2).",
      hook: "⛏️ Three power tools: divide by the top power of x (for ∞), factor (for 0/0), or rationalise (roots in 0/0).",
      hint: "At ∞, divide every term by the highest power of x. For 0/0, factor and cancel, or multiply by the conjugate.",
      steps: [
        { do: "(a)–(d) divide by the top power of x", math: "(a) → 1 · (b) → 0 · (c) → −1/2 · (d) → ∞ (does not exist)", why: "Lower powers vanish as x→∞; compare the leading terms." },
        { do: "(e) it blows up", math: "(x+2)/x → 2/0 = ∞ (does not exist)" },
        { do: "(f) factor & cancel", math: "(x+4)/((x+4)(x−2)) = 1/(x−2) → 1/(−6) = −1/6", why: "0/0: cancel the common (x+4). Careful — the answer is −1/6, not 0." },
        { do: "(g) factor & cancel", math: "(x+1)(x−1)/(x−1) = x+1 → 2" },
        { do: "(h) rationalise the root", math: "×(√(x²+5)+3): → (√(x²+5)+3)/(x+2) → 6/4 = 3/2" },
        { do: "(i) rationalise", math: "×(√(x+2)+2): → (√(x+2)+2)·x → 4·2 = 8" },
      ],
      ans: "1 · 0 · −1/2 · ∞ · ∞ · −1/6 · 2 · 3/2 · 8"
    },
    {
      src: "10.1 Q3 · Standard limits",
      q: "Derive lim_{x→0}(eˣ−1)/x = 1 and lim_{x→0} x/sin(ax) = 1/a.",
      hook: "⛏️ Two 'building-block' limits you reuse all through calculus.",
      hint: "For the first, tabulate values either side of 0. For the second, substitute t = ax to reach the standard sine form.",
      steps: [
        { do: "(eˣ−1)/x near 0", math: "x=−0.05→0.975 … x=0.05→1.025, closing on 1", why: "Continuous through y=1 from both sides → the limit is 1." },
        { do: "x/sin(ax): substitute t = ax", math: "= (1/a)·(t/sin t) → (1/a)(1) = 1/a", why: "lim t/sin t = 1, the standard small-angle limit." },
      ],
      ans: "Both shown: 1 and 1/a"
    },
    {
      src: "10.1 Q4 · Trig & exponential limits",
      q: "Evaluate: (a) lim_{x→0} sinx·tanx/x²; (b) lim_{x→0}(sin(x/2)−sin(x/3))/x; (c) lim_{x→2} sin((x−2)/3)/(x−2); (d) lim_{x→∞}((x−2)/(x+1))ˣ; (e) lim_{x→0}(1+2tanx)^(2cotx); (f) lim_{x→0}(1−x/3)^(2/x).",
      hook: "⛏️ Two families: small-angle sine limits (a–c) and the 'e' limit (1 + a/x)ˣ → eᵃ (d–f).",
      hint: "Split into known pieces. Use lim sinθ/θ = 1, and lim(1 + a/x)ˣ = eᵃ.",
      steps: [
        { do: "(a) split the product", math: "(sinx/x)(tanx/x) → 1·1 = 1" },
        { do: "(b) split the two sines", math: "½(sin(x/2)/(x/2)) − ⅓(sin(x/3)/(x/3)) → ½ − ⅓ = 1/6" },
        { do: "(c) substitute t = x−2", math: "sin(t/3)/t → 1/3" },
        { do: "(d) shape into eᵃ", math: "((x−2)/(x+1))ˣ = (1 − 3/(x+1))ˣ → e⁻³" },
        { do: "(e) e-limit", math: "(1+2tanx)^(2cotx) → e⁴", why: "Let t = cotx; (1 + 2/t)^(2t) → e⁴." },
        { do: "(f) e-limit", math: "(1 − x/3)^(2/x) → e^(−2/3)" },
      ],
      ans: "1 · 1/6 · 1/3 · e⁻³ · e⁴ · e^(−2/3)"
    },
    {
      src: "10.1 Q5 · One-sided limits / DNE",
      q: "Evaluate: (a) lim_{x→0}(1−e^(1/x)); (b) lim_{x→3}√(x²−9); (c) lim_{x→0}(x−|x|).",
      hook: "⛏️ Check BOTH sides — if they disagree, or one side isn't even defined, the limit does not exist.",
      hint: "Compute the left-hand and right-hand limits separately, then compare.",
      steps: [
        { do: "(a) the two sides differ", math: "x→0⁻: e^(1/x)→0 so →1;  x→0⁺: e^(1/x)→∞ so →−∞", why: "Different sides ⇒ limit does not exist." },
        { do: "(b) left side undefined", math: "x→3⁻: x²−9 < 0, so √ is undefined", why: "Can't approach from the left ⇒ DNE." },
        { do: "(c) both sides agree", math: "x→0⁻: 2x→0;  x→0⁺: 0;  ⇒ limit = 0" },
      ],
      ans: "(a) DNE · (b) DNE · (c) 0"
    },
    {
      src: "10.1 Q6 · Continuity of sec & csc",
      q: "On the stretch from 0 to π/2, where are secx and cscx continuous (open, closed or mixed interval)?",
      hook: "⛏️ A function breaks where its denominator hits zero. sec = 1/cos, csc = 1/sin.",
      hint: "Find where cos and sin equal zero in [0, π/2], and exclude those endpoints.",
      steps: [
        { do: "secx = 1/cosx", math: "cos(π/2) = 0 → undefined at π/2", why: "Continuous on [0, π/2): include 0, exclude π/2." },
        { do: "cscx = 1/sinx", math: "sin(0) = 0 → undefined at 0", why: "Continuous on (0, π/2]: exclude 0, include π/2." },
      ],
      ans: "secx on [0, π/2) · cscx on (0, π/2]"
    },
    {
      src: "10.2 Q1 · Derivative by first principles",
      q: "Find the derivative of y = √(2x+3) using the limit definition.",
      hook: "⛏️ The definition behind every shortcut rule — the slope as the step δx shrinks to zero.",
      hint: "Form [f(x+δx) − f(x)]/δx, rationalise the root difference, then let δx → 0.",
      steps: [
        { do: "Set up the difference quotient", math: "[√(2x+2δx+3) − √(2x+3)] / δx" },
        { do: "Rationalise (× the conjugate)", math: "→ 2δx / [δx(√(2x+2δx+3) + √(2x+3))]", why: "Difference of squares clears the roots on top." },
        { do: "Cancel δx, then let δx → 0", math: "→ 2 / (2√(2x+3)) = 1/√(2x+3)" },
      ],
      ans: "y′ = 1/√(2x+3)"
    },
    {
      src: "10.2 Q2 · Derivatives by rules",
      q: "Differentiate (a–n): a) x⁴−2x³−x²+5x+3; b) x²−2x+5; c) ∛(8x²); d) 3/√(x³); e) e^(2x); f) e^(−3x); g) ⅔ln x; h) log x⁻²; i) log₂√x; j) sin3x+2cos2x−cos3x; k) tanx+sin2x; l) 3e^(−2x)−2e^(3x); m) ln(x/√(2x)); n) −2x+ln(1/x).",
      hook: "⛏️ The rule toolkit: power rule, eᵏˣ, ln/log and the trig derivatives. Rewrite roots and logs as powers first.",
      hint: "Power rule: d/dx xⁿ = n·xⁿ⁻¹. (eᵏˣ)′ = k·eᵏˣ. (ln x)′ = 1/x. (sin ax)′ = a·cos ax, (cos ax)′ = −a·sin ax.",
      steps: [
        { do: "Polynomials (a, b)", math: "(a) 4x³−6x²−2x+5   (b) 2x−2", why: "Power rule term by term; constants vanish." },
        { do: "Roots as powers (c, d)", math: "(c) (4/3)x^(−1/3) = 4/(3∛x)   (d) −(9/2)x^(−5/2) = −9/(2√(x⁵))", why: "∛(8x²) = 2x^(2/3); 3/√(x³) = 3x^(−3/2)." },
        { do: "Exponentials & logs (e–i)", math: "(e) 2e^(2x) (f) −3e^(−3x) (g) 2/(3x) (h) −2/(x·ln10) (i) 1/(2x·ln2)" },
        { do: "Trig & combos (j–n)", math: "(j) 3cos3x−4sin2x+3sin3x (k) sec²x+2cos2x (l) −6(e^(−2x)+e^(3x)) (m) 1/(2x) (n) −2 − 1/x" },
      ],
      ans: "see each part above (power / exp / log / trig rules)"
    },
    {
      src: "10.2 Q3 · Product & quotient rule",
      q: "Differentiate (a–n): a) x³e^(2x); b) 2x²·ln√x; c) ∛(8x²)·sinx; d) ⅓e^(−3x)ln x; e) e^(2x)cos2x; f) e^(−3x)sin(x/3); g) (ln x²)/(2x); h) (x²−e^(2x))/ln x; i) 4√x/e^(2x); j) sin3x·cos2x; k) tanx/cos2x; l) (3e^(−2x)−2e^(3x))/(3x²); m) (ln x)/√(2x); n) −2x·ln(1/x).",
      hook: "⛏️ Two machines combined: product rule (u′v + uv′) for things multiplied, quotient rule ((u′v − uv′)/v²) for fractions.",
      hint: "Name u and v, find u′ and v′, slot into the rule, then simplify.",
      steps: [
        { do: "Product-rule pattern (a, e, j)", math: "(a) x²e^(2x)(3+2x) · (e) 2e^(2x)(cos2x−sin2x) · (j) 3cos3x·cos2x − 2sin3x·sin2x", why: "(uv)′ = u′v + uv′." },
        { do: "Quotient-rule pattern (g, h)", math: "(g) (1−ln x)/x² · (h) [x²(2ln x−1) + e^(2x)(1−2x·ln x)] / (x(ln x)²)", why: "(u/v)′ = (u′v − uv′)/v²." },
        { do: "The rest (b,c,d,f,i,k,l,m,n)", math: "(b) x(2ln x+1) (c) 4sinx/(3∛x)+2x^(2/3)cosx (d) e^(−3x)(1/(3x)−ln x) (f) e^(−3x)(⅓cos(x/3)−3sin(x/3)) (i) (2−8x)/(√x·e^(2x)) (k) (1−tan²x+4sin²x)/cos²2x (l) [−6e^(−2x)(1+x)+2e^(3x)(2−3x)]/(3x³) (m) (2−ln x)/(2x√(2x)) (n) 2(ln x+1)" },
      ],
      ans: "each part above (product / quotient rule)"
    },
    {
      src: "10.2 Q4 · Slope at a point",
      q: "Find the slope at x = 1 (or t = π/4): a) x²+3x−4; b) −2√x; c) e^(−3x); d) 2x²·ln√x; e) 4√x/e^(2x); f) sin3t+2cos2t (t=π/4); g) tan t+sin t (t=π/4).",
      hook: "⛏️ The derivative evaluated at a point IS the slope there — the gradient of the tangent line.",
      hint: "Differentiate, then substitute the given point.",
      steps: [
        { do: "(a)–(c)", math: "(a) 2x+3 → 5 · (b) −1/√x → −1 · (c) −3e^(−3x) → −3e⁻³" },
        { do: "(d)–(e)", math: "(d) 2x·ln x + x → 1 · (e) 2x^(−1/2)e^(−2x) − 8x²e^(−2x) → −6e⁻²", why: "At x = 1, ln1 = 0." },
        { do: "(f)–(g) at t = π/4", math: "(f) 3cos3t − 4sin2t → −4 − 3√2/2 · (g) sec²t + cos t → (4 + √2)/2" },
      ],
      ans: "5 · −1 · −3e⁻³ · 1 · −6e⁻² · (−4 − 3√2/2) · (4 + √2)/2"
    },
  ],
  6: [
    {
      src: "10.3 Q1 · Triple product rule",
      q: "Differentiate (products of three+ functions): a) 2x³eˣln x; b) 4√x·ln√x·e^(−x); c) x·e^(−x)·ln x·sin2x; d) tanx·sin2x; e) 3e^(−2x)cos2x; f) ln x·sin²x; g) x²·tanx·ln(1/x).",
      hook: "⛏️ When THREE things are multiplied, the product rule extends: differentiate each factor in turn and add.",
      hint: "Label u, v, w; find each derivative; sum three terms, each differentiating ONE factor.",
      steps: [
        { do: "The rule", math: "(uvw)′ = u′vw + uv′w + uvw′", why: "Each term differentiates one factor and leaves the others alone." },
        { do: "(a) worked", math: "2x³eˣlnx → 6x²eˣlnx + 2x³eˣlnx + 2x²eˣ" },
        { do: "(d) simplify first", math: "tanx·sin2x = 2sin²x → 2sin2x", why: "(sinx/cosx)(2sinxcosx) = 2sin²x." },
        { do: "Other answers", math: "(b) e^(−x)(lnx+2−2x·lnx)/√x (c) e^(−x)(lnx·sin2x − x·lnx·sin2x + sin2x + 2x·lnx·cos2x) (e) −6e^(−2x)(cos2x+sin2x) (f) sin²x/x + sin2x·lnx (g) −2x·tanx·lnx − x²sec²x·lnx − x·tanx" },
      ],
      ans: "all via (uvw)′ = u′vw + uv′w + uvw′"
    },
    {
      src: "10.3 Q2 · Chain rule",
      q: "Differentiate: a) (x−2)³; b) ½ln(2x+5); c) ∛((x+2)²); d) e^(−x²+2x); e) e^√(2x+3); f) sin(3x−2); g) cos(x²−2x+1); h) cos(3x+2)+2cos[2(x−1)]; i) ln(x²+2x+5); j) e^(sin(x+2)).",
      hook: "⛏️ Function inside a function — differentiate the OUTSIDE, then multiply by the derivative of the inside.",
      hint: "Spot the inner function u; dy/dx = (outer derivative) × u′.",
      steps: [
        { do: "The rule", math: "dy/dx = dy/du · du/dx" },
        { do: "Quick ones", math: "(a) 3(x−2)² · (f) 3cos(3x−2)" },
        { do: "Answers", math: "(b) 1/(2x+5) (c) 2/(3∛(x+2)) (d) −2(x−1)e^(−x²+2x) (e) e^√(2x+3)/√(2x+3) (g) −2(x−1)sin(x²−2x+1) (h) −3sin(3x+2) − 4sin2(x−1) (i) (2x+2)/(x²+2x+5) (j) cos(x+2)·e^(sin(x+2))" },
      ],
      ans: "each via the chain rule (see parts)"
    },
    {
      src: "10.3 Q3 · Logarithmic differentiation",
      q: "Differentiate by taking ln first: a) x³e^(2x)cos²x; b) 4√(x²+3)/e^(2x); c) 6√(x²+3x)·e^(x²+3x); d) 2(x+2)²ln√(x+2).",
      hook: "⛏️ When something is a big product or quotient of powers, take ln of both sides FIRST — products become sums that are easy to differentiate.",
      hint: "ln y = ln(...); differentiate both sides (left side gives y′/y); then y′ = y × (that).",
      steps: [
        { do: "(a) take ln", math: "ln y = 3lnx + 2x + 2ln cosx → y′/y = 3/x + 2 − 2tanx", why: "Products turn into sums of logs." },
        { do: "(a) multiply back by y", math: "y′ = x²e^(2x)cos²x(3 + 2x − 2x·tanx)" },
        { do: "Answers", math: "(b) −4(2x²−x+6)/(e^(2x)√(x²+3)) (c) 3(2x+3)(2x²+6x+1)e^(x²+3x)/√(x²+3x) (d) (x+2)[2ln(x+2)+1]" },
      ],
      ans: "via ln-then-differentiate (see parts)"
    },
    {
      src: "10.5 Q1 · Higher-order derivatives",
      q: "Find the 1st, 2nd and 3rd derivatives: a) e^(2x); b) −3x⁴−2x³−3x²+5; c) ln x; d) sin2x; e) cos(2x−1); f) e^(x²).",
      hook: "⛏️ Differentiate, then differentiate the result, then again — like acceleration is the derivative of velocity is the derivative of position.",
      hint: "Apply the rules repeatedly. For (f) you'll need the product rule from the 2nd derivative on.",
      steps: [
        { do: "(a) e^(2x)", math: "2e^(2x), 4e^(2x), 8e^(2x)", why: "Each derivative just multiplies by 2." },
        { do: "(b) polynomial", math: "−12x³−6x²−6x,  −36x²−12x−6,  −72x−12" },
        { do: "(c)–(e)", math: "(c) 1/x, −1/x², 2/x³ · (d) 2cos2x, −4sin2x, −8cos2x · (e) −2sin(2x−1), −4cos(2x−1), 8sin(2x−1)" },
        { do: "(f) e^(x²) — product rule kicks in", math: "2xe^(x²),  (2+4x²)e^(x²),  4x(2x²+3)e^(x²)" },
      ],
      ans: "see each part (1st · 2nd · 3rd)"
    },
    {
      src: "11.1 Q1 · Tangent & normal",
      q: "Given y = 3x² + 2x − 6, find the tangent and normal lines through (−1, −5).",
      hook: "⛏️ Tangent = the line that just grazes the curve (slope = y′). Normal = perpendicular to it. Exam Q2 bread-and-butter.",
      hint: "Tangent slope = y′ at the point. Normal slope = −1/(tangent slope). Use point-slope for each.",
      steps: [
        { do: "Tangent slope", math: "y′ = 6x + 2 → at x = −1: −4" },
        { do: "Tangent line", math: "y + 5 = −4(x + 1) → y = −4x − 9" },
        { do: "Normal slope = −1/(−4) = ¼", math: "y + 5 = ¼(x + 1) → y = ¼x − 19/4" },
      ],
      ans: "Tangent y = −4x − 9 · Normal y = ¼(x − 19)"
    },
    {
      src: "11.1 Q2 · Tangent & normal (ln)",
      q: "Given y = ln x + 6x − 5, find the tangent and normal lines through (1, 1).",
      hook: "⛏️ Same method, now with a log term — the derivative of ln x is 1/x.",
      hint: "Tangent slope = y′(1). Normal slope = −1/that.",
      steps: [
        { do: "Tangent slope", math: "y′ = 1/x + 6 → at x = 1: 7" },
        { do: "Tangent line", math: "y − 1 = 7(x − 1) → y = 7x − 6" },
        { do: "Normal line", math: "slope −1/7: y − 1 = −1/7(x − 1) → y = −(1/7)(x − 8)" },
      ],
      ans: "Tangent y = 7x − 6 · Normal y = −(1/7)(x − 8)"
    },
    {
      src: "11.1 Q3 · Tangent & normal (trig)",
      q: "Given y = sin2x − cosx, find the tangent and normal lines through (π/6, 0).",
      hook: "⛏️ Tangent/normal with trig — take care evaluating at π/6.",
      hint: "y′ = 2cos2x + sinx; evaluate at π/6 (cos(π/3) = ½, sin(π/6) = ½).",
      steps: [
        { do: "Tangent slope", math: "y′ = 2cos2x + sinx → 2(½) + ½ = 3/2" },
        { do: "Tangent line", math: "y = (3/2)(x − π/6) = (3/2)x − π/4" },
        { do: "Normal line", math: "slope −2/3: y = −(2/3)(x − π/6) = −(2/3)x + π/9" },
      ],
      ans: "Tangent y = (3/2)x − π/4 · Normal y = −(2/3)x + π/9"
    },
  ],
  7: [
    {
      src: "11.2 Q1 · Critical points (FDT & SDT)",
      q: "Use the first AND second derivative tests to find interior extrema: a) 2x²+4x−1; b) x·ln x; c) x+cos2x on [0,π]; d) −2x³+7x²−8x−2; e) 2−x^(2/3); f) 2x+sin2x on [−π,π].",
      hook: "⛏️ Find the turning points: set y′=0, then test. FDT: does the slope flip sign? SDT: y″>0 = valley (min), y″<0 = peak (max).",
      hint: "Solve y′=0 for the candidate x's. Classify with y″ (positive→min, negative→max), or by the sign-change of y′.",
      steps: [
        { do: "(a) 2x²+4x−1", math: "y′=4x+4=0 → x=−1; y″=4>0 → min, y=−3" },
        { do: "(b) x·ln x", math: "y′=ln x+1=0 → x=1/e; y″=1/x>0 → min, y=−1/e" },
        { do: "(c) x+cos2x on [0,π]", math: "y′=1−2sin2x=0 → x=π/12 (max, y=(π+6√3)/12) and 5π/12 (min, y=(5π−6√3)/12)" },
        { do: "(d) −2x³+7x²−8x−2", math: "y′=−6x²+14x−8=0 → x=4/3 (max, y=−134/27) and x=1 (min, y=−5)" },
        { do: "(e) 2−x^(2/3)", math: "y′ undefined at x=0 (a cusp) → max, y=2", why: "No y′=0 solution; the peak is where the derivative doesn't exist." },
        { do: "(f) 2x+sin2x", math: "y′=2+2cos2x=0 → x=±π/2, but y′ never changes sign → NOT extrema", why: "FDT: the slope stays positive either side, so these are just flat inflection points." },
      ],
      ans: "(a) min −3 (b) min −1/e (c) max (π+6√3)/12, min (5π−6√3)/12 (d) max −134/27, min −5 (e) max 2 (f) none"
    },
    {
      src: "11.2 Q3 · Global extremes",
      q: "Find ALL extreme points and values of y = 2√x + 1/x on [−2, 2].",
      hook: "⛏️ Don't forget the ENDPOINTS — global extremes can hide there, not only at turning points. And mind the domain.",
      hint: "√x needs x > 0, so really work on (0, 2]. Find interior critical points, then compare with the endpoints.",
      steps: [
        { do: "Fix the domain", math: "√x needs x ≥ 0, 1/x needs x ≠ 0 → use (0, 2]" },
        { do: "Interior critical point", math: "y′ = 1/√x − 1/x² = 0 → x = 1; y″(1) = 1.5 > 0 → min, y = 3" },
        { do: "Check the endpoints", math: "y(0⁺) → ∞ (global max);  y(2) = 2√2 + ½ ≈ 3.33" },
        { do: "Conclusion", math: "global min y = 3 at x = 1; y blows up as x → 0⁺" },
      ],
      ans: "Global min (1, 3); y → ∞ as x → 0⁺"
    },
    {
      src: "11.4 Q1 · L'Hôpital's Rule",
      q: "Evaluate (0/0 or ∞/∞): a) lim_{x→∞}(x²−2x+9)/(x·ln x); b) lim_{x→1}(2x²−3x+1)/(x·ln x); c) lim_{x→0}(2x²−x+cosx−1)/(3x); d) lim_{x→∞} 2x/eˣ; e) lim_{x→∞} e^(−2x)·x³.",
      hook: "⛏️ When a limit is 0/0 or ∞/∞, L'Hôpital says: differentiate top and bottom SEPARATELY, then try again. Repeat if needed.",
      hint: "Confirm it's 0/0 or ∞/∞ first. Then take d(top)/d(bottom). Re-apply until it resolves.",
      steps: [
        { do: "(a) apply twice", math: "→ (2x−2)/(ln x+1) → 2/(1/x) = 2x → ∞" },
        { do: "(b) once", math: "→ (4x−3)/(ln x+1) → 1/1 = 1" },
        { do: "(c) once", math: "→ (4x−1−sinx)/3 → −1/3" },
        { do: "(d) once", math: "→ 2/eˣ → 0" },
        { do: "(e) rewrite x³/e^(2x), then 3×", math: "→ … → 6/(8e^(2x)) → 0" },
      ],
      ans: "(a) ∞ (b) 1 (c) −1/3 (d) 0 (e) 0"
    },
    {
      src: "11.4 Q2 · Maximise profit",
      q: "Price per TV is p = 200 − 0.45x; cost of x sets is T(x) = 4500 + 0.55x². How many sets maximise profit, and what is the max profit?",
      hook: "⛏️ Optimisation: build the profit function, then find its peak with the derivative. Classic exam application.",
      hint: "Profit P = revenue − cost = x·p − T(x). Set P′ = 0, confirm with P″ < 0.",
      steps: [
        { do: "Build profit", math: "P = x(200 − 0.45x) − (4500 + 0.55x²) = −x² + 200x − 4500" },
        { do: "Maximise", math: "P′ = −2x + 200 = 0 → x = 100; P″ = −2 < 0 → max" },
        { do: "Maximum profit", math: "P(100) = −10000 + 20000 − 4500 = $5500" },
      ],
      ans: "Sell 100 sets → max profit $5500"
    },
    {
      src: "11.4 Q3 · Box of maximum volume",
      q: "An open box is made from 20 cm × 30 cm card by cutting x-sized squares from the corners and folding up the sides. Find x for maximum volume, and that volume.",
      hook: "⛏️ Classic optimisation — write the volume as a function of the cut size x, then maximise.",
      hint: "V = x(20−2x)(30−2x). Expand, set V′=0, keep the physically sensible root, confirm with V″.",
      steps: [
        { do: "Volume function", math: "V = x(20−2x)(30−2x) = 4x³ − 100x² + 600x" },
        { do: "Set V′ = 0", math: "12x² − 200x + 600 = 0 → 3x² − 50x + 150 = 0 → x = (50 ± 10√7)/6" },
        { do: "Keep the sensible root", math: "x ≈ 3.9 cm (the other, ≈12.7, is impossible)", why: "The cut can't exceed half the short side (10 cm)." },
        { do: "Confirm & evaluate", math: "V″(3.9) = −106.4 < 0 → max; V ≈ 1056 cm³" },
      ],
      ans: "x ≈ 3.9 cm → V ≈ 1056 cm³"
    },
    {
      src: "11.4 Q4 · Can with least material",
      q: "A cylindrical can must hold 2000 cm³. Find the dimensions that use the least material (minimum surface area).",
      hook: "⛏️ Minimise surface area subject to a fixed volume — use the volume constraint to get the area in terms of r alone.",
      hint: "V = πr²h fixes h = 2000/(πr²). Substitute into A = 2πr² + 2πrh, then minimise over r.",
      steps: [
        { do: "Express h, then A(r)", math: "h = 2000/(πr²) → A = 2πr² + 4000/r" },
        { do: "Minimise", math: "A′ = 4πr − 4000/r² = 0 → r³ = 1000/π → r ≈ 6.83 cm" },
        { do: "Find h and A", math: "h = 2000/(πr²) ≈ 13.66 cm; A″ > 0 → min; A ≈ 878.8 cm²" },
      ],
      ans: "r ≈ 6.83 cm, h ≈ 13.66 cm, A ≈ 878.8 cm²"
    },
    {
      src: "11.4 Q5 · Minimise a sum of squares",
      q: "Two positive numbers add to 100. Find them so the sum of their squares is minimum.",
      hook: "⛏️ Turn the constraint into one variable, then minimise. Intuition says 'split evenly' — the maths confirms it.",
      hint: "If one number is x, the other is 100 − x. Minimise s = x² + (100 − x)².",
      steps: [
        { do: "One-variable model", math: "s = x² + (100 − x)²" },
        { do: "Minimise", math: "s′ = 4x − 200 = 0 → x = 50; s″ = 4 > 0 → min" },
        { do: "The numbers", math: "50 and 50, s = 5000" },
      ],
      ans: "50 and 50 (minimum sum of squares = 5000)"
    },
  ],
  8: [
    {
      src: "11.3 Q1 · Differentials (dy)",
      q: "Find the differential dy for: a) x⁴−2x³−x²+5x+3; b) x²−2x+5; c) ∛(8x²); d) 3/√(x³); e) e^(2x); f) e^(−3x); g) ⅔ln x; h) (x²−e^(2x))/ln x; i) 4√x/e^(2x); j) sin3x·cos2x; k) tanx/cos2x; l) (3e^(−2x)−2e^(3x))/(3x²); m) (ln x)/√(2x); n) −2x·ln(1/x).",
      hook: "⛏️ A differential just dresses up the derivative: dy = y′·dx. It says how much y nudges when x nudges by a tiny dx.",
      hint: "Differentiate as usual, then write the result times dx. (These mirror the derivative drills from Weeks 5–6.)",
      steps: [
        { do: "The idea", math: "dy = y′ dx" },
        { do: "Worked examples", math: "(a) (4x³−6x²−2x+5)dx · (b) (2x−2)dx · (e) 2e^(2x)dx · (f) −3e^(−3x)dx" },
        { do: "Roots / logs / trig", math: "(c) (4/(3∛x))dx (d) (−9/(2√(x⁵)))dx (g) (2/(3x))dx (j) (3cos3x·cos2x − 2sin3x·sin2x)dx (n) 2(ln x+1)dx" },
        { do: "Quotients (h, k, l, m)", math: "apply the quotient rule, then × dx (same results as your Week-6 derivatives)" },
      ],
      ans: "each = y′ dx (see parts)"
    },
    {
      src: "11.3 Q2 · Estimating change δy",
      q: "With x = 0 and δx = 0.05, estimate the change δy for: a) x²+3x−4; b) −2√(x+4); c) e^(−3x); d) 2x²ln√(1+x); e) sin3x+2cos2x.",
      hook: "⛏️ Small-change estimate: δy ≈ y′(x)·δx. The derivative is the 'conversion rate' from a small x-step to a small y-step.",
      hint: "Find y′, evaluate it at x = 0, then multiply by δx = 0.05.",
      steps: [
        { do: "The rule", math: "δy ≈ y′(x)·δx" },
        { do: "(a)", math: "y′ = 2x+3 → at 0: 3 → δy ≈ 3(0.05) = 0.15" },
        { do: "(b)", math: "y′ = −1/√(x+4) → at 0: −½ → δy ≈ −0.025" },
        { do: "(c)", math: "y′ = −3e^(−3x) → at 0: −3 → δy ≈ −0.15" },
        { do: "(d)", math: "y = x²ln(1+x): y′ → at 0: 0 → δy ≈ 0" },
        { do: "(e)", math: "y′ = 3cos3x − 4sin2x → at 0: 3 → δy ≈ 0.15" },
      ],
      ans: "0.15 · −0.025 · −0.15 · 0 · 0.15"
    },
    {
      src: "12.1 Q1 · Basic integrals",
      q: "Integrate: a) ∫5x⁴dx and ∫∛(x²)dx; b) ∫4x⁻²dx and ∫(2/√x)dx; c) ∫e^(x/3)dx and ∫e^(−2x)dx; d) ∫2sin²x dx and ∫sin(x/3)dx; e) ∫(−1/x)dx and ∫1/(2x)dx.",
      hook: "⛏️ Integration is differentiation in reverse. Power rule: add 1 to the power, divide by the new power, and always +C.",
      hint: "Rewrite roots as powers. ∫xⁿdx = xⁿ⁺¹/(n+1)+C. For 2sin²x, use sin²x = (1−cos2x)/2.",
      steps: [
        { do: "(a) power rule", math: "x⁵ + C  ·  (3/5)x^(5/3) + C" },
        { do: "(b)", math: "−4/x + C  ·  4√x + C" },
        { do: "(c) exponentials", math: "3e^(x/3) + C  ·  −½e^(−2x) + C" },
        { do: "(d) use the sin² identity", math: "∫2sin²x dx = x − ½sin2x + C  ·  ∫sin(x/3)dx = −3cos(x/3) + C" },
        { do: "(e) the 1/x rule", math: "−ln x + C  ·  ½ln x + C", why: "∫1/x dx = ln|x|, NOT via the power rule." },
      ],
      ans: "see each part (don't forget +C)"
    },
    {
      src: "12.1 Q2 · Integrals & initial conditions",
      q: "Integrate (d–g use a point to find C): a) ∫(2x³−x²+4x−3)dx; b) ∫(4x+3/x+2/x²+1/x³)dx; c) ∫(e^(x/2)−e^(x/3))dx; d) ∫(3x²−4x+5)dx through (1,2); e) ∫(1−1/x−1/x²)dx through (1,−2); f) ∫(2cos²x−2sinxcosx)dx through (0,1); g) ∫(3√x−1/√x)dx through (2,10).",
      hook: "⛏️ Integrate to get the general family (+C), then use the given point to lock C to one curve — the same trick as the exam's kinematics question.",
      hint: "Integrate term by term, then substitute the point and solve for C.",
      steps: [
        { do: "(a)", math: "½x⁴ − ⅓x³ + 2x² − 3x + C" },
        { do: "(b)", math: "2x² + 3ln x − 2/x − 1/(2x²) + C" },
        { do: "(c)", math: "2e^(x/2) − 3e^(x/3) + C" },
        { do: "(d) fit C with (1,2)", math: "y = x³ − 2x² + 5x + C;  2 = 4 + C → C = −2 → y = x³−2x²+5x−2" },
        { do: "(e) with (1,−2)", math: "y = x − ln x + 1/x + C;  C = −4 → y = x − ln x + 1/x − 4" },
        { do: "(f) with (0,1)", math: "y = x + ½sin2x + ½cos2x + C;  C = ½ → y = x + ½(sin2x+cos2x+1)" },
        { do: "(g) with (2,10)", math: "y = 2x^(3/2) − 2x^(1/2) + C;  C = 10 − 2√2 → y = 2√(x³) − 2√x + 10 − 2√2" },
      ],
      ans: "see each (general form + fitted C)"
    },
    {
      src: "12.3 Q1 · Function from its gradient",
      q: "The gradient of a function is dy/dx = 3x² − 1/√x. Find the function passing through (1, 1).",
      hook: "⛏️ Given the slope everywhere, integrate to recover the function — then use the point to fix the constant.",
      hint: "Integrate dy/dx to get y + C, then substitute (1, 1).",
      steps: [
        { do: "Integrate", math: "y = ∫(3x² − x^(−1/2))dx = x³ − 2√x + C" },
        { do: "Use (1, 1)", math: "1 = 1 − 2 + C → C = 2" },
        { do: "Function", math: "y = x³ − 2√x + 2" },
      ],
      ans: "y = x³ − 2√x + 2"
    },
    {
      src: "12.3 Q2 · Beam bending moment",
      q: "A beam of length L has dM/dx = 2x(x − L). Find M given M = 0 at x = L.",
      hook: "⛏️ Integrate a rate to get the quantity, then a boundary condition fixes the constant — engineering integration.",
      hint: "Expand, integrate, then substitute x = L and M = 0 to find C.",
      steps: [
        { do: "Expand & integrate", math: "dM = (2x² − 2xL)dx → M = (2/3)x³ − x²L + C" },
        { do: "Apply M(L) = 0", math: "0 = (2/3)L³ − L³ + C → C = (1/3)L³" },
        { do: "Result", math: "M = (1/3)(2x³ − 3Lx² + L³)" },
      ],
      ans: "M = (1/3)(2x³ − 3Lx² + L³)"
    },
    {
      src: "12.3 Q4 · Radioactive decay law",
      q: "A radioactive element decays at rate dm/dt = −km (k constant). Find the general formula for mass m in terms of time t.",
      hook: "⛏️ Separate the variables and integrate both sides — this is how the m = m₀e^(−kt) decay law is born.",
      hint: "Get all the m's on one side and dt on the other; integrate; remember ∫dm/m = ln m.",
      steps: [
        { do: "Separate the variables", math: "dm/m = −k dt" },
        { do: "Integrate both sides", math: "ln m = −kt + c" },
        { do: "Exponentiate", math: "m = e^(−kt+c) = C·e^(−kt)", why: "C = eᶜ is just a new constant — the initial mass m₀." },
      ],
      ans: "m = C·e^(−kt)"
    },
  ],
  9: [
    {
      src: "16.1 Q1 · Newton–Leibniz",
      q: "Find ∫₀² 2x² dx using the Newton–Leibniz (fundamental) theorem.",
      hook: "⛏️ A definite integral = the antiderivative evaluated at the top limit minus at the bottom. It's the area under the curve.",
      hint: "Integrate to F(x), then compute F(2) − F(0).",
      steps: [
        { do: "Antiderivative", math: "∫2x² dx = (2/3)x³" },
        { do: "Evaluate top − bottom", math: "(2/3)(2³ − 0³) = (2/3)(8) = 16/3" },
      ],
      ans: "16/3"
    },
    {
      src: "16.1 Q2 · Definite integrals by substitution",
      q: "Evaluate: a) ∫₀^(π/2) cosx·sinx dx and ∫₁³(4x³−6x)dx; b) ∫₀^(π/2) sin²x dx; c) ∫₀³ 3√(x+1)dx and ∫₀² 8(x−2)³dx; d) ∫₀⁴ 2x√(x²+9)dx and ∫₀⁵ 1/√(25−x²)dx; e) ∫₀^(π/2) cos²(x/2)dx.",
      hook: "⛏️ For trickier integrands, substitute u for the inner part — and remember to change the LIMITS to match.",
      hint: "Let u = the inner function; convert dx and both limits to u. For sin²/cos², use the half-angle identity.",
      steps: [
        { do: "(a) sub u=sinx; and power rule", math: "∫cosx·sinx dx = ½sin²x|₀^(π/2) = ½ · ∫₁³(4x³−6x)dx = 56" },
        { do: "(b) half-angle", math: "sin²x = (1−cos2x)/2 → ∫₀^(π/2) = π/4" },
        { do: "(c) sub & power", math: "∫₀³3√(x+1)dx = 14 · ∫₀²8(x−2)³dx = −32" },
        { do: "(d) sub u=x²+9; trig sub", math: "∫₀⁴2x√(x²+9)dx = 196/3 · ∫₀⁵1/√(25−x²)dx = π/2" },
        { do: "(e) half-angle", math: "cos²(x/2) = (1+cosx)/2 → ∫₀^(π/2) = (π+2)/4" },
      ],
      ans: "a) ½ , 56 · b) π/4 · c) 14 , −32 · d) 196/3 , π/2 · e) (π+2)/4"
    },
    {
      src: "16.1 Q3 · Symmetry shortcuts",
      q: "Use odd/even symmetry: a) ∫_{−π/2}^{π/2} cos2x·sin2x dx and ∫_{−3}^{3}(x³−2x)dx; b) ∫_{−π/2}^{π/2} 2sin²x dx and ∫_{−1}^{1} x²(4x+3)dx; c) ∫_{−3}^{3} 2x√(x²+16)dx and ∫_{−4}^{4} 1/√(16−x²)dx; d) ∫_{−π}^{π} cos(x/2)dx and ∫_{−1}^{1}(eˣ+e^(−x))dx.",
      hook: "⛏️ Save work with symmetry: an ODD function over a symmetric range integrates to 0; an EVEN one is double the half-range.",
      hint: "Odd × even = odd. Odd over [−a, a] → 0. Even over [−a, a] → 2× the [0, a] integral.",
      steps: [
        { do: "(a) both odd → 0", math: "cos2x·sin2x and x³−2x are odd → both = 0" },
        { do: "(b) even pieces", math: "∫2sin²x = π;  x²(4x+3): the 4x³ part (odd) = 0 → leaves 2∫₀¹3x² = 2" },
        { do: "(c)", math: "2x√(x²+16) odd → 0;  1/√(16−x²) even → π" },
        { do: "(d)", math: "∫cos(x/2) = 4;  ∫(eˣ+e^(−x)) = 2(e²−1)/e" },
      ],
      ans: "a) 0, 0 · b) π, 2 · c) 0, π · d) 4, 2(e²−1)/e"
    },
    {
      src: "16.2 Q1 · Area under a curve",
      q: "Find the area: ∫₀^(π/2)(sinx+cosx)dx and ∫_{−3}^{3}(3x²−1)dx.",
      hook: "⛏️ Area = the definite integral. Use symmetry on the second one to halve the work.",
      hint: "Integrate and evaluate. The second integrand is even, so it equals 2 × ∫₀³.",
      steps: [
        { do: "First", math: "[−cosx + sinx]₀^(π/2) = (0+1) − (−1+0) = 2" },
        { do: "Second (even)", math: "2[x³ − x]₀³ = 2(27 − 3) = 48" },
      ],
      ans: "2 and 48"
    },
    {
      src: "16.2 Q2 · Area bounded by curve & axis",
      q: "Find the area bounded by x = 9 − y² and the y-axis.",
      hook: "⛏️ A sideways parabola — integrate with respect to y (the y-axis is the line x = 0).",
      hint: "Find where it meets the y-axis (x = 0 → y = ±3), then ∫(9 − y²) dy.",
      steps: [
        { do: "Find the y-limits", math: "0 = 9 − y² → y = ±3" },
        { do: "Integrate over y (even)", math: "2∫₀³(9 − y²)dy = 2(27 − 9) = 36" },
      ],
      ans: "36"
    },
    {
      src: "16.2 Q3 · Area between two curves",
      q: "Find the area bounded by y = 4x − x² and y = x² − 6.",
      hook: "⛏️ Exam Q3c skill: find the crossings, pick the top curve, integrate (top − bottom).",
      hint: "Set the curves equal for the limits; test a midpoint for which is on top; integrate (top − bottom).",
      steps: [
        { do: "Intersections", math: "x²−6 = 4x−x² → 2x²−4x−6 = 0 → (x+1)(x−3) = 0 → x = −1, 3" },
        { do: "Which is on top?", math: "at x = 0: 4x−x² = 0 vs x²−6 = −6 → y = 4x−x² is on top" },
        { do: "Integrate", math: "∫_{−1}^{3}(4x − 2x² + 6)dx = 64/3" },
      ],
      ans: "64/3 ≈ 21.33"
    },
    {
      src: "16.2 Q4 · Area bounded by three lines",
      q: "Find the area bounded by y = 3x+1, y = x+3 and y = −x−3.",
      hook: "⛏️ Three lines make a triangle — find the corners, then split the area into two integrals at the middle corner.",
      hint: "Find the three intersection points; integrate (top − bottom) in two pieces, split at the middle x.",
      steps: [
        { do: "Corners", math: "(−3, 0), (−1, −2), (1, 4)" },
        { do: "Split at x = −1", math: "−3→−1: top x+3, bottom −x−3;  −1→1: top x+3, bottom 3x+1" },
        { do: "Integrate & add", math: "∫_{−3}^{−1}(2x+6)dx + ∫_{−1}^{1}(2−2x)dx = 8" },
      ],
      ans: "8"
    },
  ],
  10: [
    {
      src: "8.1 Q1 · Polar → rectangular",
      q: "Convert to rectangular (i, j) form: a) 5∠60°; b) 4∠315°; c) 6∠150°; d) 7∠−30°.",
      hook: "⛏️ Split a vector (length + bearing) into east (i) and north (j) components — like resolving a haul force.",
      hint: "Vₓ = r·cosθ, V_y = r·sinθ.",
      steps: [
        { do: "The rule", math: "V = (r cosθ)i + (r sinθ)j" },
        { do: "Answers", math: "a) 2.5i + (5√3/2)j  b) 2√2 i − 2√2 j  c) −3√3 i + 3j  d) (7√3/2)i − (7/2)j" },
      ],
      ans: "see each part"
    },
    {
      src: "8.1 Q2 · Rectangular → polar",
      q: "Convert to polar (r∠θ): a) √3 i + 2j; b) −3i + 2j; c) 6i − 8j; d) −4i − 3j.",
      hook: "⛏️ Reverse: from components back to length and bearing. r = √(x²+y²), θ = arctan(y/x) — but mind the quadrant!",
      hint: "r = √(x²+y²); θ = arctan(y/x), then adjust for the quadrant of (x, y).",
      steps: [
        { do: "(a) Q1", math: "r=√7, θ≈49.1° → √7∠49.1°" },
        { do: "(b) Q2", math: "r=√13, θ≈146.3° → √13∠146.3°", why: "x<0, y>0 → add 180° to the bare arctan." },
        { do: "(c) Q4", math: "r=10, θ≈−53.1° (=306.9°) → 10∠306.9°" },
        { do: "(d) Q3", math: "r=5, θ≈216.9° → 5∠216.9°", why: "x<0, y<0 → add 180°." },
      ],
      ans: "a) √7∠49.1° b) √13∠146.3° c) 10∠306.9° d) 5∠216.9°"
    },
    {
      src: "8.1 Q3 · Vector addition",
      q: "a) a = 5∠60°, b = 3∠45°: find c = a + b. b) a = 8∠30°, b = 4∠315°: find c = a + b.",
      hook: "⛏️ Add vectors by adding their i and j components (the rectangular method) — far easier than the parallelogram law.",
      hint: "Convert each to components, add componentwise, convert back to polar.",
      steps: [
        { do: "(a) componentwise", math: "X = 2.5+2.12 = 4.62, Y = 4.33+2.12 = 6.45 → c ≈ 7.9∠54.4°" },
        { do: "(b) componentwise", math: "X = 6.93+2.83 = 9.76, Y = 4−2.83 = 1.17 → c ≈ 9.8∠6.8°" },
      ],
      ans: "a) ≈ 7.9∠54.4° · b) ≈ 9.8∠6.8°"
    },
    {
      src: "8.1 Q4 · Multiple-vector addition",
      q: "a) a=4∠30°, b=3∠150°, c=2∠300°: find d = a+b+c. b) a=3∠300°, b=5∠120°, c=7∠30°: find d = 2a+b−c. c) a=4∠−45°, b=3∠150°, c=12∠60°: find d = −a−3b+4c.",
      hook: "⛏️ Same rectangular method, scaled — multiply each vector's components by its coefficient, then add.",
      hint: "Components of each, apply the coefficients, sum X and Y, convert to polar.",
      steps: [
        { do: "(a)", math: "X=1.86, Y=1.77 → d ≈ 2.6∠43.6°" },
        { do: "(b)", math: "X=−5.56, Y=−4.37 → d ≈ 7.07∠218.2°" },
        { do: "(c)", math: "X=28.97, Y=39.89 → d ≈ 49.3∠54°" },
      ],
      ans: "a) ≈2.6∠43.6° b) ≈7.07∠218.2° c) ≈49.3∠54°"
    },
    {
      src: "8.1 Q5 · Dot & cross product",
      q: "Given a = 5∠60° and b = 8∠120°, find c = a·b (dot) and d = a×b (cross), using two methods.",
      hook: "⛏️ Dot = |a||b|cos(angle between) → a number. Cross (2D) = |a||b|sin → a vector along k. Exam Q4a skill.",
      hint: "Method 1: a·b = ab·cos(α−β), a×b = ab·sin(β−α)k. Method 2: components.",
      steps: [
        { do: "Dot (angle between = 60°)", math: "5·8·cos(60°−120°) = 40cos(−60°) = 20" },
        { do: "Cross", math: "5·8·sin(120°−60°)k = 40sin60°k ≈ 34.6k" },
        { do: "Check by components", math: "a=2.5i+4.33j, b=−4i+6.93j: a·b=−10+30=20 ✓; a×b=(2.5·6.93−4.33·(−4))k≈34.6k ✓" },
      ],
      ans: "a·b = 20 · a×b ≈ 34.6k"
    },
    {
      src: "8.1 Q6 · Dot & cross product (2)",
      q: "Given a = 7∠45° and b = 4∠310°, find c = a·b and d = a×b.",
      hook: "⛏️ Same two products with awkward angles — let the calculator handle the cos/sin.",
      hint: "a·b = ab·cos(α−β); a×b = ab·sin(β−α)k.",
      steps: [
        { do: "Dot", math: "28·cos(45°−310°) = 28cos(−265°) ≈ −2.4" },
        { do: "Cross", math: "28·sin(310°−45°)k = 28sin265°k ≈ −27.9k" },
      ],
      ans: "a·b ≈ −2.4 · a×b ≈ −27.9k"
    },
    {
      src: "8.2 Q1 · Airplane + wind",
      q: "A plane heads northwest (135°) at 880 km/h; a 100 km/h wind blows toward 270°. Find the ground speed and actual direction.",
      hook: "⛏️ Add the plane's velocity and the wind velocity as vectors to get the true track over the ground.",
      hint: "Components of each velocity, add, convert the resultant to polar.",
      steps: [
        { do: "Components", math: "plane: (−622.3, 622.3);  wind: (0, −100)" },
        { do: "Add", math: "X = −622.3, Y = 522.3" },
        { do: "Magnitude & direction", math: "V = √(622.3² + 522.3²) ≈ 812 km/h, θ ≈ 140°" },
      ],
      ans: "≈ 812 km/h at ≈ 140°"
    },
    {
      src: "8.2 Q2 · Cables holding a weight",
      q: "Three cables hold an object static: A = 70 N at 30°, B = 45 N at 75°, C = 100 N at 135°. Find the object's weight (and mass).",
      hook: "⛏️ Static ⇒ all forces balance. The downward weight equals the total upward (y) pull of the cables.",
      hint: "Sum the y-components of A, B, C; that equals the weight.",
      steps: [
        { do: "y-components", math: "A_y = 35, B_y ≈ 43.5, C_y ≈ 70.7" },
        { do: "Vertical balance", math: "W = 35 + 43.5 + 70.7 = 149.2 N" },
        { do: "Mass", math: "m = W/g = 149.2/9.8 ≈ 15.2 kg" },
      ],
      ans: "W ≈ 149.2 N (m ≈ 15.2 kg)"
    },
    {
      src: "8.2 Q3 · Friction on an incline",
      q: "A 1000 N block is static on a 20° incline. How strong is the friction? (This is exam Q4b.)",
      hook: "⛏️ Resolve the weight along and into the slope. Static ⇒ friction balances the down-slope pull. Straight from the exam.",
      hint: "Along-slope component = W sinθ; friction must cancel it.",
      steps: [
        { do: "Down-slope component", math: "W sinθ = 1000 sin20° ≈ 342 N" },
        { do: "Friction balances it", math: "F = 342 N, up the slope" },
      ],
      ans: "≈ 342 N up the slope"
    },
    {
      src: "8.2 Q4 · Work done by gravity",
      q: "If the incline angle increases to 45° and the block slides down a length L, how much work does gravity do?",
      hook: "⛏️ Work = force · displacement (a dot product). Only the along-slope component of weight does work.",
      hint: "Resolve W at 45°; the displacement is along the slope (length L). Work = (along-slope force)·L.",
      steps: [
        { do: "Along-slope force", math: "W sin45° = 1000(√2/2) ≈ 707 N" },
        { do: "Work = force · displacement", math: "Work = 707 · L = 707L (N·m)" },
      ],
      ans: "707L N·m"
    },
  ],
  11: [
    {
      src: "9.1 · Add & scale complex numbers",
      q: "Z₁=2+i, Z₂=−5+4i, Z₃=−3−6i. Find A=Z₁+2Z₂+3Z₃, B=4Z₁−2Z₂−3Z₃, C=−3Z₁−Z₂+Z₃.",
      hook: "⛏️ Treat i like a variable: add the real parts together, and the imaginary parts together.",
      hint: "Distribute the coefficients, then collect real and imaginary parts separately.",
      steps: [
        { do: "A", math: "(2−10−9) + i(1+8−18) = −17 − 9i" },
        { do: "B", math: "(8+10+9) + i(4−8+18) = 27 + 14i" },
        { do: "C", math: "(−6+5−3) + i(−3−4−6) = −4 − 13i" },
      ],
      ans: "A = −17−9i · B = 27+14i · C = −4−13i"
    },
    {
      src: "9.1 · Multiply & power complex",
      q: "a) Z₁=2+3i, Z₂=1−4i: find A=Z₁Z₂, B=Z₂³, D=Z₂·Z̄₂. b) Z₁=1+3i, Z₂=2−i, Z₃=4i: find 2Z₁Z₂ and Z₂Z₃.",
      hook: "⛏️ Multiply with FOIL and remember i² = −1. A number times its conjugate is always real (= modulus²).",
      hint: "FOIL, replace i² with −1, then collect. For z·z̄, the cross terms cancel.",
      steps: [
        { do: "A = Z₁Z₂", math: "(2+3i)(1−4i) = 2 − 8i + 3i − 12i² = 14 − 5i" },
        { do: "B = Z₂³", math: "(1−4i)³ = −47 + 52i" },
        { do: "D = Z₂·Z̄₂", math: "(1−4i)(1+4i) = 1 − 16i² = 17", why: "z·z̄ = |z|², always real." },
        { do: "b) products", math: "2Z₁Z₂ = 10 + 10i;  Z₂Z₃ = (2−i)(4i) = 4 + 8i" },
      ],
      ans: "A=14−5i · B=−47+52i · D=17 · 2Z₁Z₂=10+10i · Z₂Z₃=4+8i"
    },
    {
      src: "9.1 · Divide complex numbers",
      q: "Z₁=3+2i, Z₂=2i, Z₃=−1+2i. Find A=2Z₁/Z₂ and B=3Z₃/Z₁.",
      hook: "⛏️ To divide, multiply top and bottom by the CONJUGATE of the bottom — that makes the denominator real.",
      hint: "Multiply numerator and denominator by the bottom's conjugate, then split into real + imaginary.",
      steps: [
        { do: "A = 2Z₁/Z₂", math: "2(3+2i)/(2i) = (3+2i)/i × (−i)/(−i) = (2 − 3i)" },
        { do: "B = 3Z₃/Z₁", math: "3(−1+2i)/(3+2i) × (3−2i)/(3−2i) = (3/13)(1 + 8i)" },
      ],
      ans: "A = 2 − 3i · B = (3/13)(1 + 8i)"
    },
    {
      src: "9.2 · Polar & trig form",
      q: "Express in polar and trig form: a) 2+i; b) 2−i; c) −3−6i. Then convert back to rectangular: 4(cos60°+isin60°); 6(cos150°+isin150°); 2(cos315°+isin315°).",
      hook: "⛏️ Same idea as vectors: r = |z| = √(a²+b²), θ = arctan(b/a) (mind the quadrant). Trig form = r(cosθ + i·sinθ).",
      hint: "Find r and θ for each. To go back, compute r·cosθ and r·sinθ.",
      steps: [
        { do: "a) 2+i", math: "r=√5, θ≈26.6° → √5∠26.6° = √5(cos26.6°+isin26.6°)" },
        { do: "b) 2−i (Q4)", math: "√5∠333.4°" },
        { do: "c) −3−6i (Q3)", math: "3√5∠243.4°" },
        { do: "Back to rectangular", math: "4∠60° = 2+2√3 i · 6∠150° = −3√3+3i · 2∠315° = √2 − √2 i" },
      ],
      ans: "a) √5∠26.6° b) √5∠333.4° c) 3√5∠243.4°; rect: 2+2√3i, −3√3+3i, √2−√2i"
    },
    {
      src: "9.2 · Multiply, power & roots (polar)",
      q: "a) Z₁=3∠150°, Z₂=4∠45°: find Z₁Z₂, Z₁/Z₂, Z₂⁴. b) Z=16∠60°: find all four fourth roots Z^(1/4).",
      hook: "⛏️ Polar form makes multiplying easy: multiply the lengths, ADD the angles. Powers use De Moivre; roots divide the angle and add 360°/n steps.",
      hint: "Multiply → r₁r₂∠(θ₁+θ₂). Divide → (r₁/r₂)∠(θ₁−θ₂). Power n → rⁿ∠(nθ). Roots → r^(1/n)∠((θ+360k)/n).",
      steps: [
        { do: "Multiply / divide", math: "Z₁Z₂ = 12∠195°;  Z₁/Z₂ = (3/4)∠105°" },
        { do: "Power (De Moivre)", math: "Z₂⁴ = 4⁴∠(4·45°) = 256∠180°" },
        { do: "Fourth roots", math: "16^(1/4)∠(60°+360k)/4 = 2∠15°, 2∠105°, 2∠195°, 2∠285°", why: "Four roots, evenly spaced 90° apart." },
      ],
      ans: "12∠195° · (3/4)∠105° · 256∠180° · roots 2∠15°, 105°, 195°, 285°"
    },
    {
      src: "9.3 · Exponential form",
      q: "Convert Z₁=81∠40° and Z₂=2∠9° to exponential form, then find Z₁Z₂, Z₁/Z₂, Z₂⁴ and ⁴√Z₁.",
      hook: "⛏️ Exponential form z = r·e^(iθ) (θ in RADIANS). Same multiply/divide/power rules, neater notation. Exam Q4c.",
      hint: "First convert degrees to radians (× π/180). Then multiply lengths & add angles, etc.",
      steps: [
        { do: "Angles to radians", math: "40° ≈ 0.6981, 9° ≈ 0.1571 → Z₁ = 81e^(i0.6981), Z₂ = 2e^(i0.1571)" },
        { do: "Multiply / divide", math: "Z₁Z₂ = 162e^(i0.8552);  Z₁/Z₂ = 40.5e^(i0.541)" },
        { do: "Power / root", math: "Z₂⁴ = 16e^(i0.6284);  ⁴√Z₁ = 3e^(i0.1745)" },
      ],
      ans: "Z₁Z₂=162e^(i0.8552) · Z₁/Z₂=40.5e^(i0.541) · Z₂⁴=16e^(i0.6284) · ⁴√Z₁=3e^(i0.1745)"
    },
    {
      src: "9.4 · Complex numbers as vectors",
      q: "A = −3i+2j, B = 2i−5j, C = 3i+4j. Using complex numbers, find D = A−B+C and E = −A+B+C.",
      hook: "⛏️ A 2D vector xi+yj is just the complex number x+yi — so vector add/subtract = complex add/subtract.",
      hint: "Rewrite each vector as a complex number, do the arithmetic, then read it back as a vector.",
      steps: [
        { do: "As complex numbers", math: "A = −3+2i, B = 2−5i, C = 3+4i" },
        { do: "D = A−B+C", math: "(−3−2+3) + i(2+5+4) = −2 + 11i → −2i + 11j" },
        { do: "E = −A+B+C", math: "(3+2+3) + i(−2−5+4) = 8 − 3i → 8i − 3j" },
      ],
      ans: "D = −2i+11j · E = 8i−3j"
    },
  ],
  12: [
    {
      src: "14.2 Q1 · Determinants",
      q: "Find the determinant: a) [[4,1],[5,3]]; b) [[2,3],[1,1]]; c) [[cosx,−sinx],[sinx,cosx]]; d) [[1,2,−1],[3,4,−2],[5,−4,1]]; e) [[2,0,1],[1,−4,−1],[−1,8,3]]; f) [[a,b,c],[b,c,a],[c,a,b]].",
      hook: "⛏️ 2×2: ad − bc. 3×3: expand along a row (or use Sarrus' diagonal rule). The determinant tells you if a system has a unique solution.",
      hint: "2×2 = ad − bc. For 3×3, sum of down-diagonals minus sum of up-diagonals.",
      steps: [
        { do: "2×2 ones", math: "a) 4·3 − 1·5 = 7 · b) 2·1 − 3·1 = −1 · c) cos²x + sin²x = 1" },
        { do: "3×3 (Sarrus)", math: "d) = 2 · e) = −4" },
        { do: "Symbolic", math: "f) = 3abc − a³ − b³ − c³" },
      ],
      ans: "a) 7 b) −1 c) 1 d) 2 e) −4 f) 3abc−a³−b³−c³"
    },
    {
      src: "15.1 Q1 · Augmented matrices",
      q: "Write a system as an augmented matrix and classify it homogeneous vs inhomogeneous (e.g. 2x+y+2z=10, 4x+4y+7z=33, 2x+5y+12z=48).",
      hook: "⛏️ Strip a system down to a grid of numbers: coefficients | constants. Homogeneous = every constant is zero.",
      hint: "Rows = equations, columns = the variables, then a bar and the constants.",
      steps: [
        { do: "Form [A | b]", math: "[2 1 2 | 10 ; 4 4 7 | 33 ; 2 5 12 | 48]" },
        { do: "Classify", math: "a non-zero constant on the right → inhomogeneous", why: "Only when ALL right-side values are 0 is it homogeneous." },
      ],
      ans: "[A | b] form; inhomogeneous (constants ≠ 0)"
    },
    {
      src: "15.1 Q2 · Verify a solution",
      q: "Verify that x=5, y=0, z=3 solves: x−y−z=2; 2x−y−3z=1; 3x+2y−5z=0.",
      hook: "⛏️ The easiest check in maths: substitute the values and see if both sides balance in every equation.",
      hint: "Plug the numbers into each equation; all three must hold.",
      steps: [
        { do: "Eq 1", math: "5 − 0 − 3 = 2 ✓" },
        { do: "Eq 2", math: "10 − 0 − 9 = 1 ✓" },
        { do: "Eq 3", math: "15 + 0 − 15 = 0 ✓" },
      ],
      ans: "Yes — all three balance"
    },
    {
      src: "15.2 Q3 · Cramer's rule",
      q: "Solve by Cramer's rule: a) x₁+3x₂+2x₃=−1, 2x₁+3x₂+3x₃=−2, −2x₁+2x₂−3x₃=7. b) 2x+y+2z=10, 4x+4y+7z=33, 2x+5y+12z=48.",
      hook: "⛏️ Cramer's rule: each variable = (determinant with its column swapped for the constants) ÷ (the main determinant).",
      hint: "Compute D (main), then Dₓ, D_y, D_z by replacing each column with the constants. Variable = D_var / D.",
      steps: [
        { do: "(a) determinants", math: "D = 5, D₁ = 10, D₂ = 5, D₃ = −15" },
        { do: "(a) divide", math: "x₁ = 10/5 = 2, x₂ = 5/5 = 1, x₃ = −15/5 = −3" },
        { do: "(b)", math: "D = 16, Dₓ = 16, D_y = 32, D_z = 48 → x = 1, y = 2, z = 3" },
      ],
      ans: "a) (2, 1, −3) · b) (1, 2, 3)"
    },
    {
      src: "15.2 Q3 · Gauss elimination",
      q: "Solve by Gauss elimination: a) the system in the Cramer question; b) 2x+y+2z=10, 4x+4y+7z=33, 2x+5y+12z=48; c) x₂+x₃+x₄=0, 3x₁+3x₃−4x₄=7, x₁+x₂+x₃+2x₄=6, 2x₁+3x₂+x₃+3x₄=6.",
      hook: "⛏️ Exam Q4d skill: row-reduce the augmented matrix to a staircase (upper-triangular), then back-substitute. Same answers as Cramer.",
      hint: "Use row operations to clear below the diagonal, then solve from the bottom row upward.",
      steps: [
        { do: "(a)", math: "row-reduce → x₁ = 2, x₂ = 1, x₃ = −3" },
        { do: "(b)", math: "→ 4z = 12 → z = 3, then y = 2, x = 1" },
        { do: "(c) four variables", math: "→ x₄ = 2, x₃ = 1, x₂ = −3, x₁ = 4" },
      ],
      ans: "a) (2,1,−3) b) (1,2,3) c) (x₁,x₂,x₃,x₄) = (4,−3,1,2)"
    },
  ],
};
// ── REAL past exam papers — fully worked, self-marked ────────
// Pass = 20/40. HD line set at 34/40 (85%).
const EXAMS = {
  "2020": {
    label: "2020 Final (full worked solutions)",
    note: "This is the complete 2020 paper. It maps almost one-to-one onto the 2024 paper — same skills, different numbers. Do it on paper first, THEN self-mark honestly.",
    questions: [
      {
        n: 1, title: "Functions, quadratics & growth", marks: 10,
        parts: [
          {
            label: "1(a)", marks: 2, topic: "functions",
            q: "Determine the domain for  y = √(9 − x²) − 1/(3x).",
            steps: [
              { do: "Spot BOTH danger parts", math: "√(9 − x²)  and  1/(3x)", why: "A square root AND a fraction — each has its own rule, and the domain must satisfy both at once." },
              { do: "Square-root rule: inside ≥ 0", math: "9 − x² ≥ 0  →  x² ≤ 9  →  −3 ≤ x ≤ 3", why: "x² ≤ 9 means x sits between −3 and 3 inclusive." },
              { do: "Fraction rule: bottom ≠ 0", math: "3x ≠ 0  →  x ≠ 0", why: "Dividing by zero blows up." },
              { do: "Combine both", math: "−3 ≤ x ≤ 3,  x ≠ 0", why: "Take the overlap: the closed interval, but with a hole punched at 0." },
            ],
            ans: "−3 ≤ x ≤ 3 with x ≠ 0,  i.e. [−3, 0) ∪ (0, 3]"
          },
          {
            label: "1(b)", marks: 3, topic: "functions",
            q: "A linear function crosses A(−2, 1) and B(2, 3). A quadratic also passes through A(−2, 1), and its vertex touches the x-axis at (1, 0). Find both functions.",
            steps: [
              { do: "Linear — get the slope", math: "m = (3 − 1)/(2 − (−2)) = 2/4 = 1/2", why: "Gradient = rise/run between the two points." },
              { do: "Linear — point-slope through B", math: "y − 3 = ½(x − 2)  →  y = ½x + 2", why: "Use y − y₁ = m(x − x₁), then tidy." },
              { do: "Quadratic — vertex ON the x-axis", math: "y = a(x − 1)²", why: "Vertex (1, 0) with k = 0 means vertex form has no '+k'. It's a perfect square times a." },
              { do: "Find a using point A(−2, 1)", math: "1 = a(−2 − 1)² = 9a  →  a = 1/9", why: "The curve must pass through A, so its values fit." },
              { do: "Write it out", math: "y = (1/9)(x − 1)²", why: "Both functions found." },
            ],
            ans: "Linear: y = ½x + 2 · Quadratic: y = (1/9)(x − 1)²"
          },
          {
            label: "1(c)", marks: 3, topic: "growth",
            q: "A model predicts a city population of 550,000 in 3 years and 600,000 in 5 years. Using p = p₀(1 + r)ᵗ, find the initial population and growth rate.",
            steps: [
              { do: "Write both equations", math: "550000 = p₀(1+r)³     600000 = p₀(1+r)⁵", why: "One equation per data point." },
              { do: "Divide to kill p₀", math: "600000/550000 = (1+r)⁵/(1+r)³ = (1+r)²", why: "Dividing cancels p₀ and subtracts the powers (5 − 3 = 2). This is the key trick." },
              { do: "Solve for r", math: "(1+r)² = 12/11  →  1+r = √(12/11) ≈ 1.0445  →  r ≈ 4.45%", why: "Square-root both sides." },
              { do: "Back-substitute for p₀", math: "p₀ = 600000 / 1.0445⁵ ≈ 482,702", why: "Put r back into either original equation." },
            ],
            ans: "r ≈ 4.45%,  p₀ ≈ 482,702"
          },
          {
            label: "1(d)", marks: 2, topic: "trig",
            q: "Solve 2cos2x − 3cos²x = 1 − 3sinx for x in [0, π].",
            steps: [
              { do: "Replace cos2x with an identity", math: "cos2x = cos²x − sin²x", why: "Get everything in terms of sin and cos of the SAME angle x." },
              { do: "Substitute and expand", math: "2(cos²x − sin²x) − 3cos²x = −cos²x − 2sin²x", why: "Combine the cos² terms." },
              { do: "Turn cos² into 1 − sin²", math: "−(1 − sin²x) − 2sin²x = −1 − sin²x", why: "Now it's purely in sinx." },
              { do: "Form a quadratic in sinx", math: "−1 − sin²x = 1 − 3sinx  →  sin²x − 3sinx + 2 = 0", why: "Move all terms to one side." },
              { do: "Factor and pick valid roots", math: "(sinx − 1)(sinx − 2) = 0  →  sinx = 1 (sinx = 2 impossible)", why: "sin can never exceed 1, so reject sinx = 2." },
              { do: "Solve on [0, π]", math: "sinx = 1  →  x = π/2", why: "The only angle in range." },
            ],
            ans: "x = π/2"
          },
        ],
      },
      {
        n: 2, title: "Limits, derivatives, tangents & critical points", marks: 10,
        parts: [
          {
            label: "2(a)", marks: 2, topic: "limits",
            q: "Evaluate  limₓ→₀ [3cot3x / 2cot2x].",
            steps: [
              { do: "Write cot as cos/sin", math: "cot3x = cos3x/sin3x,  cot2x = cos2x/sin2x", why: "Everything becomes sines and cosines you can handle." },
              { do: "As x→0, the cosines → 1", math: "cos3x → 1,  cos2x → 1", why: "cos0 = 1." },
              { do: "Use the standard limit", math: "sin(ax)/(ax) → 1, so sin2x/sin3x → 2x/3x = 2/3", why: "Small-angle rule: sin of a tiny angle ≈ the angle." },
              { do: "Put it together", math: "(3/2) × (sin2x/sin3x) → (3/2) × (2/3) = 1", why: "The constants and the ratio cancel to 1." },
            ],
            ans: "Limit = 1"
          },
          {
            label: "2(e)", marks: 2, topic: "differentiation",
            q: "For y = (x² + 3)/x, determine the tangent and normal lines crossing the point (1, 4).",
            steps: [
              { do: "Simplify before differentiating", math: "y = (x² + 3)/x = x + 3/x = x + 3x⁻¹", why: "Splitting the fraction makes the power rule trivial — far easier than the quotient rule." },
              { do: "Differentiate", math: "y′ = 1 − 3/x²", why: "d/dx(x) = 1; d/dx(3x⁻¹) = −3x⁻². " },
              { do: "Tangent slope at x = 1", math: "y′(1) = 1 − 3 = −2", why: "The derivative evaluated at the point IS the tangent's gradient." },
              { do: "Tangent line", math: "y − 4 = −2(x − 1)  →  y = −2x + 6", why: "Point-slope through (1, 4)." },
              { do: "Normal slope = negative reciprocal", math: "m_n = −1/(−2) = ½", why: "Normal is perpendicular: flip and change sign." },
              { do: "Normal line", math: "y − 4 = ½(x − 1)  →  y = ½x + 7/2", why: "Point-slope again, same point." },
            ],
            ans: "Tangent: y = −2x + 6 · Normal: y = ½x + 7/2"
          },
          {
            label: "2(f)", marks: 3, topic: "critical",
            q: "Find and classify the critical point(s) of y = x² − 2(x + 1)^(3/2).",
            steps: [
              { do: "Differentiate", math: "y′ = 2x − 2·(3/2)(x+1)^(1/2) = 2x − 3√(x+1)", why: "Power rule on (x+1)^(3/2): bring down 3/2, drop to 1/2." },
              { do: "Set y′ = 0 and isolate the root", math: "2x = 3√(x + 1)", why: "Critical points are where the slope is zero." },
              { do: "Square both sides", math: "4x² = 9(x + 1)  →  4x² − 9x − 9 = 0  →  (4x + 3)(x − 3) = 0", why: "Removes the root; gives x = −3/4 or x = 3." },
              { do: "CHECK for extraneous roots — the HD step", math: "x = 3: 2(3)=6, 3√4=6 ✓   x = −3/4: 2(−¾)=−1.5, 3√(¼)=+1.5 ✗", why: "Squaring can invent fake roots. x = −3/4 gives −1.5 ≠ +1.5, so it is NOT a real solution — reject it. (A common worked-solution slip keeps it; don't be fooled.)" },
              { do: "Classify with the 2nd derivative", math: "y′′ = 2 − 3/(2√(x+1)),  y′′(3) = 2 − 3/4 = 5/4 > 0  →  minimum", why: "Positive second derivative = cup-shaped = minimum." },
              { do: "Find the y-value", math: "y(3) = 9 − 2(4)^(3/2) = 9 − 2(8) = −7", why: "(4)^(3/2) = (√4)³ = 2³ = 8." },
            ],
            ans: "Single minimum at (3, −7)"
          },
        ],
      },
      {
        n: 3, title: "Integration: indefinite, kinematics & area", marks: 10,
        parts: [
          {
            label: "3(a)", marks: 2, topic: "integration",
            q: "Find the integral  ∫₁² (3√x − 2x − 2/x + 1/x²) dx.",
            steps: [
              { do: "Rewrite every term as a power", math: "3x^(1/2) − 2x − 2x⁻¹ + x⁻²", why: "Powers make the rule mechanical. (Note 2/x stays as a log term.)" },
              { do: "Integrate term by term", math: "2x^(3/2) − x² − 2ln|x| − 1/x", why: "Power rule ∫xⁿ = xⁿ⁺¹/(n+1); the −2/x integrates to −2ln|x|." },
              { do: "Evaluate top minus bottom", math: "[2·2^(3/2) − 4 − 2ln2 − ½] − [2 − 1 − 0 − 1]", why: "Definite integral = F(2) − F(1)." },
              { do: "Crunch the numbers", math: "≈ (5.657 − 4 − 1.386 − 0.5) − (0) ≈ −0.2294", why: "Two decimal places: −0.23." },
            ],
            ans: "≈ −0.2294"
          },
          {
            label: "3(b)", marks: 2, topic: "integration",
            q: "An object moves with acceleration a = 3t − 4 (m/s²). Its speed is 1 m/s at the start. Find the distance travelled in 10 seconds. (Integrate twice.)",
            steps: [
              { do: "Integrate a to get velocity", math: "v = ∫(3t − 4)dt = 1.5t² − 4t + C", why: "Velocity is the integral of acceleration." },
              { do: "Use v(0) = 1 to find C", math: "1 = 0 − 0 + C  →  C = 1  →  v = 1.5t² − 4t + 1", why: "Plug in the starting condition." },
              { do: "Integrate v to get distance", math: "s = ∫(1.5t² − 4t + 1)dt = 0.5t³ − 2t² + t", why: "Position is the integral of velocity (taking s(0)=0)." },
              { do: "Evaluate at t = 10", math: "s = 0.5(1000) − 2(100) + 10 = 500 − 200 + 10 = 310", why: "Distance after 10 seconds." },
            ],
            ans: "310 m"
          },
          {
            label: "3(c)", marks: 3, topic: "area",
            q: "Find the area bounded by y = √x − 1 and y = (1/8)x² − 1.",
            steps: [
              { do: "Find where they cross", math: "√x − 1 = x²/8 − 1  →  √x = x²/8  →  x⁴ = 64x  →  x(x³ − 64) = 0", why: "Set equal, clear the root by squaring, solve. Roots x = 0 and x = 4." },
              { do: "Decide which curve is on TOP", math: "at x = 1: √1 − 1 = 0   vs   1/8 − 1 = −0.875,  so √x − 1 is higher", why: "Test a point between the crossings. Area = ∫(top − bottom)." },
              { do: "Set up the integral", math: "A = ∫₀⁴ (√x − x²/8) dx", why: "The −1's cancel in (top − bottom)." },
              { do: "Integrate", math: "[ (2/3)x^(3/2) − x³/24 ]₀⁴", why: "Power rule on each term." },
              { do: "Evaluate", math: "(2/3)(8) − 64/24 = 16/3 − 8/3 = 8/3", why: "4^(3/2) = 8. Clean answer." },
            ],
            ans: "Area = 8/3 ≈ 2.67"
          },
        ],
      },
      {
        n: 4, title: "Vectors, complex numbers & Gauss elimination", marks: 10,
        parts: [
          {
            label: "4(a)", marks: 2, topic: "vectors",
            q: "Given a = 6∠120° and b = 3i − 2j, find −a·b (dot) and b×a (cross).",
            steps: [
              { do: "Convert a to components", math: "a = 6cos120° i + 6sin120° j = −3i + 3√3 j", why: "cos120° = −½, sin120° = √3/2." },
              { do: "Dot product a·b", math: "(−3)(3) + (3√3)(−2) = −9 − 6√3", why: "Dot = multiply matching components, add. Result is a NUMBER." },
              { do: "Apply the minus", math: "−a·b = 9 + 6√3", why: "Just flip the sign of the dot product." },
              { do: "Cross product b×a (2D → k)", math: "b×a = (bₓay − byaₓ)k = (3·3√3 − (−2)(−3))k = (9√3 − 6)k", why: "2D cross gives a k-component only: 3(3√3 − 2)k." },
            ],
            ans: "−a·b = 9 + 6√3 · b×a = 3(3√3 − 2)k"
          },
          {
            label: "4(c)", marks: 2, topic: "complex",
            q: "Given Z₁ = −1 + 3i, Z₂ = 3 + 4i, Z₃ = 2 − i, find Z₄ = Z₁Z₂Z₃ and Z₅ = Z₂Z₃/Z₁.",
            steps: [
              { do: "Multiply Z₁Z₂ first", math: "(−1+3i)(3+4i) = −3 −4i +9i +12i² = −15 + 5i", why: "FOIL, and remember i² = −1." },
              { do: "Times Z₃ for Z₄", math: "(−15+5i)(2−i) = −30 +15i +10i −5i² = −25 + 25i = 25(−1 + i)", why: "Again i² = −1 flips a sign." },
              { do: "For Z₅, multiply by the conjugate", math: "Z₂Z₃ = (3+4i)(2−i) = 10 + 5i; divide by Z₁ using conjugate (−1−3i)", why: "To divide complex numbers, multiply top and bottom by the bottom's conjugate." },
              { do: "Finish Z₅", math: "(10+5i)(−1−3i)/((−1)²+3²) = (5 − 35i)/10 = ½(1 − 7i)", why: "Bottom becomes |Z₁|² = 10 (real)." },
            ],
            ans: "Z₄ = 25(−1 + i) · Z₅ = ½(1 − 7i)"
          },
          {
            label: "4(d)", marks: 3, topic: "systems",
            q: "Solve by Gauss elimination:  2x − y − z = −1;  −x + y + 2z = −2;  x − 3y − 2z = 0.",
            steps: [
              { do: "Write the augmented matrix", math: "[2 −1 −1 | −1; −1 1 2 | −2; 1 −3 −2 | 0]", why: "Coefficients on the left, answers on the right." },
              { do: "Eliminate to upper-triangular", math: "use row operations to clear below the diagonal", why: "Goal: zeros under the leading entries so you can back-substitute." },
              { do: "Reach a solved bottom row", math: "3z = −6  →  z = −2", why: "The last row gives one variable directly." },
              { do: "Back-substitute upward", math: "y + 3z = −5  →  y = 1;  then  −x + y + 2z = −2  →  x = −1", why: "Feed known values up the rows." },
            ],
            ans: "x = −1, y = 1, z = −2"
          },
        ],
      },
    ],
  },
  "2024": {
    label: "2024 Final (T3 standard exam)",
    note: "The real T3 2024 paper. Same four-question shape as 2020. A few parts overlap your Question Bank — proof the exam reuses the same skills.",
    questions: [
      {
        n: 1, title: "Inverse, quadratic & compound interest", marks: 10,
        parts: [
          {
            label: "1(a)", marks: 2, topic: "functions",
            q: "Given y = f(x) = x³ − 10, determine the inverse function and its domain.",
            steps: [
              { do: "Swap to solve for x", math: "y + 10 = x³  →  x = ∛(y + 10)", why: "Undo the operations: add 10, then cube-root." },
              { do: "Relabel", math: "f⁻¹(x) = ∛(x + 10)", why: "Functions take x as input by convention." },
              { do: "Domain of a cube root", math: "(−∞, ∞)", why: "Cube roots accept any number, even negatives." },
            ],
            ans: "f⁻¹(x) = ∛(x + 10), domain all reals"
          },
          {
            label: "1(b)", marks: 4, topic: "functions",
            q: "The vertex of a quadratic is V(1, 2) and its y-intercept is 3. Find the quadratic.",
            steps: [
              { do: "Vertex form", math: "y = a(x − 1)² + 2", why: "Vertex (h,k) = (1,2) drops straight in." },
              { do: "Use the y-intercept", math: "3 = a(0−1)² + 2  →  a = 1", why: "Point (0,3) must fit." },
              { do: "Expand", math: "y = (x−1)² + 2 = x² − 2x + 3", why: "Standard form." },
            ],
            ans: "y = x² − 2x + 3"
          },
          {
            label: "1(c)", marks: 4, topic: "growth",
            q: "John deposits $5000 for 5 years, interest compounded annually. He receives $6786.35 in interest. Find the annual rate, then how long to reach a compound amount of $8000.",
            steps: [
              { do: "Total amount = deposit + interest", math: "A = 5000 + 6786.35 = 11786.35", why: "'Interest' is on top of the principal." },
              { do: "Apply the compound formula", math: "11786.35 = 5000(1 + r)⁵  →  (1+r)⁵ = 2.35727", why: "A = P(1+r)ᵗ with t = 5." },
              { do: "Solve for r", math: "1 + r = 2.35727^(1/5) ≈ 1.1871  →  r ≈ 18.71%", why: "Take the 5th root (raise to power 1/5)." },
              { do: "Time to reach $8000", math: "8000 = 5000(1.1871)ᵗ  →  1.6 = 1.1871ᵗ", why: "Same formula, now solve for t." },
              { do: "Use logs", math: "t = ln(1.6)/ln(1.1871) ≈ 2.74 years", why: "Log both sides to bring t down from the exponent." },
            ],
            ans: "r ≈ 18.71%,  t ≈ 2.74 years"
          },
        ],
      },
      {
        n: 2, title: "Differentiation & critical points", marks: 10,
        parts: [
          {
            label: "2(c)", marks: 3, topic: "critical",
            q: "Determine and classify the critical point(s) of y = 2√x + 1/x.",
            steps: [
              { do: "Write as powers", math: "y = 2x^(1/2) + x⁻¹", why: "Powers make differentiation mechanical." },
              { do: "Differentiate", math: "y′ = x^(−1/2) − x⁻² = 1/√x − 1/x²", why: "Power rule on each term." },
              { do: "Set y′ = 0", math: "1/√x = 1/x²  →  x² = √x  →  x^(3/2) = 1  →  x = 1", why: "Cross-multiply, then solve." },
              { do: "Classify with y′′", math: "y′′ = −½x^(−3/2) + 2x⁻³,  y′′(1) = −0.5 + 2 = 1.5 > 0  →  minimum", why: "Positive ⇒ minimum." },
              { do: "y-value", math: "y(1) = 2 + 1 = 3", why: "Minimum point (1, 3)." },
            ],
            ans: "Minimum at (1, 3)"
          },
        ],
      },
      {
        n: 3, title: "Integration & area between curves", marks: 10,
        parts: [
          {
            label: "3(c)", marks: 4, topic: "area",
            q: "After finding the intersection points, find the area of the region bounded by y = 3x − x² and y = x² − 2.",
            steps: [
              { do: "Set the curves equal", math: "3x − x² = x² − 2  →  2x² − 3x − 2 = 0", why: "Crossings are where the y-values match." },
              { do: "Factor", math: "(2x + 1)(x − 2) = 0  →  x = −½ or x = 2", why: "The two limits of integration." },
              { do: "Pick the top curve", math: "at x = 0: 3x−x² = 0 vs x²−2 = −2, so 3x − x² is on top", why: "Test a point between the roots." },
              { do: "Set up & simplify", math: "A = ∫₋½² [(3x − x²) − (x² − 2)] dx = ∫₋½² (−2x² + 3x + 2) dx", why: "top − bottom." },
              { do: "Integrate and evaluate", math: "[−2x³/3 + 3x²/2 + 2x]₋½²  =  125/24 ≈ 5.21", why: "Plug in 2 and −½, subtract." },
            ],
            ans: "Area = 125/24 ≈ 5.21"
          },
        ],
      },
      {
        n: 4, title: "Vectors, forces, complex & Gauss", marks: 10,
        parts: [
          {
            label: "4(a)", marks: 2, topic: "vectors",
            q: "Given a = 4∠30° and b = 3∠60°, find c = a·b (dot) and d = a×b (cross magnitude).",
            steps: [
              { do: "Angle between them", math: "60° − 30° = 30°", why: "Both are in polar form; the gap is the included angle." },
              { do: "Dot product", math: "a·b = |a||b|cosθ = 4·3·cos30° = 12·(√3/2) = 6√3 ≈ 10.39", why: "Dot uses cosine." },
              { do: "Cross magnitude", math: "|a×b| = |a||b|sinθ = 12·sin30° = 12·½ = 6", why: "Cross uses sine." },
            ],
            ans: "a·b = 6√3 ≈ 10.39 · |a×b| = 6"
          },
          {
            label: "4(b)", marks: 2, topic: "forces",
            q: "A block of weight 1000 N is static on a 20° inclined plane. How strong is the friction?",
            steps: [
              { do: "Resolve weight along the plane", math: "component down-slope = W sinθ = 1000 sin20°", why: "Split gravity into along-plane and into-plane parts." },
              { do: "Static ⇒ friction balances it", math: "friction = 1000 sin20° ≈ 342.02 N", why: "Not moving means friction exactly cancels the down-slope pull." },
              { do: "(Normal force, if asked)", math: "N = W cosθ = 1000 cos20° ≈ 939.69 N", why: "The into-plane component." },
            ],
            ans: "Friction ≈ 342.02 N (up the slope)"
          },
          {
            label: "4(d)", marks: 4, topic: "systems",
            q: "Use Gauss elimination to solve:  x + 2y + 4z = 15;  2x + y + 3z = 10;  3x + y + z = 9.",
            steps: [
              { do: "Augmented matrix", math: "[1 2 4 | 15; 2 1 3 | 10; 3 1 1 | 9]", why: "Set up for row reduction." },
              { do: "R2 − 2R1, R3 − 3R1", math: "clears the first column below the pivot", why: "Create zeros under the leading 1." },
              { do: "Continue to upper-triangular", math: "reduce until the bottom row gives one variable", why: "Then back-substitute." },
              { do: "Back-substitute", math: "z = 1, then y = 5, then x = 1", why: "Check: 1 + 10 + 4 = 15 ✓, 2 + 5 + 3 = 10 ✓, 3 + 5 + 1 = 9 ✓." },
            ],
            ans: "x = 1, y = 5, z = 1"
          },
        ],
      },
    ],
  },
};
// ── Which Method? decision guide ─────────────────────────────
const METHODS = [
  { area: "Q1 · Functions", cue: "“Determine the domain of…”", method: "Run the danger checklist: √ (inside ≥ 0), fraction (bottom ≠ 0), ln (inside > 0). Combine all rules. No danger → all reals.", trap: "Forgetting one of the two rules when a question has both a root AND a fraction." },
  { area: "Q1 · Functions", cue: "“Find the inverse function.”", method: "Swap x and y, then solve for y. Or: undo each operation in reverse order. State the domain of the result.", trap: "f⁻¹ is NOT 1/f. The ⁻¹ means 'inverse', not a power." },
  { area: "Q1 · Functions", cue: "“Vertex is V(h,k)… find the quadratic.”", method: "Use vertex form y = a(x − h)² + k. Plug the vertex in, then use one more point (often the y-intercept) to find a. Expand.", trap: "Reaching for −b/2a when vertex form is far faster here." },
  { area: "Q1 · Growth", cue: "“population / value / interest after t periods”", method: "Use A = A₀(1 + r)ᵗ (or A = P(1+r)ᵗ). Two data points → divide them to cancel A₀ and solve for r. Use logs to solve for t.", trap: "Compound 'interest' ≠ final amount. Amount = principal + interest." },
  { area: "Q1 · Trig", cue: "“Solve … = … for x in [0, π]”", method: "Use identities (cos2x = cos²−sin², sin²+cos²=1) to get ONE trig function, form a quadratic, factor, solve, reject impossible values (|sin|,|cos| ≤ 1).", trap: "Keeping a root like sinx = 2 — impossible, reject it." },
  { area: "Q2 · Derivatives", cue: "two functions MULTIPLIED, e.g. x²·sin x", method: "Product rule: (uv)′ = u′v + uv′.", trap: "Writing u′v′ — wrong. It's a sum of two terms." },
  { area: "Q2 · Derivatives", cue: "one function DIVIDED by another", method: "Quotient rule: (u/v)′ = (u′v − uv′)/v². Or simplify the fraction first if you can.", trap: "Order on top matters: u′v first, THEN minus uv′." },
  { area: "Q2 · Derivatives", cue: "a function INSIDE another, e.g. sin(x²), e^(2x), (3x+1)⁵", method: "Chain rule: differentiate the outside, then × the derivative of the inside.", trap: "Forgetting to multiply by the inside's derivative." },
  { area: "Q2 · Lines", cue: "“tangent and normal at a point”", method: "Tangent slope = y′ at that point. Normal slope = −1/(tangent slope). Use y − y₁ = m(x − x₁) for each.", trap: "Using the original function for the slope instead of its derivative." },
  { area: "Q2 · Critical pts", cue: "“find and classify critical points”", method: "Set y′ = 0, solve for x. Classify with y′′: positive → min, negative → max. Find the y-value. CHECK roots after squaring.", trap: "Keeping extraneous roots from squaring; forgetting to classify." },
  { area: "Q3 · Integration", cue: "“find the integral” (no limits)", method: "Rewrite as powers, apply ∫xⁿ dx = xⁿ⁺¹/(n+1) + C. Remember +C. Note 1/x → ln|x|.", trap: "Forgetting +C; mishandling the 1/x term." },
  { area: "Q3 · Integration", cue: "“distance/velocity from acceleration”", method: "Integrate a → v (use given v₀ for C). Integrate v → s. Evaluate at the time asked.", trap: "Forgetting the constant of integration at each stage." },
  { area: "Q3 · Area", cue: "“area bounded by two curves”", method: "Set curves equal → intersection x's (limits). Test a midpoint to find the TOP curve. Area = ∫(top − bottom) dx between the limits.", trap: "Wrong order (bottom − top) gives a negative area." },
  { area: "Q4 · Vectors", cue: "a·b (dot)  vs  a×b (cross)", method: "Dot = |a||b|cosθ (a NUMBER). Cross (2D) = |a||b|sinθ in the k direction. Convert ∠ polar to i,j first if needed.", trap: "Dot gives a scalar, cross gives a vector — don't swap cos/sin." },
  { area: "Q4 · Forces", cue: "“block on an inclined plane, angle θ”", method: "Along the slope: W sinθ. Into the slope (normal): W cosθ. Static friction = W sinθ (balances the slide).", trap: "Swapping sin and cos. sin goes with the slope direction." },
  { area: "Q4 · Complex", cue: "multiply / divide complex numbers", method: "Multiply with FOIL and i² = −1. Divide by multiplying top & bottom by the conjugate of the bottom. ∠ polar → exponential re^(iθ).", trap: "Forgetting i² = −1; not using the conjugate to divide." },
  { area: "Q4 · Systems", cue: "three equations, three unknowns", method: "Gauss elimination: build the augmented matrix, row-reduce to upper-triangular, back-substitute. Check by plugging back in.", trap: "Arithmetic slips in row operations — always verify the final answer." },
];
// ── Algebra Survival Kit (from your ALGEBRAIC RULES sheet) ──
const ALGEBRA = [
  {
    name: "Rearranging an equation",
    rule: "Whatever you do to one side, do to the other.",
    f: "If  W = P + T  then  P = W − T",
    story: "⛏️ Truck weighs in at W = 380 t total. Tray (T) is 160 t. Payload P = W − T = 220 t. You just rearranged an equation.",
    trap: "Moving a term across the = sign without flipping its sign."
  },
  {
    name: "Expanding brackets",
    rule: "Multiply EVERYTHING inside by what's outside.",
    f: "a(b + c) = ab + ac",
    story: "⛏️ 3 trucks each take (200 L diesel + 50 L hydraulic oil) at prestart: total = 3(200 + 50) = 3×200 + 3×50 = 750 L. The 3 multiplies BOTH things inside the bracket.",
    trap: "Only multiplying the first term and forgetting the second."
  },
  {
    name: "Square of a binomial",
    rule: "(a + b)² is NOT a² + b². There's a middle term.",
    f: "(a + b)² = a² + 2ab + b²",
    story: "⛳ Rough rule of thumb: carry grows roughly with (clubspeed)². Add 5 km/h to a 100 km/h swing: (100+5)² = 100² + 2·100·5 + 5² = 11,025 — the middle 1,000 is where the extra metres come from. The golf is approximate; the algebra is exact.",
    trap: "Writing (a+b)² = a² + b² and dropping the 2ab."
  },
  {
    name: "Difference of two squares",
    rule: "A pattern you can factor instantly.",
    f: "a² − b² = (a + b)(a − b)",
    story: "⛏️ Area of pit cross-section between two square benches: 50² − 30² = (50+30)(50−30) = 80 × 20 = 1600 m². No calculator gymnastics needed.",
    trap: "Trying to 'factor' a² + b² — a sum of squares doesn't factor like this."
  },
  {
    name: "Adding fractions",
    rule: "You need a common denominator first.",
    f: "a/b + c/d = (ad + cb) / bd",
    story: "⛏️ Truck does ½ a load before smoko and ⅓ after: ½ + ⅓ = 3/6 + 2/6 = 5/6 of a load. You can't just add tops and bottoms.",
    trap: "Adding tops and bottoms separately: ½ + ⅓ ≠ 2/5."
  },
  {
    name: "Multiplying & dividing fractions",
    rule: "Multiply straight across; dividing = flip the second one.",
    f: "a/b × c/d = ac/bd   ·   a/b ÷ c/d = a/b × d/c",
    story: "⛳ You hit ¾ of fairways, and ⅔ of those lead to a green in regulation: ¾ × ⅔ = 6/12 = ½ of holes.",
    trap: "Forgetting to flip when dividing."
  },
  {
    name: "Index (power) laws",
    rule: "Multiply powers = add the indices. Divide = subtract.",
    f: "xᵃ · xᵇ = xᵃ⁺ᵇ   ·   xᵃ / xᵇ = xᵃ⁻ᵇ",
    story: "⛏️ 10³ kg = 1 tonne; 10⁶ kg = a kilotonne. 10⁶/10³ = 10³ — a kilotonne is a thousand tonnes. Powers just count the zeros.",
    trap: "Multiplying the indices instead of adding them."
  },
  {
    name: "Solving a linear equation",
    rule: "Undo operations in reverse order: + / − first, then × / ÷.",
    f: "3x + 12 = 45  →  3x = 33  →  x = 11",
    story: "⛏️ Hire cost = $12 callout + $3 per km. Bill was $45 — how far did they drive? Subtract the callout, divide by the rate: 11 km.",
    trap: "Dividing before subtracting — undo the LAST operation first."
  },
  {
    name: "The quadratic formula",
    rule: "Solves ANY ax² + bx + c = 0, even when factoring is ugly.",
    f: "x = (−b ± √(b² − 4ac)) / 2a",
    story: "⛳ Ball height h = −5t² + 20t + 1. When does it land (h = 0)? Factoring's ugly, so the formula does the heavy lifting.",
    trap: "Dropping the ± — most quadratics have TWO answers."
  },
];
const DECODER = [
  ["√", "square root — 'what number times itself gives this?' √9 = 3. Can NEVER take a negative inside."],
  ["∛", "cube root — 'what number times itself three times gives this?' ∛27 = 3. Negatives are FINE: ∛(−8) = −2."],
  ["x²", "x squared — x times x. x³ = x times x times x."],
  ["f(x)", "a recipe named f, applied to input x. NOT multiplication — read it as 'f of x'."],
  ["f⁻¹(x)", "the INVERSE of f — recipe f run backwards. The ⁻¹ does not mean a power here."],
  ["g(f(x))", "machines in series — x goes through f first, the result goes through g."],
  ["≥ and ≤", "'greater than or equal to' and 'less than or equal to'. The fat end opens toward the bigger thing."],
  ["≠", "'not equal to' — used for banned values, like x ≠ 2."],
  ["∞", "infinity — 'goes on forever'. Not a number you can reach."],
  ["[2, ∞)", "interval notation: all numbers from 2 to infinity. SQUARE bracket = that end included. ROUND bracket = not included (always round next to ∞)."],
  ["(−∞, ∞)", "all real numbers — every number on the line is allowed."],
  ["±", "plus-or-minus — TWO answers in one: +value and −value. Shows up when you square-root both sides."],
  ["π", "pi — as an ANGLE, π radians = 180°. So [−π, π] just means [−180°, 180°]."],
  ["t (parametric)", "a third variable, usually time — both x and y are calculated from it."],
  ["∫", "integral — 'add up all the little pieces'. With limits ∫ₐᵇ it gives the area from a to b."],
  ["y′ , dy/dx", "the derivative — the slope / rate of change of y. y′′ is the slope of the slope."],
  ["i  (complex)", "the imaginary unit, where i² = −1. A complex number is a + bi."],
  ["a·b  vs  a×b", "dot product (gives a NUMBER) vs cross product (gives a VECTOR in the k direction)."],
];
const SESSION_STEPS = [
  "Warm up — 2 min skim of last session's notes",
  "Learn — read one section, jot 3 key points",
  "Do — work 2 practice questions on paper",
  "Lock in — say the method out loud, log any mistake",
];
// ── SVG diagrams ──────────────────────────────────────────────
const GolfArc = () => (
  <svg viewBox="0 0 320 130" className="w-full h-28">
    <rect x="0" y="110" width="320" height="20" fill="#2E6B44" />
    <rect x="0" y="106" width="320" height="4" fill="#3E9B5F" />
    <path d="M 20 108 Q 160 -30 300 108" fill="none" stroke="#FFD23F" strokeWidth="2.5" strokeDasharray="6 5" />
    <circle cx="20" cy="106" r="4" fill="#F4F4F2" />
    <circle cx="160" cy="40" r="4" fill="#F4F4F2" />
    <line x1="300" y1="108" x2="300" y2="78" stroke="#C9CDD3" strokeWidth="2" />
    <rect x="300" y="78" width="10" height="7" fill="#FF8A00" />
    <text x="150" y="26" fill="#FFD23F" fontSize="11" fontFamily="monospace">peak = vertex</text>
    <text x="24" y="100" fill="#C9CDD3" fontSize="10" fontFamily="monospace">launch angle θ</text>
  </svg>
);
const HaulRamp = () => (
  <svg viewBox="0 0 320 130" className="w-full h-28">
    <polygon points="0,120 320,120 320,30" fill="#3A3F45" />
    <line x1="0" y1="120" x2="320" y2="30" stroke="#FF8A00" strokeWidth="3" />
    <line x1="0" y1="120" x2="320" y2="120" stroke="#C9CDD3" strokeWidth="1.5" strokeDasharray="4 4" />
    <line x1="320" y1="120" x2="320" y2="30" stroke="#C9CDD3" strokeWidth="1.5" strokeDasharray="4 4" />
    <g transform="translate(120,76) rotate(-15)">
      <rect x="0" y="0" width="34" height="12" rx="2" fill="#FFD23F" />
      <rect x="26" y="-8" width="10" height="9" rx="1" fill="#FFD23F" />
      <circle cx="8" cy="14" r="5" fill="#15181C" stroke="#C9CDD3" strokeWidth="1.5" />
      <circle cx="27" cy="14" r="5" fill="#15181C" stroke="#C9CDD3" strokeWidth="1.5" />
    </g>
    <text x="120" y="116" fill="#C9CDD3" fontSize="10" fontFamily="monospace">run (x₂ − x₁)</text>
    <text x="255" y="78" fill="#C9CDD3" fontSize="10" fontFamily="monospace">rise</text>
    <text x="30" y="100" fill="#FF8A00" fontSize="11" fontFamily="monospace">grade m = rise/run</text>
  </svg>
);
const DecayCurve = () => (
  <svg viewBox="0 0 320 130" className="w-full h-28">
    <line x1="30" y1="10" x2="30" y2="110" stroke="#C9CDD3" strokeWidth="1.5" />
    <line x1="30" y1="110" x2="310" y2="110" stroke="#C9CDD3" strokeWidth="1.5" />
    <path d="M 30 20 Q 100 30 150 65 T 310 102" fill="none" stroke="#FF8A00" strokeWidth="2.5" />
    <text x="36" y="22" fill="#FFD23F" fontSize="11" fontFamily="monospace">$2.4M new truck</text>
    <text x="200" y="95" fill="#C9CDD3" fontSize="11" fontFamily="monospace">A = A₀e⁻ᵏᵗ</text>
    <text x="270" y="124" fill="#C9CDD3" fontSize="10" fontFamily="monospace">years</text>
  </svg>
);
const DIAGRAMS = { golf: GolfArc, mining: HaulRamp };
// ── Per-question visuals ─────────────────────────────────────
const VC = { axis: "#C9CDD3", grid: "#2A2F36", curve: "#FF8A00", alt: "#FFD23F", ok: "#3E9B5F", ink: "#15181C" };
function tickVals(min, max) {
  const span = max - min;
  const opts = [0.25, 0.5, 1, 2, 2.5, 5, 10, 20];
  const step = opts.reduce((b, s) => (Math.abs(span / s - 5) < Math.abs(span / b - 5) ? s : b));
  const out = [];
  for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) out.push(parseFloat(v.toFixed(2)));
  return out;
}
function Plot({ fns, xmin, xmax, ymin, ymax, label, dots = [], xlab = "x", ylab = "y" }) {
  const W = 330, H = 175, ml = 34, mr = 14, mt = 20, mb = 24;
  const sx = (x) => ml + ((x - xmin) / (xmax - xmin)) * (W - ml - mr);
  const sy = (y) => H - mb - ((y - ymin) / (ymax - ymin)) * (H - mt - mb);
  const xt = tickVals(xmin, xmax), yt = tickVals(ymin, ymax);
  const paths = fns.map(({ f, c, dash }, k) => {
    const segs = []; let cur = [];
    for (let i = 0; i <= 150; i++) {
      const x = xmin + ((xmax - xmin) * i) / 150;
      let y; try { y = f(x); } catch { y = null; }
      if (y === null || isNaN(y) || !isFinite(y) || y < ymin - 0.4 || y > ymax + 0.4) {
        if (cur.length > 1) segs.push(cur); cur = [];
      } else cur.push(sx(x).toFixed(1) + "," + sy(y).toFixed(1));
    }
    if (cur.length > 1) segs.push(cur);
    return segs.map((s, j) => <polyline key={k + "-" + j} points={s.join(" ")} fill="none" stroke={c} strokeWidth="2.5" strokeDasharray={dash || "none"} />);
  });
  return (
    <svg viewBox={"0 0 " + W + " " + H} className="w-full my-2" style={{ maxHeight: 195 }}>
      {xt.map((v) => <line key={"gx" + v} x1={sx(v)} y1={mt} x2={sx(v)} y2={H - mb} stroke={VC.grid} strokeWidth="1" />)}
      {yt.map((v) => <line key={"gy" + v} x1={ml} y1={sy(v)} x2={W - mr} y2={sy(v)} stroke={VC.grid} strokeWidth="1" />)}
      {ymin <= 0 && ymax >= 0 && <line x1={ml - 4} y1={sy(0)} x2={W - mr + 4} y2={sy(0)} stroke={VC.axis} strokeWidth="1.5" />}
      {xmin <= 0 && xmax >= 0 && <line x1={sx(0)} y1={mt - 4} x2={sx(0)} y2={H - mb + 4} stroke={VC.axis} strokeWidth="1.5" />}
      {xt.map((v) => <text key={"tx" + v} x={sx(v)} y={H - mb + 13} fill={VC.axis} fontSize="8.5" textAnchor="middle" fontFamily="monospace">{v}</text>)}
      {yt.map((v) => <text key={"ty" + v} x={ml - 5} y={sy(v) + 3} fill={VC.axis} fontSize="8.5" textAnchor="end" fontFamily="monospace">{v}</text>)}
      <text x={W - mr} y={H - mb + 13} fill={VC.alt} fontSize="10" textAnchor="end" fontFamily="monospace" fontWeight="bold">{xlab}</text>
      <text x={ml - 22} y={mt - 6} fill={VC.alt} fontSize="10" fontFamily="monospace" fontWeight="bold">{ylab}</text>
      {paths}
      {dots.map(([dx, dy, t], i) => (
        <g key={i}>
          <circle cx={sx(dx)} cy={sy(dy)} r="4" fill={VC.alt} stroke={VC.ink} strokeWidth="1" />
          {t && <text x={sx(dx) + 6} y={sy(dy) - 7} fill={VC.alt} fontSize="9" fontFamily="monospace">{t}</text>}
        </g>
      ))}
      <text x={(W + ml - mr) / 2} y={11} fill={VC.alt} fontSize="9.5" textAnchor="middle" fontFamily="monospace">{label}</text>
    </svg>
  );
}
function NumLine({ from = null, holes = null, all = false, label }) {
  const X = (v) => 160 + v * 27;
  return (
    <svg viewBox="0 0 320 70" className="w-full my-2" style={{ maxHeight: 76 }}>
      <line x1="12" y1="38" x2="308" y2="38" stroke={VC.axis} strokeWidth="1.5" />
      <polygon points="308,38 300,34 300,42" fill={VC.axis} />
      <polygon points="12,38 20,34 20,42" fill={VC.axis} />
      {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((v) => (
        <g key={v}>
          <line x1={X(v)} y1="35" x2={X(v)} y2="41" stroke={VC.axis} />
          <text x={X(v)} y="56" fill={VC.axis} fontSize="9" textAnchor="middle" fontFamily="monospace">{v}</text>
        </g>
      ))}
      <text x="308" y="62" fill={VC.alt} fontSize="9" textAnchor="end" fontFamily="monospace">x</text>
      {(all || holes) && <line x1="20" y1="38" x2="300" y2="38" stroke={VC.ok} strokeWidth="5" opacity="0.85" />}
      {from !== null && (<g>
        <line x1={X(from)} y1="38" x2="300" y2="38" stroke={VC.ok} strokeWidth="5" opacity="0.85" />
        <circle cx={X(from)} cy="38" r="5" fill={VC.ok} />
        <text x={X(from)} y="26" fill={VC.ok} fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{from} included</text>
      </g>)}
      {holes && holes.map((h) => (<g key={h}>
        <circle cx={X(h)} cy="38" r="5" fill={VC.ink} stroke={VC.curve} strokeWidth="2.5" />
        <text x={X(h)} y="26" fill={VC.curve} fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">banned</text>
      </g>))}
      <text x="160" y="12" fill={VC.alt} fontSize="10" textAnchor="middle" fontFamily="monospace">{label}</text>
    </svg>
  );
}
function Machines({ mode, fl, gl, cap }) {
  const Box = ({ x, y = 40, name, sub, c, w = 60 }) => (
    <g>
      <rect x={x} y={y} width={w} height="34" rx="6" fill="#1C2026" stroke={c} strokeWidth="2" />
      <text x={x + w / 2} y={y + 22} fill={c} fontSize="13" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{name}</text>
      {sub && <text x={x + w / 2} y={y + 47} fill={c} fontSize="8.5" textAnchor="middle" fontFamily="monospace">{sub}</text>}
    </g>
  );
  const Arr = ({ x1, x2, y = 57 }) => (
    <g>
      <line x1={x1} y1={y} x2={x2 - 6} y2={y} stroke={VC.axis} strokeWidth="2" />
      <polygon points={x2 + "," + y + " " + (x2 - 8) + "," + (y - 4) + " " + (x2 - 8) + "," + (y + 4)} fill={VC.axis} />
    </g>
  );
  if (mode === "series") return (
    <svg viewBox="0 0 320 120" className="w-full my-2" style={{ maxHeight: 128 }}>
      <text x="10" y="61" fill={VC.alt} fontSize="12" fontFamily="monospace">x in</text>
      <Arr x1={36} x2={64} /><Box x={64} name="f" sub={fl} c={VC.curve} /><Arr x1={124} x2={158} /><Box x={158} name="g" sub={gl} c={VC.ok} /><Arr x1={218} x2={252} />
      <text x="256" y="61" fill={VC.alt} fontSize="12" fontFamily="monospace">h out</text>
      <text x="160" y="112" fill={VC.axis} fontSize="9" textAnchor="middle" fontFamily="monospace">{cap || "crusher feeds the screen — f runs first"}</text>
    </svg>
  );
  if (mode === "series2") return (
    <svg viewBox="0 0 320 120" className="w-full my-2" style={{ maxHeight: 128 }}>
      <text x="4" y="61" fill={VC.alt} fontSize="11" fontFamily="monospace">x</text>
      <Arr x1={14} x2={36} /><Box x={36} name="f" sub={fl} c={VC.curve} w={54} /><Arr x1={90} x2={118} /><Box x={118} name="( )²" sub="square it" c={VC.alt} w={54} /><Arr x1={172} x2={200} /><Box x={200} name="g" sub={gl} c={VC.ok} w={54} /><Arr x1={254} x2={282} />
      <text x="286" y="61" fill={VC.alt} fontSize="11" fontFamily="monospace">h</text>
      <text x="160" y="112" fill={VC.axis} fontSize="9" textAnchor="middle" fontFamily="monospace">{cap || "f runs, the result is squared, THEN g runs"}</text>
    </svg>
  );
  if (mode === "inverse") return (
    <svg viewBox="0 0 320 132" className="w-full my-2" style={{ maxHeight: 140 }}>
      <text x="10" y="47" fill={VC.alt} fontSize="11" fontFamily="monospace">x</text>
      <g><line x1="22" y1="43" x2="98" y2="43" stroke={VC.axis} strokeWidth="2" /><polygon points="104,43 96,39 96,47" fill={VC.axis} /></g>
      <g><rect x="104" y="26" width="112" height="32" rx="6" fill="#1C2026" stroke={VC.curve} strokeWidth="2" /><text x="160" y="41" fill={VC.curve} fontSize="10" textAnchor="middle" fontFamily="monospace">f forwards →</text><text x="160" y="53" fill={VC.curve} fontSize="8.5" textAnchor="middle" fontFamily="monospace">{fl}</text></g>
      <g><line x1="216" y1="43" x2="292" y2="43" stroke={VC.axis} strokeWidth="2" /><polygon points="298,43 290,39 290,47" fill={VC.axis} /></g>
      <text x="302" y="47" fill={VC.alt} fontSize="11" fontFamily="monospace">y</text>
      <g><rect x="104" y="76" width="112" height="32" rx="6" fill="#1C2026" stroke={VC.ok} strokeWidth="2" /><text x="160" y="91" fill={VC.ok} fontSize="10" textAnchor="middle" fontFamily="monospace">← f⁻¹ backwards</text><text x="160" y="103" fill={VC.ok} fontSize="8.5" textAnchor="middle" fontFamily="monospace">{gl}</text></g>
      <g><line x1="292" y1="92" x2="222" y2="92" stroke={VC.axis} strokeWidth="2" /><polygon points="216,92 224,88 224,96" fill={VC.axis} /></g>
      <g><line x1="98" y1="92" x2="28" y2="92" stroke={VC.axis} strokeWidth="2" /><polygon points="22,92 30,88 30,96" fill={VC.axis} /></g>
      <text x="160" y="128" fill={VC.axis} fontSize="9" textAnchor="middle" fontFamily="monospace">know the output? run the plant backwards to find the input</text>
    </svg>
  );
  const sym = mode === "divide" ? "÷" : mode === "times" ? "×" : "+";
  return (
    <svg viewBox="0 0 320 134" className="w-full my-2" style={{ maxHeight: 142 }}>
      <text x="6" y="39" fill={VC.alt} fontSize="11" fontFamily="monospace">x</text>
      <text x="6" y="95" fill={VC.alt} fontSize="11" fontFamily="monospace">x</text>
      <g><rect x="36" y="18" width="64" height="32" rx="6" fill="#1C2026" stroke={VC.curve} strokeWidth="2" /><text x="68" y="39" fill={VC.curve} fontSize="13" textAnchor="middle" fontFamily="monospace" fontWeight="bold">f</text><text x="68" y="62" fill={VC.curve} fontSize="8.5" textAnchor="middle" fontFamily="monospace">{fl}</text></g>
      <g><rect x="36" y="74" width="64" height="32" rx="6" fill="#1C2026" stroke={VC.ok} strokeWidth="2" /><text x="68" y="95" fill={VC.ok} fontSize="13" textAnchor="middle" fontFamily="monospace" fontWeight="bold">g</text><text x="68" y="118" fill={VC.ok} fontSize="8.5" textAnchor="middle" fontFamily="monospace">{gl}</text></g>
      <line x1="100" y1="34" x2="158" y2="56" stroke={VC.axis} strokeWidth="2" />
      <line x1="100" y1="90" x2="158" y2="68" stroke={VC.axis} strokeWidth="2" />
      <circle cx="176" cy="62" r="18" fill="#1C2026" stroke={VC.alt} strokeWidth="2" />
      <text x="176" y="67" fill={VC.alt} fontSize="13" textAnchor="middle" fontFamily="monospace">{sym}</text>
      <g><line x1="194" y1="62" x2="278" y2="62" stroke={VC.axis} strokeWidth="2" /><polygon points="284,62 276,58 276,66" fill={VC.axis} /></g>
      <text x="160" y="132" fill={VC.axis} fontSize="9" textAnchor="middle" fontFamily="monospace">{cap || "the fussiest machine limits the legal inputs"}</text>
    </svg>
  );
}
const perWin = (x) => ((x + 1) % 2 + 2) % 2 - 1;
const QVIZ = {
  "4.1 Q1 · Plot": () => <Plot fns={[{ f: (x) => -x * x + x + 2, c: VC.curve }]} xmin={-4} xmax={4} ymin={-18} ymax={4} label="y = −x² + x + 2 — shaped like a ball flight" dots={[[-1, 0, "(−1,0)"], [2, 0, "(2,0)"], [0.5, 2.25, "peak"]]} />,
  "4.1 Q2a · Domain": () => <NumLine from={-2} label="legal inputs: [−2, ∞) — green zone" />,
  "4.1 Q2b · Domain": () => <NumLine all label="every input legal: (−∞, ∞)" />,
  "4.1 Q2c · Domain": () => <NumLine holes={[1, 2]} label="everything EXCEPT the holes at 1 and 2" />,
  "4.1 Q2d · Domain": () => <NumLine from={0} label="legal inputs: [0, ∞) — green zone" />,
  "4.1 Q3a · Combined": () => <Machines mode="blend" fl="f = −2x²" gl="g = √(x³−2x²)" cap="3f + 2g: blend the two outputs · g is the fussy one" />,
  "4.1 Q3b · Combined": () => <Machines mode="times" fl="f = −2x²" gl="g = √(x³−2x²)" cap="f × g: multiply the two outputs · domain still set by g" />,
  "4.1 Q3c · Combined": () => <Machines mode="divide" fl="f = √(x−2)" gl="g = √(x+2)" cap="f ÷ g: bottom can't be zero AND both roots must be happy" />,
  "4.1 Q3d · Composite": () => <Machines mode="series" fl="f = √(x−2)" gl="g = √(x+2)" cap="g(f(x)): crusher feeds the screen — f runs first" />,
  "4.1 Q3e · Composite": () => <Machines mode="series2" fl="√(x−2)" gl="√(x+2)" cap="g(f(x)²): f runs, result squared, then g — it collapses to √x" />,
  "4.1 Q4 · Translations": () => <Plot fns={[{ f: (x) => x * x * x, c: VC.curve }, { f: (x) => x * x * x - 9, c: VC.axis, dash: "5 4" }, { f: (x) => (x + 1) * (x + 1) * (x + 1), c: VC.alt }, { f: (x) => x * x * x / 3, c: VC.ok }]} xmin={-3.2} xmax={3.2} ymin={-12} ymax={12} label="orange x³ · grey dashed: down 9 · yellow: left 1 · green: ⅓ height" />,
  "4.1 Q5 · Reflections": () => <Plot fns={[{ f: (x) => x * x * x / 5 - 3, c: VC.curve }, { f: (x) => -x * x * x / 5 - 3, c: VC.alt }, { f: (x) => -x * x * x / 5 + 3, c: VC.ok }]} xmin={-4} xmax={4} ymin={-9} ymax={9} label="orange f · yellow f(−x): mirror ↔ · green −f(x): mirror ↕" />,
  "4.2 Q1 · Segmented": () => <Plot fns={[{ f: (x) => (x >= -3 && x < -1 ? -x : null), c: VC.curve }, { f: (x) => (x >= -1 && x < 1 ? x * x : null), c: VC.alt }, { f: (x) => (x >= 1 && x <= 3 ? x : null), c: VC.ok }]} xmin={-3.4} xmax={3.4} ymin={-0.6} ymax={3.4} label="zone 1 orange: −x · zone 2 yellow: x² · zone 3 green: x" />,
  "4.2 Q2 · Periodic": () => <Plot fns={[{ f: (x) => Math.pow(perWin(x), 3), c: VC.curve }]} xmin={-3} xmax={3} ymin={-1.4} ymax={1.4} label="the x³ S-shape repeating — one cycle every 2 units" dots={[[-1, -1, ""], [1, 1, "cycle ends"]]} />,
  "4.2 Q3 · Periodic": () => <Plot fns={[{ f: (x) => 1 - Math.pow(perWin(x), 2), c: VC.curve }]} xmin={-3} xmax={3} ymin={-0.3} ymax={1.4} label="repeating humps — peak 1, period 2" dots={[[0, 1, "peak (0,1)"]]} />,
  "4.2 Q4 · Implicit": () => <Plot fns={[{ f: (x) => (16 - x * x >= 0 ? 0.75 * Math.sqrt(16 - x * x) : null), c: VC.curve }, { f: (x) => (16 - x * x >= 0 ? -0.75 * Math.sqrt(16 - x * x) : null), c: VC.alt }]} xmin={-4.6} xmax={4.6} ymin={-3.6} ymax={3.6} label="haul loop: orange = + half, yellow = − half" dots={[[4, 0, "(4,0)"], [0, 3, "(0,3)"], [-4, 0, "(−4,0)"], [0, -3, "(0,−3)"]]} />,
  "4.2 Q5 · Rearrange & plot": () => <Plot fns={[{ f: (x) => (x >= 0 ? Math.pow(Math.sqrt(x) - 1, 2) : null), c: VC.curve }]} xmin={-0.5} xmax={9} ymin={-0.4} ymax={4.4} label="y = (√x − 1)² — starts (0,1), dips to (1,0), climbs" dots={[[1, 0, "(1,0)"], [0, 1, "(0,1)"], [9, 4, "(9,4)"]]} />,
  "4.2 Q6 · Parametric": () => <Plot fns={[{ f: (t) => 2 * t - 1, c: VC.curve }, { f: (t) => t * t + 1, c: VC.ok }]} xmin={-3} xmax={3} ymin={-8} ymax={10.5} xlab="t" ylab="gauge" label="vs the clock t: orange x = 2t−1 · green y = t²+1" dots={[[0, 1, "y min (0,1)"]]} />,
  "4.2 Q7 · Parametric": () => <Plot fns={[{ f: (t) => Math.sqrt(3 * t * t + 4), c: VC.curve }, { f: (t) => 3 - 2 * t, c: VC.ok }]} xmin={-2.2} xmax={2.2} ymin={-1.6} ymax={7.6} xlab="t" ylab="gauge" label="vs the clock t: orange x = √(3t²+4) · green y = 3−2t" dots={[[0, 2, "x min (0,2)"]]} />,
  "4.2 Q8 · Parametric circle": () => <Plot fns={[{ f: (x) => (4 - x * x >= 0 ? Math.sqrt(4 - x * x) : null), c: VC.curve }, { f: (x) => (4 - x * x >= 0 ? -Math.sqrt(4 - x * x) : null), c: VC.curve }]} xmin={-2.8} xmax={2.8} ymin={-2.8} ymax={2.8} label="the mill drum rim — circle, radius 2" dots={[[0, 2, "t=0°"], [2, 0, "t=90°"], [0, -2, "t=±180°"], [-2, 0, "t=−90°"]]} />,
  "4.2 Q9 · Parametric ellipse": () => <Plot fns={[{ f: (x) => (16 - x * x >= 0 ? 0.75 * Math.sqrt(16 - x * x) : null), c: VC.curve }, { f: (x) => (16 - x * x >= 0 ? -0.75 * Math.sqrt(16 - x * x) : null), c: VC.curve }]} xmin={-4.6} xmax={4.6} ymin={-3.6} ymax={3.6} label="lapping the oval haul loop — same shape as Q4" dots={[[4, 0, "t=0°"], [0, 3, "t=90°"], [-4, 0, "t=±180°"]]} />,
  "4.2 Q10 · Inverse": () => <Machines mode="inverse" fl="f = 2√x − 1" gl="f⁻¹ = ¼(x+1)²" />,
  "4.2 Q11 · Inverse": () => <Machines mode="inverse" fl="f = x³ − 10" gl="f⁻¹ = ∛(x+10)" />,
  "Week 2 · Exercises 5.2 Q1": () => <Plot fns={[{ f: (x) => x * x - 5 * x + 6, c: VC.curve }]} xmin={-0.8} xmax={5.5} ymin={-1.5} ymax={7} label="y = x² − 5x + 6" dots={[[2.5, -0.25, "vertex (2.5,−0.25)"], [2, 0, "(2,0)"], [3, 0, "(3,0)"], [0, 6, "(0,6)"]]} />,
  "Week 2 · Exercises 5.2 Q2": () => <Plot fns={[{ f: (x) => x * x - 2 * x + 3, c: VC.curve }]} xmin={-1.6} xmax={3.8} ymin={0} ymax={8} label="the answer curve: y = x² − 2x + 3" dots={[[1, 2, "V(1,2)"], [0, 3, "(0,3)"]]} />,
  "Week 2 · Exercises 5.2 Q5": () => <Plot fns={[{ f: (x) => x * x - 3 * x + 5, c: VC.curve }, { f: (x) => 2 * x - 1, c: VC.ok }]} xmin={-0.6} xmax={5} ymin={-2} ymax={9} label="orange parabola meets green line at two crossings" dots={[[2, 3, "(2,3)"], [3, 5, "(3,5)"]]} />,
  "5.1 Q1 · Line (3 forms)": () => <Plot fns={[{ f: (x) => -0.5 * x + 0.5, c: VC.curve }]} xmin={-4} xmax={4} ymin={-2.5} ymax={3} label="y = −½x + ½ through A(−3,2) and B(3,−1)" dots={[[-3, 2, "A"], [3, -1, "B"]]} />,
  "5.1 Q2 · Line from slope + point": () => <Plot fns={[{ f: (x) => 0.5 * x + 1, c: VC.curve }]} xmin={-2} xmax={6} ymin={-1} ymax={5} label="y = ½x + 1 through (4, 3)" dots={[[4, 3, "(4,3)"], [0, 1, "y-int"]]} />,
  "Week 2 · Exercises 5.2 Q3": () => <Plot fns={[{ f: (x) => 0.75 * (x * x - 2 * x - 3), c: VC.curve }]} xmin={-2.2} xmax={4.2} ymin={-3.6} ymax={4} label="y = ¾(x² − 2x − 3): roots −1 & 3, min −3" dots={[[-1, 0, "(−1,0)"], [3, 0, "(3,0)"], [1, -3, "min (1,−3)"]]} />,
  "Week 2 · Exercises 5.2 Q4": () => <Plot fns={[{ f: (x) => x * x + 1, c: VC.axis, dash: "5 4" }, { f: (x) => x * x - 4 * x + 5, c: VC.curve }]} xmin={-2} xmax={5.5} ymin={0} ymax={9} label="grey dashed x²+1 slid right 2 → orange x²−4x+5" dots={[[0, 1, "(0,1)"], [2, 1, "(2,1)"]]} />,
  "6.1 Q4 · Plot exp + reflection": () => <Plot fns={[{ f: (x) => Math.exp(2 * x) / 100, c: VC.curve }, { f: (x) => Math.exp(-2 * x) / 100, c: VC.ok }]} xmin={-2} xmax={2} ymin={0} ymax={0.6} label="orange (1/100)e^(2x) grows · green (1/100)e^(−2x) = mirror" />,
  "6.2 Q3 · Plot y = log₂ x^(3/2)": () => <Plot fns={[{ f: (x) => (x > 0 ? 1.5 * Math.log2(x) : null), c: VC.curve }]} xmin={0} xmax={128} ymin={-4} ymax={11} label="y = (3/2)log₂x — 0 at x=1, rising & flattening" dots={[[1, 0, "(1,0)"], [8, 4.5, "(8,4.5)"]]} />,
  "6.2 Q4 · Plot a log curve": () => <Plot fns={[{ f: (x) => (x > 0 ? Math.log10(x) / 3 : null), c: VC.curve }]} xmin={1} xmax={100} ymin={0} ymax={0.7} label="y = (1/3)log x — slow-rising log curve" dots={[[10, 0.333, "(10,0.33)"], [100, 0.667, "(100,0.67)"]]} />,
  "7.1 Q1 · Translating cosine": () => <Plot fns={[{ f: (x) => Math.cos(x), c: VC.axis, dash: "5 4" }, { f: (x) => Math.cos(x - Math.PI / 4), c: VC.curve }, { f: (x) => Math.cos(x + Math.PI / 4), c: VC.ok }]} xmin={-3.2} xmax={3.2} ymin={-1.2} ymax={1.2} label="grey cos x · orange shifted right π/4 · green shifted left π/4" />,
  "7.1 Q9 · Plot a sum": () => <Plot fns={[{ f: (x) => 4 * Math.sin(x) + 2 * Math.cos(3 * x), c: VC.curve }]} xmin={-3.2} xmax={3.2} ymin={-6} ymax={6} label="4sin x + 2cos 3x — a slow swing with a fast ripple" />,
  "11.1 Q1 · Tangent & normal": () => <Plot fns={[{ f: (x) => 3 * x * x + 2 * x - 6, c: VC.curve }, { f: (x) => -4 * x - 9, c: VC.ok }, { f: (x) => x / 4 - 19 / 4, c: VC.alt, dash: "5 4" }]} xmin={-4} xmax={3} ymin={-12} ymax={8} label="orange curve · green tangent y=−4x−9 · yellow normal" dots={[[-1, -5, "(−1,−5)"]]} />,
  "11.4 Q3 · Box of maximum volume": () => <Plot fns={[{ f: (x) => 4 * x * x * x - 100 * x * x + 600 * x, c: VC.curve }]} xmin={0} xmax={10} ymin={0} ymax={1150} label="V = 4x³−100x²+600x — peak near x ≈ 3.9 cm" dots={[[3.9, 1056, "max ≈1056"]]} />,
  "16.2 Q3 · Area between two curves": () => <Plot fns={[{ f: (x) => 4 * x - x * x, c: VC.curve }, { f: (x) => x * x - 6, c: VC.ok }]} xmin={-1.5} xmax={3.5} ymin={-7} ymax={5} label="orange 4x−x² on top, green x²−6 below — area = 64/3" dots={[[-1, -5, "x=−1"], [3, 3, "x=3"]]} />,
};
// exam-room visuals
const EVIZ = {
  "3(c)": () => <Plot fns={[{ f: (x) => Math.sqrt(x) - 1, c: VC.curve }, { f: (x) => x * x / 8 - 1, c: VC.ok }]} xmin={-0.3} xmax={4.6} ymin={-1.3} ymax={1.4} label="2020 3(c): orange √x−1 on top, green x²/8−1 below" dots={[[0, -1, "(0,−1)"], [4, 1, "(4,1)"]]} />,
  "3(c)-24": () => <Plot fns={[{ f: (x) => 3 * x - x * x, c: VC.curve }, { f: (x) => x * x - 2, c: VC.ok }]} xmin={-1.3} xmax={2.8} ymin={-2.4} ymax={2.6} label="2024 3(c): orange 3x−x² on top, green x²−2 below" dots={[[-0.5, -1.75, "x=−½"], [2, 2, "x=2"]]} />,
  "2f": () => <Plot fns={[{ f: (x) => (x + 1 >= 0 ? x * x - 2 * Math.pow(x + 1, 1.5) : null), c: VC.curve }]} xmin={-1} xmax={5} ymin={-9} ymax={6} label="2020 2(f): single minimum at (3, −7)" dots={[[3, -7, "min (3,−7)"]]} />,
  "2c-24": () => <Plot fns={[{ f: (x) => (x > 0 ? 2 * Math.sqrt(x) + 1 / x : null), c: VC.curve }]} xmin={0.05} xmax={6} ymin={0} ymax={9} label="2024 2(c): minimum at (1, 3)" dots={[[1, 3, "min (1,3)"]]} />,
};
// ── Which Method? visuals — one per card, same order as METHODS ──
const SV = { vb: "0 0 300 112", cls: "w-full my-2", sty: { maxHeight: 120 } };
const MVIZ = [
  // 0 · domain checklist
  () => (<svg viewBox={SV.vb} className={SV.cls} style={SV.sty}>
    <text x="10" y="18" fill={VC.alt} fontSize="11" fontFamily="monospace" fontWeight="bold">danger checklist</text>
    <text x="10" y="36" fill="#C9CDD3" fontSize="10" fontFamily="monospace">√ inside ≥ 0 · ÷ bottom ≠ 0 · ln(inside) {">"} 0</text>
    <line x1="20" y1="80" x2="288" y2="80" stroke={VC.axis} strokeWidth="1.5" />
    <polygon points="288,80 280,76 280,84" fill={VC.axis} />
    <line x1="110" y1="80" x2="285" y2="80" stroke={VC.ok} strokeWidth="5" opacity="0.85" />
    <circle cx="110" cy="80" r="5" fill={VC.ok} />
    <circle cx="200" cy="80" r="5" fill={VC.ink} stroke={VC.curve} strokeWidth="2.5" />
    <text x="116" y="100" fill={VC.ok} fontSize="9" fontFamily="monospace">allowed inputs</text>
    <text x="182" y="66" fill={VC.curve} fontSize="9" fontFamily="monospace">banned</text>
  </svg>),
  // 1 · inverse = mirror over y=x
  () => (<svg viewBox={SV.vb} className={SV.cls} style={SV.sty}>
    <line x1="40" y1="100" x2="40" y2="12" stroke={VC.axis} strokeWidth="1.3" />
    <line x1="40" y1="100" x2="280" y2="100" stroke={VC.axis} strokeWidth="1.3" />
    <line x1="40" y1="100" x2="180" y2="12" stroke={VC.axis} strokeDasharray="4 4" strokeWidth="1.3" />
    <text x="150" y="26" fill={VC.axis} fontSize="9" fontFamily="monospace">y = x</text>
    <path d="M40 100 Q120 90 250 55" fill="none" stroke={VC.curve} strokeWidth="2.5" />
    <path d="M40 100 Q55 60 95 18" fill="none" stroke={VC.ok} strokeWidth="2.5" />
    <text x="200" y="50" fill={VC.curve} fontSize="9" fontFamily="monospace">f</text>
    <text x="98" y="26" fill={VC.ok} fontSize="9" fontFamily="monospace">f⁻¹</text>
    <text x="120" y="110" fill={VC.alt} fontSize="9" fontFamily="monospace">swap x ↔ y · reflect over y = x</text>
  </svg>),
  // 2 · vertex form parabola
  () => (<svg viewBox={SV.vb} className={SV.cls} style={SV.sty}>
    <line x1="30" y1="98" x2="285" y2="98" stroke={VC.axis} strokeWidth="1.3" />
    <path d="M55 22 Q150 130 250 22" fill="none" stroke={VC.curve} strokeWidth="2.5" />
    <circle cx="150" cy="86" r="4" fill={VC.alt} />
    <text x="158" y="90" fill={VC.alt} fontSize="9" fontFamily="monospace">V(h, k)</text>
    <text x="70" y="18" fill={VC.alt} fontSize="10" fontFamily="monospace">y = a(x − h)² + k</text>
  </svg>),
  // 3 · growth curve
  () => (<svg viewBox={SV.vb} className={SV.cls} style={SV.sty}>
    <line x1="34" y1="98" x2="34" y2="14" stroke={VC.axis} strokeWidth="1.3" />
    <line x1="34" y1="98" x2="285" y2="98" stroke={VC.axis} strokeWidth="1.3" />
    <path d="M34 92 C140 88 195 60 275 18" fill="none" stroke={VC.curve} strokeWidth="2.5" />
    <text x="44" y="40" fill={VC.alt} fontSize="11" fontFamily="monospace">A = A₀(1 + r)ᵗ</text>
    <text x="240" y="110" fill={VC.axis} fontSize="9" fontFamily="monospace">time t</text>
  </svg>),
  // 4 · trig equation on [0, π]
  () => (<svg viewBox={SV.vb} className={SV.cls} style={SV.sty}>
    <line x1="20" y1="60" x2="285" y2="60" stroke={VC.axis} strokeWidth="1.3" />
    <path d="M30 60 C70 12 110 12 150 60 C190 108 230 108 270 60" fill="none" stroke={VC.curve} strokeWidth="2.5" />
    <circle cx="90" cy="22" r="4" fill={VC.alt} />
    <line x1="90" y1="22" x2="90" y2="60" stroke={VC.alt} strokeDasharray="3 3" strokeWidth="1" />
    <text x="74" y="96" fill={VC.alt} fontSize="9" fontFamily="monospace">solution in [0, π]</text>
    <text x="20" y="22" fill={VC.axis} fontSize="9" fontFamily="monospace">identities → one quadratic</text>
  </svg>),
  // 5 · product rule
  () => (<svg viewBox={SV.vb} className={SV.cls} style={SV.sty}>
    <rect x="24" y="38" width="48" height="34" rx="6" fill="#1C2026" stroke={VC.curve} strokeWidth="2" />
    <text x="48" y="60" fill={VC.curve} fontSize="14" textAnchor="middle" fontFamily="monospace">u</text>
    <text x="86" y="60" fill={VC.alt} fontSize="16" textAnchor="middle" fontFamily="monospace">×</text>
    <rect x="100" y="38" width="48" height="34" rx="6" fill="#1C2026" stroke={VC.ok} strokeWidth="2" />
    <text x="124" y="60" fill={VC.ok} fontSize="14" textAnchor="middle" fontFamily="monospace">v</text>
    <text x="168" y="60" fill={VC.axis} fontSize="14" fontFamily="monospace">→</text>
    <text x="190" y="60" fill={VC.alt} fontSize="13" fontFamily="monospace">u′v + uv′</text>
  </svg>),
  // 6 · quotient rule
  () => (<svg viewBox={SV.vb} className={SV.cls} style={SV.sty}>
    <text x="40" y="48" fill={VC.curve} fontSize="14" textAnchor="middle" fontFamily="monospace">u</text>
    <line x1="22" y1="56" x2="58" y2="56" stroke={VC.axis} strokeWidth="2" />
    <text x="40" y="76" fill={VC.ok} fontSize="14" textAnchor="middle" fontFamily="monospace">v</text>
    <text x="78" y="62" fill={VC.axis} fontSize="14" fontFamily="monospace">→</text>
    <text x="100" y="62" fill={VC.alt} fontSize="12" fontFamily="monospace">(u′v − uv′) / v²</text>
    <text x="100" y="86" fill={VC.curve} fontSize="9" fontFamily="monospace">order on top matters!</text>
  </svg>),
  // 7 · chain rule (nested)
  () => (<svg viewBox={SV.vb} className={SV.cls} style={SV.sty}>
    <rect x="24" y="34" width="150" height="44" rx="8" fill="#1C2026" stroke={VC.curve} strokeWidth="2" />
    <text x="40" y="61" fill={VC.curve} fontSize="13" fontFamily="monospace">g(</text>
    <rect x="64" y="44" width="92" height="24" rx="6" fill="#15181C" stroke={VC.ok} strokeWidth="2" />
    <text x="110" y="61" fill={VC.ok} fontSize="12" textAnchor="middle" fontFamily="monospace">f(x)</text>
    <text x="158" y="61" fill={VC.curve} fontSize="13" fontFamily="monospace">)</text>
    <text x="186" y="55" fill={VC.axis} fontSize="13" fontFamily="monospace">→</text>
    <text x="186" y="78" fill={VC.alt} fontSize="11" fontFamily="monospace">outside′ × inside′</text>
  </svg>),
  // 8 · tangent & normal
  () => (<svg viewBox={SV.vb} className={SV.cls} style={SV.sty}>
    <path d="M30 95 Q150 5 275 70" fill="none" stroke={VC.curve} strokeWidth="2.5" />
    <circle cx="150" cy="33" r="4" fill={VC.alt} />
    <line x1="70" y1="60" x2="240" y2="14" stroke={VC.ok} strokeWidth="2" />
    <line x1="124" y1="92" x2="176" y2="-12" stroke={VC.axis} strokeDasharray="4 4" strokeWidth="1.5" />
    <text x="196" y="22" fill={VC.ok} fontSize="9" fontFamily="monospace">tangent (y′)</text>
    <text x="180" y="86" fill={VC.axis} fontSize="9" fontFamily="monospace">normal ⟂ (−1/y′)</text>
  </svg>),
  // 9 · critical points
  () => (<svg viewBox={SV.vb} className={SV.cls} style={SV.sty}>
    <line x1="20" y1="98" x2="285" y2="98" stroke={VC.axis} strokeWidth="1.2" />
    <path d="M20 78 C70 8 110 8 150 58 C190 104 230 104 282 44" fill="none" stroke={VC.curve} strokeWidth="2.5" />
    <line x1="68" y1="17" x2="112" y2="17" stroke={VC.alt} strokeDasharray="3 3" strokeWidth="1.5" />
    <line x1="188" y1="100" x2="232" y2="100" stroke={VC.alt} strokeDasharray="3 3" strokeWidth="1.5" />
    <circle cx="90" cy="14" r="3.5" fill={VC.alt} /><circle cx="210" cy="102" r="3.5" fill={VC.alt} />
    <text x="60" y="34" fill={VC.alt} fontSize="9" fontFamily="monospace">max f″{"<"}0</text>
    <text x="180" y="90" fill={VC.alt} fontSize="9" fontFamily="monospace">min f″{">"}0</text>
    <text x="118" y="44" fill={VC.ok} fontSize="9" fontFamily="monospace">f′ = 0</text>
  </svg>),
  // 10 · indefinite integral (+C family)
  () => (<svg viewBox={SV.vb} className={SV.cls} style={SV.sty}>
    <line x1="30" y1="98" x2="285" y2="98" stroke={VC.axis} strokeWidth="1.2" />
    <path d="M40 92 C120 80 170 50 250 20" fill="none" stroke={VC.curve} strokeWidth="2" />
    <path d="M40 70 C120 58 170 28 250 -2" fill="none" stroke={VC.ok} strokeWidth="1.5" opacity="0.7" />
    <path d="M40 50 C120 38 170 8 250 -22" fill="none" stroke={VC.alt} strokeWidth="1.5" opacity="0.5" />
    <text x="40" y="20" fill={VC.alt} fontSize="10" fontFamily="monospace">∫xⁿdx = xⁿ⁺¹/(n+1) + C</text>
    <text x="150" y="110" fill={VC.curve} fontSize="9" fontFamily="monospace">+ C = a whole family</text>
  </svg>),
  // 11 · kinematics a → v → s
  () => (<svg viewBox={SV.vb} className={SV.cls} style={SV.sty}>
    {[["a", VC.curve, 24], ["v", VC.alt, 130], ["s", VC.ok, 236]].map(([t, c, x]) => (
      <g key={t}><rect x={x} y="44" width="40" height="34" rx="6" fill="#1C2026" stroke={c} strokeWidth="2" /><text x={x + 20} y="66" fill={c} fontSize="15" textAnchor="middle" fontFamily="monospace">{t}</text></g>
    ))}
    <line x1="66" y1="61" x2="124" y2="61" stroke={VC.axis} strokeWidth="2" /><polygon points="130,61 122,57 122,65" fill={VC.axis} />
    <line x1="172" y1="61" x2="230" y2="61" stroke={VC.axis} strokeWidth="2" /><polygon points="236,61 228,57 228,65" fill={VC.axis} />
    <text x="78" y="38" fill={VC.axis} fontSize="9" fontFamily="monospace">∫dt</text>
    <text x="184" y="38" fill={VC.axis} fontSize="9" fontFamily="monospace">∫dt</text>
    <text x="92" y="98" fill={VC.alt} fontSize="9" fontFamily="monospace">integrate twice · use v₀, s₀ for C</text>
  </svg>),
  // 12 · area between curves
  () => (<svg viewBox={SV.vb} className={SV.cls} style={SV.sty}>
    <path d="M60 30 C130 70 180 70 250 36 L250 78 C180 64 130 64 60 86 Z" fill={VC.curve} opacity="0.25" />
    <path d="M60 30 C130 70 180 70 250 36" fill="none" stroke={VC.curve} strokeWidth="2.5" />
    <path d="M60 86 C130 64 180 64 250 78" fill="none" stroke={VC.ok} strokeWidth="2.5" />
    <line x1="60" y1="22" x2="60" y2="96" stroke={VC.axis} strokeDasharray="3 3" strokeWidth="1.2" />
    <line x1="250" y1="30" x2="250" y2="86" stroke={VC.axis} strokeDasharray="3 3" strokeWidth="1.2" />
    <text x="52" y="108" fill={VC.axis} fontSize="9" fontFamily="monospace">a</text>
    <text x="246" y="108" fill={VC.axis} fontSize="9" fontFamily="monospace">b</text>
    <text x="92" y="56" fill={VC.alt} fontSize="10" fontFamily="monospace">∫(top − bottom) dx</text>
  </svg>),
  // 13 · dot vs cross
  () => (<svg viewBox={SV.vb} className={SV.cls} style={SV.sty}>
    <line x1="40" y1="92" x2="250" y2="92" stroke={VC.curve} strokeWidth="2.5" /><polygon points="250,92 242,88 242,96" fill={VC.curve} />
    <line x1="40" y1="92" x2="200" y2="22" stroke={VC.ok} strokeWidth="2.5" /><polygon points="200,22 191,24 196,31" fill={VC.ok} />
    <path d="M88 92 A48 48 0 0 0 76 70" fill="none" stroke={VC.axis} strokeWidth="1.3" />
    <text x="92" y="80" fill={VC.axis} fontSize="10" fontFamily="monospace">θ</text>
    <text x="150" y="108" fill={VC.curve} fontSize="9" fontFamily="monospace">a·b = |a||b|cosθ (number)</text>
    <text x="120" y="16" fill={VC.ok} fontSize="9" fontFamily="monospace">a×b = |a||b|sinθ (vector)</text>
  </svg>),
  // 14 · inclined plane
  () => (<svg viewBox={SV.vb} className={SV.cls} style={SV.sty}>
    <polygon points="34,96 270,96 270,30" fill="#23272E" stroke={VC.axis} strokeWidth="1.3" />
    <line x1="34" y1="96" x2="270" y2="30" stroke={VC.curve} strokeWidth="2" />
    <g transform="translate(150,57) rotate(-16)"><rect x="-16" y="-14" width="32" height="22" rx="3" fill={VC.alt} /></g>
    <line x1="150" y1="58" x2="150" y2="92" stroke={VC.curve} strokeWidth="2" /><polygon points="150,94 146,86 154,86" fill={VC.curve} />
    <text x="120" y="92" fill={VC.curve} fontSize="9" fontFamily="monospace">W</text>
    <text x="58" y="90" fill={VC.axis} fontSize="9" fontFamily="monospace">θ</text>
    <text x="120" y="22" fill={VC.alt} fontSize="9" fontFamily="monospace">along: W sinθ · normal: W cosθ</text>
  </svg>),
  // 15 · complex plane + conjugate
  () => (<svg viewBox={SV.vb} className={SV.cls} style={SV.sty}>
    <line x1="40" y1="56" x2="285" y2="56" stroke={VC.axis} strokeWidth="1.2" /><text x="276" y="50" fill={VC.axis} fontSize="9" fontFamily="monospace">Re</text>
    <line x1="120" y1="14" x2="120" y2="100" stroke={VC.axis} strokeWidth="1.2" /><text x="124" y="22" fill={VC.axis} fontSize="9" fontFamily="monospace">Im</text>
    <line x1="120" y1="56" x2="215" y2="26" stroke={VC.curve} strokeWidth="2.2" /><circle cx="215" cy="26" r="3.5" fill={VC.curve} />
    <line x1="120" y1="56" x2="215" y2="86" stroke={VC.ok} strokeWidth="1.6" strokeDasharray="3 3" /><circle cx="215" cy="86" r="3.5" fill={VC.ok} />
    <text x="220" y="24" fill={VC.curve} fontSize="9" fontFamily="monospace">a + bi</text>
    <text x="220" y="92" fill={VC.ok} fontSize="9" fontFamily="monospace">a − bi (conjugate)</text>
  </svg>),
  // 16 · Gauss elimination → upper triangular
  () => (<svg viewBox={SV.vb} className={SV.cls} style={SV.sty}>
    <text x="20" y="40" fill={VC.curve} fontSize="13" fontFamily="monospace">∗ ∗ ∗ | ∗</text>
    <text x="20" y="58" fill={VC.curve} fontSize="13" fontFamily="monospace">∗ ∗ ∗ | ∗</text>
    <text x="20" y="76" fill={VC.curve} fontSize="13" fontFamily="monospace">∗ ∗ ∗ | ∗</text>
    <text x="138" y="60" fill={VC.axis} fontSize="16" fontFamily="monospace">→</text>
    <text x="172" y="40" fill={VC.ok} fontSize="13" fontFamily="monospace">∗ ∗ ∗ | ∗</text>
    <text x="172" y="58" fill={VC.ok} fontSize="13" fontFamily="monospace">0 ∗ ∗ | ∗</text>
    <text x="172" y="76" fill={VC.ok} fontSize="13" fontFamily="monospace">0 0 ∗ | ∗</text>
    <text x="60" y="100" fill={VC.alt} fontSize="9" fontFamily="monospace">row-reduce, then back-substitute</text>
  </svg>),
];
// ── Storage: works in the Project (window.storage), standalone
//    (localStorage), or falls back to memory. Never throws. ──
const _mem = {};
async function loadState() {
  try {
    if (typeof window !== "undefined" && window.storage && window.storage.get) {
      const r = await window.storage.get("shiftboard-state");
      if (r && r.value) return JSON.parse(r.value);
    }
  } catch {}
  try {
    const v = (typeof localStorage !== "undefined") && localStorage.getItem("shiftboard-state");
    if (v) return JSON.parse(v);
  } catch {}
  try { return _mem["shiftboard-state"] ? JSON.parse(_mem["shiftboard-state"]) : null; } catch { return null; }
}
async function saveState(s) {
  const str = JSON.stringify(s);
  try {
    if (typeof window !== "undefined" && window.storage && window.storage.set) {
      await window.storage.set("shiftboard-state", str); return;
    }
  } catch {}
  try { if (typeof localStorage !== "undefined") { localStorage.setItem("shiftboard-state", str); return; } } catch {}
  _mem["shiftboard-state"] = str;
}
// flatten every worked question for the Practice Range
function buildPool() {
  const pool = [];
  Object.values(QBANK).forEach((arr) => arr.forEach((q) =>
    pool.push({ tag: "Tutorial", topic: q.src, q: q.q, hint: q.hint, steps: q.steps, ans: q.ans })));
  Object.entries(EXAMS).forEach(([yr, ex]) => ex.questions.forEach((Q) => Q.parts.forEach((p) =>
    pool.push({ tag: "Exam " + yr, topic: p.label + " · " + p.topic, q: p.q, hint: "Think: which method does this cue point to? Check the Which Method? tab.", steps: p.steps, ans: p.ans }))));
  return pool;
}
const POOL = buildPool();
// ── Main app ─────────────────────────────────────────────────
export default function ShiftBoard() {
  const [tab, setTab] = useState("today");
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastSession, setLastSession] = useState(null);
  const [done, setDone] = useState({});
  const [qdone, setQdone] = useState({});
  const [examMarks, setExamMarks] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [secs, setSecs] = useState(20 * 60);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);
  useEffect(() => {
    loadState().then((s) => {
      if (s) {
        setXp(s.xp || 0); setStreak(s.streak || 0);
        setDone(s.done || {}); setLastSession(s.lastSession || null);
        setQdone(s.qdone || {}); setExamMarks(s.examMarks || {});
      }
      setLoaded(true);
    });
  }, []);
  useEffect(() => {
    if (loaded) saveState({ xp, streak, done, lastSession, qdone, examMarks });
  }, [xp, streak, done, lastSession, qdone, examMarks, loaded]);
  useEffect(() => {
    if (running && secs > 0) {
      timerRef.current = setInterval(() => setSecs((s) => s - 1), 1000);
      return () => clearInterval(timerRef.current);
    }
    if (secs === 0 && running) setRunning(false);
  }, [running, secs]);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const completeSession = () => {
    const today = new Date().toDateString();
    if (lastSession !== today) {
      const yest = new Date(Date.now() - 864e5).toDateString();
      setStreak(lastSession === yest ? streak + 1 : 1);
      setLastSession(today);
    }
    setXp((x) => x + 250);
  };
  return (
    <div className="min-h-screen text-gray-100" style={{ background: "#15181C", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <header className="border-b-4" style={{ borderColor: "#FF8A00", background: "#1C2026" }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <div className="text-xs tracking-widest font-mono" style={{ color: "#FFD23F" }}>MATH11160 · SHIFT BOARD · HD EDITION</div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: "#F4F4F2" }}>Technology Mathematics</h1>
          </div>
          <div className="text-right font-mono">
            <div className="text-xl font-bold" style={{ color: "#FF8A00" }}>{xp.toLocaleString()} t</div>
            <div className="text-xs text-gray-400">tonnes hauled (XP)</div>
            <div className="text-xs mt-1" style={{ color: "#3E9B5F" }}>🔥 streak: {streak} day{streak === 1 ? "" : "s"}</div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 pb-3 flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono tracking-widest text-gray-400">FOCUS</span>
          <span className="text-3xl font-black font-mono leading-none mr-1" style={{ color: secs < 120 ? "#FF8A00" : "#F4F4F2" }}>{mm}:{ss}</span>
          <button onClick={() => setRunning(true)} disabled={running || secs === 0}
            className="px-3 py-1.5 rounded font-bold text-sm text-black" style={{ background: "#3E9B5F", opacity: running || secs === 0 ? 0.5 : 1 }}>Start</button>
          <button onClick={() => setRunning(false)} disabled={!running}
            className="px-3 py-1.5 rounded font-bold text-sm" style={{ background: "#1C2026", color: "#C9CDD3", border: "1px solid #3A3F45", opacity: running ? 1 : 0.5 }}>Stop</button>
          <button onClick={() => { setRunning(false); setSecs(20 * 60); }}
            className="px-3 py-1.5 rounded font-bold text-sm" style={{ background: "#1C2026", color: "#FFD23F", border: "1px solid #3A3F45" }}>Reset</button>
          <span className="w-px h-5 mx-1" style={{ background: "#3A3F45" }} />
          {[15, 20, 25].map((m) => (
            <button key={m} onClick={() => { setRunning(false); setSecs(m * 60); }}
              className="px-2 py-1 rounded text-xs font-mono font-bold"
              style={{ background: (secs === m * 60 && !running) ? "#FF8A00" : "#15181C", color: (secs === m * 60 && !running) ? "#15181C" : "#9CA3AF", border: "1px solid #3A3F45" }}>{m}m</button>
          ))}
        </div>
        <nav className="max-w-3xl mx-auto px-2 flex overflow-x-auto">
          {[["today", "Today's Shift"], ["tutor", "🎙 Tutor"], ["weeks", "12 Weeks"], ["exam", "Exam Room"], ["method", "Which Method?"], ["qbank", "Question Bank"], ["algebra", "Algebra Kit"], ["practice", "Practice Range"], ["formulas", "Formulas"], ["progress", "Scorecard"]].map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
              className="px-4 py-2 text-sm font-bold whitespace-nowrap border-b-4 transition-colors"
              style={{ borderColor: tab === k ? "#FFD23F" : "transparent", color: tab === k ? "#FFD23F" : "#9CA3AF" }}>
              {label}
            </button>
          ))}
        </nav>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-6">
        {tab === "today" && <Today onComplete={completeSession} />}
        {tab === "tutor" && <Tutor />}
        {tab === "weeks" && <Weeks done={done} setDone={setDone} setXp={setXp} />}
        {tab === "exam" && <ExamRoom examMarks={examMarks} setExamMarks={setExamMarks} setXp={setXp} />}
        {tab === "method" && <MethodGuide />}
        {tab === "qbank" && <QuestionBank qdone={qdone} setQdone={setQdone} setXp={setXp} />}
        {tab === "algebra" && <AlgebraKit />}
        {tab === "practice" && <Practice setXp={setXp} />}
        {tab === "formulas" && <Formulas />}
        {tab === "progress" && <Progress done={done} xp={xp} streak={streak} qdone={qdone} examMarks={examMarks} />}
      </main>
    </div>
  );
}
// ── Tutor — live verbal conversation (voice in, voice out) ───
const TUTOR_STARTERS = [
  "Explain critical points to me like I'm five",
  "How do I know which derivative rule to use?",
  "Walk me through area between two curves",
  "What's the trick for compound interest questions?",
  "Quiz me on Question 1 topics",
];
function speakClean(t) {
  return (t || "")
    .replace(/\*\*/g, "").replace(/\*/g, "").replace(/#/g, "")
    .replace(/√/g, " square root of ").replace(/∛/g, " cube root of ")
    .replace(/π/g, " pi ").replace(/≥/g, " greater than or equal to ")
    .replace(/≤/g, " less than or equal to ").replace(/≠/g, " not equal to ")
    .replace(/∞/g, " infinity ").replace(/→/g, " gives ").replace(/×/g, " times ")
    .replace(/·/g, " dot ").replace(/²/g, " squared ").replace(/³/g, " cubed ")
    .replace(/∫/g, " integral of ").replace(/∠/g, " angle ").replace(/Δ/g, " delta ")
    .replace(/≈/g, " approximately ").replace(/±/g, " plus or minus ");
}
function Tutor() {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [speakOn, setSpeakOn] = useState(true);
  const [listening, setListening] = useState(false);
  const [err, setErr] = useState(null);
  const recRef = useRef(null);
  const scrollRef = useRef(null);
  const hasAI = typeof window !== "undefined" && window.claude && window.claude.complete;
  const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const hasTTS = typeof window !== "undefined" && window.speechSynthesis;
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [msgs, busy]);
  useEffect(() => () => { try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch {} }, []);
  const speak = (text) => {
    if (!speakOn || !hasTTS) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(speakClean(text));
      u.lang = "en-AU"; u.rate = 1.0; u.pitch = 1.0;
      window.speechSynthesis.speak(u);
    } catch {}
  };
  const stopSpeaking = () => { try { window.speechSynthesis.cancel(); } catch {} };
  const buildPrompt = (history, latest) => {
    const sys = "You are a warm, patient university maths tutor for MATH11160 Technology Mathematics at CQUniversity. " +
      "Your student has ADHD and finds maths hard, so: explain in plain English first, go ONE small step at a time, " +
      "never say 'obviously', 'clearly' or 'simply', always name the rule before using it, and be encouraging. " +
      "This is a SPOKEN conversation that gets read aloud, so keep replies SHORT and natural — usually 2 to 5 sentences. " +
      "Only give full written working if the student explicitly asks for 'the full steps'. Use plain words for symbols where you can " +
      "(say 'square root of x' not the symbol). If they want a hint, nudge them one step, don't dump the whole answer. " +
      "You can quiz them and check their working too. " +
      "The final exam = 4 questions, 40 marks, pass 20: Q1 functions/domain, inverse, quadratics from a vertex, compound interest & growth; " +
      "Q2 differentiation (product/quotient/chain), tangent & normal lines, critical points; Q3 integration, definite integrals, area between curves, kinematics; " +
      "Q4 vectors (dot & cross), forces on an incline, complex numbers, Gauss elimination.";
    const convo = history.slice(-10).map((m) => (m.role === "you" ? "Student" : "Tutor") + ": " + m.text).join("\n");
    return sys + "\n\nConversation so far:\n" + (convo || "(none yet)") + "\nStudent: " + latest + "\nTutor:";
  };
  const send = async (text) => {
    const q = (typeof text === "string" ? text : input).trim();
    if (!q || busy) return;
    setErr(null);
    const history = msgs;
    setMsgs((m) => [...m, { role: "you", text: q }]);
    setInput("");
    if (!hasAI) {
      setMsgs((m) => [...m, { role: "tutor", text: "I can only chat live when the board is open inside your Claude Project (that's where I'm allowed to answer). Open it there and I'll talk back. Everything else on the board still works offline." }]);
      return;
    }
    setBusy(true);
    try {
      const reply = await window.claude.complete(buildPrompt(history, q));
      const text2 = (reply || "").trim() || "Sorry, I didn't catch that — can you say it a different way?";
      setMsgs((m) => [...m, { role: "tutor", text: text2 }]);
      speak(text2);
    } catch (e) {
      setErr("That didn't go through — try again.");
      setMsgs((m) => [...m, { role: "tutor", text: "Hmm, that didn't send. Have another go?" }]);
    }
    setBusy(false);
  };
  const toggleMic = () => {
    if (!SR) { setErr("This browser can't do voice input — type your question and I'll still answer out loud. (Chrome works best.)"); return; }
    if (listening) { try { recRef.current && recRef.current.stop(); } catch {} return; }
    stopSpeaking();
    try {
      const rec = new SR();
      rec.lang = "en-AU"; rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 1;
      let finalText = "";
      rec.onresult = (e) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) finalText += t; else interim += t;
        }
        setInput(finalText || interim);
      };
      rec.onerror = (e) => {
        setListening(false);
        if (e.error === "not-allowed" || e.error === "service-not-allowed")
          setErr("Microphone is blocked here. Allow mic access in your browser, or just type — I'll still reply out loud.");
        else setErr("Mic stopped (" + e.error + "). You can type instead.");
      };
      rec.onend = () => { setListening(false); const t = (finalText || "").trim(); if (t) send(t); };
      recRef.current = rec; setListening(true); rec.start();
    } catch (e) { setListening(false); setErr("Couldn't start the mic — type your question instead."); }
  };
  return (
    <div>
      <div className="rounded-lg p-3 mb-4 text-sm border-l-4" style={{ background: "#1C2026", borderColor: "#FF8A00", color: "#C9CDD3" }}>
        <span className="font-bold" style={{ color: "#FF8A00" }}>Your live tutor.</span> Tap the mic and just talk — ask anything, get unstuck, have me check your working or quiz you. I answer out loud. {!hasAI && <span style={{ color: "#F8B4B4" }}>(Open the board inside your Claude Project to switch me on.)</span>}
      </div>
      {/* conversation */}
      <div ref={scrollRef} className="rounded-lg border-2 p-3 mb-3 space-y-3 overflow-y-auto" style={{ background: "#15181C", borderColor: "#3A3F45", height: 340 }}>
        {msgs.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-6">
            <div className="text-4xl mb-2">🎙️</div>
            Press the mic and say something like:
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              {TUTOR_STARTERS.map((s, i) => (
                <button key={i} onClick={() => send(s)} className="px-3 py-1.5 rounded-full text-xs font-bold border" style={{ borderColor: "#3A3F45", color: "#FFD23F", background: "#1C2026" }}>{s}</button>
              ))}
            </div>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={"flex " + (m.role === "you" ? "justify-end" : "justify-start")}>
            <div className="max-w-[85%] rounded-lg px-3 py-2 text-sm" style={{
              background: m.role === "you" ? "#3E9B5F" : "#1C2026",
              color: m.role === "you" ? "#0E1410" : "#E5E7EB",
              border: m.role === "you" ? "none" : "1px solid #3A3F45",
            }}>
              {m.role === "tutor" && <div className="text-xs font-mono mb-1" style={{ color: "#FF8A00" }}>tutor</div>}
              <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>
              {m.role === "tutor" && hasTTS && (
                <button onClick={() => speak(m.text)} className="text-xs mt-1.5 font-bold" style={{ color: "#FFD23F" }}>🔊 replay</button>
              )}
            </div>
          </div>
        ))}
        {busy && <div className="text-sm" style={{ color: "#9CA3AF" }}>tutor is thinking…</div>}
      </div>
      {err && <div className="mb-3 p-2 rounded text-xs" style={{ background: "#3A2020", color: "#F8B4B4" }}>{err}</div>}
      {/* mic + input */}
      <div className="flex items-center gap-2">
        <button onClick={toggleMic} title="Press to talk"
          className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shrink-0 transition-colors"
          style={{ background: listening ? "#FF4D4D" : "#FF8A00", color: "#15181C", boxShadow: listening ? "0 0 0 4px rgba(255,77,77,0.3)" : "none" }}>
          {listening ? "■" : "🎙"}
        </button>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }}
          placeholder={listening ? "listening…" : "…or type your question"}
          className="flex-1 p-3 rounded-lg text-gray-100" style={{ background: "#1C2026", border: "2px solid #3A3F45" }} />
        <button onClick={() => send()} disabled={busy || !input.trim()} className="px-4 py-3 rounded-lg font-bold text-black shrink-0" style={{ background: "#FFD23F", opacity: busy || !input.trim() ? 0.5 : 1 }}>Ask</button>
      </div>
      <div className="flex items-center gap-3 mt-2 flex-wrap">
        <button onClick={() => setSpeakOn(!speakOn)} className="text-xs font-bold px-2 py-1 rounded" style={{ color: speakOn ? "#7BD89B" : "#9CA3AF", border: "1px solid #3A3F45" }}>
          {speakOn ? "🔊 speaking answers: ON" : "🔇 speaking answers: OFF"}
        </button>
        <button onClick={stopSpeaking} className="text-xs font-bold px-2 py-1 rounded" style={{ color: "#C9CDD3", border: "1px solid #3A3F45" }}>⏹ stop voice</button>
        {msgs.length > 0 && <button onClick={() => { setMsgs([]); stopSpeaking(); }} className="text-xs font-bold px-2 py-1 rounded" style={{ color: "#C9CDD3", border: "1px solid #3A3F45" }}>clear chat</button>}
        {!SR && <span className="text-xs text-gray-500">· voice input needs Chrome/Edge; typing works everywhere</span>}
      </div>
    </div>
  );
}
// ── Today ────────────────────────────────────────────────────
function Today({ onComplete }) {
  const [steps, setSteps] = useState([false, false, false, false]);
  const [finished, setFinished] = useState(false);
  const allDone = steps.every(Boolean);
  return (
    <div>
      <div className="rounded-lg p-4 mb-4 text-sm border-l-4" style={{ background: "#1C2026", borderColor: "#FF8A00", color: "#C9CDD3" }}>
        <span className="font-bold" style={{ color: "#FF8A00" }}>Exam target:</span> 4 questions · 40 marks · pass at 20/40 · aim for the HD line (34/40). New here? Hit the <span className="font-bold" style={{ color: "#FFD23F" }}>Exam Room</span> to see exactly what's coming, and <span className="font-bold" style={{ color: "#FFD23F" }}>Which Method?</span> when you're stuck on what to do.
      </div>
      <div className="rounded-lg p-4 mb-1 text-sm border-l-4 flex items-center gap-3" style={{ background: "#1C2026", borderColor: "#FFD23F", color: "#C9CDD3" }}>
        <span className="text-xl shrink-0">⏱</span>
        <span>Your focus timer now lives in the header up top — Start, Stop and Reset it from there. It keeps ticking no matter which tab you're on.</span>
      </div>
      <div className="mt-4 space-y-2">
        {SESSION_STEPS.map((s, i) => (
          <button key={i} onClick={() => setSteps(steps.map((v, j) => j === i ? !v : v))}
            className="w-full text-left p-3 rounded-lg border-2 flex items-center gap-3 transition-colors"
            style={{ background: steps[i] ? "#23331F" : "#1C2026", borderColor: steps[i] ? "#3E9B5F" : "#3A3F45" }}>
            <span className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
              style={{ background: steps[i] ? "#3E9B5F" : "#3A3F45", color: steps[i] ? "#15181C" : "#9CA3AF" }}>
              {steps[i] ? "✓" : i + 1}
            </span>
            <span className={steps[i] ? "text-green-300" : "text-gray-200"}>{s}</span>
          </button>
        ))}
      </div>
      {allDone && !finished && (
        <button onClick={() => { setFinished(true); onComplete(); }}
          className="mt-4 w-full py-3 rounded-lg font-black text-black text-lg" style={{ background: "#FF8A00" }}>
          Clock off — bank 250 t
        </button>
      )}
      {finished && (
        <div className="mt-4 p-4 rounded-lg text-center font-bold" style={{ background: "#23331F", color: "#7BD89B" }}>
          Shift complete. 250 tonnes banked. Same time tomorrow keeps the streak alive.
        </div>
      )}
    </div>
  );
}
// ── Weeks ────────────────────────────────────────────────────
function Weeks({ done, setDone, setXp }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-3">
      {WEEKS.map((w) => {
        const D = w.n === 3 ? DecayCurve : DIAGRAMS[w.tag];
        const isOpen = open === w.n;
        return (
          <div key={w.n} className="rounded-lg border-2 overflow-hidden" style={{ background: "#1C2026", borderColor: done[w.n] ? "#3E9B5F" : "#3A3F45" }}>
            <button onClick={() => setOpen(isOpen ? null : w.n)} className="w-full text-left p-4 flex items-center gap-3">
              <span className="font-mono font-black text-lg w-10 shrink-0" style={{ color: "#FF8A00" }}>W{w.n}</span>
              <div className="flex-1">
                <div className="font-bold">{w.title}</div>
                <div className="text-xs text-gray-400">{w.tag === "golf" ? "⛳ golf example" : "⛏️ mining example"} · exam {w.examQ}</div>
              </div>
              <span style={{ color: done[w.n] ? "#3E9B5F" : "#3A3F45" }} className="text-xl font-bold">{done[w.n] ? "✓" : isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
              <div className="px-4 pb-4">
                <D />
                <p className="text-sm text-gray-300 mt-2">{w.blurb}</p>
                <p className="text-sm mt-1 font-mono" style={{ color: "#FFD23F" }}>→ {w.example}</p>
                <p className="text-xs mt-1 font-mono" style={{ color: "#9CA3AF" }}>Shows up in exam {w.examQ}.</p>
                <button onClick={() => { const nv = !done[w.n]; setDone({ ...done, [w.n]: nv }); if (nv) setXp((x) => x + 500); }}
                  className="mt-3 px-4 py-2 rounded font-bold text-sm"
                  style={{ background: done[w.n] ? "#3A3F45" : "#3E9B5F", color: done[w.n] ? "#C9CDD3" : "#0E1410" }}>
                  {done[w.n] ? "Mark as not done" : "Mark week complete (+500 t)"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
// ── Scribble pad — write your working with a stylus ──────────
function Scribble() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#FFD23F");
  const colorRef = useRef("#FFD23F");
  const toolRef = useRef("pen");
  useEffect(() => { colorRef.current = color; }, [color]);
  useEffect(() => { toolRef.current = tool; }, [tool]);
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const dpr = (typeof window !== "undefined" && window.devicePixelRatio) || 1;
    const rect = c.getBoundingClientRect();
    const H = 240;
    c.width = Math.max(1, rect.width) * dpr; c.height = H * dpr;
    c.style.height = H + "px";
    const ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctxRef.current = ctx;
  }, []);
  const pos = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, p: e.pressure, type: e.pointerType };
  };
  const down = (e) => {
    e.preventDefault(); drawing.current = true;
    const { x, y } = pos(e); last.current = { x, y };
    try { canvasRef.current.setPointerCapture(e.pointerId); } catch {}
  };
  const move = (e) => {
    if (!drawing.current) return; e.preventDefault();
    const { x, y, p, type } = pos(e);
    const ctx = ctxRef.current; if (!ctx) return;
    ctx.globalCompositeOperation = toolRef.current === "eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = colorRef.current;
    ctx.lineWidth = toolRef.current === "eraser" ? 18 : (type === "pen" ? 1 + (p || 0.5) * 4 : 2.6);
    ctx.beginPath(); ctx.moveTo(last.current.x, last.current.y); ctx.lineTo(x, y); ctx.stroke();
    last.current = { x, y };
  };
  const up = () => { drawing.current = false; };
  const clear = () => { const c = canvasRef.current, ctx = ctxRef.current; if (c && ctx) ctx.clearRect(0, 0, c.width, c.height); };
  const pens = [["#FFD23F", "yellow"], ["#F4F4F2", "white"], ["#FF8A00", "orange"], ["#7BD89B", "green"]];
  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {pens.map(([c]) => (
          <button key={c} onClick={() => { setColor(c); setTool("pen"); }} aria-label={"pen " + c}
            className="w-6 h-6 rounded-full" style={{ background: c, border: (tool === "pen" && color === c) ? "3px solid #C9CDD3" : "2px solid #3A3F45" }} />
        ))}
        <button onClick={() => setTool("eraser")} className="px-2 py-1 rounded text-xs font-bold"
          style={{ background: tool === "eraser" ? "#3E9B5F" : "#1C2026", color: tool === "eraser" ? "#0E1410" : "#C9CDD3", border: "1px solid #3A3F45" }}>eraser</button>
        <button onClick={clear} className="px-2 py-1 rounded text-xs font-bold ml-auto" style={{ background: "#1C2026", color: "#F8B4B4", border: "1px solid #3A3F45" }}>clear</button>
      </div>
      <canvas ref={canvasRef}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} onPointerCancel={up}
        className="w-full rounded-lg block"
        style={{ touchAction: "none", background: "#0E1114", border: "2px dashed #3A3F45", cursor: "crosshair" }} />
      <div className="text-xs text-gray-500 mt-1">✍️ Write your working here with a stylus, finger, or mouse. Apple Pencil gets pressure-sensitive lines. (Clears when you close the pad.)</div>
    </div>
  );
}
function ScribbleToggle() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3">
      <button onClick={() => setOpen((o) => !o)}
        className="px-3 py-1.5 rounded text-sm font-bold border" style={{ borderColor: "#9CA3AF", color: "#C9CDD3" }}>
        {open ? "Hide scribble pad" : "✏️ Scribble pad"}
      </button>
      {open && <Scribble />}
    </div>
  );
}
// ── Exam Room — real past papers, self-marked ────────────────
function StepList({ steps, ans }) {
  return (
    <div className="mt-3 space-y-2">
      {steps.map((s, j) => (
        <div key={j} className="rounded-lg p-3 border-l-4" style={{ background: "#1E2A22", borderColor: "#3E9B5F" }}>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0" style={{ background: "#3E9B5F", color: "#0E1410" }}>{j + 1}</span>
            <span className="font-bold text-sm" style={{ color: "#F4F4F2" }}>{s.do}</span>
          </div>
          {s.math && <div className="font-mono text-sm text-center my-2 px-2 py-2 rounded leading-relaxed" style={{ background: "#15181C", color: "#FFD23F" }}>{s.math}</div>}
          {s.why && <p className="text-sm leading-relaxed mt-1" style={{ color: "#A8B0B8" }}>{s.why}</p>}
        </div>
      ))}
      {ans && <div className="rounded-lg p-3 text-center font-bold" style={{ background: "#23331F", color: "#7BD89B" }}>✔ {ans}</div>}
    </div>
  );
}
function ExamRoom({ examMarks, setExamMarks, setXp }) {
  const [paper, setPaper] = useState("2020");
  const [reveal, setReveal] = useState({});
  const ex = EXAMS[paper];
  const totalAvail = ex.questions.reduce((a, Q) => a + Q.parts.reduce((b, p) => b + p.marks, 0), 0);
  const myScore = ex.questions.reduce((a, Q) => a + Q.parts.reduce((b, p) => {
    const m = examMarks[paper + "-" + p.label];
    return b + (typeof m === "number" ? m : 0);
  }, 0), 0);
  const pct = totalAvail ? Math.round((myScore / totalAvail) * 100) : 0;
  const band = pct >= 85 ? "HD" : pct >= 75 ? "D" : pct >= 65 ? "C" : pct >= 50 ? "Pass" : "Below pass";
  const bandColor = pct >= 85 ? "#FFD23F" : pct >= 65 ? "#3E9B5F" : pct >= 50 ? "#FF8A00" : "#F8B4B4";
  return (
    <div>
      <div className="rounded-lg p-3 mb-4 text-sm border-l-4" style={{ background: "#1C2026", borderColor: "#FF8A00", color: "#C9CDD3" }}>
        Real past papers. Work each part <span className="font-bold" style={{ color: "#FFD23F" }}>on paper first</span>, reveal the worked solution, then mark yourself honestly. Your self-marks tally into a mock exam score below. {ex.note}
      </div>
      <div className="flex gap-2 mb-4">
        {Object.keys(EXAMS).map((yr) => (
          <button key={yr} onClick={() => { setPaper(yr); setReveal({}); }}
            className="px-4 py-2 rounded font-bold text-sm"
            style={{ background: paper === yr ? "#FF8A00" : "#1C2026", color: paper === yr ? "#15181C" : "#C9CDD3", border: "1px solid #3A3F45" }}>
            {yr} paper
          </button>
        ))}
      </div>
      {/* live score */}
      <div className="rounded-lg border-2 p-4 mb-4" style={{ background: "#1C2026", borderColor: bandColor }}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs font-mono tracking-widest text-gray-400">MOCK SCORE ({paper})</div>
            <div className="text-3xl font-black" style={{ color: bandColor }}>{myScore}<span className="text-lg text-gray-500"> / {totalAvail}</span></div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black" style={{ color: bandColor }}>{band}</div>
            <div className="text-xs text-gray-400">{pct}% · pass 50% · HD 85%</div>
          </div>
        </div>
        <div className="mt-3 h-3 rounded-full overflow-hidden relative" style={{ background: "#15181C" }}>
          <div className="h-full" style={{ width: pct + "%", background: bandColor }} />
        </div>
        <div className="text-xs text-gray-500 mt-1">Note: the original 2020 paper carried a few bonus marks; we show the parts most likely to repeat. Treat 85%+ here as HD-ready.</div>
      </div>
      <div className="space-y-5">
        {ex.questions.map((Q) => (
          <div key={Q.n} className="rounded-lg border-2 overflow-hidden" style={{ background: "#1C2026", borderColor: "#3A3F45" }}>
            <div className="px-4 py-3 flex items-center justify-between" style={{ background: "#23272E" }}>
              <div className="font-black" style={{ color: "#FF8A00" }}>Question {Q.n}</div>
              <div className="text-xs font-mono text-gray-400">{Q.title} · {Q.marks} marks</div>
            </div>
            <div className="p-4 space-y-4">
              {Q.parts.map((p) => {
                const k = paper + "-" + p.label;
                const r = reveal[k];
                const mine = examMarks[k];
                const eviz = (paper === "2024" && p.label === "3(c)") ? "3(c)-24"
                  : (paper === "2024" && p.label === "2(c)") ? "2c-24"
                  : (paper === "2020" && p.label === "3(c)") ? "3(c)"
                  : (paper === "2020" && p.label === "2(f)") ? "2f" : null;
                return (
                  <div key={p.label} className="rounded-lg border p-3" style={{ borderColor: typeof mine === "number" ? "#3E9B5F" : "#3A3F45", background: "#15181C" }}>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold" style={{ color: "#FFD23F" }}>{p.label}</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: "#3A3F45", color: "#C9CDD3" }}>{p.marks} marks · {p.topic}</span>
                    </div>
                    <p className="text-gray-100 mt-2">{p.q}</p>
                    {eviz && EVIZ[eviz] && EVIZ[eviz]()}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button onClick={() => setReveal({ ...reveal, [k]: !r })}
                        className="px-3 py-1.5 rounded text-sm font-bold border" style={{ borderColor: "#3E9B5F", color: "#7BD89B" }}>
                        {r ? "Hide worked solution" : "Show worked solution"}
                      </button>
                    </div>
                    {r && <StepList steps={p.steps} ans={p.ans} />}
                    <ScribbleToggle />
                    {/* self-mark */}
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-400 font-mono">Mark yourself:</span>
                      {Array.from({ length: p.marks + 1 }, (_, m) => (
                        <button key={m} onClick={() => {
                          const prev = typeof mine === "number" ? mine : 0;
                          setExamMarks({ ...examMarks, [k]: m });
                          if (m > prev) setXp((x) => x + (m - prev) * 40);
                        }}
                          className="w-8 h-8 rounded font-mono font-bold text-sm"
                          style={{ background: mine === m ? "#3E9B5F" : "#1C2026", color: mine === m ? "#0E1410" : "#9CA3AF", border: "1px solid #3A3F45" }}>
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
// ── Which Method? decision guide ─────────────────────────────
function MethodGuide() {
  const [search, setSearch] = useState("");
  const list = METHODS.filter((m) => (m.area + m.cue + m.method).toLowerCase().includes(search.toLowerCase()));
  const groups = [...new Set(list.map((m) => m.area))];
  return (
    <div>
      <div className="rounded-lg p-3 mb-4 text-sm border-l-4" style={{ background: "#1C2026", borderColor: "#FFD23F", color: "#C9CDD3" }}>
        Your <span className="font-bold" style={{ color: "#FFD23F" }}>"what do I actually DO?"</span> system. Read the cue, match it to your question, follow the method. This is the fastest way to stop freezing at the start of a question.
      </div>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search a cue… e.g. domain, tangent, area, dot product"
        className="w-full p-3 rounded-lg text-gray-100 mb-4" style={{ background: "#1C2026", border: "2px solid #3A3F45" }} />
      {groups.map((g) => (
        <div key={g} className="mb-4">
          <div className="text-xs font-mono tracking-widest mb-2" style={{ color: "#FF8A00" }}>{g.toUpperCase()}</div>
          <div className="space-y-2">
            {list.filter((m) => m.area === g).map((m, i) => {
              const idx = METHODS.indexOf(m);
              return (
              <div key={i} className="rounded-lg border-2 p-3" style={{ background: "#1C2026", borderColor: "#3A3F45" }}>
                <div className="text-sm font-bold" style={{ color: "#FFD23F" }}>If you see: <span style={{ color: "#F4F4F2" }}>{m.cue}</span></div>
                {MVIZ[idx] && <div className="rounded-lg mt-2 p-1" style={{ background: "#15181C", border: "1px solid #2A2F36" }}>{MVIZ[idx]()}</div>}
                <div className="text-sm mt-2 flex gap-2"><span style={{ color: "#3E9B5F" }} className="font-bold shrink-0">→ do:</span><span className="text-gray-300">{m.method}</span></div>
                <div className="text-xs mt-1.5" style={{ color: "#FF8A00" }}>⚠ {m.trap}</div>
              </div>
              );
            })}
          </div>
        </div>
      ))}
      {list.length === 0 && <p className="text-gray-500 text-center py-8">No cue matches that search.</p>}
    </div>
  );
}
// ── Question Bank — REAL questions from the tutorial PDFs ───
function QuestionBank({ qdone, setQdone, setXp }) {
  const [week, setWeek] = useState(1);
  const [reveal, setReveal] = useState({});
  const [showDecoder, setShowDecoder] = useState(false);
  const qs = QBANK[week] || [];
  const loadedWeeks = Object.keys(QBANK).map(Number);
  return (
    <div>
      <div className="rounded-lg p-3 mb-4 text-sm border-l-4" style={{ background: "#1C2026", borderColor: "#FFD23F", color: "#C9CDD3" }}>
        These are the <span className="font-bold" style={{ color: "#FFD23F" }}>actual tutorial questions</span> from your course PDFs. Every working assumes zero memory of algebra — each step says what to do AND why. Weeks {loadedWeeks.join(" & ")} are loaded here; the <span className="font-bold" style={{ color: "#FFD23F" }}>Exam Room</span> now covers the calculus &amp; vectors content too.
      </div>
      <div className="rounded-lg border-2 mb-4 overflow-hidden" style={{ background: "#1C2026", borderColor: "#3A3F45" }}>
        <button onClick={() => setShowDecoder(!showDecoder)} className="w-full text-left p-3 flex items-center justify-between">
          <span className="font-bold text-sm" style={{ color: "#FF8A00" }}>🔑 Symbols Decoder — tap if any squiggle confuses you</span>
          <span className="font-bold" style={{ color: "#3A3F45" }}>{showDecoder ? "−" : "+"}</span>
        </button>
        {showDecoder && (
          <div className="px-3 pb-3 space-y-2">
            {DECODER.map(([sym, meaning], i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="font-mono font-bold w-20 shrink-0" style={{ color: "#FFD23F" }}>{sym}</span>
                <span className="text-gray-300">{meaning}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {WEEKS.map((w) => (
          <button key={w.n} onClick={() => { setWeek(w.n); setReveal({}); }}
            disabled={!QBANK[w.n]}
            className="px-3 py-1.5 rounded font-mono font-bold text-sm shrink-0"
            style={{
              background: week === w.n ? "#FF8A00" : "#1C2026",
              color: week === w.n ? "#15181C" : QBANK[w.n] ? "#C9CDD3" : "#4B5563",
              border: "1px solid #3A3F45",
              opacity: QBANK[w.n] ? 1 : 0.5,
            }}>
            W{w.n}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {qs.map((item, i) => {
          const key = `${week}-${i}`;
          const r = reveal[i];
          return (
            <div key={i} className="rounded-lg border-2 p-4" style={{ background: "#1C2026", borderColor: qdone[key] ? "#3E9B5F" : "#3A3F45" }}>
              <div className="text-xs font-mono mb-2" style={{ color: "#FF8A00" }}>{item.src}</div>
              <p className="font-bold text-gray-100">{item.q}</p>
              {QVIZ[item.src] && QVIZ[item.src]()}
              <p className="text-sm mt-2 italic" style={{ color: "#9CA3AF" }}>{item.hook}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <button onClick={() => setReveal({ ...reveal, [i]: r === "hint" ? null : "hint" })}
                  className="px-3 py-1.5 rounded text-sm font-bold border" style={{ borderColor: "#FFD23F", color: "#FFD23F" }}>
                  {r === "hint" ? "Hide hint" : "Hint"}
                </button>
                <button onClick={() => setReveal({ ...reveal, [i]: r === "full" ? null : "full" })}
                  className="px-3 py-1.5 rounded text-sm font-bold border" style={{ borderColor: "#3E9B5F", color: "#7BD89B" }}>
                  {r === "full" ? "Hide working" : "Show full working"}
                </button>
                <button onClick={() => { const nv = !qdone[key]; setQdone({ ...qdone, [key]: nv }); if (nv) setXp((x) => x + 150); }}
                  className="px-3 py-1.5 rounded text-sm font-bold"
                  style={{ background: qdone[key] ? "#3A3F45" : "#3E9B5F", color: qdone[key] ? "#C9CDD3" : "#0E1410" }}>
                  {qdone[key] ? "Undo" : "I nailed it (+150 t)"}
                </button>
              </div>
              {r === "hint" && <p className="mt-3 text-sm p-3 rounded" style={{ background: "#2E2A18", color: "#FFD23F" }}>{item.hint}</p>}
              {r === "full" && <StepList steps={item.steps} ans={item.ans} />}
              <ScribbleToggle />
            </div>
          );
        })}
      </div>
    </div>
  );
}
// ── Algebra Survival Kit ─────────────────────────────────────
function AlgebraKit() {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <div className="rounded-lg p-3 mb-4 text-sm border-l-4" style={{ background: "#1C2026", borderColor: "#FF8A00", color: "#C9CDD3" }}>
        Your safety net. Did algebra two years ago and it's gone fuzzy? Every rule here is shown through a site or fairway scenario first. Flick back here any time a question trips you up mid-week.
      </div>
      <div className="space-y-3">
        {ALGEBRA.map((a, i) => (
          <div key={i} className="rounded-lg border-2 overflow-hidden" style={{ background: "#1C2026", borderColor: "#3A3F45" }}>
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full text-left p-4 flex items-center justify-between gap-3">
              <div>
                <div className="font-bold" style={{ color: "#FFD23F" }}>{a.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{a.rule}</div>
              </div>
              <span className="text-xl font-bold shrink-0" style={{ color: "#3A3F45" }}>{open === i ? "−" : "+"}</span>
            </button>
            {open === i && (
              <div className="px-4 pb-4 space-y-3">
                <div className="font-mono text-lg p-3 rounded text-center" style={{ background: "#15181C", color: "#F4F4F2" }}>{a.f}</div>
                <p className="text-sm text-gray-300">{a.story}</p>
                <p className="text-xs" style={{ color: "#FF8A00" }}>⚠ Common trap: {a.trap}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
// ── Practice Range — offline, draws from the verified pool ───
function Practice({ setXp }) {
  const [item, setItem] = useState(null);
  const [show, setShow] = useState({ hint: false, full: false });
  const [filter, setFilter] = useState("all");
  const filters = [["all", "Everything"], ["Tutorial", "⛏️ Tutorials"], ["Exam 2020", "📄 2020"], ["Exam 2024", "📄 2024"]];
  const draw = () => {
    const sub = filter === "all" ? POOL : POOL.filter((p) => p.tag === filter);
    const pick = sub[Math.floor(Math.random() * sub.length)];
    setItem(pick); setShow({ hint: false, full: false });
  };
  return (
    <div>
      <div className="rounded-lg p-3 mb-4 text-sm border-l-4" style={{ background: "#1C2026", borderColor: "#FFD23F", color: "#C9CDD3" }}>
        Random-fire practice from your <span className="font-bold" style={{ color: "#FFD23F" }}>verified question pool</span> ({POOL.length} questions). Pull one, try it on paper, then reveal. Works fully offline — no internet needed.
      </div>
      <div className="flex gap-2 mb-3 flex-wrap">
        {filters.map(([k, label]) => (
          <button key={k} onClick={() => setFilter(k)} className="px-3 py-1.5 rounded text-sm font-bold"
            style={{ background: filter === k ? "#FF8A00" : "#1C2026", color: filter === k ? "#15181C" : "#9CA3AF", border: "1px solid #3A3F45" }}>
            {label}
          </button>
        ))}
      </div>
      <button onClick={draw} className="w-full py-3 rounded font-black text-black mb-4" style={{ background: "#FFD23F" }}>
        {item ? "Pull another question" : "Pull a question"}
      </button>
      {item && (
        <div className="rounded-lg border-2 p-4 space-y-3" style={{ background: "#1C2026", borderColor: "#FF8A00" }}>
          <div className="text-xs font-mono" style={{ color: "#FF8A00" }}>{item.tag} · {item.topic}</div>
          <p className="text-gray-100 font-bold">{item.q}</p>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setShow((s) => ({ ...s, hint: !s.hint }))} className="px-3 py-1.5 rounded text-sm font-bold border" style={{ borderColor: "#FFD23F", color: "#FFD23F" }}>
              {show.hint ? "Hide hint" : "Hint"}
            </button>
            <button onClick={() => { setShow((s) => ({ ...s, full: !s.full })); if (!show.full) setXp((x) => x + 100); }}
              className="px-3 py-1.5 rounded text-sm font-bold border" style={{ borderColor: "#3E9B5F", color: "#7BD89B" }}>
              {show.full ? "Hide working" : "Reveal working (+100 t)"}
            </button>
          </div>
          {show.hint && <p className="text-sm p-3 rounded" style={{ background: "#2E2A18", color: "#FFD23F" }}>{item.hint}</p>}
          {show.full && <StepList steps={item.steps} ans={item.ans} />}
        </div>
      )}
    </div>
  );
}
// ── Formula cards ────────────────────────────────────────────
const FORMULAS = [
  { name: "Gradient (slope)", f: "m = (y₂ − y₁) / (x₂ − x₁)", week: 2, use: "Slope of a line between two points — like haul road grade.", trap: "Subtracting coordinates in different orders top and bottom." },
  { name: "Line equation", f: "y = mx + c   ·   y − y₁ = m(x − x₁)", week: 2, use: "Any straight line. Point-slope form is gold for tangents/normals.", trap: "Mixing up m (rate) and c (start point)." },
  { name: "Quadratic formula", f: "x = (−b ± √(b² − 4ac)) / 2a", week: 2, use: "Solving ax² + bx + c = 0 — e.g. where the ball lands.", trap: "Dropping the ± or the minus on b." },
  { name: "Vertex form", f: "y = a(x − h)² + k,  vertex (h, k)", week: 2, use: "Building a quadratic when you're GIVEN the vertex (exam Q1b).", trap: "Forgetting to use a second point to pin down a." },
  { name: "Vertex location", f: "x = −b / 2a", week: 2, use: "Peak/valley of a parabola from standard form.", trap: "Forgetting to sub x back in to get the y value." },
  { name: "Compound / growth", f: "A = P(1 + r)ᵗ", week: 3, use: "Compound interest, population. Two data points → divide to find r.", trap: "Amount = principal + interest. Don't use interest alone." },
  { name: "Exponential growth/decay", f: "A = A₀ eᵏᵗ", week: 3, use: "k > 0 grows, k < 0 decays. Continuous models.", trap: "Sign of k — decay needs a negative k." },
  { name: "Log laws", f: "log(ab) = log a + log b   ·   log(aⁿ) = n log a", week: 3, use: "Bringing t down from an exponent to solve for time.", trap: "log(a + b) is NOT log a + log b." },
  { name: "Change of base", f: "log_b(x) = ln x / ln b", week: 3, use: "Calculator only has ln and log₁₀ — convert anything else.", trap: "Flipping the fraction." },
  { name: "Key trig identities", f: "sin²x + cos²x = 1 · cos2x = cos²x − sin²x", week: 4, use: "Reducing a trig equation to ONE function so you can factor it.", trap: "Forgetting cos2x has THREE common forms." },
  { name: "SOH CAH TOA", f: "sin = O/H, cos = A/H, tan = O/A", week: 4, use: "Right-triangle sides and angles — ramp angles, launch angles.", trap: "Calculator in radians when you wanted degrees." },
  { name: "Cosine rule", f: "a² = b² + c² − 2bc·cos A", week: 4, use: "Non-right triangles with two sides + included angle.", trap: "Forgetting the −2bc·cosA term (it's not Pythagoras)." },
  { name: "Standard limit", f: "limₓ→₀ sin(ax)/(ax) = 1", week: 5, use: "Limits of trig ratios as x → 0 (exam Q2a).", trap: "Only true as the angle → 0." },
  { name: "Derivative — power rule", f: "d/dx(xⁿ) = n·xⁿ⁻¹", week: 5, use: "Differentiating any polynomial term. Bring power down, drop by 1.", trap: "Forgetting constants vanish: d/dx(7) = 0." },
  { name: "Chain rule", f: "dy/dx = dy/du · du/dx", week: 6, use: "Function inside a function — e.g. sin(x²), e^(2x).", trap: "Forgetting to multiply by the inside derivative." },
  { name: "Product rule", f: "(uv)′ = u′v + uv′", week: 6, use: "Two functions multiplied together.", trap: "Writing u′v′ — wrong, it's a sum of two terms." },
  { name: "Quotient rule", f: "(u/v)′ = (u′v − uv′) / v²", week: 6, use: "One function divided by another.", trap: "Order matters on top: u′v first, then minus uv′." },
  { name: "Tangent & normal", f: "tangent slope = y′ · normal = −1/y′", week: 6, use: "Lines touching/perpendicular to a curve at a point (exam Q2b).", trap: "Using the function instead of its derivative for the slope." },
  { name: "Critical points", f: "f′(x) = 0, classify with f′′", week: 7, use: "Peaks/valleys. f′′ > 0 min, f′′ < 0 max.", trap: "Keeping extraneous roots after squaring; forgetting to classify." },
  { name: "Power rule for integration", f: "∫xⁿ dx = xⁿ⁺¹/(n+1) + C", week: 8, use: "Reverse of the derivative power rule.", trap: "Forgetting + C; 1/x integrates to ln|x|, not via this rule." },
  { name: "Definite integral", f: "∫ₐᵇ f(x) dx = F(b) − F(a)", week: 9, use: "Area under a curve; total tonnes/distance.", trap: "Subtracting in the wrong order: top limit minus bottom." },
  { name: "Area between curves", f: "A = ∫ₐᵇ (top − bottom) dx", week: 9, use: "Region between two curves (exam Q3c). Limits = intersections.", trap: "Wrong order gives negative area — test a midpoint for 'top'." },
  { name: "Kinematics", f: "v = ∫a dt,   s = ∫v dt", week: 9, use: "Distance from acceleration — integrate twice, use given conditions.", trap: "Forgetting + C at each stage." },
  { name: "Vector magnitude", f: "|v| = √(x² + y²)", week: 10, use: "Length of a vector — total force size.", trap: "Forgetting the square root at the end." },
  { name: "Dot product", f: "a · b = |a||b| cos θ", week: 10, use: "Angle between vectors; work done. Gives a NUMBER.", trap: "Confusing it with cross product (which uses sin)." },
  { name: "Cross product (2D)", f: "a × b = (aₓb_y − a_ybₓ) k", week: 10, use: "Perpendicular vector / area. Uses |a||b|sinθ. Gives a VECTOR.", trap: "Reporting it as a scalar." },
  { name: "Inclined plane", f: "along: W sinθ · normal: W cosθ", week: 10, use: "Forces on a slope; static friction = W sinθ.", trap: "Swapping sin and cos." },
  { name: "Complex modulus", f: "|z| = √(a² + b²)", week: 11, use: "Size of z = a + bi.", trap: "Including i inside the root — only a and b." },
  { name: "Complex polar/exp form", f: "z = r∠θ = r e^{iθ}", week: 11, use: "Converting for easy multiply/divide and powers.", trap: "Angle in wrong mode (degrees vs radians)." },
  { name: "Complex division", f: "multiply top & bottom by conjugate", week: 11, use: "Dividing complex numbers into a + bi form.", trap: "Forgetting i² = −1 when expanding." },
  { name: "2×2 determinant", f: "det = ad − bc", week: 12, use: "Whether a system has a unique solution.", trap: "Doing ad + bc — it's a MINUS." },
];
function Formulas() {
  const [search, setSearch] = useState("");
  const list = FORMULAS.filter((f) => (f.name + f.f + f.use).toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search formulas… e.g. quadratic, tangent, area, dot"
        className="w-full p-3 rounded-lg text-gray-100 mb-4" style={{ background: "#1C2026", border: "2px solid #3A3F45" }} />
      <div className="grid gap-3 sm:grid-cols-2">
        {list.map((f, i) => (
          <div key={i} className="rounded-lg border-2 p-4" style={{ background: "#1C2026", borderColor: "#3A3F45" }}>
            <div className="flex justify-between items-start">
              <div className="font-bold text-sm" style={{ color: "#FFD23F" }}>{f.name}</div>
              <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: "#3A3F45", color: "#C9CDD3" }}>W{f.week}</span>
            </div>
            <div className="font-mono text-base my-2" style={{ color: "#F4F4F2" }}>{f.f}</div>
            <p className="text-xs text-gray-400">{f.use}</p>
            <p className="text-xs mt-2" style={{ color: "#FF8A00" }}>⚠ {f.trap}</p>
          </div>
        ))}
      </div>
      {list.length === 0 && <p className="text-gray-500 text-center py-8">No formulas match that search.</p>}
    </div>
  );
}
// ── Scorecard ────────────────────────────────────────────────
function Progress({ done, xp, streak, qdone, examMarks }) {
  const completed = Object.values(done).filter(Boolean).length;
  const nailed = Object.values(qdone).filter(Boolean).length;
  const pct = Math.round((completed / 12) * 100);
  // best mock exam % across papers
  const best = Object.entries(EXAMS).map(([yr, ex]) => {
    const avail = ex.questions.reduce((a, Q) => a + Q.parts.reduce((b, p) => b + p.marks, 0), 0);
    const got = ex.questions.reduce((a, Q) => a + Q.parts.reduce((b, p) => {
      const m = examMarks[yr + "-" + p.label]; return b + (typeof m === "number" ? m : 0);
    }, 0), 0);
    return avail ? Math.round((got / avail) * 100) : 0;
  });
  const bestMock = best.length ? Math.max(...best) : 0;
  return (
    <div className="space-y-4">
      <div className="rounded-lg border-2 p-5" style={{ background: "#1C2026", borderColor: "#3A3F45" }}>
        <div className="text-xs font-mono tracking-widest text-gray-400">UNIT SCORECARD</div>
        <div className="flex flex-wrap items-end gap-6 mt-2">
          <div><div className="text-4xl font-black" style={{ color: "#FF8A00" }}>{completed}<span className="text-xl text-gray-500">/12</span></div><div className="text-xs text-gray-400">weeks done</div></div>
          <div><div className="text-4xl font-black" style={{ color: "#FFD23F" }}>{xp.toLocaleString()}</div><div className="text-xs text-gray-400">tonnes hauled</div></div>
          <div><div className="text-4xl font-black" style={{ color: "#3E9B5F" }}>{streak}</div><div className="text-xs text-gray-400">day streak</div></div>
          <div><div className="text-4xl font-black" style={{ color: "#C9CDD3" }}>{nailed}</div><div className="text-xs text-gray-400">questions nailed</div></div>
        </div>
        <div className="mt-4 h-4 rounded-full overflow-hidden" style={{ background: "#15181C" }}>
          <div className="h-full transition-all" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #FF8A00, #FFD23F)" }} />
        </div>
        <div className="text-xs font-mono text-gray-400 mt-1">{pct}% of the pit excavated</div>
      </div>
      <div className="rounded-lg border-2 p-4" style={{ background: "#1C2026", borderColor: bestMock >= 85 ? "#FFD23F" : "#3A3F45" }}>
        <div className="text-xs font-mono tracking-widest text-gray-400">BEST MOCK EXAM</div>
        <div className="flex items-end justify-between mt-1">
          <div className="text-4xl font-black" style={{ color: bestMock >= 85 ? "#FFD23F" : bestMock >= 50 ? "#3E9B5F" : "#9CA3AF" }}>{bestMock}%</div>
          <div className="text-sm font-bold" style={{ color: bestMock >= 85 ? "#FFD23F" : "#9CA3AF" }}>
            {bestMock >= 85 ? "HD-ready 🏆" : bestMock >= 50 ? "Passing — push for 85%" : "Sit a paper in the Exam Room"}
          </div>
        </div>
        <div className="mt-3 h-3 rounded-full overflow-hidden relative" style={{ background: "#15181C" }}>
          <div className="h-full" style={{ width: bestMock + "%", background: bestMock >= 85 ? "#FFD23F" : "#3E9B5F" }} />
          <div style={{ position: "absolute", left: "85%", top: 0, bottom: 0, width: 2, background: "#FFD23F" }} />
        </div>
        <div className="text-xs text-gray-500 mt-1">Yellow line = HD (85%). Pass = 50%.</div>
      </div>
      <div className="rounded-lg border-2 p-4" style={{ background: "#1C2026", borderColor: "#3A3F45" }}>
        <div className="text-xs font-mono tracking-widest text-gray-400 mb-3">HOLE BY HOLE</div>
        <div className="grid grid-cols-6 gap-2">
          {WEEKS.map((w) => (
            <div key={w.n} className="rounded p-2 text-center font-mono font-bold"
              style={{ background: done[w.n] ? "#3E9B5F" : "#15181C", color: done[w.n] ? "#0E1410" : "#6B7280", border: "1px solid #3A3F45" }}>
              {w.n}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">Green = week complete. Exam pass rule: at least 50% on the final exam itself (20/40), and 50% overall combined with assignments.</p>
      </div>
    </div>
  );
}
