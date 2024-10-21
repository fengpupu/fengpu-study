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
  <div class="container" id="container"></div>
</template>
<script setup lang="ts">
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { onMounted } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const initTHREE = (domElement) => {
  const scene = new THREE.Scene();
  /**
   * 相机设置
   */
  const width = domElement.clientWidth; //窗口宽度
  const height = domElement.clientHeight; //窗口高度

  const k = width / height; //窗口宽高比
  const s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
  //创建相机对象
  const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
  camera.position.set(200, 300, 200); //设置相机位置
  camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
  /**
   * 创建渲染器对象
   */
  var renderer = new THREE.WebGLRenderer({
    antialias: true, //抗锯齿
    devicePixelRatio: window.devicePixelRatio, //设置设备像素比
  });
  renderer.setSize(width, height); //设置渲染区域尺寸
  domElement.appendChild(renderer.domElement); //body元素中插入canvas对象
  //执行渲染操作   指定场景、相机作为参数
  renderer.render(scene, camera);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
  const ani = () => {
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(ani);
  };
  ani();
  return { scene, camera, renderer };
};
const initLoader = async (scene) => {
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load("/images/env.jpg", (texture) => {
    const loader = new GLTFLoader();
    loader.load("/modules/scene.glb", (gltf) => {
      // gltf.scene.traverse((child) => {
      //   if (child.isMesh) {
      //     child.material.envMap = texture;
      //   }
      // });
      scene.add(gltf.scene);
    });
    // scene.environment = environmentEquirectangularTexture;
    scene.environment = texture;
    scene.environment.mapping = THREE.EquirectangularReflectionMapping;
  });
};
onMounted(() => {
  const { scene } = initTHREE(document.getElementById("container"));
  initLoader(scene);
});
</script>
<style  scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>