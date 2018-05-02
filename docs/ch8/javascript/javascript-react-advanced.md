# 高级教程<https://reactjs.org/docs/jsx-in-depth.html>

## web component

<https://developer.mozilla.org/en-US/docs/Web/Web_Components>
解决代码重用的问题，主要有四个技术(API)

+ 定制元素， 定制element和其行为，用于界面设计
+ shadowDOM， 给元素附加一个封装过的shadowDOM, 这个DOM独立于主DOM的渲染，并控制关联的功能。这样元素实现了封装的特性
+ HTML template模板。`template`和`slot`标签可以让你在渲染页面中不显示的标注模板。模板可以多次使用，作为定制元素结构的基础。
+ HTML Imports引入。定义好定制组件，重用最简单的方式就是通过Import引入. 这api就是实现这个功能。

### 基本方法

+ 定义一个class并封装功能。
+ 用`CustomElementRegistry.define()`注册元素。传入元素名称，功能定义class，以及从哪个元素继承(可选)。
+ 必要时，附上`Element.attachShadow()`Shadow DOM，用DOM方法加上Listener，孩子元素。
+ 必要时，定义`<template>`和`<slot>`模板。用正规的DOM方法克隆并付到shadowDOM.
+ 此时元素就能使用了。


