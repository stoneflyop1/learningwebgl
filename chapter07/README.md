# 进入三维世界

## 立方体由三角形构成

绘制两维图形时，只需要考虑顶点坐标；而绘制三维物体时，还需要考虑深度信息(depth info)。

定义观察者：

- 观察方向，即：观察者自己在什么位置(`视点`)，在看场景的哪一部分(`视线`)？
- 可视距离，即：观察者能够看多远？

## 视点(eye point)和视线(viewing direction)

默认情况下，`视点`位于原点，`视线`为Z轴负半轴(指向屏幕内部)。

### 视点、观察目标点(look-at point)和上方向(up direction)

- 视点：观察者所在的三维空间位置，视线的起点。(eyeX, eyeY, eyeZ)
- 观察目标点：被观察目标所在的点。视线从视点出发，穿过观察目标点并继续延伸。(atX, atY, atZ)
- 上方向：最终绘制在屏幕上的影像中的向上的方向。(upX, upY, upZ)

如上三个矢量可以组成`视图矩阵`(`view matrix`)。它可以表示观察者的状态，含有观察者的视点、观察目标点和上方向等信息，它最终影响了观察者观察到的场景。

观察者默认状态：

- 视点位于vec3(0.0,0.0,0.0)
- 视线为Z轴负方向，观察点为vec3(0.0,0.0,-1.0)
- 上方向为Y轴负方向，即：vec3(0.0,1.0,0.0)


[三个三角形示例](01lookattriangles.html)

对图形进行旋转、平移、缩放等基本变换或它们的组合的矩阵称为`模型矩阵`(`model matrix`)。

[Model and View Matrix](02lookattrianglesRotation.html)

[ModelViewMatrix](03lookattrianglesRotation.html)

[ModelViewMatrixWithKeyDownLeft->Right](04lookattrianglesRotationKey.html)

## 可视空间(viewing volume)

- 长方体空间(rectangular parallelepiped)或盒状空间(box)，由正射投影(orthographic projection)产生
- 金字塔空间(quadrangular pyramid)，由透视投影(perspective projection)产生

### 正射投影示例

[正射投影](05OrthoView.html)

[补全丢失的一角](06OrthoView2.html)

### 透视投影

[透视投影](07PerspectiveView.html)


[联合1](08PMView1.html)

[联合2](08PMView2.html)

[联合3WithDepthTest](08PMView3.html)

## 立方体

为了重用顶点数据，我们需要给顶点编号，然后使用gl.drawElements()函数绘制三角形形成矩形，进而形成立方体。

注：顶点及编号数据一般可以通过三维建模软件生成。

[立方体](09HelloCube.html)

[单色面立方体](09HelloCubeColored.html)