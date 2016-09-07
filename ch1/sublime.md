[来源](https://developers.google.com/web/tools/setup/setup-editor?hl=en)
# 安装包管理器
[参考](http://robdodson.me/sublime-text-2-tips-and-shortcuts/)

### [流行插件趋势](https://packagecontrol.io/browse)

###偏好
+ `Preferences > Key Bindings - User`
>看起来很不直观，不友好，但这是强大功能的通病，如果要更改快捷键，就是这个菜单。
>要修改
><pre>`{ "keys": ["super+shift+r"], "command": "insert_snippet", "args": { "name": "Packages/XML/long-tag.sublime-snippet" } },
{ "keys": ["alt+shift+r"], "command": "wrap_zen_as_you_type",
"context": [
    {
      "operand": "text.html, text.xml",
      "operator": "equal",
      "match_all": true,
      "key": "selector"
    }
  ]
}
`
</pre>
>其中，`super`指的`ctrl`键。


+ [包管理器 https://packagecontrol.io/installation](https://packagecontrol.io/installation)。用来管理/发现插件
>使用简单安装，避免因为某个依赖失败

>安装完成，重新启动sublime，

>打开`package control`,选择`install packages`.就可以随便装了。安装过程用`ctrl+`` 查看

---

+ [Tag插件]
+ [emmet-sublime插件 https://github.com/sergeche/emmet-sublime](https://github.com/sergeche/emmet-sublime)


+ `ctrl+shift+p` 打开命令面板，当你不记得命令在那个菜单下。

+ `ctrl+p`
> 输入名字帮你导航文件，
> 
> 输入前面加@可以帮你在文档内部定位。markdown给你找出header，js或者ruby列出对象的方法。

> 前面加`:`可以进入指定行。

+ 窗口分离。
> view --> layouts.

+ 选取
> `ctrl+shift+a` html选中整个`<tag>`
> `ctrl+l` 选中整行
> `ctrl+d` 选中整字，多次按多个选中，这叫`multiple cursors`。
> 选中文本块，`ctrl+shift+l`,激活多光标。`ctrl`随便点也可以激活，
> `ctrl+shift`+上下箭头。


+ 页面加书签 `ctrl+F2`， 遍历书签`F2`,直接定位书签`goto`->`bookmarks`

+ 标记Mark功能，有点像vi编辑器

+ 项目整体保存
> 将文件夹`save project as `到项目根目录，下次打开`recent projects`可以打开整个文件夹

+ `ctrl+``: open console.
+ `ctrl+pageDown|pageUp`:  navigate between tabs
+ `ctrl+p`: open file
+ `ctrl+w`: close tab
+ `ctrl+d`: select word
+ `ctrl+alt+f`: 格式化js， jsformat插件
+ 