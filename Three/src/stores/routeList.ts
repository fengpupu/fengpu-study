import { ref, computed } from "vue";
import { defineStore } from "pinia";
import list from "./data/routers/list";

export const useRouteList = defineStore("routeList", () => {
  const routeList = ref(list);
  return { routeList};
});
