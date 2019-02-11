# vantiq smart sys platform

<https://dev.vantiq.cn/docs/system/index.html#using-the-documentation>

## 总揽

智能系统`获取数据`，据此`评估实时场景`。然后对确定下来的场景`做出相应`，比如直接的自动化操作，或者提醒系统/用户当前需要处理的情况。这样的系统包含了`传感数据的存储定义`，`场景的检测和响应逻辑`，`数据存储/评估的数据传输`。
比如，先定义一个场景：

+ 冷雨天
+ 用户正参加一个棒球游戏
+ 游戏推迟

如果全部条件满足，系统就会通知一个应用，应用然后向用户推荐各种选择，倒杯热咖啡或者卖给他们防水夹克。
在实时系统，`任务本地处理`总是能提升响应时间和可靠性。比如，行业设置中，管理`物件处理系统`的位置需要百毫秒级的响应时间。这样的响应时间用远程决策系统是做不到的。
vantiq是一个高效高性能的系统，主要包括：

+ 从IoT资源获取数据的技术。过滤数据使其可用于决策引擎。决策引擎用于实时分析并作出决策。
+ 发送控制信息给IoT设备，并通知外部系统/用户在自动化方案下作出的决策。 相比传统的服务平台，方案支持更高级别的自动化，保证了高效率。
+ 一系列的工具，让开发，部署，操作，系统的管理尽可能简单。 因为数据来自外部，结果也必须提交给外部系统，因此高效的关键就是灵活而简单的外部集成能力。vantiq支持高度可扩展的云架构，引入了多个特定的性能优化，以及支持网络分布式处理和私有数据中心的逻辑服务部署，因此有很好的性能。

## 概念模型

`新事件流`从外部数据源流入服务。如果到达的数据与特定的规则相关，则规则被触发并被调度执行。
规则可能更新模型状态，如果检测到定义的场景，规则定义对应的action就会执行
Vantiq根据规则检测场景。通过`达到服务的数据流的改变`规则被激活。上面的例子中，数据流可能是天气，用户的位置，游戏的状态。
检测到场景后，采取的行动可能提交通知，发出推荐请求，或者改变场景的状态。

## 定义数据流

创建一个方案的第一步，是定义入口数据。可以定义多个数据流，上例中定义了三个流：

+ 天气
+ 用户位置
+ 游戏状态

每个流在自动化数据模型中都是一个类型。类型由开发者定义，仅受限于该数据模型的能力。
当插入/更新/删除一个对象时，就会初始化处理。比如天气的定义

```json
{
    "name": "Weather",
    "properties": {
        "location": { "type": "GeoJSON" },
        "temperature": { "type": "Integer" },
        "windSpeed": { "type": "Integer" },
        "visibility": { "type": "Integer" },
        "precipitation": { "type": "Real" },
        "overallEvaluation": { "type": "String" }
    }
}
```

`类型，以及其他系统对象`，都可以用开发者门户或者Vantiq CLI或者rest service来定义。在Resource Reference Guide中可以找到Rest命令。

一旦自动化数据流定义好，开发者就要提供`数据种子`来提交`流类型`的对象。Vantiq提供了多个预包装的外部资源，简单配置一下，就能从外部系统读取数据， 比如，定义一个读取天气服务的代码如下：

```json
{
    "name": "WeatherSource",
    "type": "REMOTE",
    "direction": "SOURCE",
    "pipelineRules": ["ingestWeather"],
    "config": {
        "serverURIs": ["http://weather.arbitraryweatherdomain.com"],
        "username": "vantiq",
        "password": "vantiq",
        "queryForm": "url",
        "pollingInterval": 60
    }
}
```

这个代码每60s发出一个Get请求。收到响应时，触发规则`ingestWeather`来处理到来的天气数据

或者，可能创建一个应用来为`用户的位置`获取相关天气信息。然后数据通过Vantiq REST API的命令`INSERT, UPDATE，DELETE`添加到流。比如，通过发出Insert命令来加入天气预报流：

```text
POST https://dev.vantiq.com/api/v1/resources/types/Weather
{
    "location": {"type": "Point", coordinates: [122.3892, 37.7786]},
    "temperature": 57,
    "windSpeed": 12,
    "visibility": 1,
    "precipitation": 0.1,
    "overallEvaluation": "poor"
}
```

可以在`API Reference Guide`参考相关的rest命令

查询可能每15分钟发送一次来更新。
新天气条件的INSERT将触发把天气作为触发条件的规则。

## 定义场景

