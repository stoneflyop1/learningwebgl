# 高级主题

## 旋转物体

[旋转物体](01RotateObject.html)

## 选择物体

以选择一个立方体为例

1. 当鼠标按下时，把立方体的颜色设置为单一的红色
2. 读取选择点的像素值（颜色）
3. 重新把立方体设置为原始的颜色
4. 如果选择点的像素颜色为红色，则选中了立方体

选择整个物体，可以使用单一颜色。[选择立方体](02PickObject.html)

选择一个物体的面，可以使用alpha通道的值给面编号。[选择立方体的面](03PickFace.html)

## 平视显示器(Head Up Display, HUD)

在三维场景上叠加文本或二维图形信息。

1. 额外准备一个canvas并与webgl的canvas重叠放置(HUD的canvas位于上层)
2. 绘制webgl三维场景
3. 使用canvas 2D API绘制HUD信息

注： canvas默认的背景是透明的。

[示例](04HUD.html)

## 雾化(大气效果) Fog(Atmospheric Effect)

雾化用来描述远处的物体看上去较为模糊的现象。

1. <雾化因子> = ( <终点> - <当前点与视点的距离> ) / ( <终点> - <起点> )，其中 <起点> <= <当前点与视点间的距离> <= <终点>
2. <片元颜色> = <物体颜色> X <雾化因子> + <雾的颜色> X ( 1 - <雾化因子> )

[示例](05Fog.html)

### 使用position的w分量

shader中的gl_Postion的w分量的值一般就是顶点坐标的z分量乘以-1。

在视图坐标系中，视点在原点，视线沿着Z轴负方向，观察者看到的物体其视图坐标系z分量都是负的，而gl_Position的w分量值正好是z分量值乘以-1，所以可以直接使用该值来近似顶点与视点的距离。

[使用z的示例](05Fogw.html)

## 圆形点

涉及的shader变量：

| 变量类型和名称 | 描述 |
| ---- | ---- |
| vec4 gl_FragCoord | 片元的窗口坐标 |
| vec4 gl_PointCoord | 片元在被绘制的点内的坐标(0.0~1.0) |

1. 假设圆半径为r
2. 计算片元距离点中心的距离
3. 若小于r，则绘制该片元，否则舍弃(discard)它

[示例](06RoundPnts.html)

## Alpha Blending

使用Alpha混合可实现半透明效果。

```js
gl.enable(gl.BLEND); // 开启混合功能
const src_factor = gl.SRC_ALPHA; // 源颜色在混合后颜色中的权重因子
const dst_factor = gl.ONE_MINUS_SRC_ALPHA; // 指定目标颜色再混合后颜色中的权重因子
gl.blendFunc(src_factor, dst_factor); // 指定混合函数
```

`混合后颜色 = 源颜色 X src_factor + 目标颜色 X dst_factor`

[三角形示例](07LookAtBlendedTriangles.html)

[立方体示例](08HelloCubeBlend.html)

立方体示例中关闭了隐藏面消除功能，若要实现透明与不透明物体共存，则需要使用开启此功能：

1. 开启隐藏面消除功能
    ```js
    gl.enable(gl.DEPTH_TEST);
    ```
2. 绘制所有不透明物体
3. 锁定用于进行隐藏面消除的[深度缓冲区](../chapter07)的写入操作，使之只读
   ```js
   gl.depthMask(false);
   ```
4. 绘制所有半透明物体，注意它们应当按照深度排序，然后从后向前绘制
5. 释放深度缓冲区，使之可读可写
   ```js
   gl.depthMask(true);
   ```

## 使用多个着色器

多个着色器需要多个WebGLProgram的使用。

[示例](09ProgramObject.html)，可以使用python的simplehttpserver避免跨域问题

```sh
python -m http.server # http://localhost:8000/chapter10/09ProgramObject.html
# or
python server.py
```