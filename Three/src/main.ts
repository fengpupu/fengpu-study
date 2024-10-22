/*
 * @Description:
 * @Author: fengpu 1126120965@qq.com
 * @Date: 2024-09-13 10:06:41
 * @LastEditors: fengpu 1126120965@qq.com
 * @LastEditTime: 2024-09-13 14:07:19
 * @FilePath: \fengpu-study\Three\src\main.ts
 * Endless Story. - NANA
 */
import "./assets/main.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router/router";
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
