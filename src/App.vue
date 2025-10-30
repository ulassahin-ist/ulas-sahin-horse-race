<template>
  <Layout />
</template>

<script setup>
import Layout from "./components/Layout.vue";
</script>

<style>
:root {
  --scroll-offset: 70px;
  --header: #1c2331;
  --white-bg: #eaeaea;
  --table-bg: #ffffff;
  --table-head: #e1e1e1;
}
#app {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  user-select: none;
  height: 100vh;
  width: 100vw;
}
</style>
