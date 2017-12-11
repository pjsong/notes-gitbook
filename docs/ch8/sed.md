# sed用法

## ref

<https://www.gnu.org/software/sed/manual/sed.pdf>
<http://www.grymoire.com/Unix/SedChart.pdf>
<https://linuxconfig.org/learning-linux-commands-sed>

### sed是怎样工作的

+ sed维护两个数据空间：活跃模式和辅助保留。 起初都为空
+ 对每行， sed从input stream读入， 放入模式空间， 然后执行命令。
+ 每个命令都关联了一个地址， 所谓的地址就是一个条件判断代码，只有满足条件才会执行命令。
+ 当脚本结束， 除了有-n选项， 模式空间的内容会打印到output stream, 然后开始下一行循环。除非使用特殊命令如D， 模式空间在两次循环之间被删除， 而辅助保持空间被保留

### 总揽

#### sed SCRIPT INPUTFILE

##### 等价写法

    sed ’s/hello/world/’ input.txt > output.txt
    sed ’s/hello/world/’ < input.txt > output.txt
    cat input.txt | sed ’s/hello/world/’ - > output.txt
    sed -e ’s/hello/world/’ input.txt > output.txt

    echo ’s/hello/world/’ > myscript.sed \
    && sed -f myscript.sed input.txt > output.txt \
    && sed --file=myscript.sed input.txt > output.txt

### 命令行选项

    -e -f
见例子

    -n， --quiet， --silent
缺省时活跃空间内容打印到输出，本选项禁止默认打印，使用p才能开启。

    -s， --seperate
缺省时sed把命令行的输入文件当作单个持续的长字节流。GNU此选项禁止范围地址如（/abc/, /def/）跨越文件。行号针对没一个文件， $代表每一个文件末行。R触发的文件都回退到文件的开始。

    -i， --in-place
GNU让活跃空间内容写入临时文件而不是输出， 当文件结束，临时文件重命名为输出文件。该选项默认了-s选项。例如

    sed -i.bak 's/hello/bonjour/' greetings.txt

创建greeting.txt.bak
如果不制定扩展如.bak, 则源文件被覆盖

#### 脚本总揽

    [addr]X[options]

如果指定地址，X只对指定行生效,

    sed ’30,35d’ input.txt > output.txt
不显示30-35行

    sed '5!s/ham/cheese/' file.txt
除了第五行， 替换ham为cheese

    sed '/[0-9]\{3\}/p' file.txt
打印连续三个数字

    sed '/boom/!s/aaa/bb/' file.txt
替换aaa为bbb除非看到boom

    sed '17,/disk/d' file.txt
删除17行到disk行

    sed ’/^foo/q42’ input.txt > output.txt
输出^foo之前的内容并用42退出

     sed ’/^foo/d ; s/hello/world/’ input.txt >output.txt
等价

    sed -e ’/^foo/d’ -e ’s/hello/world/’ input.txt > output.txt
等价

    echo ’/^foo/d’ > script.sed
echo ’s/hello/world/’ >> script.sed
sed -f script.sed input.txt > output.txt
等价

echo ’s/hello/world/’ > script2.sed
sed -e ’/^foo/d’ -f script2.sed input.txt > output.txt

删除^foo行，替换hello为world

a， c, i命令后面不能用分号，必须用空格或者放文件结尾

## 命令

### s命令

    s/regexp/replacement/flags
匹配regexp, 替换成replacement. replace可以含有\n比如\1, \2, 代表第几次匹配。

+ i 匹配时大小写不敏感

+ g 替换所有的匹配， 而不是第一个匹配

+ number 只替换第n次匹配

### 其他命令

#### 注释

    #

#### q[code]退出并返回code

#### a text添加 text, 多行使用a\

    seq 3 | sed '2a hello'
等价

    seq 3 | sed -e '2a\' -e hello

添加 text, 在第三行插入hello输出

    1
    2
    hello
    3

#### c text替换行, 多行使用c\

    $ seq 10 | sed '2,9c hello'
    1
    hello
    10

#### d 删除模式空间, 进入下一个循环

#### i text 前面插入行， 当插入多行使用i\

    seq 3 | sed '2i\
    hello\
    world
    s/./X/'
输出

    X
    hello
    world
    X
    X
当命令不是’\‘结束如world, sed重启命令

#### r filename读取文件

     seq 3 | sed '2r/etc/hostname'
输出

    1
    2
    fencepost.gnu.org
    3




## 地址