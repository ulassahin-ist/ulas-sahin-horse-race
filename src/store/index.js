import { createStore } from "vuex";

export default createStore({
  state: {
    gameInProgress: false,
    horses: [],
    races: [],
    results: [],
    raceState: {
      running: false,
      paused: false,
      horses: [],
      finishedOrder: [],
      winner: null,
      raceIndex: 0,
    },
  },
  mutations: {
    setGameInProgress(state, value) {
      state.gameInProgress = value;
    },
    setHorses(state, horses) {
      state.horses = horses;
    },
    setRaces(state, races) {
      state.races = races;
    },
    addResult(state, { raceId, horse }) {
      let race = state.results.find((r) => r.id === raceId);
      if (race) {
        race.horses.push(horse);
      } else {
        state.results.push({
          id: raceId,
          horses: [horse],
        });
      }
    },
    clearResults(state) {
      state.results = [];
    },
    setRaceState(state, payload) {
      Object.assign(state.raceState, payload);
    },
    addFinishedHorse(state, horse) {
      state.raceState.finishedOrder.push(horse);
    },
    setWinner(state, horse) {
      state.raceState.winner = horse;
    },
    incrementRaceIndex(state) {
      if (state.raceState.raceIndex < state.races.length - 1) {
        state.raceState.raceIndex++;
      }
    },
    togglePause(state) {
      if (state.raceState.running) {
        state.raceState.paused = !state.raceState.paused;
      }
    },
    clearRuntime(state) {
      state.raceState = {
        running: false,
        paused: false,
        horses: [],
        finishedOrder: [],
        winner: null,
        raceIndex: 0,
      };
    },
    resetAll(state) {
      state.horses = [];
      state.races = [];
      state.results = [];
      state.gameInProgress = false;
      state.raceState = {
        running: false,
        paused: false,
        horses: [],
        finishedOrder: [],
        winner: null,
        raceIndex: 0,
      };
    },
  },
  actions: {
    generateHorses({ commit }) {
      // prettier-ignore
      const horseNames = ["Thunderbolt", "Midnight Sun", "Silver Arrow", "Crimson Comet", "Golden Mirage","Whisperwind", "Ironstride", "Phantom Blaze", "Luna’s Shadow", "Wildfire","Star Dancer", "Misty Valley", "Storm Runner", "Jetstream", "Aurora Flame","Velvet Thunder", "Dust Devil", "Nightshade", "Echo Spirit", "Royal Tempest","Shadowfax", "Morning Glory", "Cinderheart", "High Voltage", "Eclipse Dancer","Frozen Fire", "Rapid River", "Diamond Soul", "Majestic Dream", "Solar Wind","Moonfire", "Lightning Step", "Ocean Whisper", "Valiant Star", "Frostbite","Noble Heart", "Wild Majesty", "Desert Flame", "Silver Storm", "Tempest Wind", "Black Gokhce"]

      // prettier-ignore
      const horseColors = ["reddish","green","blue","yellow","purple","orange","teal","dark-orange","emerald-green","sky-blue","red","dark-purple","deep-blue","turquoise","bright-orange","crimson","gray","silver","dark-navy","pink",];
      const shuffledNames = [...horseNames].sort(() => 0.5 - Math.random());
      const shuffledColors = [...horseColors].sort(() => 0.5 - Math.random());
      let horses = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: shuffledNames[i],
        color: shuffledColors[i],
        condition: Math.floor(Math.random() * 100) + 1,
      }));
      horses = [...horses].sort((a, b) => a.name.localeCompare(b.name));
      commit("setHorses", horses);
    },

    generateRaces({ state, commit }) {
      const distances = [1200, 1400, 1600, 1800, 2000, 2200];
      const races = distances.map((distance, i) => {
        const tenHorses = [...state.horses]
          .sort(() => 0.5 - Math.random())
          .slice(0, 10);
        return {
          id: i + 1,
          distance: distance,
          horses: tenHorses,
        };
      });
      commit("setRaces", races);
    },
  },
});
