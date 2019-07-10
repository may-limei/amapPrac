<template>
  <div id="detail">
    <mx-header :title="$route.meta.title"></mx-header>
    <div class="content" style="background-color: #FFFFFF;">
      <!-- <tabs v-model="selected" v-if="tabbarSelect===0">
        <tab title="文档">
          <mx-loadmore
          :top="88" :bottom="50"
          :top-method="loadTop"
          :bottom-method="loadBottom"
          :bottom-all-loaded="todo[0].allLoaded"
          @translate-change="recordScrollPosition"
          :ref="todo[0].ref">
            <cell v-for="n in todo[0].list" :key="n" :title="'tab-container1-item' + n"></cell>
          </mx-loadmore>
        </tab>
      </tabs>-->
      <div v-if="tabbarSelect===0">
        <div class="title">API</div>
        <van-collapse v-model="activeNames0">
          <van-collapse-item title="属性" name="1">内容</van-collapse-item>
          <van-collapse-item title="方法" name="2">内容</van-collapse-item>
          <van-collapse-item title="事件" name="3">内容</van-collapse-item>
        </van-collapse>
        <div class="title">使用案例</div>
        <van-collapse v-model="activeNames1">
          <van-collapse-item title="定位按钮" name="1">内容</van-collapse-item>
          <van-collapse-item title="缩放工具条" name="2">内容</van-collapse-item>
          <van-collapse-item title="中心点" name="3">内容</van-collapse-item>
        </van-collapse>
      </div>
      <div class="amap" id="defaultMapContainer" v-show="(tabbarSelect===2)">
        <div class="cur-position" v-if="curPositionShow" @click="curPosition"></div>
      </div>
      <van-collapse v-model="activeNames2" v-show="(tabbarSelect===2)">
        <van-collapse-item title="功能" name="1">
          <van-tree-select
            :items="items"
            :main-active-index="mainActiveIndex"
            :active-id="activeId"
            @navclick="onNavClick"
            @itemclick="onItemClick"
          />
        </van-collapse-item>
        <van-collapse-item title="API" name="2">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column fit prop="propName" label="属性名" width="120"></el-table-column>
            <el-table-column prop="propType" label="属性值类型" width="120"></el-table-column>
            <el-table-column prop="propDefault" label="默认值" width="120"></el-table-column>
            <el-table-column prop="propDescription" label="描述" width="260"></el-table-column>
          </el-table>
        </van-collapse-item>
        <van-collapse-item title="案例" name="3">
          <van-row type="flex" justify="center" v-if="(this.mainActiveIndex===0) && (this.activeId===1)">
            <van-radio-group v-model="lang" style="display: flex;">
              <van-radio name="en" @click="changeLang">英文</van-radio>
              <van-radio name="zh_en" @click="changeLang">中英文对照</van-radio>
              <van-radio name="zh_cn" @click="changeLang">中文</van-radio>
            </van-radio-group>
          </van-row>
          <van-row type="flex" justify="center" v-if="(this.mainActiveIndex===1) && (this.activeId===1)">
            <van-col span="8">
              <van-button type="info" size="small" @click="startLocation">开启定位</van-button>
            </van-col>
            <van-col span="8">
              <van-button type="info" size="small" @click="stopLocation">关闭定位</van-button>
            </van-col>
            <van-col span="10">
              <van-button type="info" size="small" @click="showLocation">显示/隐藏图标</van-button>
            </van-col>
          </van-row>
          <van-row>
            <van-col span="8">
              <el-radio-group v-model="btnPos" @change="setBtnPos">
                <el-radio :label="0">左下角</el-radio>
                <el-radio :label="1">右下角</el-radio>
                <el-radio :label="2">右上角</el-radio>
                <el-radio :label="3">左上角</el-radio>
              </el-radio-group>
              <!-- <van-radio-group v-model="btnPos" @change="setBtnPos">
                <van-radio name="0">左下角</van-radio>
                <van-radio name="1">右下角</van-radio>
                <van-radio name="2">左上角</van-radio>
                <van-radio name="3">右上角</van-radio>
              </van-radio-group> -->
            </van-col>
            <van-col span="12">
              <!-- <van-cell-group>
                <van-field v-model="btnOffsetX" label="偏移量x" type="textarea" placeholder="请输入定位按钮的偏移坐标x" rows="1" autosize/>
              </van-cell-group>
              <van-cell-group>
                <van-field v-model="btnOffsetY" label="偏移量y" type="textarea" placeholder="请输入定位按钮的偏移坐标y" rows="1" autosize/>
              </van-cell-group> -->
              <van-stepper v-model="btnOffsetX" step="0.1" @change="setBtnPos"/><!--@change时setBtnPos()未执行，stepper的宽度待改-->
              <van-stepper v-model="btnOffsetY" step="0.1" @change="setBtnPos"/>
            </van-col>
          </van-row>
        </van-collapse-item>
      </van-collapse>
      <div class="btn-list">
        <!-- <div class="demo-btn" @click="startLocation">开启定位</div> -->
        <!-- <div class="demo-btn" @click="stopLocation">结束定位</div> -->
        <!-- <br /> -->
        <div class="demo-btn" @click="getToolBar">显示缩放工具条</div>
        <!-- <div class="demo-btn"
        @click="curPositionShow = !curPositionShow">显示／隐藏定位按钮</div><br/>-->
        <!-- <div class="demo-btn" @click="showLocation">显示／隐藏定位按钮</div> -->
        <br />
        <div class="demo-btn" @click="setDemoPoint()">设置中心点</div>
        <div
          class="demo-btn"
          @click="setMarker({longitude: 116.2312,latitude: 39.54,pointName: '测试地点'}, 1)"
        >设置点标记</div>
        <br />
        <div class="demo-btn" @click="setCircle(116.23, 39.54)">设置范围圈</div>
        <div class="demo-btn" @click="openInfoWindow">显示信息窗</div>
      </div>
      <tabbar v-model="tabbarSelect" :fixed="true" active-color="#07c160">
        <tabbar-item icon="description">文档</tabbar-item>
        <tabbar-item icon="search">搜索</tabbar-item>
        <tabbar-item icon="tv-o">示例</tabbar-item>
      </tabbar>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-undef */
