# shell编程

## 变量

### [tutorial point](https://www.tutorialspoint.com/unix/unix-using-arrays.htm)

+ 大写，不带`-`
+ `VARIABLE_NAME=variable_value`，常量`readonly VARIABLE_NAME`,`unset VARIABLE_NAME`
+ `$`本shell的PID
+ `！`上一个后台进程的PID
+ `0`本脚本文件名，n从1到n代表从1开始的参数，
+ `#`参数个数，
+ `*`给所有参数加双引号比如有两个参数，$*就等价于$1 $2
+ `@`单独给每个参数加双引号
+ `？`上个命令的退出码
+ 数组定义`ARRAY_NAME=(value1 ... valuen)`,访问`${ARRAY_NAME[0]}`，`${ARRAY_NAME[*]}`，`${array_name[@]}`

## 表达式

### [tutorial point1](https://www.tutorialspoint.com/unix/unix-using-arrays.htm)

注意`2 + 2`之间的空格，`expr`要用backtick包起来。条件判断`[ $a == $b ]`也一样

```bash
#!/bin/sh

val=`expr 2 + 2`
echo "Total value : $val"
```

假定`a=10;b=20`

+ `expr $a + $b`, `expr $a - $b`, `expr $a \* $b`,`expr $b / $a`,`expr $b % $a`,`[ $a == $b ]`,`[ $a != $b ]`,`a = $b`, 注意外面有backtick
+ `[ $a -eq $b ]`, `[ $a -ne $b ]`, `[ $a -gt $b ]`, `[ $a -lt $b ]`
+ `[ ! false ]`, `[ $a -lt 20 -o $b -gt 100 ]`, `[ $a -lt 20 -a $b -gt 100 ]`
+ `^=`异或

假定`a="abc";b="efg"`

+ `[ $a = $b ]`,`[ $a != $b ]`, `[ -z $a ]`操作数是否空,`[ -n $a ]`操作数是否非空,`[ $a ]`是否空串

文件操作符

+ `[ -b $file ]`块文件，`[ -c $file ]`字符文件，
+ `[ -d $file ]`目录，`[ -f $file ]`普通文件，`[ -g $file ]`文件有groupId,`[ -u $file ]`文件有userId,`[ -o $file ]`user拥有文件
+ `[ -e $file ]`是否存在，
+ `[ -s $file ]`大小不为0,`rwx`可读写执行
+ `[ -t $file ]`文件描述附打开并关联terminal

#### 逻辑判断`if ... fi`, `if...else...fi`, `if ... elif ...else... fi`

`case ... esac`

```bash
#!/bin/sh
FRUIT="kiwi"

case "$FRUIT" in
   "apple") echo "Apple pie is quite tasty." 
   ;;
   "banana") echo "I like banana nut bread." 
   ;;
   "kiwi") echo "New Zealand is famous for kiwi." 
   ;;
esac
```

```bash
#!/bin/sh

option="${1}" 
case ${option} in
   -f) FILE="${2}"
      echo "File name is $FILE"
      ;;
   -d) DIR="${2}"
      echo "Dir name is $DIR"
      ;;
   *)
      echo "`basename ${0}`:usage: [-f file] | [-d directory]" 
      exit 1 # Command to come out of the program with status 1
      ;;
esac
```

`./test.sh`, `./test.sh -f index.htm`,`./test.sh -d unix`

#### while

```bash
#!/bin/sh

a=0
while [ "$a" -lt 10 ]    # this is loop1
do
   b="$a"
   while [ "$b" -ge 0 ]  # this is loop2
   do
      echo -n "$b "
      b=`expr $b - 1`
   done
   echo
   a=`expr $a + 1`
done
```

```text
0
1 0
2 1 0
3 2 1 0
4 3 2 1 0
5 4 3 2 1 0
6 5 4 3 2 1 0
7 6 5 4 3 2 1 0
8 7 6 5 4 3 2 1 0
9 8 7 6 5 4 3 2 1 0
```

<http://www.shellscript.sh/variables3.html>

<http://www.tldp.org/LDP/abs/html/abs-guide.html#REGEXREF>

<https://www.gnu.org/software/bash/manual/html_node/Reserved-Word-Index.html>

<http://stackoverflow.com/questions/26792169/use-last-commands-output-as-a-pipeline-input-for-bash-shell-script>

<http://www.regular-expressions.info/anchors.html>

<http://serverfault.com/questions/52034/what-is-the-difference-between-double-and-single-square-brackets-in-bash>

<http://mywiki.wooledge.org/BashFAQ/031>

+ 替换文件名中的空格

    `find -name "* *" -type f | rename 's/ /_/g'`