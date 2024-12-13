<!--
 * @Description: 
 * @Author: fengpu 1126120965@qq.com
 * @Date: 2024-09-13 10:06:41
 * @LastEditors: fengpu 1126120965@qq.com
 * @LastEditTime: 2024-12-09 14:33:17
 * @FilePath: \fengpu-study\Three\src\views\layout\index.vue
 * Endless Story. - NANA
-->
<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";
import { useRouteList } from "../../stores/routeList.ts";
const routeStore = useRouteList();
const route = useRoute();
</script>

<template>
  <div class="layout-container">
    <nav class="layout-left">
      <div
        v-for="item in routeStore.routeList"
        :key="item.path"
        :class="[
          'left-item',
          route.name == item.name ? 'left-item-active' : '',
        ]"
      >
        <RouterLink :to="{ path: item.path }">{{ item.name }}</RouterLink>
      </div>
    </nav>
    <main class="layout-content">
      <RouterView></RouterView>
    </main>
  </div>
  <RouterView />
</template>

<style scoped>
.layout-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}

.layout-left {
  width: 200px;
}

.layout-content {
  flex: 1;
}

.left-item {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-bottom: 1px solid #ccc;
}
</style>
