#virtualbox 跑 Android

###1. 模拟器[安装](http://www.rickylford.com/install-android-5-1-on-virtualbox/)
+ 下载镜像[地址](http://www.android-x86.org/download)

####1.1 安装注意
+ 创建虚拟机，type用linux, Version用Other linux(32-bit)

![alt text](http://www.rickylford.com/wp-content/uploads/2016/01/img_568849b4f13d1.png)

+ 创建好之后，
  1. 加载iso，光盘启动放前面，
  2. 修改网络为桥接，启动安装界面。
  3. 指点设备项，disable usb触控板输入，改为ps/2鼠标。
  4. 显存可加大到64m，音频控制器改到`SoundBlaster 16.`
  5. 禁止usb选项。
  
+ 选择安装到硬盘
 ![选择安装到硬盘](http://visualgdb.com/w/wp-content/uploads/2015/09/12-bootmenu.png)
+ 创建分区
 ![创建分区](http://www.rickylford.com/wp-content/uploads/2016/01/VirtualBox_Android-5.1_02_01_2016_15_22_45.png)
+ 不用GPT **NO**
 ![GPT no](http://www.rickylford.com/wp-content/uploads/2016/01/VirtualBox_Android-5.1_02_01_2016_15_23_07.png)
+ new分区
  ![new处回车](http://www.rickylford.com/wp-content/uploads/2016/01/VirtualBox_Android-5.1_02_01_2016_15_24_10.png)
+ primary回车，默认size回车，bootable回车，write回车，yes， quit
+ 分区设置完成
  ![分区设置](http://www.rickylford.com/wp-content/uploads/2016/01/VirtualBox_Android-5.1_02_01_2016_15_26_59.png)
+ 选择分区并格式化
+ ![](http://www.rickylford.com/wp-content/uploads/2016/01/VirtualBox_Android-5.1_02_01_2016_15_27_42.png)
+  ![](http://www.rickylford.com/wp-content/uploads/2016/01/VirtualBox_Android-5.1_02_01_2016_15_28_20.png)
+  安装Grub YES
+  ![](http://www.rickylford.com/wp-content/uploads/2016/01/VirtualBox_Android-5.1_02_01_2016_15_29_45.png)
+  EFI GRUB SKIP
+  ![](http://www.rickylford.com/wp-content/uploads/2016/01/VirtualBox_Android-5.1_02_01_2016_15_30_53.png)
+  重启之后
+  ![](http://www.rickylford.com/wp-content/uploads/2016/01/VirtualBox_Android-5.1_02_01_2016_15_34_10.png)
+ 运行之后黑屏待机，按第二个菜单控制==>正常关机。
+ 在android进入`settings`->`display`->`sleep`->`never`避免休眠
+ 打开terminal应用，修改Run-as工具权限，避免安卓因为权限问题不能启动gdbserver,也就不能调试安卓代码
> ifconfig eth0

> su

> chmod 4750 /system/bin/run-as

visualstudio + visualGDB 调试程序， [参考](http://visualgdb.com/tutorials/android/virtualbox/)