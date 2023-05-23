<template>
  <div class="map-baidu">
    <div class="set-up" @click="setupMapPositioning">
      <span>设置中心点</span>
      <div class="positioning-map" v-show="positioningMap">
        <span class="parallelogram" @click="submitPositioning">保存</span>
        <span class="parallelogram" @click="submitPositioningupdata">清楚</span>
      </div>
      <dv-border-box-5 
      
        :color="['#7c95e8', '#345ffc']" 
        backgroundColor="rgba(6,51,218,0.5)"
        class="positioning-map-item-dv-border-box" 
        v-show="positioningMap" 
        v-if="pointCnot"></dv-border-box-5>
      <div class="positioning-map-item" v-show="positioningMap" v-if="pointCnot">
        <div>经纬度lng : {{pointCnot.lng}}</div>
        <div>经纬度lat : {{pointCnot.lat}}</div>
        <div>显示级别 : {{pointLevelCnot}}</div>
      </div>
    </div>
    <dv-loading class="loading-map" v-show="loadingMap">加载...</dv-loading>
    <div id="mapContainer" ref="mapContainer"></div>
  </div>

</template>
<script>
import { mapGetters } from 'vuex';
import { mapIntegration, mapPositioning, getMapPositioning, updateMapPg } from '@/api/dashboard';
function ComplexCustomOverlay(point, text, mouseoverText, map, statushowSum) {
  this._map = map;
  this._point = point;
  this._text = text;
  this._overText = mouseoverText;
  this._statushowSum = statushowSum;
}
// ../../../../public/img/label.png
ComplexCustomOverlay.prototype = new BMap.Overlay();
ComplexCustomOverlay.prototype.initialize = function () {
  let map = this._map;
  this._div = document.createElement("div");
  let div = this._div;
  div.style.position = "absolute";
  div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
  if(this._statushowSum == 0){
    div.style.backgroundColor = "#aaa9a9";
    div.style.border = "1px solid #a4a3a3";
    div.style.color = "#4c4c4c";
  }else{
    div.style.backgroundColor = "#209b36";
    div.style.border = "1px solid #129129";
    div.style.color = "#fff";
  }
  div.style.padding = "0 3px";
  div.style.lineHeight = "18px";
  div.style.whiteSpace = "nowrap";
  div.style.MozUserSelect = "none";
  div.style.fontSize = "12px";
  div.style.borderRadius = '4px';
  let span = this._span = document.createElement("span");
  div.appendChild(span);
  span.appendChild(document.createTextNode(this._text));
  this._arrow = document.createElement("div");
  let arrow = this._arrow;
  arrow.style.background = "url(./img/label.png) no-repeat";
  arrow.style.position = "absolute";
  arrow.style.width = "11px";
  arrow.style.height = "10px";
  arrow.style.top = "18px";
  arrow.style.left = "10px";
  arrow.style.overflow = "hidden";
  if(this._statushowSum == 0){
    arrow.style.backgroundPosition = "0px -29px";
  }else{
    arrow.style.backgroundPosition = "0px -19px";
  }
  
  div.appendChild(arrow);
  map.getPanes().labelPane.appendChild(div);
  return div;
}
ComplexCustomOverlay.prototype.draw = function () {
  let map = this._map;
  let pixel = map.pointToOverlayPixel(this._point);
  this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
  this._div.style.top = pixel.y - 30 + "px";
}
export default { 
  name: "MapBaidu",
  props: {
    mapBaiduData: {
      type: Array,
      required: [] 
    },
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "100%"
    }
  },
  computed: {
    ...mapGetters([
      'jdno',
      'id'
    ]),
  },
  data() {
    return {
      onMapShow: false,
      loadingMap: false, // 地图 loading
      positioningMap: false, // 显示设置定位
      updataIndex: 0, // 定位删除index
      markerArr: [],
      timerMapInterval:'',
      responseData:[],
      map:'',
      point:'', //初始化经纬度
      pointLevel: 8,//初始级别
      pointCnot:'',
      pointLevelCnot: 8,
      lng: 0,
      lat: 0
    };
  },
  watch: {
    mapBaiduData: {  
      handler: function () {
        // console.log(val)
        // let that = this;
        // that.markerArr = val;
        // that.getmarkerArr(that.markerArr);
      },
      immediate: true,
      deep: true		   
    },
  },
  created() { },
  destroyed() { },
  mounted() {
    this.$nextTick(() => {
      this.getnative();
      this.getMapPg();
    });
  },
  beforeDestroy(){
    let that = this;
    clearInterval(that.timerMapInterval);
    that.timerMapInterval = '';
  },
  methods: { 
    init() {
      let mapContainer = this.$refs.mapContainer;
      let map = new BMap.Map(mapContainer); // 创建地图实例
      let point = new BMap.Point(116.404, 39.915); // 创建点坐标
      map.centerAndZoom(point, 8);
    },
    getMapPg(){
      let that = this;
      getMapPositioning({'id':this.id}).then(response=>{
        that.lng = response.data.lng;
        that.lat = response.data.lat;
        that.pointLevelCnot = response.data.zoom;
      })
    },
    submitPositioning(){
      let that = this;   
      let data = {
        id: this.id+'',
        lng: this.pointCnot.lng+'',
        lat: this.pointCnot.lat+'',
        zoom: this.pointLevelCnot+'',
      };
      mapPositioning(data).then(response => {
        if(response.status == 1){
          that.$message({message: '成功', type: 'success'});
          let sum = this.map.getOverlays();
          that.map.removeOverlay(sum[this.updataIndex]);
          that.onMapShow = false;
          that.updataIndex = 0;
        }else{
          that.$message.error('失败');
        }
      });
    },
    submitPositioningupdata(){
      let that = this;
      if(this.updataIndex > 0){
        let sum = this.map.getOverlays();
        this.map.removeOverlay(sum[this.updataIndex]);
        this.onMapShow = false;
        this.updataIndex = 0;
        updateMapPg({'id':this.id}).then(response=>{
          if(response.status == 1){
            that.$message({message: '成功', type: 'success'});
          }else{
            that.$message.error('失败');
          }
        })
      }else{
        updateMapPg({'id':this.id}).then(response=>{
          if(response.status == 1){
            that.$message({message: '成功', type: 'success'});
          }else{
            that.$message.error('失败');
          }
        })
      }
    },
    setupMapPositioning(){
      this.positioningMap = !this.positioningMap;
    },
    getnative() {
      let that = this;
      let mapContainer = this.$refs.mapContainer;
      let geoc = new BMap.Geocoder(); //获取用户的地址解析。
      let native = new BMap.LocalCity(); //此类用于获取用户所在的城市位置信息
      let lat, lng, cityname;
      native.get(function (r) {
        lng = r.center.lng; //经度
        lat = r.center.lat; //纬度
        cityname = r.name; //城市名
        geoc.getLocation(r.center, function () {
          //console.log("城市：" + cityname + "，经度:" + lng + ",纬度:" + lat);         
          that.$emit('fixedPosition',{'cityname':cityname,'lng':lng,'lat':lat});
          let map = new BMap.Map(mapContainer);
          // 创建地图实例
          let point = new BMap.Point(lng, lat); ////创建坐标点
          // 创建点坐标
          that.point = point;
          that.pointLevel = 8;
          map.centerAndZoom(that.point, that.pointLevel);
          // 初始化地图，设置中心点坐标和地图级别
          that.changeMapStyle(map);
          map.enableScrollWheelZoom(true);//滚轮缩放
          //向地图中添加缩放控件
          let ctrlNav = new BMap.NavigationControl({
            anchor: BMAP_ANCHOR_TOP_RIGHT,
            type: BMAP_NAVIGATION_CONTROL_LARGE
          });
          map.addControl(ctrlNav)
          let ctrlOve = new BMap.OverviewMapControl({
            anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
            isOpen: 1
          });
          map.addControl(ctrlOve);
          //向地图中添加比例尺控件 
          let ctrlSca = new window.BMap.ScaleControl({
            anchor: BMAP_ANCHOR_BOTTOM_LEFT
          });
          map.addControl(ctrlSca);

          let cityCtrl = new BMap.CityListControl();  // 添加城市列表控件
          map.addControl(cityCtrl);
          that.map = map;
          that.getMapIntegration();

          map.addEventListener('click', function (e) {
            if(!that.positioningMap){
              return false;
            }
            if(that.markerArr.length < 0){
              return false;
            }
            that.loadingMap = true;
            that.pointCnot = e.point;
            if(that.onMapShow){
              let sum = that.map.getOverlays();
              for(let i = 0; sum.length > i; i++){
                if(sum[i].K){
                  if(sum[i].K.title == '中心坐标'){
                    // arker.remove();
                    //map.clearOverlays(); //删除所有点
                    that.map.removeOverlay(sum[i]);
                    let marker1 = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat),{ title: '中心坐标'});
                    that.map.addOverlay(marker1);
                    that.loadingMap = false;
                  }
                }
              }
              that.getOverlaySum(that.map.getOverlays());
            }else{
              that.onMapShow = true;
              // 新增
              // that.pointLevelCnot
              let marker1 = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat),{ title: '中心坐标'});
              // 在地图上添加点标记
              that.map.addOverlay(marker1);
              that.getOverlaySum(that.map.getOverlays());
            }
            that.loadingMap = false;
          });

          map.addEventListener("zoomend", function(){
            //地图缩放结束后执行的代码
            let zoom = that.map.getZoom(); 
            that.pointLevelCnot = zoom;
          });

          that.timerMapInterval = setInterval(() => {
            console.log('五分钟地图');
            that.getMapIntegration();
          }, 1000 * 60 * 5);

        });
      });
    },
    getOverlaySum(data){
      for(let i = 0; data.length > i; i++){
        if(data[i].K){
          if(data[i].K.title == '中心坐标'){
            this.updataIndex = i;
          }
        }
      }
    },
    getMapIntegration(){
      let that = this;
      mapIntegration(that.jdno).then(response => {
        if(response.status == 1){
          let data = response.data.tree;
          for(let i = 0; data.length > i; i++){
              let datamap =  {
              title: data[i].oldmanname,
              point: data[i].longitude1 + ',' + data[i].latitude1,
              address: data[i].Address,
              tel: "",
              isonline: data[i].isonline
            }
            that.responseData[i] = datamap;
          }
          that.markerArr = that.responseData;
          that.getmarkerArr(that.markerArr);
        }
      })
    },
    getmarkerArr(data){
      let that = this;
      return new Promise((resolve) => {
        this.$nextTick(() => {
          let markerArr = data;
          let mapPointsListval = [];
          let mapPointsList = [];
          for (let i = 0; i < markerArr.length; i++) {
            let p0 = markerArr[i].point.split(",")[0];
            let p1 = markerArr[i].point.split(",")[1];
            mapPointsListval.push({'longitude':p0,'latitude':p1});
            if(markerArr[i].isonline != '在线'){
              let makerDisconnect = that.addMarkerDisconnect(
                new window.BMap.Point(p0, p1),
                markerArr[i],
                that.map
              );
              that.addInfoWindow(makerDisconnect, markerArr[i]);
            }else{
              let maker = that.addMarker(
                new window.BMap.Point(p0, p1),
                markerArr[i],
                that.map
              );
              that.addInfoWindow(maker, markerArr[i]);
            }
          }
          mapPointsListval.forEach(item => {
            mapPointsList.push(new BMap.Point(Number(item.longitude), Number(item.latitude)))
          })
          // 在这里设置中心点
          if(this.lng && this.lat){
            let center = new BMap.Point(parseFloat(this.lng), parseFloat(this.lat)); ////创建坐标点
            this.map.centerAndZoom(center, this.pointLevelCnot);
          }else{
            // 获取合理的中心点
            const centerPoint = this.map.getViewport(mapPointsList);
            // 初始化地图，设置中心点坐标和地图级别
            this.map.centerAndZoom(centerPoint.center, centerPoint.zoom);
          }
          resolve(true);
        })
      })
    },
    addMarker(point, poi, map) {
      let myIcon = new BMap.Icon("./img/markers.png",
        new BMap.Size(23, 25), {
        offset: new BMap.Size(10, 25),
        imageOffset: new BMap.Size(0, 0 - 10 * 32.5)
      });
      let marker = new BMap.Marker(point, { title: poi.title, icon: myIcon });
      map.addOverlay(marker);
      let myCompOverlay = new ComplexCustomOverlay(
        point,
        poi.title,
        poi.address,
        map,
        1
      );
      map.addOverlay(myCompOverlay)
      return marker;
    },
    addMarkerDisconnect(point, poi, map) {
      let myIcon = new BMap.Icon("./img/markers.png",
        new BMap.Size(23, 25), {
        offset: new BMap.Size(10, 25),
        imageOffset: new BMap.Size(0, 0 - 10 * 35)
      });
      let marker = new BMap.Marker(point, { title: poi.title, icon: myIcon });
      map.addOverlay(marker);
      let myCompOverlay = new ComplexCustomOverlay(
        point,
        poi.title,
        poi.address,
        map,
        0
      );
      map.addOverlay(myCompOverlay)
      return marker;
    },
    addInfoWindow(marker, poi) {
      //pop弹窗标题 
      let title = '<div style="font-weight:bold;color:#CE5521;font-size:14px">' + poi.title + '</div>';
      //pop弹窗信息 
      let html = [];
      html.push('<table cellspacing="0" style="table-layout:fixed;width:100%;font:12px arial,simsun,sans-serif"><tbody>');
      html.push('<tr>');
      html.push('<td style="vertical-align:top;line-height:16px;width:38px;white-space:nowrap;word-break:keep-all">地址:</td>');
      html.push('<td style="vertical-align:top;line-height:16px">' + poi.address + ' </td>');
      html.push('</tr>');
      html.push('</tbody></table>');
      let infoWindow = new BMap.InfoWindow(html.join(""), {
        title: title,
        width: 200
      });
      let openInfoWinFun = function () {
        marker.openInfoWindow(infoWindow);
      };
      marker.addEventListener("click", openInfoWinFun);
      return openInfoWinFun;
    },
    changeMapStyle(map) {
      let mapStyle = {
        features: ["road", "building", "water", "land"], //隐藏地图上的"poi",
        style: "midnight"
      };
      map.setMapStyle(mapStyle);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
  .map-baidu {
    position: absolute;
    top: 0.5%;
    left: 0.26%;
    height: 99%;
    width: 99.48%;
    #mapContainer{
      width: 100%;
      height: 100%;
    }
  }
  .set-up{
    position: absolute;
    top: 10px;
    left: 120px;
    width: 80px;
    height: 24px;
    line-height: 24px;
    z-index: 1;
    font-size: 10px;
    background-color: #fff;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;
    .positioning-map{
      position: absolute;
      height: 24px;
      line-height: 24px;
      top: 30px;
      left: 0;
      border-radius: 2px;
      display: flex;
      justify-content: space-around;
      .parallelogram {   
        width: 50px;
        height: 24px;
        background-color: rgba(6,51,218,0.5);
        border-radius: 2px;
        color: #fff;
        border: #345ffc 1px solid;
        margin-right: 6px;
      }
    }
    .positioning-map-item-dv-border-box{
      position: absolute;
      width: 260px;
      height: 120px;
      top: 55px;
      left: -2px;
      z-index: 1;
    }
    .positioning-map-item{
      position: absolute;
      width: 200px;
      line-height: 22px;
      top: 82px;
      left: 0;
      text-align: left;
      padding-left: 20px;
      overflow: hidden;
      z-index: 2;
      color: #fff;
    }
  }
  .loading-map{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    height: 100%;
    color: #fff;
    background-color: rgba(0,0,0,0.75);
  }
</style>