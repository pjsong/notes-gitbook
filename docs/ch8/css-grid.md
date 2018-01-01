# Css Grid布局

<https://gridbyexample.com/what/>
<https://css-tricks.com/snippets/css/complete-guide-grid/#prop-grid-template-columns-rows>
<https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Grids>

## 概念

+ 页面元素的二维布局方法。我们可以用css来描述格子结构，而不是html
+ 将元素从源文件的顺序与表示顺序分离，
+ flex是一维(单行或列)，grid是二维，

grid就是水平和垂直的线条集合，通过它们我们排列元素。它能帮助我们创建一些设计，元素不跳来跳去，或者改变宽度。grid有行，列，还有间隙叫做gutter.

在网站使用grid,你不用担心一个元素相对与其他元素应该有多宽，你只考虑，这个元素应该跨多少个列。

当前，grid类型的布局主流是使用float。