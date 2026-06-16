// Candidate data referenced from real Phase-1 Cooch Behar 2026 Candidates
const candidates = [
    { id: 1, name: "PARESH ADHIKARY", party: "All India Trinamool Congress (AITC)", logo: "aitc.png" }, // Add e.g. "logos/aitc.png"
    { id: 2, name: "DADHIRAM RAY", party: "Bharatiya Janata Party (BJP)", logo: "bjp.png" },          // Add e.g. "logos/bjp.png"
    { id: 3, name: "KAMAL ROY", party: "Communist Party of India (CPIM)", logo: "cpim.png" },           // Add e.g. "logos/aifb.png"
    { id: 4, name: "ILA RANI ROY", party: "Indian National Congress (INC)", logo: "inc.png" },       // Add e.g. "logos/inc.png"
    { id: 5, name: "NOTA", party: "None Of The Above", logo: "" }
];

// Operational states
let systemReadyToVote = false;
let totalVotesRegistered = 0;
let voteTallies = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

// DOM Elements
const ballotRowsHook = document.getElementById("ballot-rows-hook");
const cuDisplay = document.getElementById("cu-display");
const lightBusy = document.getElementById("light-busy");
const lightReady = document.getElementById("light-ready");
const buReadyLamp = document.getElementById("bu-ready-lamp");
const statTotalVotes = document.getElementById("stat-total-votes");
const btnBallot = document.getElementById("btn-ballot");
const btnResult = document.getElementById("btn-result");
const btnClear = document.getElementById("btn-clear");
const vvpatSlipContainer = document.getElementById("vvpat-slip-container");
const evmBeep = document.getElementById("evm-beep");
const ballotUnit = document.querySelector(".ballot-unit");

// Initialize Ballot Sheet Matrix
function renderBallotUnit() {
    ballotRowsHook.innerHTML = "";
    candidates.forEach((cand) => {
        const row = document.createElement("div");
        row.className = "ballot-row";
        row.setAttribute("data-cand-id", cand.id);

        // Frame the logo or alternative text inside predefined dimensions
        let logoHTML = `<span class="symbol-placeholder">${cand.party.split(' ').pop()}</span>`;
        if (cand.logo && cand.logo.trim() !== "") {
            logoHTML = `<img src="${cand.logo}" alt="${cand.party} Logo">`;
        }

        row.innerHTML = `
            <div class="col-num">${cand.id}</div>
            <div class="col-details">${cand.name}<span>${cand.party}</span></div>
            <div class="col-symbol">
                <div class="symbol-img-wrap">${logoHTML}</div>
            </div>
            <div class="col-action">
                <div class="bu-ready-led" id="led-cand-${cand.id}"></div>
                <button class="vote-trigger-btn" onclick="executeVote(${cand.id})"></button>
            </div>
        `;
        ballotRowsHook.appendChild(row);
    });
    // Set initial configuration to locked until polling officer taps BALLOT
    lockBallotUnit(true);
}

function lockBallotUnit(shouldLock) {
    if (shouldLock) {
        ballotUnit.classList.add("locked");
        buReadyLamp.classList.remove("lit");
    } else {
        ballotUnit.classList.remove("locked");
        buReadyLamp.classList.add("lit");
    }
}

// Polling officer interactions
btnBallot.addEventListener("click", () => {
    if (systemReadyToVote) {
        updateCUDisplay("ALREADY RDY");
        return;
    }
    systemReadyToVote = true;
    lightReady.classList.add("lit");
    lightBusy.classList.remove("lit");
    lockBallotUnit(false);
    updateCUDisplay("VOTE READY");
});

// Replace the entire old btnTotal listener with this:
btnResult.addEventListener("click", () => {
    if (systemReadyToVote) return; // Prevent viewing results while a ballot is active

    let delay = 0;

    // 1. Display the Grand Total first
    updateCUDisplay(`TOT - ${totalVotesRegistered}`);
    
    // 2. Cycle through each candidate's results one by one
    candidates.forEach((cand) => {
        delay += 2000; // 2 seconds spacing for each entry
        setTimeout(() => {
            // Extracts the last word of the party string (e.g., "AITC", "BJP")
            const partyCode = cand.party.split(' ').pop().replace(/[()]/g, '');
            const count = voteTallies[cand.id];
            updateCUDisplay(`${partyCode} - ${count}`);
        }, delay);
    });

    // 3. Reset the screen back to READY after the cycle completes
    setTimeout(() => {
        resetCUDisplayDefault();
    }, delay + 2000);
});

btnClear.addEventListener("click", () => {
    if (systemReadyToVote) return; // Prevent clear while ballot active
    totalVotesRegistered = 0;
    statTotalVotes.innerText = totalVotesRegistered;
    updateCUDisplay("CLOSED CLEARED");
    setTimeout(() => { resetCUDisplayDefault(); }, 2000);
});

// Voter interactions
function executeVote(candId) {
    if (!systemReadyToVote) return;
    
    systemReadyToVote = false; // Immediately lock down to avoid double execution
    lockBallotUnit(true);
    
    // UI state transitions matching original hardware behavior
    lightReady.classList.remove("lit");
    lightBusy.classList.add("lit");
    updateCUDisplay("VOTING...");

    // Light up the precise candidate red arrow LED indicator row
    const targetLed = document.getElementById(`led-cand-${candId}`);
    if (targetLed) targetLed.classList.add("active");

    const selectedCandidate = candidates.find(c => c.id === candId);
    
    // Trigger the physical VVPAT Slip system pipeline
    triggerVVPATPrint(selectedCandidate);

    // Audio beep scheduling and cleanup lifecycle
    setTimeout(() => {
        try {
            evmBeep.currentTime = 0;
            evmBeep.play();
        } catch (e) { console.log("Audio playback blocked natively by browser policies."); }
        
        totalVotesRegistered++;
        voteTallies[candId]++;
        statTotalVotes.innerText = totalVotesRegistered;
        updateCUDisplay("VOTE CAST");

        setTimeout(() => {
            if (targetLed) targetLed.classList.remove("active");
            lightBusy.classList.remove("lit");
            resetCUDisplayDefault();
        }, 2000);

    }, 3500); // Beep matches intermediate printing stage completion window
}

function triggerVVPATPrint(candidate) {
    // Inject metadata into slip fields before movement mechanics fire
    document.getElementById("slip-serial").innerText = `SL No: 0${candidate.id}`;
    document.getElementById("slip-name").innerText = candidate.name;
    
    const slipImg = document.getElementById("slip-symbol");
    const slipAlt = document.getElementById("slip-symbol-alt");

    if (candidate.logo && candidate.logo.trim() !== "") {
        slipImg.src = candidate.logo;
        slipImg.style.display = "block";
        slipAlt.style.display = "none";
    } else {
        slipImg.style.display = "none";
        slipAlt.style.display = "block";
        slipAlt.style.innerText = candidate.party.split(' ').pop();
    }

    // Force animation reset loop mechanism
    vvpatSlipContainer.classList.remove("print-drop");
    void vvpatSlipContainer.offsetWidth; // Force Reflow
    vvpatSlipContainer.classList.add("print-drop");
}

function updateCUDisplay(text) {
    cuDisplay.innerText = text;
}

function resetCUDisplayDefault() {
    cuDisplay.innerText = "READY";
}

// Fire startup sequence execution
renderBallotUnit();