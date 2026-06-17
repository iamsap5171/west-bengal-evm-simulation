# 🗳️ Indian EVM & VVPAT Web Simulation

A fully functional, hardware-accurate web simulation of the Indian Electronic Voting Machine (EVM) ecosystem. This project reverse-engineers the physical multi-unit workflow into a responsive browser experience using native front-end web technologies.

---

## 🚀 Live Demo

Check out the interactive live web application here: **[Insert Your Live Deployment Link Here]**

---

## 🛠️ System Architecture & Features

The application faithfully replicates the synchronized behavior of the three physical hardware components used in Indian elections, utilizing candidates from the **2026 West Bengal Assembly Elections (Cooch Behar)** for contextual data mapping.

### 1. Control Unit (CU) — Polling Officer Interface

* **Ballot Authorization:** Recreates the event-driven system lock. Pressing the `BALLOT` button unlocks the voting unit for a single, unique vote.
* **Real-time State Machine:** Monitors system states via digital screen display readouts (`READY`, `VOTE READY`, `VOTING...`, `VOTE CAST`) and synchronized hardware status LEDs (Busy/Ready).
* **Sequential Audit Tally:** Upgraded from a standard total display to a `RESULT` auditing cycle that loops sequentially through each individual party's live vote metrics upon verification.

### 2. Ballot Unit (BU) — Voter Interface

* **Dynamic Candidate Matrix:** Programmatically constructs ballot cards from data structures, eliminating rigid HTML tables.
* **Precision Image Framing:** Uses CSS boundaries (`50px` × `40px`) combined with `object-fit: contain` properties to cleanly auto-scale custom PNG party logos without disrupting card symmetry.
* **Double-Vote Prevention:** Rigid UI locking mechanisms ensure the voting triggers are completely unresponsive until explicitly authorized by the Control Unit.

### 3. VVPAT Unit (Voter Verifiable Paper Audit Trail)

* **Asynchronous Print Mechanics:** Uses hardware-accelerated CSS keyframe transitions to drop down a printed verification slip containing the serial number, candidate name, and party logo.
* **Audit Window Lifecycle:** The paper slip automatically remains static behind the glass window view for exactly 5 seconds before dropping down into a sealed virtual ballot compartment.
* **Audio Buzz Synchronization:** Plays a timed hardware warning chime natively aligned with the exact microsecond the printing cycle finishes and the vote registers.

---

## 📱 Mobile Responsiveness

The application includes a tailored CSS media break layout targeted at screen viewports under `768px`.

* **Fluid Flex-Direction Stacking:** Automatically converts the wide, multi-column layout of physical machinery into a vertical stack layout optimized for small screens.
* **Finger-Friendly Touch Scales:** Margins shrink and action targets expand into larger touch surfaces to prevent accidental input drift.

---

## 📁 Project Structure

```text
├── index.html       # Structural nodes for CU, BU, and VVPAT layout grids
├── style.css        # Skeuomorphic design styling, LED animations, and mobile media queries
├── script.js       # Core state engine, asynchronous VVPAT loops, and result arrays
└── README.md        # Documentation and implementation reference

```

---

## 📦 Local Installation & Setup

No compilers, local servers, or database dependencies are required. You can run this directly in any modern browser.

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/wb-evm-simulation.git
cd wb-evm-simulation

```


2. **Add Your Custom Graphics (Optional):**
Place your party PNG files into a project subdirectory and configure their paths within the `candidates` array structure inside `script.js`:
```javascript
{ id: 1, name: "PARESH ADHIKARY", party: "All India Trinamool Congress (AITC)", logo: "assets/aitc.png" }

```


3. **Launch the application:**
Simply double-click `index.html` or run it through a development tool extension like Visual Studio Code's *Live Server*.

---

## ⚖️ Disclaimer

This is a purely educational, front-end interface project built to study responsive UI layouts, skeuomorphic web design, and asynchronous state-handling inside JavaScript. It uses static mock datasets and is entirely unaffiliated with the Election Commission of India or any official political entity.
