<template>
  <div class="container">
    <div class="title">RESULTS</div>

    <div v-for="race in results" :key="race.id" class="result-block">
      <div class="race-title">
        {{
          race.id +
          (race.id === 1
            ? "ST"
            : race.id === 2
            ? "ND"
            : race.id === 3
            ? "RD"
            : "TH")
        }}
        Lap – {{ store.state.races[race.id - 1]?.distance ?? "?" }}m
      </div>

      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(horse, i) in race.horses" :key="horse.id">
            <td>{{ i + 1 }}</td>
            <td>{{ horse.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, nextTick, defineEmits } from "vue";
import { useStore } from "vuex";

const store = useStore();

const results = computed(() => store.state.results);

const props = defineProps({
  scrollRef: Object,
});

const emit = defineEmits(["scrollToBottom"]);

watch(
  results,
  async () => {
    await nextTick();
    emit("scrollToBottom");
  },
  { deep: true }
);
</script>

<style scoped>
.container {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.title {
  background: linear-gradient(145deg, #d9dbdf, #a6a9ad);
  color: #1b1b1f;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 14px;
}
</style>
