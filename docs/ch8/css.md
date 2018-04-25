# CSS

+ bootstrap[official](http://v4-alpha.getbootstrap.com/)
+ materialcss[official](http://materializecss.com/buttons.html)
+ ng-bootstrap[official](https://github.com/ng-bootstrap)
+ ng2-bootstrap[official](http://valor-software.com/ng2-bootstrap)
+ angular-ui[official](https://github.com/angular-ui)

## Mozilla css

<https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Combinators_and_multiple_selectors#Multiple_selectors_on_one_rule>

### 组合关系

+ `A，B`: 任意一个即可
+ `A B`: B是A的后代
+ `A>B`: B是A直接孩子
+ `A+B`: B是A的下一个邻居
+ `A~B`: B是A的邻居

### 伪类/伪属性

伪类是些状态关键字，用`：`打头，放在选择器后面，表示只在元素处在一定的状态时应用。

:active   :any    :checked    :default    :dir()    :disabled
:empty    :enabled
:first    :first-child    :first-of-type    :fullscreen
:focus    :focus-within    :hover
:indeterminate    :in-range    :invalid
:lang()    :last-child    :last-of-type    :left    :link
:not()    :nth-child()    :nth-last-child()    :nth-last-of-type()    :nth-of-type()
:only-child    :only-of-type    :optional    :out-of-range
:read-only    :read-write    :required    :right    :root
:scope    :target    :valid    :visited

```css
ul {
  padding: 0;
}

li {
  padding: 3px;
  margin-bottom: 5px;
  list-style-type: none;
}

a {
  text-decoration: none;
  color: black;
}

a:hover {
  text-decoration: underline;
  color: red;
}

li:nth-of-type(even) {
  background-color: #ccc;
}

li:nth-of-type(odd) {
  background-color: #eee;
}
```

### 伪元素

<https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Pseudo-classes_and_pseudo-elements>

关键字，：：打头，放到元素后，选择元素的一部分。比如after就是元素后，before元素前。

::after    ::before    ::first-letter    ::first-line
::selection    ::backdrop

```css
/* All elements with an attribute "href", which values
   start with "http", will be added an arrow after its
   content (to indicate it's an external link) */
[href^=http]::after {
  content: '⤴';
}
```

### 属性选择器

<https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Attribute_selectors>

`[attr]` :包含该attr属性,
`[attr=val]`: 属性attr值是val,
`[attr~=val]`: 属性值是一个空格分割的列表，val在其中。

`[attr|=val]`： 值就是val，或者val-打头，注意`-`,主要用于处理语言代码比如`[lang|=fr]`
`[attr^=val]`: val打头,
`[attr$=val]`: val打尾,
`[attr*=val]`: 值包含val, 注意与~=的区别，这里空格当作值的一部分而不是分割符

### 简单选择器

<https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Simple_selectors>
`elementType`：元素选择器。
`.className`:类选择器
`#id`：id选择器
`*`: 全局选择器,选择所有元素，常与其他组合使用。

### 值和单位

值类型： 数量值，百分比，颜色，坐标，函数。

绝对单位: px用的最多，尺寸总是一样大。其他绝对单位还有cm,mm,in,厘米毫米英寸，pt,pc(Point为1/72个英寸，picas为12个Point).

相对单位：

+ em，当前元素font-size下M的宽度，浏览器给页面缺省的基本font-size是16pixel,不过元素的font-size会从parent那里继承。是使用最多的相对单位.
+ ex,ch，小写x的高度，0的宽度，支持度不如em
+ rem(root em): 工作方式与em相同，除了总等于基本的font-size，而不会继承parent.
+ vw,vh: view port 1/100的宽度和高度，不如rem支持广泛。

无单位的数值： 表示百分比，如`line-height: 1.5;`，放大1.5倍。

### 瀑布模型cascade

从名字可以猜到，css应用与规则定义的顺序有关系，但哪个选择器会胜出还与三个因素有关系，按照重要程度从高到底排列

+ importance, !important优先级最高
+ Specificity，除了important, 优先级接下来是 id > class > element。specificity的程度还可以用四个值(组件，可以分别看作千，百，十，个位)来定义：
  + 如果定义在元素的stype属性，千位是1,
  + 如果id在选择范围，百位是1,
  + 如果class，attribute在范围，十位为1,
  + 如果元素或者伪元素在选择范围，，个位是1,
+ 规则定义的顺序

### 继承

应用到元素的属性，有些被孩子元素继承，有些不会。具体可以根据常识判断。

继承的属性： font-family; color
不继承的属性： margin, padding, border, background-image

可以控制继承：

+ inherit: 该值从parent获取
+ initial: 取浏览器的缺省值
+ unset: 根据情况自然取. 如果该属性可以inherit就从parent取,否则取initial。

### 盒子模型

<https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Box_model>
盒子模型是布局的基础，任何元素都表现为一个矩形box，包括box的内容，padding,border, margin,一个接一个如果洋葱的层。浏览器要提交一个布局，首先要计算出每个盒子内容的样式，盒子周围的层的尺寸，盒子想对于其他盒子的位置。

#### 一般操作

+ content: width, height, min-width, max-width, min-height,max-height.
+ padding: padding, padding-top, padding-right, padding-bottom, padding-left
+ border:
  + border-top, border-right, border-bottom, border-left
  + border-width, border-style, border-color，
  + border-top-width, border-top-style, border-top-color
+ margin: margin, margin-top, margin-right, margin-bottom, margin-left

#### 高级盒子操作

+ overflow: 当设置盒子尺寸比如宽高，为绝对值单位，内容可能超出了该范围，此时我们用overflow来操作。
  + auto: 超出被隐藏，露出滚动条
  + hidden: 直接隐藏
  + visible： 缺省，超出部分在盒子外显示
+ background-clip: 盒子背景由颜色background-color和图片background-image堆积组成，缺省时背景扩展到了边界外部，但有时比如使用多个背景图片平铺，就需要把背景限定在内容边界内部
  + border-box
  + padding-box
  + content-box

outline不属于盒子的一部分。outline在margin内部，border之外

#### 盒子类型

前面说的都是块级别(block level)元素的box，还有一种类型的box，通过display属性指定，display可以有很多值，这里说最常用的三种。

+ block： 堆在其他盒子之上，盒子之前和之后的内容显示在分开的行。
+ inline: 与block相反，跟着文档的文本走，内容可以像文本行一样换行，没有width, height设定，margin和border会影响周边文本的位置，不影响周边的block box.
+ inline-block: 介于前面两者之间。顺着文本前边除非空间不够，不产生换行，后面可以用width和height像block一样维护完整性，后面不会产生换行。

### layout

#### [positioning](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Positioning)

##### 文档流

Positioning 可以把元素从一般的文档布局流中拿出来，形成单独的行为。比如，居于其他元素之上，停留在浏览器视窗的固定位置，
Positioning是一个相当复杂的主题。我们需要首先复习一些布局理论。

首先，单个的元素box通过元素的内容来布局，然后添加padding, border, margin.
缺省情况， 一个block级别的元素内容，占用父元素100%的宽度，高度与内容一致。inline级别的元素宽度和高度都和父元素一致，不能设置宽度和高度，他们在block级别元素的内容里边。
如果要设置inline元素有block级别元素的行为，要用display:block.

这是说单个元素， 如果元素之间相互作用呢？ 一般的布局流就是一个元素放到浏览器视窗的系统，缺省情况block级别的垂直向下， 一个元素一行，由margin来设置距离。

inline元素不同， 不显示在新的行， 和别的元素留在同一行，只要父元素还有空间，如果没有空间， 溢出的文本或者元素移到一个新行。

如果相邻的两个元素都设置了margin, 两个margin接触在一起， 大的一个生效，小的那个消失， 这个叫margin collapse.

##### 引入positioning

Positioning的主要思想， 是重载基本文档流的行为，产生有趣的效果。

通过position属性， 元素可以有许多不同的Positioning类型，

+ static静态， 元素的缺省类型。
+ relative相对，与静态类似，除了一旦在一般布局中获取到位置后，你还可以修改它最后的位置，比如用top,left,bottom,right属性，可能覆盖页面的其他元素。
+ absolute绝对，
  + 元素已经从一般布局中提取出来，处在自己的独立层。
  + 元素的位置改变。absolute中的top,bottom,left,right的行为与之前有所不同。它不是指定元素进来的方向，而是指定他和包含它的容器的距离。
  + 缺省包含容器是html,元素处在body中。但可以修改这个context,修改下这个元素的某个祖先position为relative。比如把body设为relative, 元素的context就成为body.
  + 引入z-index. 如果元素重叠了怎么办？上面只有一个absolute的元素，可以直接覆盖在上面，如果有多个呢？根据positon元素出现的顺序，后面的覆盖前面的。如果要改变，就使用z-index，相当于x轴y轴，z指z轴z-aixis.x轴左到右，y上倒下，z里到外。缺省为0
+ fixed固定. 固定类似于absolute，有一点区别是：固定位置是想对于html或者某个祖先，fixed想对于浏览器的视窗。比如nav菜单。
+ 实验阶段的sticky，支持不广泛，属于relative和fixed的混合。允许元素像relative一样，直到滚动到某一个坐标。之后就变成fixed.

## [属性](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)

### [box-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow)

### [transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function)

+ 坐标系：左上角为原点，右下为x，y坐标方向
+ 一个转换函数由一个二维矩阵表示，由此实现旋转，缩放，变形。组合变形函数从右到左的顺序实现。
+ 平移的变换不是线性的，因此需要两个参数作为向量分别表示。
+ 矩阵变形：

### at-rule @规则

<https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule>
<https://css-tricks.com/the-at-rules-of-css/>
at-rule各种句法不同。

#### 例子

@keyframe <https://www.w3schools.com/cssref/tryit.asp?filename=trycss3_keyframes>

```css
div {
    width: 200px;
    height: 100px;
    background: red;
    position :relative;
    -webkit-animation: mymove 5s infinite; /* Safari 4.0 - 8.0 */
    animation: mymove 5s infinite;
}
/* Standard syntax */
@keyframes mymove {
    from {top: 0px;}
    to {top: 200px;}
}
```