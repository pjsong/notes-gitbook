#virtualbox 跑 win10

## 执行步骤

+ [下载](https://www.microsoft.com/en-us/software-download/windows10) `media creation tool` 工具

+ 安装时选择ISO.


##问题
+ 显卡驱动显示有问题
> 在vm启动后，设备菜单`-->`安装增强功能

+ 不能被激活
> 虚拟机不能被认为是同一个设备，因此不能被激活，但不影响使用

+ 网络连接
> host-only方式是只能访问到宿主机为止
> 
> NAT是把宿主机作为一个外部网络，虚拟机需要穿过路由器来访问。

> 桥接方式是把虚拟网卡和宿主网卡放到平等的地位。

> 三种方式逐步放宽网络的限制。
