# 光照(Lighting Objects)

- 明暗(shading)、阴影(shadowns)、不同类型的光：点光源光(point)、平行光(directional)以及环境光(ambient)
- 物体表面反射光线的方式：漫反射(diffuse)和环境反射(ambient)

## 光照原理

漫反射颜色 = 入射光颜色 X 表面基底色 X ( 光线方向 * 法线方向 )

环境反射光颜色 = 入射光颜色 X 表面基底色

物体表面反射光颜色 = 漫反射颜色 + 环境反射光颜色

注：其中光线方向和发现方向需要归一化处理