定义好数据流，场景表示也就确定了。场景通过`状态`表示。
或者使用一个新类型来表示场景，或者给已有的类型添加一个新属性来表示。比如下面定义一个新类型来标志用户和当前的状态。

```json
{
    "name": "BallparkSituation",
    "properties": {
        "username": {"type": "String"},
        "currentLocation": {"type": "GeoJSON"},
        "currentSituation": {"type": "String"},
        "proactiveActions": {"type": "String", "multi": true}
    }
}
```

`currentSituation`可能是：

+ Arriving at ballpark
+ Actively watching (in their seat) and good conditions
+ Actively watching and poor weather
+ At concessions
+ Leaving ballpark

状态将由规则计算并存储在`BallparkSituation`.

## 定义自动化规则

+ 定义好数据流和场景，最后一步就是定义规则。
+ 每个规则由数据流的一个变化来触发。触发之后开始调度执行规则。
+ 执行涉及计算上下文并基于上下文评估每条规则。如果规则的条件满足，规则的action就被执行。
+ 规则的action可引起场景的变化，场景的变化反过来可以触发其他规则。
+ 处理通过评估最初的状态变化开始，直到所有的规则都被触发。

规则使用`Rule and Procedure Reference Guide`参考中的记号，使用rest api注册到自动化服务

举例。

+ 规则由新的天气事件触发，如果天气条件的位置条件匹配，即计算`BallparkSituations`得到新的天气条件。如果天气很差，当前的场景被更新，这个更新触发下一个场景规则，产生推荐action
+ 第二条规则为guest生成可能的action,并发送到guest服务app(假定app为移动设备发送action)。
+ 推荐的实际实现由使用自动服务的应用来完成。自动化服务仅仅识别兴趣场景，并为应用生成推荐。

初始规则

```text
RULE uncomfortableConditions
WHEN INSERT OCCURS ON Weather:w WHERE w.location == "ballpark"
SELECT BallparkSituation
for (b in BallparkSituation) {
    if (w.temperature < 55 && w.precipitation > 0.05) {
        UPDATE BallparkSituation(currentSituation : "uncomfortably cold",
                                temperature: w.temperature)
                                WHERE _id == b._id
    }
}
```

第二条规则

```text
RULE uncomfortableGuest
WHEN UPDATE OCCURS ON BallparkSituation:b
if (b.currentSituation == "uncomfortably cold") {
  PUBLISH REQUEST ON BallparkSituation WITH b
  PUBLISH { body:b } TO SOURCE guestServices
}
if (b.currentSituation == "uncomfortablly warm") {
  PUBLISH REQUEST ON BallparkSituation WITH b
  PUBLISH { body:b } TO SOURCE guestServices
}
```

推荐规则，生成比当前温度上下5度的offer推荐列表

```text
RULE coldGuest
WHEN request OCCURS ON BallparkSituation:b
  WHERE b.currentSituation == "uncomfortably cold"
SELECT BallparkOffers WHERE offerType == "uncomfortably cold"
FILTER offer in BallparkOffers RECOMMENDATIONS TO GuestRecommendations
UNTIL GuestRecommendations.size() < 5 DO
    MATCH
        if (offer.idealOfferTemperature > b.temperature - 5 &&
            offer.idealOfferTemperature < b.temperature + 5) {
            recommend(offer)
        }
    END
END
```

另一条规则给外部系统发送提醒，并用新找到的场景更新`WeatherSituation`类型

```text
RULE weatherExample
WHEN UPDATE OCCURS ON Weather
if (Weather.temperature < "50F" && Weather.windSpeed > "10MPH" &&
    Weather.precipitation > "0.1 inches") {
    PUBLISH {"body": {"situation": "poor"}} TO SOURCE weatherAdvisory
    UPDATE WeatherSituation(date: ars_currentDateTime, situation: "poor")
        WHERE location == Weather.location
}
```

以上例子简单演示了Vantiq自动化的核心。其他部分提供一些完整的工作例子，以及Vantiq的功能描述，以及如何有效使用该功能。

## [操作平台入门](https://dev.vantiq.cn/docs/system/tutorials/tutorial/index.html)

使用IoT中的一个例子：处理`引擎的数据`来检测并诊断过热的设备。包括`定义类型来记录传感数据`，`添加app来处理并关联这些数据，产生报警`。教程还包括怎样模拟生成传感数据，并监控数据产生的结果。

Vantiq的web平台有两个工作模式： 开发和操作。两个模式都可以有多个项目。页面顶部选择模式，注意要以管理员身份登录。

