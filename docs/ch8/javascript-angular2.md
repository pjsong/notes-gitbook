# angular2+

## 原生app--[nativescript](https://docs.nativescript.org/tutorial/ng-chapter-0)

## 混合app--[ionic](https://ionicframework.com/)

## 服务端预提交--[angular universal](https://universal.angular.io/quickstart/)

## angular2-starter

[webpack](https://github.com/AngularClass/angular2-webpack-starter)

## [cli](https://cli.angular.io/)

## 资源

[angular cn](https://angular.cn/resources/)
[lesson egghead](https://egghead.io/lessons/angular-2-say-hello-world-to-angular-2)
[lesson codedamn](http://codedamn.com/videos/angular2/3/)
[thelgevold](https://github.com/thelgevold/angular-2-samples)
[syntax-success](http://www.syntaxsuccess.com/angular-2-samples/#/demo/http)

### starter

[github angular/quickstart](https://github.com/angular/quickstart/blob/master/README.md)

[github: angular-university/angular2-for-beginners-starter](https://github.com/angular-university/angular2-for-beginners-starter)


## official site 
[cn](https://angular.cn/)


##安装Node
[说明 https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04] (https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04)
<pre>
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
</pre>

### 安装sublime3

<pre>sudo add-apt-repository ppa:webupd8team/sublime-text-2
sudo apt-get update
sudo apt-get install sublime-text</pre>

命令行启动：subl
窗口启动：application/sub...

---
# quickstart中的javascript与typescript版本对比

## index.html

### 公共 polyfill

>
    <script src="node_modules/core-js/client/shim.min.js"></script>
    <script src="node_modules/zone.js/dist/zone.js"></script>
    <script src="node_modules/reflect-metadata/Reflect.js"></script>
</pre></code>

## javascript

>
    <script src="node_modules/rxjs/bundles/Rx.umd.js"></script>
    <script src="node_modules/@angular/core/bundles/core.umd.js"></script>
    <script src="node_modules/@angular/common/bundles/common.umd.js"></script>
    <script src="node_modules/@angular/compiler/bundles/compiler.umd.js"></script>
    <script src="node_modules/@angular/platform-browser/bundles/platform-browser.umd.js"></script>
    <script src="node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js"></script>
    <!-- 2. Load our 'modules' -->
    <script src='app/app.component.js'></script>
    <script src='app/app.module.js'></script>
    <script src='app/main.js'></script>
    #############################   vs   ######################################
    <script src="node_modules/systemjs/dist/system.src.js"></script>
    <!-- 2. Configure SystemJS -->
    <script src="systemjs.config.js"></script>
    <script>`
      System.import('app').catch(function(err){ console.error(err); });
    </script>

## main.js

>
    document.addEventListener('DOMContentLoaded', function() {
      ng.platformBrowserDynamic
        .platformBrowserDynamic()
        .bootstrapModule(app.AppModule);
    });
    ######################################  vs  ################################
    import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
    import { AppModule } from './app.module';
    platformBrowserDynamic().bootstrapModule(AppModule);

## module

>
    app.AppModule =
      ng.core.NgModule({
        imports: [ ng.platformBrowser.BrowserModule ],
        declarations: [ app.AppComponent ],
        bootstrap: [ app.AppComponent ]
      })
      .Class({
        constructor: function() {}
      });
    #######################################  vs  #####################
    import { NgModule }      from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { AppComponent }  from './app.component';
    @NgModule({
      imports:      [ BrowserModule ],
      declarations: [ AppComponent ],
      bootstrap:    [ AppComponent ]
    })
    export class AppModule { }

## conponent

>
     app.AppComponent =
     ng.core.Component({
      selector: 'my-app',
      template: '<h1>My First Angular 2 App</h1>'
    })
    .Class({
      constructor: function() {}
    });
    ###############################    vs    ###########################
    import { Component } from '@angular/core';
    @Component({
      selector: 'my-app',
      template: '<h1>My First Angular 2 App</h1>'
    })
    export class AppComponent { }