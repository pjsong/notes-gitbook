# hystrix

## wiki<https://github.com/Netflix/Hystrix/wiki>

通过提供延时/错误容忍，来帮助控制分布式服务的交互。

* 保护/控制所访问的依赖产生的延时/错误
* 防止错误层层扩散
* 快速失败/恢复
* 提供缺省方案/降级
* 实时监控/警报

## how it works <https://github.com/Netflix/Hystrix/wiki/How-it-Works>

### observable模式 <http://reactivex.io/documentation/observable.html>

```javascript
// before observable
returnVal = someMethod(itsParameters);
// after ovservable
var myOnNextObserver = { it -> do something useful with it };
var myObservable = someObservable(itsParameters);
myObservable.subscribe(myOnNextObserver);
```

![流程图](https://github.com/Netflix/Hystrix/wiki/images/hystrix-command-flow-chart-640.png)

## how to use <https://github.com/Netflix/Hystrix/wiki/How-To-Use>


https://www.2cto.com/kf/201801/713442.html
https://dzone.com/articles/spring-cloud-with-turbine
https://cloud.spring.io/spring-cloud-netflix/single/spring-cloud-netflix.html#_how_to_include_hystrix
https://github.com/spring-cloud-samples/turbine
https://github.com/Netflix/Hystrix/wiki/How-To-Use
https://github.com/bijukunjummen/sample-spring-hystrix/blob/master/sample-hystrix-aggregate/pom.xml