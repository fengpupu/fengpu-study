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

import { createStore } from "vuex";
// 创建一个新的 store 实例
const store = createStore({
  state() {
    return {
      count: 0,
    };
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
});

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
const app = createApp(App);
app.use(createPinia());

import router from "./router/router";

app.use(router);
// 将 store 实例作为插件安装
app.use(store);

app.mount("#app");
