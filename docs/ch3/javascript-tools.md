# js 开发工具

## webstorm

### 下载，试用运行，license server注册。

+ 作者主页：http://blog.lanyus.com/
+ license server下载地址：
  1. https://drive.google.com/open?id=0Bx7wGDIg2K-7dzRNOTViaVJJYUE
  2. http://pan.baidu.com/s/1nvjJFZz 密码: fsuy

### 服务器安装

+ 建用户

```bash
    useradd webstorm;//新增用户
    pwsswd xxxxxx;//设置密码
```

+ 修改 /etc/sudoers 文件，找到下面一行，在root下面添加一行，如下所示：

```bash
    ## Allow root to run any commands anywhere
    `root    ALL=(ALL)     ALL`
    `webstorm ALL=(ALL)     ALL`
```

+ 新建启动脚本到`/etc/rc.d/init.d/webstorm`, 添加启动命令

```bash
    vi /etc/rc.d/init.d/webstorm
    #!/bin/bash
    /opt/Intelxxxxx > /dev/null 2>&1 &
    chmod+x webstorm.sh
    chkconfig --add webstorm
    chkconfig --level 345 webstorm on</pre>
```

+ note: `[`相当于test的一个command. 参数参考 man test
