# Windows 指令备忘

##端口检查, 
#### 1. 检查端口/程序
> netstat -aon|findstr "5000"

#### 查看进程
> tasklist|findstr "2016"

#### 结束进程
> taskkill /f /t /im tor.exe

> taskkill /F /PID pid

### 也可以下载[TCP/view](https://technet.microsoft.com/en-us/sysinternals/tcpview.aspx)