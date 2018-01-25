# 时间/日期

## time

+ 三种方法从秒到struct_time： `strptime`，`gmtime`，`localtime`
+ GMT(Greenwich Mean Time), UTC(Coordinated Universal Time)
+ 三种方法从struct_time到秒: `calendar.timegm`, `strftime`, `mktime`

```python
import time
time.strptime("30 Nov 00", "%d %b %y")
```

### strftime格式

+ 语言，周`a`,`A`
+ 语言，月`b`,`B`
+ 语言，AM,PM`p`
+ 语言，日期时间`c`，
+ 数字，日期在月份`d`，在年`j`
+ 数字，24小时`H`12小时`I`
+ 数字，月`m`, 分`M`,秒`S`
+ 数字，周日为开始`U`，新年第一个周日前的为第0周， 周一为一周开始`W`，新年第一个周一前的为第0周. strptime方法仅使用在计算中，
+ 数字，星期0-6`w`，
+ 语言，日期`x`如`01/23/18`,时间`X`如`16：24：52`
+ 语言，年四位`Y`,2为`y`
+ 语言，时区偏移`z`如`+0800`,`Z`如`CST`代表ChinaStandardTime,大中华时区

### 设置时区

```python
os.environ['TZ'] = 'US/Eastern'
time.tzset()
time.tzname
os.environ['TZ'] = 'Egypt'
time.tzset()
time.tzname
```

## datetime

两种datetime对象， 一种aware考虑时区，时制等信息，另一种naive不考虑。

aware有datetime和time对象，她们有一个可选的tzinfo属性

对象包括

+ date
  + 构造参数`year`,`month`,`day`
  + 实例方法
    + `today`===`fromtimestamp(time.time())`,
    + `fromordinal(today.toordinal)`==`today`
    + `replace`，
    + `timetuple==time.struct_time((d.year,d.month,d.day,0,0,0,d.weekday(), (d.toordinal()-date(d.year,1,1).toordinal() +1), -1)`,
  + 类方法
    + `date.MIN = date.date(MINYEAR,1,1)`,
    + `date.MAX=date(MAXYEAR,12,31)`,
    + `date.resolution = timedelta(days=1)`,
    + `weekday`,`isoweekday`,`isocalendar`,
    + `isoformat==__str__`,`strftime==__format__`,
+ time
+ datetime
+ timedelta
  + 构造参数`days`, `seconds`, `microseconds`, `milliseconds`,`minutes`,`hours`, `week`. 后面的四个化为前面的三个单位，`week`->`days`, `hours`,`minutes`->`seconds`, `milliseconds`-> `microseconds`
  + 类属性`min`,`max`,`resolution`,分别是最大的负数timedelta，最大的正数timedelta，最小的区分timedelta单位
  + 实例属性`days`,`seconds`,`microseconds`, `total_seconds()`
  + 支持`+`,`-`,`*`,`/`,`//`,`%`,`abs`,`divmod`,`str`,`repr`
  + 例子
  ```python
    from datetime import timedelta
    d = timedelta(microseconds=-1)
    (d.days, d.seconds, d.microseconds)
  ```
  输出`(-1, 86399, 999999)`
  + 例子
  ```python
    from datetime import timedelta
    year = timedelta(days=365)
    another_year = timedelta(weeks=40, days=84, hours=23,
                            minutes=50, seconds=600)  # adds up to 365 days
    year.total_seconds()
    year == another_year #True

    ten_years = 10 * year
    ten_years, ten_years.days // 365 # (datetime.timedelta(3650), 10)

    nine_years = ten_years - year
    nine_years, nine_years.days // 365 #(datetime.timedelta(3285), 9)

    three_years = nine_years // 3
    three_years, three_years.days // 365 #(datetime.timedelta(1095), 3)
    abs(three_years - ten_years) == 2 * three_years + year #True
  ```
+ tzinfo
+ timezone
