<template>
  {{ obj }}
  <div v-for="item in list" :class="`test1--` + item">{{ item }}</div>
</template>
<script setup lang="ts" name="memory1">
import {
  ref,
  getCurrentScope,
  onBeforeUnmount,
  onUnmounted,
  getCurrentInstance,
  watch,
  onMounted,
} from "vue";
import { obj } from "./part/config.ts";
const list = ref<any>([]);
for (let index = 0; index < 20; index++) {
  list.value.push(index);
}
const cleanComponent = (scope) => {
  const { effects } = scope;
  for (const effect of effects) {
    disConnectLink(effect.depsTail);
    effect.deps = null;
    effect.depsTail = null;
  }
};
function disConnectLink(link) {
  if (!link) {
    return;
  }
  const nextLink = link.prevDep;
  nextLink && (nextLink.nextDep = null);

  const realDep = link.dep;

  link.prevSub && (link.prevSub.nextSub = link.nextSub);
  link.nextSub && (link.nextSub.prevSub = link.prevSub);

  if (!link.nextSub) {
    realDep.subs = link.prevSub;
  }
  if (!link.prevSub) {
    realDep.subsHead = null;
  }

  const sub = link.sub;
  sub.depsTail = link.prevDep;

  link.prevSub = null;
  link.nextSub = null;
  link.prevDep = null;
  link.nextDep = null;
  disConnectLink(nextLink);
}
onBeforeUnmount(() => {
  const scope = getCurrentScope();
  cleanComponent(scope);
});
</script>
