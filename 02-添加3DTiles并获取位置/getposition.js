// 在发布Cesium应用程序之前，请访问https://www.bingmapsportal.com获取您自己的Bing Maps API密钥：
// Cesium.BingMapsApi.defaultKey ='把你的API密钥放在这里';

// 构造默认的地形源列表。
// var terrainModels = Cesium.createDefaultTerrainProviderViewModels();

// 使用我们对此基本应用程序所需的内容构建查看器
var viewer = new Cesium.Viewer('cesiumContainer', {
    timeline: false,
    animation: false,
    vrButton: true,
    sceneModePicker: false,
    infoBox: true,
    // scene3DOnly:true,
    // terrainProviderViewModels: terrainModels,
    // selectedTerrainProviderViewModel: terrainModels[1]  // 选择STK高分辨率地形
});

// 没有针对地形的深度测试以避免z战斗
viewer.scene.globe.depthTestAgainstTerrain = false;

// 边界球体
//var boundingSphere = new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(111.5652101, 38.70350851, 1297.500143), 143.6271004);
var boundingSphere = new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(111.5652101, 38.70350851, 100.500143), 143.6271004);

// 覆盖主页按钮的行为
viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (commandInfo) {
    // 飞到自定义位置
    viewer.camera.flyToBoundingSphere(boundingSphere);

    // 告诉主页按钮不要做任何事情
    commandInfo.cancel = true;
});

// 设置自定义初始位置
viewer.camera.flyToBoundingSphere(boundingSphere, { duration: 0 });

// 添加tileset。 不要忘记将默认屏幕空间错误减少到2
// var origin = Cesium.Cartesian3.fromDegrees(-95.0, 40.0, 200000.0);
// var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin);
var x = 360.0;
var y = -920.0;
var z = -820.0;
// var x = 0;
// var y = 0;
// var z = 0;
var m = Cesium.Matrix4.fromArray([
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    x, y, z, 1.0
]);

var tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    url: 'Scene/testm3DTiles.json', //数据路径
    maximumScreenSpaceError: 2, //最大的屏幕空间误差
    maximumNumberOfLoadedTiles: 1000, //最大加载瓦片个数
    // 矩阵生效
    modelMatrix: m  //方法一，动态修改modelMatrix
}));


var boundingSphere = null; // = new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(111.5652101, 38.70350851, 100.500143), 143.6271004);

function zoomToTileset() {
    boundingSphere = tileset.boundingSphere;
    viewer.camera.viewBoundingSphere(boundingSphere, new Cesium.HeadingPitchRange(0, -2.0, 0));
    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

    //changeHeight(0);
}

tileset.readyPromise.then(zoomToTileset);
// scene.morphComplete.addEventListener(zoomToTileset);
var step = 10;

function changeStep(stepin) {
    step = stepin;
}

function change(type) {
    switch (type) {
        case 0:
            x += step;
            break;
        case 1:
            x -= step;
            break;
        case 2:
            y += step;
            break;
        case 3:
            y -= step;
            break;
        case 4:
            z += step;
            break;
        case 5:
            z -= step;
            break;
    }

    //创建平移矩阵方法一
    // m = Cesium.Matrix4.fromArray([
    //     1.0, 0.0, 0.0, 0.0,
    //     0.0, 1.0, 0.0, 0.0,
    //     0.0, 0.0, 1.0, 0.0,
    //     x, y, z, 1.0
    // ]);

    //创建平移矩阵方法二
    var translation = Cesium.Cartesian3.fromArray([x, y, z]);
    m = Cesium.Matrix4.fromTranslation(translation);

    document.getElementById("result").innerText = "x:" + x + " y:" + y + " z:" + z;

    tileset.modelMatrix = m;
}

// 旋转
// function rotation() {
//     var m = tileset.modelMatrix;
//     //RotateX为旋转角度，转为弧度再参与运算
//     var m1 = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(0.5));

//     //矩阵计算
//     Cesium.Matrix4.multiplyByMatrix3(m, m1, m);

//     //赋值
//     tileset.modelMatrix = m;
// }

function changevisible() {
    tileset.show = !tileset.show;
}

//方法二，直接调用函数，调整高度,height表示物体离地面的高度
function changeHeight(height) {
    height = Number(height);
    if (isNaN(height)) {
        return;
    }

    var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
    var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
    var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);
    var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
}