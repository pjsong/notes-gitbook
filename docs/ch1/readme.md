# CMS 系统

## 可用参考项目

[列表](https://gist.github.com/eyecatchup/89942bd609be89e5a9fefdf459a10b04),
该列表没有包含 [hexo](https://hexo.io/docs/)

## keystonejs

### 选择原因

+ 优点：简单， 只需要依赖keystone和underscore. 前端独立性好.

### 步骤

#### 选项1 从其他github库clone再修改

<https://github.com/JedWatson/keystone-demo.git>

#### 选项2 新生成

生成过程可能访问github失败，需要`export HTTP_PROXY=http://example.com:1234`或者`npm config set proxy http://example.com:8080`

```bash
npm install -g generator-keystone
mkdir myproject
cd myproject
yo keystone

? What is the name of your project? My Site
? Would you like to use Jade, Nunjucks, Twig or Handlebars for templates? [jade
| nunjucks | twig | hbs] hbs
? Which CSS pre-processor would you like? [less | sass | stylus] sass
? Would you like to include a Blog? Yes
? Would you like to include an Image Gallery? Yes
? Would you like to include a Contact Form? Yes
? What would you like to call the User model? User
? Enter an email address for the first Admin user: xxx@qq.com
? Enter a password for the first Admin user:
 Please use a temporary password as it will be saved in plain text and change it
 after the first login. admin
? Would you like to include gulp or grunt? [gulp | grunt | none] none
? Would you like to create a new directory for your project? No
? ------------------------------------------------
    KeystoneJS integrates with Mandrill (from Mailchimp) for email sending.
    Would you like to include Email configuration in your project? Yes
? ------------------------------------------------
    Please enter your Mandrill API Key (optional).
    See http://keystonejs.com/docs/configuration/#services-mandrill for more inf
o.
    You can skip this for now (we'll include a test key instead)
    Your Mandrill API Key:
? ------------------------------------------------
    KeystoneJS integrates with Cloudinary for image upload, resizing and
    hosting. See http://keystonejs.com/docs/configuration/#services-cloudinary f
or more info.
    CloudinaryImage fields are used by the blog and gallery templates.
    You can skip this for now (we'll include demo account details)
    Please enter your Cloudinary URL:
? ------------------------------------------------
    Finally, would you like to include extra code comments in
    your project? If you're new to Keystone, these may be helpful. Yes

```

### 配置

#### enduro.js

管网宣称， 是一个web开发框架。

##### 部署方式

+ 全静态部署， 不需要nodejs
+ nodejs动态部署，有管理功能
+ theme就是一个endurojs项目，

### 其他

<http://apostrophecms.org/>

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

ghost感觉偏向商业化，比较复杂。