安装好mongo, 并创建数据库和用户。

`sudo docker exec -it mongo-testdb mongo admin`
`use ars02`
`db.createUser({user: "ars", pwd: "ars", roles: ["readWrite", "dbAdmin"]})`

修改原包里边的vantiq/config/里边的文件
`mv io.vantiq.security.SecurityManager.json io.vantiq.security.SecurityManager.json.bak`
`mv KeycloakProvider.json KeycloakProvider.json.bak`

添加vantiq/config里边文件`mongoDbService.json`

```json
{
    "hosts": [

        { "host": "172.18.0.19" }
    ]
}
```

构建镜像，打包上传




VANTIQ DNS Resolution for mongo on Mac Sierra versions
There is a problem with hostname resolution for localhost with the VANTIQ application introduced with Macs running versions of Sierra and later.

From the CLI:
hostname
which outputs something like 'Bretts-MacBook-Air.local'
Edit /etc/hosts and at the bottom of the file add the lines like:
(substituting your hostname output):
127.0.0.1     Bretts-MacBook-Air.local
::1     Bretts-MacBook-Air.local

Run the command:
sudo killall -HUP mDNSResponder
which will cause the DNS to restart (or reboot)

Installing JAVA
VANTIQ requires java 8 to run.
To install Java enter the commands:
brew tap caskroom/versions
brew cask install java8

Verify JAVA is installed correcty with:
java -version

Bretts-MacBook-Air:~ brettrudenstein$ java -version
java version "1.8.0_172"
Java(TM) SE Runtime Environment (build 1.8.0_172-b11)
Java HotSpot(TM) 64-Bit Server VM (build 25.172-b11, mixed mode)

Installing VANTIQ
Download the release of VANTIQ from SharePoint under Engineering -> Documents -> Product Distributions and grab the zip file.  For example vantiq-server-1.22.0-20180415.224851-32-unmonitored.zip

Create the directory for the VANTIQ installation and change the permissions

sudo mkdir -p /opt/vantiq
sudo chown -R `id -un` /opt/vantiq
sudo mkdir -p /var/log/vantiq
sudo chown -R `id -un` /var/log/vantiq

Copy the zip to /opt/vantiq and unzip, for example:

cd Downloads
cp vantiq-server-1.22.0-20180415.224851-32-unmonitored.zip /opt/vantiq
cd /opt/vantiq
unzip vantiq-server-1.22.0-20180415.224851-32-unmonitored.zip
(optionallly you can delete the zip file)
rm vantiq-server-1.22.0-20180415.224851-32-unmonitored.zip

Start VANTIQ
./vantiq-server io.vantiq.vertx.BootstrapVerticle -conf /opt/vantiq/vantiq-server-1.22.0-SNAPSHOT/config/fullServer.json


You will know when vantiq is fully started when you see a line in the output like:
22:34:42.801 [vert.x-eventloop-thread-7] INFO i.v.c.i.l.c.VertxIsolatedDeployer - Succeeded in deploying verticle


You can now log into VANTIQ at:
http://localhost:8080

user: system
password: fxtrt$1492

Starting and stopping
To stop VANTIQ
Stop VANTIQ by pressing ctrl-c in the VANTIQ terminal window
Stop Mongo by pressing ctrl-c in the Mongo terminal window

To start VANTIQ 
Start VANTIQ by opening two terminal windows
Terminal WINDOW 1:
ulimit -n 2048 && mongod;
Terminal WINDOW 2:
./vantiq-server io.vantiq.vertx.BootstrapVerticle -conf /opt/vantiq/vantiq-server-1.22.0-SNAPSHOT/config/fullServer.json

In your browser
http://localhost:8080