### 创建Type

+ 创建引擎监控项目。 `createNewProject`.
+ 创建数据类型。两个传感器，速度和温度。它们各产生一个数据流并存储在vantiq数据库。
  + `add`->`type`温度传感器`SystemTemperature`。两个属性`systemId`引擎所在的系统，`temperature`引擎的温度。然后保存类型。
  + 同样方式创建速度类型。
  + 创建一个总体系统状态类型，关联上面两个类型。`systemId`，`temperature`，`speed`,设置`systemId`为`NaturalKey`, 因为一个id对应一个SystemStatus。NaturalKey设置为唯一索引。另外两个属性`不`设置`required`
  + 同样创建`SystemHUD`system heads up display, 提醒用户引擎温度过高。

### 用平台`数据生成器`功能模拟数据流

+ `show`->`data generator`->`create new`,用`Auto0123456789`作为systemId. 用`%R200:215:1%`作为速度。表示range(from=200, to=215, step=1). 注`%Evalue1:value2:value3%`表示枚举值，`%T%`表示当前日期时间。 保存。

### 创建app

app处理速度和温度，并合并数据到SystemStatus记录，更新一条SystemHUD记录

+ `add`->`app`,输入名字`EngineMonitor`
+ 点击矩形创建第一个事件流任务。每个app都有多个事件流。事件流定义入口数据源，通过类型的插入/更新，消息的到达，或者topic的发布来触发。这个例子使用两个事件流，分别是插入EngineTemp和EngineSpeed类型。
+ 事件流名字用`TempReading`, 配置中，入口资源用`types`.入口`resourceId`用`EngineTemperature`， op用`insert`。ok，保存。

### 测试

+ 给TempReading附上logger, 测试app是否能正常触发。`右键`选择该事件流->`link new task`->`activity pattern=logstream, name=LogTemp`
+ 配置LogTemp，loglevel选择info,保存app.
+ 查看LogTemp任务的log信息。`debug`->`live log message`

### overview

<https://dev.vantiq.cn/docs/system/tutorials/tutorial/index.html>

添加第二个事件流。选择 `TempReading`任务矩形，选择`Add Event Stream`。 选择新出现的矩形面板， 命名为`SpeedReading`。

选好`SpeedReading`事件流。点击`Click to Edit link`来输入配置参数。`inboundResource`选`types`,  `inboundResourceId`选`EngineSpeed`。 因为只关心 `EngineTemp`类型的插入，`opt`下拉菜单选INSERT.
接下来给`SpeedReading`附上另一个LogStream任务`LogSpeed`，也设置log level为info
`EngineMonitor`面板的右上方的向下箭头保存，然后测试。

现在两个数据流都接收到了，要合并到`SystemStatus`类型。在此之前可以删除测试的logger来清理app.在两个logger上右键删除。

合并的第一步是为app增加一个Merge任务。右键选择`TempReading`->新任务->`activity-pattern=Merge, name=UpdateSystemStatus`->OK.该任务是钻石形状，表示这个`merge`任务是一个决策节点。

右键点击`SpeedReading`->`Link Existing Task`，连接`SpeedReading`到`UpdateSystemStatus`，

选择Merge任务并配置。注意merge任务没有缺省选项。
关闭它，然后给`UpdateSystemStatus`添加一个`LogStatus`的logger.

保存并测试，任意事件流收到事件，merge和logger都会执行。

#### 输出并更新`SystemStatus`类型

点击并配置`UpdateSystemStatus`，因为我们要保存merge任务，`outboundResource`选`types`, `outboundResourceId`选`SystemStatus`,并选中`upsert`，表示更新已有的`SystemStatus`而不是创建新的记录(如果根据SystemId已经存在记录)。 SystemStatus要求除了systemId之外的字段，不是required字段，否则运行
报错。
保存app, 再次运行generator. 菜单`show`->`find records`->`type: SystemStatus`,运行`Query`，可以看到记录。运行`Date Generator`， 不断运行`Query`可以看到数据变化。

#### `ActivityPattern:Transformation`更新 `SystemHUD`

要为模拟引擎更新SystemHUD， 需要对每个SystemStatus记录的更新作出响应。添加一个新的转换任务可以达成。
右键`UpdateSystemStatus`->`Link New Task`->`ActivityPattern:Transformation,name:UpdateSystemHUD`

选择`UpdateSystemHUD`并配置，有一个必需参数`transformation`，点击链接弹出编辑对话框。
`UnionName:visualTransformation`->`Add a transformation`->`outboundProperty: systemId,Transformation Expression=event.systemId`
添加另外一个`transformation`

