# [html5](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)

## [内容区](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#Flow_content)

根据元素的特性可以分为一些内容区，每个元素都属于一些内容区的成员。这是一个松耦合，因为它并不在这些类型里边创建元素之间的关系。但是， 当涉及到内部的细节，就需要定义并描述元素的行为和他们必须遵守的相关规则。 

+ 主内容， 描述许多元素共享的，常用的内容规则
  + 元数据内容，主要为了修改其他元素的展示和行为，设置其他文档的链接，等，`base, link，meta, noscript, script, style， title.`
  + 流内容，此类元素通常包含文本或者嵌入内容。`a`， `abbr`， `address`， `article`， `aside`， `audio`， `b`, `bdo`， `bdi`， `blockquote`， `br`， `button`， `canvas`， `cite`， `code`， `data`， `datalist`， `del`， `details`， `dfn`， `div`， `dl`， `em`， `embed`， `fieldset`， `figure`， `footer`， `form`， `h1`， `h2`， `h3`， `h4`， `h5`， `h6`， `header`， `hgroup`， `hr`， `i`， `iframe`， `img`， `input`， `ins`， `kbd`，`label`， `main`， `map`， `mark`， `math`， `menu`， `meter`， `nav`， `noscript`， `object`， `ol`， `output`， `p`， `pre`， `progress`， `q`， `ruby`， `s`， `samp`， `script`， `section`， `select`， `small`， `span`， `strong`， `sub`， `sup`， `svg`， `table`， `template`， `textarea`， `time`， `ul`， `var`， `video`， `wbr`，`Text`.等
+ 表单相关内容
+ 特定内容

（未完整）

## 更多语义

### section && ourline

+ `section` 单独的一个文档区域，没有特定的语义元素来表示。 如果说导航菜单应该用nav, 那么搜索结果列表，地图及控制器的显示，应该是一个section. 。
  + 逻辑上应该是文档的一个outline，
  + 通常用`h1`,`h6`,`p`等标签作为孩子
  + 不要做div容器，不要做article的角色。
+ `article`, 文档中自包含的组件，应用，页面或者站点，可以独立分发或者重用。比如论坛帖子，杂志文章，博客等。
  + 作者信息可以用`address`来表示，嵌套`article`不可以
  + `article`可以嵌套，表示是与之相关的`article`比如评论
  + 时间可以用`time`元素表示
+ `nav`, 提供导航链接， 菜单，目录， 索引等等。
  + 用在主导航块， `footer`的链接就不需要用。
  + 可以有多个`nav`,比如一个用于站点导航，一个用于页面导航
+ `aside`内容不与文档主内容直接相关的一块区域，也表述为sidebar, call-out box.
+ `header`, 介绍性的内容，或者导航帮助，可能包含`h1`,...,`h6`,搜索表单，logo，作者名等
+ `footer` 最近的一个section或者一个section root的页脚。不是一个section， 可以包含作者信息等
+ `hgroup` 文档section的一个多级标题，`h1`到`h6`