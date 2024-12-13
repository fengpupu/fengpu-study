<template>
  {{ obj }}
  <div v-for="item in list" :class="`test2--` + item">{{ item }}</div>
</template>
<script setup lang="ts">
import { ref, onUnmounted, getCurrentScope } from "vue";
import { objFn } from "./part/config.ts";
const list = ref([]);
const { obj } = objFn();
for (let index = 0; index < 100; index++) {
  list.value.push(index);
}
// onUnmounted(() => {
//   const scoped = getCurrentScope();
//   console.log("unmounted-2", scoped);
// });
</script>