```json
{
    "outboundProperty": "alertMsg",
    "TransformationExpression":"((event.temperature >= 210) && (event.speed >= 45)) ?
    \"Your engine is overheating, please reduce your speed.\" :
    (((event.temperature >= 210) && (event.speed < 45)) ?
    \"Your engine is overheating: check for a malfunctioning fan or a coolant leak.\" : \"\")
}
```

记得`UpdateSystemStatus`任务的输出是一个`SystemStatus`类型，有三个属性。因为`UpdateSystemHUD`任务进跟着`UpdateSystemStatus`任务， 意味着`UpdateSystemHUD`用`SystemStatus`类型关联的属性作为输入。我们给这些属性加上前缀类似于`event.temperature`.

`UpdateSystemHUD`任务的目的是更新`SystemHUD`的记录。这个转换需要计入两个`SystemHUD`类型。`systemId`和`alertMsg`
设置`systemId`,就是`SystemStatus`类型的`systemId`属性。转换表达式就是`event.systemId`

设置`alertMsg`属性有些复杂。因为要包含基于速度和温度的诊断文本。

+ 表达式首先检查`event.speed`和`event.temperature`. 温度高于210,速度大于45,alert信息则包含`您的引擎过热请减速`，温度高于210,如果速度小于45,信息包含`引擎过热，请检查功能故障`，如果两种情况都不存在，显示空信息代表没问题。

保存`SystemHUD`类型中转换任务的输出，`outboundResource:types, outboundResourceId:SystemHUD`.勾上`upsert`。

### `Subscription`运行系统监控

用`modelo subscription`功能查看Vantiq数据库属性的变化，检查处理是否正确。
`add`->`advanced`->`Subscription`->`new`
监控数据库`SystemHUD`变化。
还记得上一节中，当`SystemStatus`更新后，`UpdateSystemHUD`任务会更新引擎系统的`SystemHUD`
勾上 alertMsg 和 systemId，让SystemHUD更新的时候，结果能显示出来。保存

```json
{
    "dataType":"SystemHUD","operation":"update","alertMsg": true, "systemId": true
}
```

点击subscription`SystemHUD`打开面板，每次`systemHUD`有更新，面板就会显示消息。

### 可视化运行系统

`add`->`client`->`new client`,用属性改名字为`EngineSimulation`，保存.
把线型图，柱状图，两个gauge仪表图，饼图，6个标签拖进设计框。

创建数据流喂入数据。几个部件显示温度/速度值，饼图显示`SystemHUD`的警告信息。

点击`数据流`->`新数据流`

```json
[{"name":"SystemStatus","On Data Changed":true,"datatype":"SystemStatus","update":true,

},{"name":"SystemHUD","On Date Changed":true,"datatype":"SystemHUD","update":true}]
```

编辑好内容，保存，回到项目

### 运行模拟

数据生成器面板点击`run`，同时在client中点击运行.出现模拟效果。

## Source 教程

怎样在Vantiq系统使用data source。
使用了公用的天气种子，获取基于邮编的温度预报。预报数据触发一个规则来保存温度值。温度值可以再和rule中的其他数据合并，来提供温度相关的决策。

### 创建一个source项目

source项目主要负责与外部系统的集成，包括检索，接收。
这个例子从提供rest服务的`OpenWeatherMap`获取数据。首先定义怎样与外部系统API交互的source. 获取`OpenWeatherMap`数据需要一个免费的apiKey, <https://home.openweathermap.org/>注册帐号名pjsong, 获得key 6566769a1d5620cb93e74703bd6bb21d

+ `add`->`new source`

```json
{"name": "weather", "type": "remote", "pollingInterval":"15s","content-type":"application/json"}
```

输入`http://api.openweathermap.org/data/2.5/weather?zip=94549,us&APPID={YourRegisteredAppID}`为uri, 然后点击新增的黄色图片，run也就是`Test Data Receipt`来尝试获取数据。
获取的数据需要存储到Vantiq数据库，使得可以和其他数据一起触发特定场景的规则。此时需要创建一个数据类型

+ `add`->`type`->`new type`, 添加五个属性, location和zipcode必填，保存为`weatherReading`

```json
{"location": "String",
"tempF": "Fahrenheit value of the temperature forecast",
"tempK": "Kelvin value of the temperature forecast",
"windSpeed": "Kph value of the wind speed forecast",
"zipCode": "zip code"}
```

