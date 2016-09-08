#virtualbox 跑 ubuntu

##1. 安装

基本安装没有windows的那些问题

###1.1. [安装java](https://www.digitalocean.com/community/tutorials/how-to-install-java-on-ubuntu-with-apt-get)

###1.1.1 安装指令
> sudo apt-get install python-software-properties

> sudo add-apt-repository ppa:webupd8team/java
> 
如果这条指令失败， 先安装指令`apt-get install software-properties-common`

> sudo apt-get update

> sudo apt-get install oracle-java8-installer

###1.1.1. 管理多版本
>sudo update-alternatives --config java

###1.1.2. 设置JAVA_HOME
> 从1.1.1 的结果里面copy路径

> 在`/etc/environment`文件添加行
> `JAVA_HOME="YOU_COPIED_PATH"`


###1.2. [安装`android studio`](https://developer.android.com)
+ 启动后新建项目报异常 
`Exception in thread "AWT-EventQueue-0" java.lang.ClassCastException: sun.awt.image.BufImgSurfaceData cannot be cast to sun.java2d.xr.XRSurfaceData`
> 在studio64.vmoptions文件内， [增加虚拟机启动参数](http://stackoverflow.com/questions/34188495/how-can-i-work-around-the-classcastexception-in-java2d-bug-id-7172749)  '-Dsun.java2d.xrender=false'

> 然后删除原来的临时文件夹 


>`rm -rf ~/.android`

>`rm -tf ~/.AndroidStudio2.1`

>重新启动

###1.2.1. android studio 启动模拟器
+ 在virtualbox中的studio启动不了模拟器。因为virtualbox不暴露虚拟VT-x,AMD-V，也就是ubuntu不能再启动虚拟机来做模拟器。
+ 在virtualbox中启动android，然后用virtualbox的android studio连接。也不行。因为android的ADB走usb，wifi也不可用(因为ubuntu virtualbox是网线桥接)。
+ 有人说用genymotion,还没试。
+ [有人](http://stackoverflow.com/questions/28252296/test-android-app-on-virtual-box-from-android-studio)说再设一个网卡做转发，试了下，adb connect ip连接没问题。这就是 **答案**。 为什么又可以了呢？因为adb connect 后面可以直接跟IP，也就是tcp over usb.


###1.2.2. 让程序在真实的设备上运行

使用[Hardware device debugging](https://developer.android.com/studio/run/device.html)

+ 在设备上开发时，仍然要使用模拟器来测试一些与实际设备不同的配置，尽管不能用模拟器测试所有的设备功能，但你可以确保你的程序在不同的安卓版本平台，不同的屏幕尺寸，方向上功能正常。

###1.2.3. [安装USB驱动]
windows下需要安装，linux/osx只要Hardware device debugging就够了


###1.3 spring环境
1. 安装[sdkman](http://sdkman.io/install.html)
> `curl -s "https://get.sdkman.io" | bash`

> source "$HOME/.sdkman/bin/sdkman-init.sh" 

> sdk version

2. 安装spring-boot_cli
> sdk install springboot

3. git
> sudo apt-get install git