import MxHeader from '@/components/mx-header/index'
import { Tabbar, TabbarItem } from 'vant'
export default {
  data() {
    return {
      tableData: [{
        propName: 'showButton',
        propType: 'Boolean',
        propDefault: 'true',
        propDescription: '是否显示定位按钮'
      }, {
        propName: 'showButton',
        propType: 'Boolean',
        propDefault: 'true',
        propDescription: '是否显示定位按钮'
      }, {
        propName: 'showButton',
        propType: 'Boolean',
        propDefault: 'true',
        propDescription: '是否显示定位按钮'
      }, {
        propName: 'showButton',
        propType: 'Boolean',
        propDefault: 'true',
        propDescription: '是否显示定位按钮'
      }],
      items: [{
        text: '地图属性',
        children: [
          { text: '中/英文地图', id: 1 },
          { text: '地图中心点', id: 2 },
          { text: '当地行政区', id: 3 },
          { text: '地图显示范围', id: 4 },
          { text: '点击获取经纬度', id: 5 },
          { text: '设置鼠标样式', id: 6 },
          { text: '显示缩放工具条', id: 7 }]
      }, {
        text: '其他服务',
        children: [
          { text: '定位', id: 1 },
          { text: '天气预报', id: 2 },
          { text: '公交信息查询', id: 3 }]
      }, {
        text: '覆盖物',
        children: [
          { text: '点标记', id: 1 },
          { text: '3D控制罗盘', id: 2 },
          { text: '信息窗体', id: 3 }]
      }],
      openLocationFlag: false, // 定位Flag，定位开启时为true
      geolocation: null, // 定位控件
      geolocationArg: { // 定位控件参数
        noIpLocate: 0, // 是否禁用IP定位：0（不禁用，默认值），1（手机设备禁用），2（PC设备禁用），3（所有设备都禁用）
        noGeoLocation: 0, // 是否禁用浏览器定位：0（不禁用，默认值），1（手机设备禁用），2（PC设备禁用），3（所有设备都禁用）
        enableHighAccuracy: true, // 是否使用高精度定位，默认：true
        timeout: 10000, // 超过10秒后停止定位，默认：无穷大
        maximumAge: 0, // 定位结果缓存0毫秒，默认：0毫秒
        showButton: true, // 显示定位按钮，默认：true
        buttonPosition: 'LB', // 定位按钮停靠位置，默认左下角
        buttonOffset: null, // new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
        showCircle: false, // 定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: false // 定位成功后调整地图视野范围，使定位位置及精度范围视野内可见，默认：false
      },
      mainActiveIndex: 0, // 左侧高亮元素的index
      activeId: 1, // 被选中元素的id
      activeNames0: ['10'],
      activeNames1: ['9'],
      activeNames2: ['1'],
      lang: 'zh_cn', // 地图标注的语言类型
      btnPos: 9,
      btnOffsetX: 0, // 定位按钮的偏移坐标x
      btnOffsetY: 0, // 定位按钮的偏移坐标y
      tabbarSelect: 2, // -------------------------------------------------
      mapObj: null,
      canLI: false,
      location: '',
      positionImg: '',
      isOutWork: this.$route.params.isOutWork === 'true',
      isPicture: this.$route.params.isImg === 'true',
      circle: null,
      currentMarker: null,
      infoWindow: null,
      selectPoint: null, // 选中的点
      curPositionShow: false,
      timer: ''
    }
  },
  components: {
    // Cell, Tab, Tabs, Tabbar, TabbarItem, mxLoadmore, MxHeader, noneTip
    Tabbar,
    TabbarItem,
    MxHeader
  },
  computed: {
    ...mapGetters({
      getLocation: 'getLocation'
    })
  },
  mounted() {
    this.getMap()
  },
  methods: {
    onNavClick(index) {
      this.mainActiveIndex = index
    },
    onItemClick(data) {
      this.activeId = data.id
      this.activeNames2 = ['3']
    },
    /**
     * 开启定位，
     * openLocationFlag为开启定位的标志位，
     * geolocation为用于定位设置的全局对象
     */
    startLocation() {
      if (!this.openLocationFlag) {
        let _self = this // 后续可能在局部作用域使用全局this，故定义一个_self
        this.geolocationArg.buttonOffset = new AMap.Pixel(this.btnOffsetX, this.btnOffsetY)
        this.mapObj.plugin('AMap.Geolocation', function() {
          _self.geolocation = new AMap.Geolocation(_self.geolocationArg)
        })
        _self.mapObj.addControl(_self.geolocation) // 添加定位控件后，记得把openLocationFlag标志位置true
        this.openLocationFlag = true
        this.$toast('定位已开启')
        // geolocation.getCurrentPosition()
        // AMap.event.addListener(geolocation, 'complete', onComplete) // 返回定位信息
        // AMap.event.addListener(geolocation, 'error', onError) // 返回定位出错信息
      } else {
        // 面包屑提示，已开启定位
        this.$toast('已开启定位')
      }
    },
    /**
     * 关闭定位
     * openLocationFlag为开启定位的标志位，
     * geolocation为用于定位设置的全局对象
     */
    stopLocation () {
      // if (this.$config.env === 'local') {
      //   if (this.timer) {
      //     clearInterval(this.timer)
      //   }
      // } else {
      //   this.$nativeApi.stopUpdatingLocation().then(() => { // 涉及cordova获取本机设备信息
      //     // 获取设备信息
      //     this.$toast('结束定位……')
      //   })
      // }
      if (this.openLocationFlag) {
        this.mapObj.removeControl(this.geolocation) // 删除定位控件后，记得把openLocationFlag标志位置false
        this.openLocationFlag = false
        this.$toast('定位已关闭')
      } else {
        this.$toast('尚未开启定位')
      }
    },
    /**
     * 显示/隐藏定位图标
     */
    showLocation() {
      if (this.openLocationFlag) {
        this.mapObj.removeControl(this.geolocation) // 删除定位控件后，记得把openLocationFlag标志位置false
        this.openLocationFlag = false
        // ？？？removeControl后，是否将this.geolocation的内存删掉了？或者后续垃圾回收时自动清除？
        // ？？？如果没有删除，那么每次切换显示/隐藏定位图标时产生很多垃圾（因为每次从隐藏到显示，都用newAMap.Geolocation开辟了一段内存）
        this.geolocationArg.buttonOffset = new AMap.Pixel(this.btnOffsetX, this.btnOffsetY)
        this.geolocationArg.showButton = !this.geolocationArg.showButton
        this.geolocation = new AMap.Geolocation(this.geolocationArg)
        this.mapObj.addControl(this.geolocation) // 添加定位控件后，记得把openLocationFlag标志位置true
        this.openLocationFlag = true
        // 定位图标的class名为amap-geo
        // document.getElementsByClassName('amap-geo')[0].style.display = (document.getElementsByClassName('amap-geo')[0].style.display === 'none') ? 'block' : 'none'
      } else {
        this.$toast('请先开启定位')
      }
    },
    changeLang () {
      this.mapObj.setLang(this.lang)
    },
    /**
     * 地图定位到当前中心点
     */
    curPosition() {
      if (this.getLocation) {
        this.selectPoint = null
        this.initcanLI(this.getLocation)
      }
    },
    /**
     * 设置定位
     */
    initcanLI(newval) {
      // 选中了点， 则停止定位到当前点，否则定位成功，回到当前点位中心点
      if (!this.selectPoint) {
        this.setPoint(newval.longitude, newval.latitude, newval.address)
      } else {
        // 如需实现以当前点位打卡点， 则执行下面逻辑后返回  如果始终保持计算最近点打卡，下面逻辑注释即可
      }
    },
    /**
     * 定位按钮的位置
     */
    setBtnPos() {
      if (this.openLocationFlag) {
        this.mapObj.removeControl(this.geolocation) // 删除定位控件后，记得把openLocationFlag标志位置false
        this.openLocationFlag = false
        switch (this.btnPos) {
          case 0:
            this.geolocationArg.buttonPosition = 'LB'
            break
          case 1:
            this.geolocationArg.buttonPosition = 'RB'
            break
          case 2:
            this.geolocationArg.buttonPosition = 'RT'
            break
          case 3:
            this.geolocationArg.buttonPosition = 'LT'
            break
        }
        this.buttonOffset = new AMap.Pixel(this.btnOffsetX, this.btnOffsetY)
        this.geolocation = new AMap.Geolocation(this.geolocationArg)
        this.mapObj.addControl(this.geolocation) // 添加定位控件后，记得把openLocationFlag标志位置true
        this.openLocationFlag = true
      } else {
        this.$toast('请先开启定位')
      }
    },
    getMap() {
      // AMap是高德地图的构造函数，这里.Map是创建地图，.Marker是创建坐标点
      this.mapObj = new AMap.Map('defaultMapContainer', {
        // 未设置高德地图初始点，默认为北京的人民公园
        // 'defaultMapContainer'是对应页面盒子的id
        resizeEnable: true, // 自适应大小
        dragEnable: true,
        zoom: 15, // 初始视窗放大比例
        center: [121.191912, 31.281215], // 中心点坐标,乘用车
        viewMode: '3D' // 使用3D视图
      })
      if (this.getLocation) {
        this.initcanLI(this.getLocation)
      }
      this.infoWindow = new AMap.InfoWindow({
        isCustom: true, // 使用自定义窗体
        autoMove: true,
        showShadow: true,
        content: '',
        offset: new AMap.Pixel(10, -45)
      })
    },
    /**
     * 设置是否显示放大缩小按钮
     */
    getToolBar() {
      let _self = this
      this.mapObj.plugin(['AMap.ToolBar'], function() {
        let toolBar = new AMap.ToolBar({
          position: 'LT', // 位置（LT:左上角）
          autoPosition: false // 自动定位
        })
        _self.mapObj.addControl(toolBar)
      })
    },
    /**
     * 设置窗体内容
     */
    getInfoContent(item) {
      // pointName radius latitude   longitude
      let infoWindow = document.createElement('div')
      let distance = -1
      let distanceStr = '--'
      if (
        this.getLocation &&
        this.getLocation.latitude &&
        this.getLocation.longitude
      ) {
        distance = this.$service.calculateDistance(
          item.latitude,
          item.longitude,
          this.getLocation.latitude,
          this.getLocation.longitude
        )
        if (distance >= 1000) {
          distanceStr = parseInt(distance / 1000, 10) + 'KM'
        } else {
          distanceStr = parseInt(distance) + 'M'
        }
      }

      infoWindow.className = 'marker-info'
      infoWindow.innerHTML =
        '<div style="background: #FFFFFF;padding: 5px;border-radius: 5px;font-family: PingFangSC-Regular;"><p style="font-size: 14px;color: #21272B;">' +
        item.pointName +
        '</p><div style="font-size: 12px;color: #919CA3;">距离: ' +
        distanceStr +
        '</div></div>'
      return infoWindow
    },
    /**
     * 设置标志物
     */
    setMarker(item, index) {
      let _self = this
      let point = new AMap.LngLat(item.longitude, item.latitude)
      // 创建一个 Marker 实例：
      let marker = new AMap.Marker({
        content:
          '<div class="icon-map-marker txt-white">' + (index + 1) + '</div>',
        topWhenClick: true,
        clickable: true,
        position: point, // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        zIndex: 105,
        title: item.pointName,
        extData: item
      })

      AMap.event.addListener(marker, 'click', function(event) {
        let data = event.target.getExtData()
        _self.selectPoint = data
        _self.initcanLI(_self.getLocation)
        _self.infoWindow.setContent(_self.getInfoContent(data))
        _self.infoWindow.open(_self.mapObj, marker.getPosition())
      })

      // 将创建的点标记添加到已有的地图实例
      marker.setMap(this.mapObj)
    },
    /**
     * 设置范围圆圈
     */
    setCircle(lang, lat) {
      if (this.circle) {
        this.circle.setCenter(new AMap.LngLat(lang, lat))
      } else {
        this.circle = new AMap.Circle({
          strokeWeight: 0.5,
          strokeColor: '#3685d6',
          strokeOpacity: 0,
          fillColor: '#3685d6',
          fillOpacity: 0.2,
          radius: 100,
          center: new AMap.LngLat(lang, lat),
          map: this.mapObj
        })
      }
    },
    /**
     * 设置中心点
     */
    setPoint(lang, lat, address) {
      // 创建一个 Marker 实例：
      let point = new AMap.LngLat(lang, lat)

      // 将创建的点标记添加到已有的地图实例：
      this.mapObj.setCenter(point)
      if (this.currentMarker) {
        this.currentMarker.setMap(null)
      }
      this.currentMarker = new AMap.Marker({
        content: '<div class="icon-location-marker txt-white">' + '</div>',
        position: point,
        label: {
          content: '当前位置',
          position: 'TM',
          offset: new AMap.Pixel(-10, -28)
        },
        zIndex: 110,
        topWhenClick: true // 鼠标点击时该标记默认制定
      })
      this.currentMarker.setMap(this.mapObj)
    },
    // ********测试内容****************
    openInfoWindow() {
      // AMap.event.addListener(marker, 'click', function () { // 监听圆形标记的点击事件
      //   infoWindow.open(map, marker.getPosition()) // 信息窗体打开
      // })
      this.infoWindow.setContent(
        this.getInfoContent({
          longitude: 116.23,
          latitude: 39.54,
          pointName: '测试地点'
        })
      )

      this.infoWindow.open(this.mapObj, [116.23, 39.54]) // 信息窗体打开
    },
    setDemoPoint() {
      this.selectPoint = null
      this.$store.commit('updateLocation', {
        longitude: 116.23,
        latitude: 39.54,
        pointName: '示例地点'
      })
      console.log('this.getLocation:' + this.getLocation.latitude.toString())
    }
  },
  updated() {
    // 滚动条位置的监听放到activated是因为此页面被keep-alive缓存了
    // this.getMap()
  },
  watch: {
    getLocation: function(newval, oldval) {
      console.log('a', newval)
      // 根据获取的打开点记录，与获取到的定位进行比对，范围内则进行设置可以进行gps打卡
      this.setCircle(newval.longitude, newval.latitude)
      this.initcanLI(newval)
    }
  }
}
</script>
<style lang="less" scoped>
.title {
  padding: 0.1rem 0.1rem;
  font-size: 16px;
  font-weight: bold;
  background-color: #fafafa;
}
.all-point {
  z-index: 10;
  position: absolute;
  top: 54px;
  right: 10px;
  width: 145px;
  height: 35px;
  font-size: 0;
  color: #fff;
  line-height: 35px;
  background-color: #198cfa;
  border: 1px solid #bebdbb;
  border-radius: 4px;
}
.all-point:before {
  padding: 8px;
  font-size: 20px;
}
.all-point button {
  float: right;
  margin-top: -1px;
  margin-right: -1px;
  width: 110px;
  height: 35px;
  padding: 0 5px;
  min-height: inherit;
  line-height: 35px;
  font-size: 13px;
  color: #000;
  background-color: #fff;
  border: 1px solid #bebdbb;
  border-left-width: 0;
  border-radius: 0 4px 4px 0px;
}
.amap {
  width: 100%;
  height: 40%;
}
.cur-position {
  background-image: url('../../assets/img/cur_position.svg');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100%;
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  bottom: 0.3rem;
  left: 0.1rem;
  z-index: 9999;
}

.demo-btn {
  margin: 0;
  background: #f9fafc;
  font-weight: 400;
  font-size: 14px;
  color: #409eff;
  padding: 15px;
  margin: 5px 10px;
  text-align: center;
  display: inline-block;
}
</style>
