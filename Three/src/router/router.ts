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
// const routeList = useRouteList()
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "",
      component: Layout,
    },
    // ...routeList.routeList,
    {
      path: "/test",
      name: "test",
      component: () => import("@/views/test/index.vue"),
    },
  ],
});
// router.beforeEach((to)=>{

// })

export default router;
