# vantiq

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
  + `add`->`type`温度传感器SystemTemperature。两个属性`systemId`引擎所在的系统，`temperature`引擎的温度。然后保存类型。
  + 同样方式创建速度类型。
  + 创建一个总体系统状态类型，关联上面两个类型。`systemId`，`temperature`，`speed`,设置`systemId`为`NaturalKey`, 因为一个id对应一个SystemStatus。NaturalKey设置为唯一索引。
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

## Source 教程

怎样在Vantiq系统使用data source。
使用了公用的天气种子，获取基于邮编的温度预报。预报数据触发一个规则来保存温度值。温度值可以再和rule中的其他数据合并，来提供温度相关的决策。

