<template>
  <div class="container">
    <div class="title">PROGRAM</div>

    <div v-for="race in races" :key="race.id">
      <div class="race-title">
        {{ race.id
        }}{{
          race.id === 1
            ? "ST"
            : race.id === 2
            ? "ND"
            : race.id === 3
            ? "RD"
            : "TH"
        }}
        Lap - {{ race.distance }}m
      </div>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(horse, index) in race.horses" :key="horse.id">
            <td>{{ index + 1 }}</td>
            <td>{{ horse.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.container {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const races = computed(() => store.state.races);
</script>
