#常用指令
###top
`shift+f`列出指令， 选择指令可以排序。 

# 系统检查
##### [安装u盘](http://www.ubuntu.com/download/desktop/create-a-usb-stick-on-windows)
下载该文件，在win下运行，生成可启动U盘。

###wordpress ftp更新
+ 安装提示”无法定位 WordPress 根目录”
<pre>/**wordpress 根目录下的wp-config.php末尾添加 */
if(is_admin()) {
	add_filter('filesystem_method', create_function('$a', 'return "direct";' ));
	define( 'FS_CHMOD_DIR', 0751 );
}
</pre>
+ 安装提示无法创建目录
> 在安装目录下`chmod -R 777 . `

##### [ftp server安装](https://www.digitalocean.com/community/tutorials/how-to-set-up-vsftpd-on-centos-6--2)
sftp不是secured ftp， 是shell ftp。另外wordpress不支持sftp，只支持ftp/ftps。

步骤：

+ sudo yum install vsftpd
+ sudo yum install ftp
+ sudo vi /etc/vsftpd/vsftpd.conf
[参考](https://www.unixmen.com/install-vsftpd-server-on-centos-rhel-scientific-linux-6-4/)
<pre>anonymous_enable=NO
ascii_upload_enable=YES
ascii_download_enable=YES
ftpd_banner=Welcome to UNIXMEN FTP service.
use_localtime=YES
useradd sk
passwd sk
</pre>

+ chkconfig vsftpd on
+ service vsftpd status/start/stop/restart
+ sample<pre># ftp 192.168.1.101
Connected to 192.168.1.101 (192.168.1.101).
220 Welcome to UNIXMEN FTP service.
Name (192.168.1.101:root): sk</pre>

选项/配置[说明](https://www.centos.org/docs/5/html/Deployment_Guide-en-US/s1-ftp-vsftpd-conf.html)
##### [远程桌面](http://c-nergy.be/blog/?p=8952)
> sudo apt-get install xrdp

> sudo apt-get update

> sudo apt-get install mate-core mate-desktop-environment mate-notification-daemon

> sudo sed -i.bak '/fi/a #xrdp multiple users configuration \n mate-session \n' /etc/xrdp/startwm.sh


###### 关机
> shutdown -h now
> 
> shutdown -P now
> 
> halt -p
> 
> init 0
> 
> poweroff

###### [磁盘检查](http://askubuntu.com/questions/73160/how-do-i-find-the-amount-of-free-space-on-my-hard-drive)
> apt-get install ncdu
> 
> ncdu

###### 安装/清理
> apt-get autoclean

##### vnc server[安装](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-vnc-on-ubuntu-16-04)
> sudo apt install xfce4 xfce4-goodies tightvncserver

> vncserver

输入密码
###### vnc 配置
配置vnc启动时，要执行那些命令。
文件在.vnc目录下xstartup,在执行vncserver时已经创建好了。
缺省的服务器实例在5901显示端口，vnc用:1表示，可以启动多个服务器实例多个端口，5902就是:2

+ 关闭5901上的实例 `vncserver -kill :1`

+ 把缺省5901的实例配置备份 `mv ~/.vnc/xstartup ~/.vnc/xstartup.bak`

+ 新建文件写入一下内容<pre>#!/bin/bash
xrdb $HOME/.Xresources
startxfce4 &</pre>
其中.Xresources是图形桌面的一些设置， Xfce4是图形软件

+ `sudo chmod +x ~/.vnc/xstartup`

---
###### [virtualbox安装](https://www.howtoforge.com/tutorial/running-virtual-machines-with-virtualbox-5.1-on-a-headless-ubuntu-16.04-lts-server/)
> `sudo nano /etc/apt/sources.list`

> add line `deb http://download.virtualbox.org/virtualbox/debian xenial contrib`

> `wget -q https://www.virtualbox.org/download/oracle_vbox_2016.asc -O- | sudo apt-key add -`

> `#更新package database`
 
>` sudo apt-get update`

> `sudo apt-get install linux-headers-$(uname -r) build-essential virtualbox-5.1 dkms`

> dkms 确保 当linux kernel 版本更新时，VirtualBox host kernel modules 同步更新 

> <pre>cd /tmp
wget http://download.virtualbox.org/virtualbox/5.1.0/Oracle_VM_VirtualBox_Extension_Pack-5.1.0-108711.vbox-extpack
sudo VBoxManage extpack install Oracle_VM_VirtualBox_Extension_Pack-5.1.0-108711.vbox-extpack
adduser root vboxusers
  </pre>
> `virtualbox` 直接启动<br>
> `VBoxManage --help`

######[Docker安装](https://docs.docker.com/engine/installation/linux/ubuntulinux/)
<pre>
$ sudo apt-get install linux-image-extra-$(uname -r)
$ sudo apt-get update
$ sudo apt-get install apt-transport-https ca-certificates
$ sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
$ sudo echo 'deb https://apt.dockerproject.org/repo ubuntu-xenial main' > /etc/apt/sources.list.d/docker.list
$ sudo apt-get update
$ sudo apt-get purge lxc-docker
$ apt-cache policy docker-engine
$ sudo apt-get update
$ sudo apt-get install docker-engine
$ sudo service docker status