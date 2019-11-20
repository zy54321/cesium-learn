# 返回按钮可以自行飞向自定义经纬度坐标
```
viewer.scene.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(101.88, 39.78,10000000)
          });
```
# 使用方法

```
 <script src="./node_modules/cesium-navigation/navigation.js"></script>

    Cesium.viewerCesiumNavigationMixin(viewer,{});
```

