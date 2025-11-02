<template>
  <div class="container">
    <div class="title">HORSES</div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Condition</th>
          <th>Color</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(horse, index) in horses" :key="index">
          <td>{{ horse.name }}</td>
          <td>{{ horse.condition }}</td>
          <td :style="{ background: `var(--${horse.color})` }">
            {{ horse.color }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

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

table,
td,
th {
  border: 1px solid var(--table-head);
  padding: 10px 2px;
}
</style>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const horses = computed(() => store.state.horses);
</script>
