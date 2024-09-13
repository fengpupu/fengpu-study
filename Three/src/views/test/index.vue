<!--
 * @Description: 
 * @Author: fengpu 1126120965@qq.com
 * @Date: 2024-09-13 11:03:44
 * @LastEditors: fengpu 1126120965@qq.com
 * @LastEditTime: 2024-09-13 14:13:01
 * @FilePath: \fengpu-study\Three\src\views\Test\index.vue
 * Endless Story. - NANA
-->
<template>
  <ElButton @click="onClick">
    {{ store.state.count }}
  </ElButton>
</template>
<script setup lang="ts">
import { useStore } from "vuex";
const store = useStore();
console.log(store.state);
const onClick = () => {
  store.state.count++;
};
</script>
