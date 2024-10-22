/*
 * @Description:
 * @Author: fengpu 1126120965@qq.com
 * @Date: 2024-09-13 11:31:53
 * @LastEditors: fengpu 1126120965@qq.com
 * @LastEditTime: 2024-09-13 14:09:18
 * @FilePath: \fengpu-study\Three\src\stores\data\routers\list.ts
 * Endless Story. - NANA
 */
const partRoute = [
  {
    path: "/test",
    name: "test",
    component: () => import("@/views/test/index.vue"),
  },
  {
    path: "/test2",
    name: "test2",
    component: () => import("@/views/test/index.vue"),
  },
];
export default partRoute;
