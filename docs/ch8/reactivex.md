# 介绍

## 背景

### 介绍[1](https://codewords.recurse.com/issues/two/an-introduction-to-reactive-programming)

近些年对于服务端和网络的，基于事件的异步编程(如nodejs, netty/nio)有些变化了。异步代码允许并行独立的IO操作，但是让简单的同步代码变成一堆嵌入回调。

怎样既保持同步代码的简洁，又得到高效率呢？Futures可以让我们表达异步计算的延时效果，封装了事件处理代码，使用高阶函数，来组成干净可读的异步代码。

先看一个字词计数的例子。写一个简单的同步代码，并想想用回调怎么写。然后，我们用Promise来把基于回调的部分变成函数返回的future, 如此就可以用函数编程的构子来写代码。

#### 例子

```scala
def countWordOccurrences(urls: List[String], keyword: String):
  List[(String, Int)] = {

  urls map { url =>
    val html = fetchUrl(url)
    val dom = parseHtmlToDOM(html)
    val count = countWordOccurrencesInDOM(dom, keyword)
    (url, count)
  }
}
```

fetchUrl方法可以并行起来，用回调改，难阅读。串行的例子好读在于，fetch的结果可以看到马上被后面的函数调用。

#### Future和Promise

Future是一个异步执行结果的对象，fetchUrl返回一个`Future[String]`,在同步代码中使用，不用担心该`string`值是否可用。
Promise用于帮助构建一个Future。

下例中，`fetchUrlAsync`定义了两个`Handler`，再从Promise提取Future返回给调用者。其他方法`parseHtmlToDOM`，`countWordOccurrencesInDOM`可以类似重构。

```scala
def fetchUrl(url: String): Future[String] = {
  val p = Promise[String]()
  fetchUrlAsync(url,
     successHandler = { html => p.success(html) },
     errorHandler = { error => p.failure(error) })
  p.future
}
```

### 介绍[2](https://medium.com/@kevalpatel2106/what-is-reactive-programming-da37c1611382)

Rx编程中，一个组件发出数据，Rx的内部的结构会传播变化给注册了的组件。

三个关键概念是：

1. Observable数据发出组件。包装可在线程之间传输的数据，是数据的提供者。
2. Observer数据消化组件。用`subscribeOn`方法来注册并接受数据。一旦Observable发送了数据，所有的Observer的`onNext`回调能收到，如果Observable抛出错误，observer将用`onError`接收。
3. Schedulers线程管理组件。告诉Observable和Observer,用哪个线程。`observeOn`方法告诉observer, observe哪一个线程;`ScheduleOn`方法告诉Observable用哪个线程。`schedulers.newThread()`创建一个后台线程，`Schedulers.io`在IO线程执行代码。

#### java例子

```java
Observable<String> database = Observable      //Observable will emit the data
                .just(new String[]{"1", "2", "3", "4"});    //Operator

 Observer<String> observer = new Observer<String>() {
           @Override
            public void onCompleted() {
                //...
            }

            @Override
            public void onError(Throwable e) {
                //...
            }

            @Override
            public void onNext(String s) {
                //...
            }
        };

Subscription subscription = database.subscribeOn(Schedulers.newThread())     //Observable runs on new background thread.
        .observeOn(AndroidSchedulers.mainThread())    //Observer will run on main UI thread.
        .subscribe(observer);                         //Subscribe the observer
subscription.unsubscribe();
```

其中， database是Observable, 后面是Observer， 最后Scheduler让database这个observable在后台运行，Observer在主线程运行，最后注册observer。

#### 鹅卵石图

![鹅卵石图](https://cdn-images-1.medium.com/max/800/1*-RggxXyfw1M3CrYkzGTRDw.png)

1. 顶部的不同形状代表不同类型的原始数据。
2. 操作符控制什么时候，怎样产生数据。中间可以filter
3. 底下是Observable发出的数据。

## JDK 9

jdk只定义了接口，没有实现。

```java
    @FunctionalInterface
    public static interface Flow.Publisher<T> {
        public void    subscribe(Flow.Subscriber<? super T> subscriber);
    }

    public static interface Flow.Subscriber<T> {
        public void    onSubscribe(Flow.Subscription subscription);
        public void    onNext(T item) ;
        public void    onError(Throwable throwable) ;
        public void    onComplete() ;
    }

    public static interface Flow.Subscription {
        public void    request(long n);
        public void    cancel() ;
    }

    public static interface Flow.Processor<T,R>  extends Flow.Subscriber<T>, Flow.Publisher<R> {
    }
```

用`FLow`类， 主要包括三个主要的抽象：

1. 处理`Publisher`的接口`subscribe`方法发布的事件，类似与Observable
2. 消息接收者实现`Subscriber`接口，类似Observer
3. 继续传递消息实现`Processor`接口，
4. Subscription为单个`Publisher`,`Subscriber`建立联系

