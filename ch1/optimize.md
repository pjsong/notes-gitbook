#页面优化
[权威工具http://discover-devtools.codeschool.com/](http://discover-devtools.codeschool.com/)

[参考https://varvy.com/pagespeed/](https://varvy.com/pagespeed/)

###常识
+ css 文件越少越好，版本越少越好。 [参考](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css)
+ js文件延迟加载，使其不影响浏览器关键render路径。
  + 延迟加载就是在页面内容加载完成之后，再来加载和解析js。
  + 使用onload事件。用defer或者async或者把js放到页面最后，不解决延迟加载的问题。没有async|defer属性的script是在html解析中遇到script时，停下来加载和解析js，完成之后继续自己的html解析。使用async属性后，加载和html解析同时进行，当js加载完成时，阻塞html解析，等js解析完成再开始。defer是在aysnc的基础上，不阻塞html解析。等html解析结束再来解析js。[参考](http://www.growingwiththeweb.com/2014/02/async-vs-defer-attributes.html)
  + 测试地址https://varvy.com/tools/js/(https://varvy.com/tools/js/)

###概念：

+ DOMContentLoaded:  在加载css,图片,subframe之前，html文档完整加载和解析完成时触发。加载。load用来检测一个完全加载的页面。devtools中的蓝色竖条表示
+ load： 资源和其依赖全部加载完成。devtools中的红色竖条表示