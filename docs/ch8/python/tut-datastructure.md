# 数据结构

## list

### 方法

+ stack特性
  + 后面加`append(x)`, 等价`a[len(a):]=[x]`
  + 删除`pop([i])`, `i` 缺失则选择最后的元素
+ 后面加`extend(iterable)`， 等价`a[len(a):]=iterable`
+ 插入`insert(i, x)`，指定位置前插入
+ 删除`remove(x)`, 元素不存在异常
+ `clear`, 等价`del a[:]`
+ `index(x[,start[,end]])`第一个`x`出现的位置，若不存在抛异常
+ `count(x)`, `x`出现的次数
+ `sort(key=None, reverse=False)`， key是比较函数如`key=str.lower`
+ `reverse()`
+ `copy()`

### 用作queue

```python
from collections import deque
queue = deque(["Eric", "John", "Michael"])
queue.append("Terry")           # Terry arrives
queue.append("Graham")          # Graham arrives
queue.popleft()                 # The first to arrive now leaves
queue.popleft()                 # The second to arrive now leaves
```

### comprehension方式创建

```python
squares = []
for i in range(1, 10):
    squares.append(i**2)

squares = list(map(lamda x: x**2, range(1,10)))
squares = [x**2 for x in range(1,10)]
expressionSample = [(x,y) for x in range(1,10) for y in range(1,10) if x!=y]
vec = [-4, -2, 0, 2, 4]
# create a new list with the values doubled
[x*2 for x in vec]
# filter the list to exclude negative numbers
[x for x in vec if x >= 0]
# apply a function to all the elements
[abs(x) for x in vec]
# call a method on each element
freshfruit = ['  banana', '  loganberry ', 'passion fruit  ']
[weapon.strip() for weapon in freshfruit]
# create a list of 2-tuples like (number, square)
[(x, x**2) for x in range(6)]
# the tuple must be parenthesized, otherwise an error is raised
[x, x**2 for x in range(6)]
# flatten a list using a listcomp with two 'for'
vec = [[1,2,3], [4,5,6], [7,8,9]]
[num for elem in vec for num in elem]
#[1, 2, 3, 4, 5, 6, 7, 8, 9]

from math import pi
[str(round(pi, i)) for i in range(1, 6)]

matrix = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
]
[[row[i] for row in matrix] for i in range(4)]
list(zip(*matrix))

```

### 集合

+ 空集合用`set()`函数
+ 构造`basket = {'apple', 'orange', 'apple', 'pear', 'orange', 'banana'}`， `a = {x for x in 'abracadabra' if x not in 'abc'}`
+ 集合操作 `|`, `&`,`-`,`^`:`((a-b)|(b-a))`

### 字典

```python
tel = {'jack': 4098, 'sape': 4139}
tel['guido'] = 4127
tel['jack']
del tel['sape']
tel['irv'] = 4127
list(tel.keys())
sorted(tel.keys())
'guido' in tel
'jack' not in tel

dict([('sape', 4139), ('guido', 4127), ('jack', 4098)])
{x: x**2 for x in (2, 4, 6)}
dict(sape=4139, guido=4127, jack=4098)
```

### 遍历技巧

遍历字典

```python
knights = {'gallahad': 'the pure', 'robin': 'the brave'}
for k, v in knights.items():
    print(k, v)
```

遍历sequence

```python
for i, v in enumerate(['tic', 'tac', 'toe']):
    print(i, v)

questions = ['name', 'quest', 'favorite color']
answers = ['lancelot', 'the holy grail', 'blue']
for q, a in zip(questions, answers):
    print('What is your {0}?  It is {1}.'.format(q, a))

for i in reversed(range(1, 10, 2)):
    print(i)
```

### 条件语句

+ `is`, `is not`, `in`, `not in`, `a<b==c`, `a and not b or c`
+ 计算从左到右，优先级`（）> not > and > or`