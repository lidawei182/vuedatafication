<template>
    <div class="nav-main">
      <div class="headline">
        <span class="headline-family">{{ realName }}</span>
      </div>
      <canvas id="canvas-2761" style="position: absolute; z-index: -1; left: 0px;"></canvas>
      <span class="nav-span"><a class="nav-link"></a></span>
      <span class="nav-span"><a class="nav-link"></a></span>
      <span class="nav-span"><a class="nav-link"></a></span>
      <span 
        v-for="(route, index) in prarray"
        v-bind:key="index" 
        @click="clickLink(route.children[0].path,route.path,$event)"
        class="nav-span">
        <!-- @click="canvasnav._toggle(index+3);" -->
          <a class="nav-link" aria-current="true"
            href="javascript:;">
            <item :title="generateTitle(route.children[0].meta.title)" />
          </a>
      </span>
    </div>
</template>

<script>
let resizeliadd = '';
import path from "path";
import { mapGetters } from "vuex";
import { generateTitle } from "@/utils/i18n";
import { validateURL } from "@/utils/validate";
import Item from "./Item";
export default {
  name: 'SidebarIndex',
  components: { Item },
  computed: {
    ...mapGetters(["permission_routers","skip", "realName"])
  },
  data() {
    return {
      canvasnav: null,
      prarray: [],
      pathIndex: 3,
    };
  },
  watch: {
    $route(){
      // to, from this.$store.dispatch("setSkip", null);
      if(this.skip){}
      this.canvasnav._toggle(this.permissionRouters());
    }
  },
  created() {
    // 数据整理
    let pr = this.permission_routers;
    for(let i = 0; pr.length > i; i++){
      if(pr[i].name && pr[i].redirect != '/404'){
        this.prarray.push(pr[i])
      }
    }
    this.permissionRouters();
  },
  mounted() {
    this.$nextTick(() => {
      this.canvasnavDataV(this.pathIndex);
      window.addEventListener("resize", this.addResize);
    });
  },
  methods: {
    generateTitle,
    addResize(){
      resizeliadd();
    },
    resolvePath(basePath, routePath) {
      return path.resolve(basePath, routePath);
    },
    isExternalLink(routePath) {
      return validateURL(routePath);
    },
    clickLink(routePath, basePath, e) {
      if (!this.isExternalLink(routePath)) {
        e.preventDefault();
        const path = this.resolvePath(basePath, routePath);
        this.$router.push(path);
      }
    },
    permissionRouters() {
      for(let i = 0; this.prarray.length>i; i++ ){
        let pathName = this.prarray[i].children[0].path;
        let strPath = this.$route.path.split('/');
        if(this.prarray[i].children[0].hasOwnProperty("children")){
          this.prarray[i].children[0].children.forEach(element => {
            let childrensk = element.path.split('/');
            childrensk = childrensk[childrensk.length-1];
            if(childrensk == strPath[strPath.length-1]){
              this.pathIndex = element.index + 3;
            }
          });
        }
        if(pathName == strPath[strPath.length-1]){
          this.pathIndex = this.prarray[i].children[0].index + 3;
        }
      }
      return this.pathIndex;
    },
    canvasnavDataV(indexSeat){
      this.canvasnav = (function() {
        var c = Math.min,
          h = Math.sign,
          m = Math.max,
          n = Math.abs,
          j = 0.85,
          k = 10,
          l = 4;
        var opt = {};
        opt.currentIndex = 1;
        opt.canvas = document.getElementById("canvas-2761");

        var calcAVGSpeed = function(a) {
          var b = (l * j * a + k * (1 - j) * a) / (k * l * 20);
          return (b = m(n(b), 2.5) * h(b)), b;
        };
        var getCurSpeed = function(a, b) {
          var c = n(a) > n(j * b) ? l * opt.avgSpeed : k * opt.avgSpeed;
          return c;
        };

        var _calCurve = function(a, b, c, d, e, f) {
          //console.log(a + f,b,c-f,d,c,d);
          e.bezierCurveTo(a + f, b, c - f, d, c, d);
        };

        var _initCanvas = function(canvas, width, height) {
          var devicePixelRatio = window.devicePixelRatio,
            canvasObj = canvas.getContext("2d");
          (canvas.width = width * devicePixelRatio),
            (canvas.height = height * devicePixelRatio),
            (canvas.style.width = width + "px"),
            (canvas.style.height = height + "px"),
            canvasObj.scale(devicePixelRatio, devicePixelRatio);
        };

        resizeliadd = function() {
          //resize发生
          opt.timer && cancelAnimationFrame(opt.timer);
          _calcTabs();
          _initCanvas(opt.canvas, opt.width, opt.height), draw(0);
        };

        var _calcTabs = function() {
          var a = document.querySelectorAll(".nav-main .nav-span"),
            b = [],
            c = 0;
          Array.prototype.forEach.call(a, function(a) {
            b.push(c), (c += a.offsetWidth);
          }),
            (b[0] = -20),
            b.push(c),
            (opt.tabWidthList = b),
            (opt.tabHeight = a[0].offsetHeight + 0),
            (opt.height = opt.tabHeight + 20),
            (opt.width = window.innerWidth);
        };

        var _toggle = function(navindex) {
          "undefined" !== typeof navindex &&
            navindex !== opt.currentIndex &&
            opt.tabWidthList &&
            opt.tabWidthList.length &&
            (!opt.animating || navindex !== opt.nextIndex) &&
            ((opt.animating = true),
            (opt.distance =
              opt.tabWidthList[navindex] - opt.tabWidthList[opt.currentIndex]),
            (opt.avgSpeed = calcAVGSpeed(opt.distance)),
            (opt.curDisX = 0),
            (opt.nextIndex = navindex));
          return false;
        };

        var _createPattern = function(a) {
          var b = 140,
            c = 63,
            d = 1,
            e = document.createElement("canvas");
          (e.width = b),
            (e.height = c),
            (e.style.width = b / d + "px"),
            (e.style.height = c / d + "px");
          var f = e.getContext("2d");
          //缩放 宽高 100%
          f.scale(d, d);
          f.lineWidth = 0.4;
          for (var g = 3, h = 0.8, j = 1; 30 > j; j++) {
            //设置或返回用于笔触的颜色、渐变或模式
            f.strokeStyle = "RGBA(22, 120, 160, " + h + ")";
            //开始一条路径
            f.beginPath();
            //把路径移动到画布中的指定点，不创建线条
            f.moveTo(0, j * g);
            //添加一个新点，然后在画布中创建从该点到最后指定点的线条
            f.lineTo(b, j * g);
            //绘制已定义的路径
            f.stroke();
            //创建从当前点回到起始点的路径
            f.closePath();
            10 < j && (h -= 0.1);
          }
          var i = a.getContext("2d").createPattern(e, "repeat-x");
          (opt.pattern = i), (e = null);
        };

        var _drawHightlight = function(a) {
          //a = 0
          var b = opt.canvas.getContext("2d"),
            d = 0.3;
          //clearRect 在给定的矩形内清除指定的像素,这里清完了
          b.clearRect(0, 0, 2 * opt.width, 2 * opt.height);
          b.shadowColor = "rgba(0, 193, 220, 1)";
          b.shadowBlur = 5;
          b.strokeStyle = "#004CB3";
          b.lineWidth = 0.8;
          b.fillStyle = "none";
          _draw(b, false);
          //这里绘制了外围边框线条
          //return false;
          var e = b.createLinearGradient(0, 0, opt.width, opt.height),
            f = a - d;
          e.addColorStop(c(1, m(0, 0 + f)), "rgba(0,0,0,0)");
          e.addColorStop(c(1, m(0, 0 + f + 0.1)), "#8ED6FF");
          e.addColorStop(c(1, 0 + f + d), "#8ED6FF");
          e.addColorStop(c(1, 0 + f + d + 0.1), "rgba(0,0,0,0)");
          e.addColorStop(1, "rgba(0,0,0,0)");
          b.lineWidth = 1.5;
          b.strokeStyle = e;
          b.fillStyle = opt.pattern;
          _draw(b, true);
        };

        var draw = function(a) {
          //console.log(a);
          _drawHightlight(a);
          //return false;

          opt.timer = requestAnimationFrame(function() {
            //console.log(a);
            draw((a + 0.005) % 1.6);
          });
        };

        var _draw = function(canvasObj, trueorfalse) {
          var navindex = opt.currentIndex,
            tableHeight = opt.tabHeight,
            f = 0,
            g = 40,
            i = 20,
            j = 0.5,
            k = 2.5,
            l = 0;
          if (
            (canvasObj.beginPath(),
            canvasObj.moveTo(-50, opt.height + 10),
            canvasObj.lineTo(-50, tableHeight + j),
            opt.animating)
          ) {
            var m = getCurSpeed(opt.curDisX, opt.distance);
            l = c(n(opt.distance), n(opt.curDisX + m)) * h(m);
          }
          if (
            (canvasObj.lineTo(
              f + opt.tabWidthList[navindex] + l - g / 2,
              tableHeight + j
            ),
            _calCurve(
              f + opt.tabWidthList[navindex] + l - g / 2,
              tableHeight + j,
              f + opt.tabWidthList[navindex] + l + g / 2,
              k + j,
              canvasObj,
              i
            ),
            opt.animating)
          ) {
            var o =
              opt.tabWidthList[opt.nextIndex + 1] -
              opt.tabWidthList[opt.nextIndex];
            canvasObj.lineTo(
              f + opt.tabWidthList[navindex] + o + l - g / 2,
              k + j
            ),
              _calCurve(
                f + opt.tabWidthList[navindex] + o + l - g / 2,
                k + j,
                f + opt.tabWidthList[navindex] + o + l + g / 2,
                tableHeight + j,
                canvasObj,
                i
              );
          } else {
            //lineTO添加一个新点 宽度长度
            canvasObj.lineTo(
              f + opt.tabWidthList[navindex + 1] + l - g / 2,
              k + j
            );
            _calCurve(
              f + opt.tabWidthList[navindex + 1] + l - g / 2,
              k + j,
              f + opt.tabWidthList[navindex + 1] + l + g / 2,
              tableHeight + j,
              canvasObj,
              i
            );
          }

          canvasObj.lineTo(opt.width + 10, tableHeight + j);
          canvasObj.lineTo(opt.width + 10, opt.height + 10);
          canvasObj.closePath();
          canvasObj.stroke();
          trueorfalse && canvasObj.fill();
          opt.animating &&
            trueorfalse &&
            ((opt.curDisX = l),
            n(l) >= n(opt.distance) &&
              ((opt.animating = false), (opt.currentIndex = opt.nextIndex)));
        };

        _calcTabs();
        _initCanvas(opt.canvas, opt.width, opt.height);
        _createPattern(opt.canvas);
        draw(0);
        _toggle(indexSeat);
        window.onresize = function() {
          resizeliadd();
        };
        return {
          _toggle: _toggle
        };
      })();
    }
  }
};
</script>
<style lang="scss" scoped>
  .headline{
    max-width: 200px;
    min-width: 120px;
    position: absolute;
    top: -10%;
    left: 1%;
    z-index: 999;
    font-size: 20px;
    display: flex;
    align-items: center;
      .headline-family{
        color: #fff;
        text-align: center;
        -webkit-animation: blink 12s ease infinite alternate;
        animation: blink 12s ease infinite alternate;
      }
      @-webkit-keyframes blink {
          20%, 24%, 55% {
              color: #a6e0fe;
              text-shadow: none;
          }

          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
              text-shadow: 0 0 5px #379dfc, 0 0 15px #379dfc, 0 0 20px #379dfc, 0 0 40px #379dfc, 0 0 60px #034fa5, 0 0 10px #379dfc, 0 0 98px #034fa5;
              color: #fff;
          }
      }

      @keyframes blink {
          20%, 24%, 55% {
              color: #a6e0fe;
              text-shadow: none;
          }

          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
              text-shadow: 0 0 5px #379dfc, 0 0 15px #379dfc, 0 0 20px #379dfc, 0 0 40px #379dfc, 0 0 60px #034fa5, 0 0 10px #379dfc, 0 0 98px #034fa5;
              color: #fff;
          }
      }
  }
  .nav-main {
      z-index: 10;
      display: flex;
  }
  .nav-span .nav-link {
      text-decoration: none !important;
      display: block;
      color: #fff;
      width: auto;
      min-width: 140px;
      font-size: 8px;
      text-align: left;
      cursor: pointer;
  }
</style>