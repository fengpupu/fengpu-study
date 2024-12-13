import { onBeforeUnmount, ref,getCurrentScope } from "vue";
export const objFn = () => {
  const obj = ref({
    name: "1111112313",
  });
  // onBeforeUnmount(()=>{
  //   console.log{getCurrentScope()}
  // })
  return {
    obj,
  };
};
