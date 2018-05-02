# angular2+

## 明星项目

<https://github.com/akveo/ngx-admin>
<https://github.com/start-angular/SB-Admin-BS4-Angular-5>

## angular cli

<https://github.com/angular/angular-cli/wiki>

+ `ng new my-project&&cd my-project&&ng serve`
+ bundling`ng build --prod` or `ng serve --prod`
+ test`ng test`, `ng e2e`

### 环境配置

<https://blog.angulartraining.com/how-to-manage-different-environments-with-angular-cli-883c26e99d15>
<https://github.com/angular/angular-cli/wiki/build>

ng build 可以指定构建目标`(--target=production or --target=development)`，并指定构建环境`(--environment=dev or --environment=prod)`. 缺省环境是dev

下面的命令是一样的

```bash
ng build --target=production --environment=prod
ng build --prod --env=prod
ng build --prod
# and so are these
ng build --target=development --environment=dev
ng build --dev --e=dev
ng build --dev
ng build
```

构建时修改index.html的base标签`<base href="/">`， `ng build --base-href /myUrl/ or ng build --bh /myUrl/`

ng-cli有一个这样的功能，比如`ng build --env=prod`。

+ 在`.angular-cli.json`有一个部分, 文本搜索`environments`
+ 然后分别写这些文件。
+ 在代码中使用文件

```javascript
//.angular-cli.json 已经写好
"environmentSource": "environments/environment.ts",
"environments": {
  "dev": "environments/environment.ts",
  "prod": "environments/environment.prod.ts"
}
//environments/environment.ts
export const environment = {
  production: false,
  serverUrl: "http://dev.server.mycompany.com"
};
//app.ts that use environment
import {environment} from '../../environments/environment';
@Injectable()
export class AuthService {
  LOGIN_URL: string = environment.serverUrl + '/login' ;
```

## 常见错误

### `ExpressionChangedAfterItHasBeenCheckedError`

<https://blog.angularindepth.com/everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error-e3fd9ce7dbb4>

因为开发人员不知道，变更侦测怎样工作，且抛出这个错误是必要的，这个机制防止数据和UI不一致，以至于显示的数据过时，错误。我们知道一个应用就是一棵组件树，在变更检测的时候，按照特定的顺序进行如下检查：

+ 为孩子组件绑定属性
+ 在孩子组件调用`ngOnInit, OnChanges and ngDoCheck`
+ 更新当前组件的DOM
+ 给孩子组件检测变更
+ 给孩子组件调用`ngAfterViewInit`
+ 更详细参考<https://hackernoon.com/everything-you-need-to-know-about-change-detection-in-angular-8006c51d206f>

每步操作操作后，用过的值都记录在组件的old_values属性。所有组件检查完成进入下一步循环，但是这一次他检查自己的old_values和当前值。

+ 传给孩子的值和用于更新这些组件属性的值一样。
+ 用于更新DOM元素的值和用于更新这些元素的值一样。
+ 同样的检查应用到所有的孩子。

解决方法： 把父亲组建的值变更写入异步方法，加入`setTimeOut`

```javascript
    //get initial value from page
    this.subscriptionPW = this.homeService.pageWaiting$.subscribe(pw => {
      setTimeout(() => {
        this.pageWaiting = pw;
        this.waitingCnt = this.pageWaiting;
      });
    });
```

A running Angular application is a tree of components. During change detection Angular performs checks for each component which consists of the following operations performed in the specified order:
变更检测的操作：

## 有关

## 平台适应

+ 原生app--[nativescript](https://docs.nativescript.org/tutorial/ng-chapter-0)
+ 混合app--[ionic](https://ionicframework.com/)

## 服务端预提交--[angular universal](https://universal.angular.io/quickstart/)

### angular2-starter

[webpack angularclass](https://github.com/AngularClass/angular2-webpack-starter)
[github angular/quickstart](https://github.com/angular/quickstart/blob/master/README.md)
[github: angular-university/angular2-for-beginners-starter](https://github.com/angular-university/angular2-for-beginners-starter)

#### Template

<https://blog.angular-university.io/angular-ng-template-ng-container-ngtemplateoutlet/>

### webpack

[webpack tutor](https://survivejs.com/webpack/developing/getting-started/)
[webpack ref angulario](https://angular.io/guide/webpack)
[index of webpack resource](https://github.com/webpack-china/awesome-webpack-cn)

#### 概念

+ 是模块bundler, 一个bundler就是一个js文件，这个js文件里边可以包括各种各样内容。
+ webpack在项目源代码找import并生成依赖图，产生一个或多个bundle.
+ 通过插件/规则，对各种文件如css，typescript，sass等进行预处理，并最小化

#### loader

+ webpack本身只能理解javascript, 需要loader把各式各样文件转为javascript
+ 当在代码遇到import, 用test知道应该使用什么loader。

```javascript
rules: [
  {
    test: /\.ts$/,
    loader: 'awesome-typescript-loader'
  },
  {
    test: /\.css$/,
    loaders: 'style-loader!css-loader'
  }
]
//遇到条件满足，触发loader
import { AppComponent } from './app.component.ts';
import 'uiframework/dist/uiframework.css';
```

上例子，对于css文件使用了loader链，先用后面`css-loader`处理css文件中的`import`,`url`,再用`style`给页面添加`<style>`标签内容。

## [cli](https://cli.angular.io/)

## 资源

[angular cn](https://angular.cn/resources/)
[lesson egghead](https://egghead.io/lessons/angular-2-say-hello-world-to-angular-2)
[lesson codedamn](http://codedamn.com/videos/angular2/3/)
[thelgevold](https://github.com/thelgevold/angular-2-samples)
[syntax-success](http://www.syntaxsuccess.com/angular-2-samples/#/demo/http)



## official site

[cn](https://angular.cn/)

## 安装Node

[说明 https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04] (https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04)

```bash
cd ~
curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt-get install nodejs
npm install npm -g
#############  or for centos/fedora  ######################
curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
##### or ######
curl --silent --location https://rpm.nodesource.com/setup_6.x -o nodesource.sh && sudo bash nodesource.sh
yum -y install nodejs
```

## angular2表单

+ <https://swimlane.github.io/ngx-charts/#/ngx-charts/bar-horizontal-2d>