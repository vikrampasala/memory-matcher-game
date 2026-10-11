# 🧠 Memory Matcher

**Memory Matcher** is a responsive, browser-based card-matching puzzle game engineered with vanilla web technologies. It features a modern dark-themed dashboard UI, progressive grid difficulty presets, a combo-multiplier scoring engine, dynamic time-extension rewards, native synthesized audio effects, and persistent high-score tracking.

---

## ✨ Features

* **Dynamic Rectangular Grid Scales:** Automatically rebuilds and shifts the card matrix layout based on selection:
  * **Easy Mode:** 4 × 3 Grid Layout (12 Cards / 6 Matching Pairs) | 90-second limit
  * **Medium Mode:** 4 × 4 Grid Layout (16 Cards / 8 Matching Pairs) | 60-second limit
  * **Hard Mode:** 6 × 4 Grid Layout (24 Cards / 12 Matching Pairs) | 30-second limit (with downscaled card fonts for mobile viewports).
* **Intelligent Scoring & Combo Chains:** Incorporates a modular feedback loop. Sequential correct card matches activate a visual multiplier status (`.combo-active`) that accelerates your final point calculation (`Base Points (100) × Current Combo`).
* **Dynamic Time Extensions:** Every correct match awards bonus time based on difficulty (+5s on Easy, +3s on Medium, +2s on Hard) capped at your starting time limit, acting as a critical gameplay mechanic to keep the clock alive.
* **Native Web Audio Engine:** Synthesizes retro-style sound effect alerts directly in the browser via the native `AudioContext` API—no external assets required:
  * **Card Flip:** Light, percussive percussive pop (`triangle` wave).
  * **Successful Match:** Bright, short rising chord interval (`sine` wave).
  * **Victory Fanfare:** High triumphant rolling C-E-G chime triad.
  * **Game Over:** Deep, descending fail buzzer (`sawtooth` wave).
* **Live Performance HUD Panels:** Tracks crucial real-time game analytics including remaining time metrics, active combo scales, current session points, and overall move counts.
* **Multi-Stage UX Safety Modals:**
  * **Difficulty Guard:** Prevents accidental mid-game board wipes using an intercept warning overlay (`#confirm-overlay`).
  * **High Score Eraser:** Includes a fail-safe popup verification structure (`#clear-scores-btn`) that clears tracking arrays for **all difficulties** simultaneously.
* **Immersive Visual Engine:** Features flashing urgency prompts (`.time-warning`) during low-time boundaries (under 10s) and smooth cubic-bezier scaling animations (`@keyframes modalPopUp`) on overlays.

## 🛠️ Built With

* **HTML5:** Modular markup structuring for stats counters, card elements, and dialogue overlays.
* **CSS3 (`stylings.css`):** Powers deep linear-gradient shading, micro-interactions, responsive flex layout components, and keyframe animations.
* **JavaScript (`cards.js`):** Coordinates core matching state loops, custom modern Fisher-Yates array shuffling algorithms, browser `AudioContext` synthesis, and local browser storage retention (`localStorage`).

## 📦 Local Setup & Execution

Because the application relies exclusively on clean front-end code, it does not require node packaging tools, local servers, or system compilation steps.

1. Clone or download your repository:
   ```bash
   git clone https://github.com
   ```
2. Open the source project folder:
   ```bash
   cd memory-matcher
   ```
3. Run the entrypoint document directly inside your preferred web browser:
   ```bash
   # Windows Systems
   start index.html

   # macOS Systems
   open index.html
   ```

---

## 🎮 Interface Inputs & Mechanics

| Interaction Element | Input Type | Realized System Action |
| :--- | :--- | :--- |
| **Game Grid Cards** | `Left Click` | Flips face-down card tile; runs a physical compression animation (`0.95`). Starts the timer and audio engine context on first click. |
| **Difficulty Selectors** | `Left Click` | Sets difficulty environment; displays safety warning if currently mid-game. |
| **HUD Restart Key** | `Left Click` | Instantly resets matching parameters, shuffles cards, and reloads the clock. |
| **Reset Best Key** | `Left Click` | Calls down a high-priority browser alert prompt to securely delete all score history entries. |

### Structural Card State Colors
* **Face-Down State:** A dark gray-blue geometric tile (`#34495e` to `#2c3e50`) wrapped in a neon blue interactive border displaying `?`.
* **Flipped State:** Shifts to a bright, cleanly illuminated teal texture (`#1abc9c`) to reveal one of 12 master animal or creature emojis (`🦊`, `🐸`, `🐱`, `🦁`, `🦉`, `🦄`, `🐝`, `🦖`, `🐼`, `🦀`, `🐙`, `🦋`).
* **Matched State:** Transitions to an emerald green layout indicator (`#27ae60`), activates a glow, and permanently drops input detection (`pointer-events: none`).

### Score System Math
* **Base Match Reward:** `100 points × Current Combo Multiplier`
* **Mismatch Penalty:** Resets active combo multiplier back to `1`.
* **Victory Time Bonus:** `Remaining Seconds × 50 points`

---

## 📁 Repository Structure
```text
├── memories.html        # Central DOM tree, metrics widgets, and markup modal containers
├── stylings.css      # Core grid structures, theme profiles, and responsive animation paths
└── cards.js          # Core loop execution, sound synthesis, storage arrays, and matching algorithms
```