+ 做一个数据实例(数据库中的一个entry),定义指定zipcode的数据存放位置。`show`->`add record`

```json
{"type":"weatherReading", "location": "Concord", "zipCode": "94549", }
```

保存。

+ Rules用于识别添加或者更新到Vantiq数据库的数据，且组织数据准备下一步处理。这里有一个规则，当预报数据收到就会触发。`add`->`rule`->`new rule`

```text
RULE weatherReading
WHEN MESSAGE ARRIVES FROM weather
UPDATE weatherReading(tempK:weather.main.temp) WHERE location == weather.name
```

这个规则进更新指定位置当前的kelvin温度。返回的数据是JSON格式，因此规则用天气变量作为JSON对象的root来获取数据.`weather.main.temp`是Kelvin的温度预报，`weather.name`是城市位置。勾上active,保存。

+ 校验/使用数据

本节展示： 1,校验数据的获取并能够被规则触发来保存，2,保存的数据如何被其他规则使用。
因为数据是每15s获取一次，那么创建规则后，数据存储的时间也不会超过15s. 用`show`->`find records`->`run`显示查询面板。

看到温度更新，则验证成功

成功之后，这个数据就可以用在其他规则中

```text
WHEN UPDATE OCCURS ON Customer
SELECT UNIQUE weatherReading:wr WHERE zipCode EQ Customer.location
if (wr.tempK >= 300) {
    UPDATE Offer(offerMessage: "Buy a fan") WHERE (customerId == Customer.id)
}
```

只要customer(由Customer类型定义)实例有更新，则规则被触发，比如，当客户进入特定的某个邮编。`SELECT`陈述指示规则根据邮编，找出该处的天气预报(weatherReading类型)
接下来如果该处的温度超过300k， 则更新与customerID关联的Offer类型

### 结束/删除一个source

结束测试应该`deactivate`或者删除source，避免持续请求。`右键点击source`->`窗口面板右上角toggleKeepAliveOff`->`保存`

#### 术语

+ mqtt, `MQTT-SN`基于非tcp/ip的传感器网络比如zigbee的发布/注册`消息服务`。
+ sms，短信

## 分析教程

<https://dev.vantiq.cn/docs/system/tutorials/analytics/index.html>
介绍怎样使用微软的Azure机器学习studio来感性分析

## 介绍

微软的`Azure Machine Learning Studio (MLStudio)` 是一个制作机器学习实验的工作空间。实验可在MLStudio转换为web service, 通过Restful接口查询，来得到预判和归类。

到<https://studio.azureml.net/>去注册一个帐号。现在有免费的10g训练数据和有限几个实验提供给用户。如果不熟悉MLStudio，推荐去看下教程并开始一些样例实验,或者看看实验走廊。在这个教程，我们用一个实验，来做twitter情绪分析<https://gallery.cortanaintelligence.com/Experiment/Predictive-Experiment-for-Twitter-sentiment-analysis-3>
教程的结尾，可以通过VANTIQ分析Source获得任意twitter情绪，来查询这个实验。

### 设置实验

创建好帐号并登入workspace, 进入<https://gallery.cortanaintelligence.com/Experiment/Predictive-Experiment-for-Twitter-sentiment-analysis-3>, `点击 “Open in Studio”`->`点击弹出窗“Copy experiment to gallery”checkmark` . 待续......

### curl 增加source
<http://vantiq.test.zs.perfect/docs/system/sources/amqp/index.html>

`POST https://dev.vantiq.com/api/v1/resources/sources`
`curl -u pengjingsong:pengjingsong -X POST -H "Content-Type: application/json" -d '{
    "name": "rabbitmq1",
    "type": "AMQP",
    "direction": "BOTH",
    "config": {
        "serverURIs"     : [ "amqp://test.zs.perfect:5672" ],
        "topics"         : [ "com.perfect99.doms.systemStatus" ],
        "username"       : "pjsong",
        "password"       : "perfectdotcoM8",
        "pollingInterval": 100
    }
}' http://vantiq.test.zs.perfect/api/v1/resources/sources/rabbitmq1`

```json
{ 
    "name": "rabbitmq",
    "type": "AMQP",
    "direction": "BOTH",
    "config": {
        "serverURIs"     : [ "amqp://test.zs.perfect:5672" ],
        "topics"         : [ "com.perfect99.doms.systemStatus" ],
        "username"       : "pjsong",
        "password"       : "perfectdotcoM8",
        "pollingInterval": 100
    }
}
```