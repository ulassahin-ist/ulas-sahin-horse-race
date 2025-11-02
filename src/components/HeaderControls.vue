<template>
  <div class="container">
    <div class="title">Horse Racing</div>

    <button
      :disabled="store.state.gameInProgress || raceState.running"
      @click="generateHorses"
      title="Generate Horses"
    >
      <Icon name="horse" size="26" />
    </button>

    <button
      :disabled="
        store.state.gameInProgress ||
        !store.state.horses.length ||
        raceState.running
      "
      @click="generateRaces"
      title="Generate Program"
    >
      <Icon name="program" size="26" />
    </button>

    <button
      :disabled="!store.state.races.length || !areHorsesSynced()"
      @click="handleRaceControl"
      title="Start / Pause / Resume"
    >
      <Icon :name="raceButtonIcon" size="26" />
    </button>

    <button
      :disabled="!store.state.horses.length && !store.state.races.length"
      @click="emit('resetAll')"
      title="Reset All"
    >
      <Icon name="reset" size="26" />
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import Icon from "./Icon.vue";

const emit = defineEmits([
  "initRace",
  "togglePause",
  "resetAll",
  "cancelCountdown",
]);

const store = useStore();
const raceState = computed(() => store.state.raceState);

const raceButtonIcon = computed(() => {
  const { running, paused, winner } = raceState.value;

  if (!store.state.gameInProgress) return "start";

  if (!running && !paused && !winner) return "start";

  if (running) return paused ? "resume" : "pause";

  return "start";
});
function handleRaceControl() {
  const { running } = raceState.value;
  const gameInProgress = store.state.gameInProgress;
  const currentIndex = store.state.raceState.raceIndex;
  const totalRaces = store.state.races.length;
  const resultsComplete =
    store.state.results.length === totalRaces && totalRaces > 0;
  if (!gameInProgress && resultsComplete) {
    store.commit("clearResults");
    store.commit("clearRuntime");
  }
  if (running) {
    emit("togglePause");
    return;
  }
  if (!gameInProgress && currentIndex === 0 && store.state.results.length) {
    emit("initRace");
    return;
  }
  if (gameInProgress && !running) {
    emit("cancelCountdown");
    store.commit("incrementRaceIndex");
    setTimeout(() => emit("initRace"), 50);
    return;
  }
  if (!gameInProgress) {
    emit("initRace");
  }
}

function areHorsesSynced() {
  const horses = store.state.horses;
  const raceHorses = store.state.races.flatMap((r) => r.horses);

  if (!horses.length || !raceHorses.length) return false;

  function isSameHorse(h1, h2) {
    return (
      h1.id === h2.id &&
      h1.name === h2.name &&
      h1.color === h2.color &&
      h1.condition === h2.condition
    );
  }

  return raceHorses.every((raceHorse) =>
    horses.some((mainHorse) => isSameHorse(mainHorse, raceHorse))
  );
}

function generateHorses() {
  store.dispatch("generateHorses");
}
function generateRaces() {
  store.dispatch("generateRaces");
}
</script>

<style scoped>
.container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px;
  gap: 10px;
  padding-right: 20px;
}
.title {
  margin-right: auto;
  font-weight: bolder;
  font-size: 34px;
  letter-spacing: 2px;
  color: #e80000;
}
</style>
