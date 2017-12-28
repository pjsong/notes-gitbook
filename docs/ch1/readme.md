# CMS 系统

## 可用参考项目

<https://gist.github.com/eyecatchup/89942bd609be89e5a9fefdf459a10b04>，该列表没有包含 [hexo] (https://hexo.io/docs/)

## keystonejs

### 选择原因

+ 优点：简单， 只需要依赖keystone和underscore. 前端独立性好.
+ 缺点：是否headless更好

### 步骤

```bash
npm install -g generator-keystone
mkdir myproject
cd myproject
yo keystone
```

### 其他

<http://apostrophecms.org/>

#### enduro.js

自己宣称， 是一个web开发框架。

#### hexo

hexo 简单， 缺少数据库， 编码程度小

```bash
npm install hexo-cli -g
hexo init blogger
cd blogger
npm install
npm server
```


## 放弃

### ghost

ghost感觉偏向商业化，比较复杂， 按照文档建立开发环境， bower依赖总是出错。放弃。