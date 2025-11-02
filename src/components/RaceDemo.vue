<template>
  <div class="container">
    <div class="controls">
      <button
        @click="startRace"
        :disabled="raceState.running && !raceState.paused"
      >
        Start
      </button>
      <button @click="togglePause" :disabled="!raceState.running">
        {{ raceState.paused ? "Resume" : "Pause" }}
      </button>
    </div>

    <!-- TRACK -->
    <div class="track">
      <div class="finish-line"></div>

      <div v-for="horse in raceState.horses" class="lane">
        <div
          class="horse"
          :key="horse.id"
          :style="{
            left: (horse.position / currentRace.distance) * 100 + '%',
            background: `var(--${horse.color})`,
          }"
        >
          {{ horse.name }}
        </div>
      </div>
    </div>

    <!-- WINNER MESSAGE -->
    <div v-if="raceState.winner" class="winner">
      🏆 {{ raceState.winner.name }} wins Race {{ currentRace.id }}!
    </div>

    <!-- RESULTS -->
    <div v-if="raceState.finishedOrder.length > 0" class="results">
      <h4>🏁 Finishing Order</h4>
      <ol>
        <li v-for="(horse, index) in raceState.finishedOrder" :key="index">
          {{ index + 1 }}. {{ horse.name }}
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

// 🧠 State
const raceState = reactive({
  running: false,
  paused: false,
  horses: [],
  finishedOrder: [],
  winner: null,
  raceIndex: 0,
});

const currentRace = computed(() => store.state.races[raceState.raceIndex]);

let lastTime = null;
let animationFrameId = null;

// Clone horses so we don’t mutate store data directly
function loadHorsesForCurrentRace() {
  const raceData = store.state.races[raceState.raceIndex];
  raceState.horses = raceData.horses.map((h) => ({
    ...h,
    position: 0,
    finished: false,
  }));
}

function simulateRace(timestamp) {
  if (!raceState.running || raceState.paused) return;
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  raceState.horses.forEach((horse) => {
    if (horse.finished) return;
    const luck = Math.random() * 100; // 0-100
    const equaller = 15 + horse.condition / 10;
    const effectiveCondition = equaller * 0.4 + luck * 0.6;

    // Increase speed multiplier
    let distanceCovered = effectiveCondition * 1.2 * (delta / 1000); // was 0.05

    // Occasional speed burst
    if (Math.random() < 0.1) {
      distanceCovered *= 3;
    }

    horse.position += distanceCovered;

    if (horse.position >= currentRace.value.distance) {
      horse.position = currentRace.value.distance;
      horse.finished = true;
      raceState.finishedOrder.push(horse);

      // If 5 finished, complete the last one automatically
      if (raceState.finishedOrder.length === raceState.horses.length - 1) {
        const lastHorse = raceState.horses.find((h) => !h.finished);
        if (lastHorse) {
          lastHorse.finished = true;
          lastHorse.position = currentRace.value.distance;
          raceState.finishedOrder.push(lastHorse);
        }
      }

      // All finished → show results
      if (raceState.finishedOrder.length === raceState.horses.length) {
        raceState.winner = raceState.finishedOrder[0];
        raceState.running = false;
        cancelAnimationFrame(animationFrameId);
        showWinnerAndProceed();
      }
    }
  });

  if (raceState.running) animationFrameId = requestAnimationFrame(simulateRace);
}

function startRace() {
  if (raceState.running) return;
  if (!currentRace.value) return;

  loadHorsesForCurrentRace();
  raceState.running = true;
  raceState.paused = false;
  raceState.finishedOrder = [];
  raceState.winner = null;
  lastTime = null;

  animationFrameId = requestAnimationFrame(simulateRace);
}

function togglePause() {
  raceState.paused = !raceState.paused;
  if (!raceState.paused) {
    lastTime = null;
    animationFrameId = requestAnimationFrame(simulateRace);
  }
}

function showWinnerAndProceed() {
  if (raceState.raceIndex < store.state.races.length - 1) {
    setTimeout(() => {
      raceState.raceIndex++;
      startRace();
    }, 3000);
  } else {
    console.log("🏁 All races finished!");
  }
}
</script>

<style scoped>
.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 10px;
}

.controls {
  display: flex;
  gap: 10px;
}

.track {
  position: relative;
  width: 100%;
  height: 600px;
  background: #e0e0e0;
  border: 2px solid #333;
  overflow: hidden;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.lane {
  position: relative;
  height: 10%;
}
.finish-line {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  background: repeating-linear-gradient(
    45deg,
    white,
    white 5px,
    black 5px,
    black 10px
  );
}

.horse {
  position: absolute;
  height: 80%;
  width: 80px;
  color: white;
  text-align: center;
  font-size: 12px;
  line-height: 20px;
  border-radius: 4px;
  transition: left 0.1s linear;
}

.winner {
  font-weight: bold;
  font-size: 18px;
  color: gold;
  margin-top: 10px;
  text-shadow: 1px 1px 2px black;
}

.results {
  text-align: left;
  width: 100%;
}

.results ol {
  margin-top: 5px;
  padding-left: 20px;
}
</style>
