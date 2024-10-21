/*
 * @Description:
 * @Author: fengpu 1126120965@qq.com
 * @Date: 2024-09-13 10:06:41
 * @LastEditors: fengpu 1126120965@qq.com
 * @LastEditTime: 2024-09-13 14:09:30
 * @FilePath: \fengpu-study\Three\src\router\router.ts
 * Endless Story. - NANA
 */
import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/views/home/index.vue";
import { useRouteList } from "@/stores/routeList";
import type { Store } from "pinia";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "",
      component: Layout,
    },
    {
      path: "/:pathMatch(.*)*",
      component: Layout,
    },
  ],
});
let routeStore: null | Store = null;
router.beforeEach((to) => {
  if (!routeStore) {
    routeStore = useRouteList();
    router.addRoute(...routeStore.routeList);
    return { name: to.name, path: to.fullPath };
  }
});
export default router;
