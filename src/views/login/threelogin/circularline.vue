<template>
  <div id="container"></div>
</template>
<script>
import * as THREE from "three";
let scene, camera, renderer, geometry, geometry1, geometry2;
export default {
  name: "circularLine",
  props: {},
  data() {
    return {
      geometry: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
      window.onresize = () => {
        return (() => {
          this.clearScene();
          this.init();
        })();
      };
    });
  },
  destroyed() {
    this.clearScenedestroyed();
  },
  methods: {
    clearScene:function(){
      geometry.dispose();
      geometry1.dispose();
      geometry2.dispose();
      let container = document.getElementById("container");
      container.innerHTML = '';
      renderer.forceContextLoss();
      renderer.dispose();
    },
    clearScenedestroyed:function(){
      geometry.dispose();
      geometry1.dispose();
      geometry2.dispose();
      renderer.forceContextLoss();
      renderer.dispose();
    },
    init: function () {
      const container = document.getElementById("container");
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      let innerColor = 0xff0000,
        outerColor = 0xff9900;
      let innerSize = 55,
        outerSize = 60;
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setClearColor(0x000000, 0); // background
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);
      camera.position.z = -400;
      // Mesh
      let group = new THREE.Group();
      scene.add(group);
      // Lights
      let light = new THREE.AmbientLight(0x404040); // soft white light
      scene.add(light);
      let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(0, 128, 128);
      scene.add(directionalLight);

      // Sphere Wireframe Inner
      let sphereWireframeInner = new THREE.Mesh(
        new THREE.IcosahedronGeometry(innerSize, 2),
        new THREE.MeshLambertMaterial({
          color: innerColor,
          ambient: innerColor,
          wireframe: true,
          transparent: true,
          shininess: 0
        })
      );
      scene.add(sphereWireframeInner);

      // Sphere Wireframe Outer
      let sphereWireframeOuter = new THREE.Mesh(
        new THREE.IcosahedronGeometry(outerSize, 3),
        new THREE.MeshLambertMaterial({
          color: outerColor,
          ambient: outerColor,
          wireframe: true,
          transparent: true,
          shininess: 0
        })
      );
      scene.add(sphereWireframeOuter);

      // Sphere Glass Inner
      let sphereGlassInner = new THREE.Mesh(
        new THREE.SphereGeometry(innerSize, 32, 32),
        new THREE.MeshPhongMaterial({
          color: innerColor,
          ambient: innerColor,
          transparent: true,
          shininess: 25,
          opacity: 0.3,
        })
      );
      scene.add(sphereGlassInner);

      // Sphere Glass Outer
      let sphereGlassOuter = new THREE.Mesh(
        new THREE.SphereGeometry(outerSize, 32, 32),
        new THREE.MeshPhongMaterial({
          color: outerColor,
          ambient: outerColor,
          transparent: true,
          shininess: 25,
          opacity: 0.3,
        })
      );

      // Particles Outer
      geometry = new THREE.Geometry();
      for (let i = 0; i < 35000; i++) {
        let x = -1 + Math.random() * 2;
        let y = -1 + Math.random() * 2;
        let z = -1 + Math.random() * 2;
        let d = 1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
        x *= d;
        y *= d;
        z *= d;
        let vertex = new THREE.Vector3(
          x * outerSize,
          y * outerSize,
          z * outerSize
        );
        geometry.vertices.push(vertex);
      }
      let particlesOuter = new THREE.PointCloud(geometry, new THREE.PointCloudMaterial({
        size: 0.1,
        color: outerColor,
        transparent: true,
      })
      );
      scene.add(particlesOuter);

      // Particles Inner
      geometry1 = new THREE.Geometry();
      for (let i = 0; i < 35000; i++) {
        let x = -1 + Math.random() * 2;
        let y = -1 + Math.random() * 2;
        let z = -1 + Math.random() * 2;
        let d = 1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
        x *= d;
        y *= d;
        z *= d;
        let vertex = new THREE.Vector3(
          x * outerSize,
          y * outerSize,
          z * outerSize
        );
        geometry1.vertices.push(vertex);
      }
      let particlesInner = new THREE.PointCloud(geometry1, new THREE.PointCloudMaterial({
        size: 0.1,
        color: innerColor,
        transparent: true,
      })
      );
      scene.add(particlesInner);

      // Starfield
      geometry2 = new THREE.Geometry();
      for (let i = 0; i < 5000; i++) {
        let vertex = new THREE.Vector3();
        vertex.x = Math.random() * 2000 - 1000;
        vertex.y = Math.random() * 2000 - 1000;
        vertex.z = Math.random() * 2000 - 1000;
        geometry2.vertices.push(vertex);
      }
      let starField = new THREE.PointCloud(geometry2, new THREE.PointCloudMaterial({
        size: 2,
        color: 0xffff99
      })
      );
      scene.add(starField);

      camera.position.z = -110;
      //camera.position.x = mouseX * 0.05;
      //camera.position.y = -mouseY * 0.05;
      //camera.lookAt(scene.position);

      let time = new THREE.Clock();
      let render = function () {
        //camera.position.x = mouseX * 0.05;
        //camera.position.y = -mouseY * 0.05;
        camera.lookAt(scene.position);

        sphereWireframeInner.rotation.x += 0.002;
        sphereWireframeInner.rotation.z += 0.002;

        sphereWireframeOuter.rotation.x += 0.001;
        sphereWireframeOuter.rotation.z += 0.001;

        sphereGlassInner.rotation.y += 0.005;
        sphereGlassInner.rotation.z += 0.005;

        sphereGlassOuter.rotation.y += 0.01;
        sphereGlassOuter.rotation.z += 0.01;

        particlesOuter.rotation.y += 0.0005;
        particlesInner.rotation.y -= 0.002;

        starField.rotation.y -= 0.002;

        let innerShift = Math.abs(Math.cos(((time.getElapsedTime() + 2.5) / 20)));
        let outerShift = Math.abs(Math.cos(((time.getElapsedTime() + 5) / 10)));

        starField.material.color.setHSL(Math.abs(Math.cos((time.getElapsedTime() / 10))), 1, 0.5);

        sphereWireframeOuter.material.color.setHSL(0, 1, outerShift);
        sphereGlassOuter.material.color.setHSL(0, 1, outerShift);
        particlesOuter.material.color.setHSL(0, 1, outerShift);

        sphereWireframeInner.material.color.setHSL(0.08, 1, innerShift);
        particlesInner.material.color.setHSL(0.08, 1, innerShift);
        sphereGlassInner.material.color.setHSL(0.08, 1, innerShift);

        sphereWireframeInner.material.opacity = Math.abs(Math.cos((time.getElapsedTime() + 0.5) / 0.9) * 0.5);
        sphereWireframeOuter.material.opacity = Math.abs(Math.cos(time.getElapsedTime() / 0.9) * 0.5);


        directionalLight.position.x = Math.cos(time.getElapsedTime() / 0.5) * 128;
        directionalLight.position.y = Math.cos(time.getElapsedTime() / 0.5) * 128;
        directionalLight.position.z = Math.sin(time.getElapsedTime() / 0.5) * 128;

        // controls.update();

        renderer.render(scene, camera);
        requestAnimationFrame(render);
      };

      render();

    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
#container {
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
}
</style>