#Docker-Compose
---
###安装
+ <del>进入https://github.com/docker/compose/releases</del>[pip安装](https://docs.docker.com/compose/install/#/alternative-install-options)
+ 指令
<pre><del>curl -L https://github.com/docker/compose/releases/download/1.8.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose</del>
sudo apt-get install python-pip
sudo pip install docker-compose
docker-compose version</pre>

######卸载

`pip uninstall docker-compose`

##指令
[config参考docker-ghost-template](https://github.com/jwasham/docker-ghost-template)

+ `docker-compose up --build`
+ `docker-compose down`
+ `docker-compose start SERVICE_NAME`
+ `docker-compose stop SERVICE_NAME`
+ `docker-compose ps`
+ `docker-compose exec CONTAINER_NAME BASH(or SH)`
+ `docker inspect CONTAINER_NAME`

##说明
[原文](https://docs.docker.com/compose/compose-file/)

`docker-compose.yml`包括服务，网络，卷

服务定义包含容器的配置，和传递命令行参数给`docker run`类似。

网络和卷类似`docker network create` 和`docker volumn create`.

注意： yaml中bool和str的值都要用`""`.




---
###Services服务配置
#### build： 
  + context，一个包含Dockerfile的路径，或者一个git地址。
  + dockerfile: 另外指定Dockerfile
  + args： 构建时的环境变量. Dockerfile指定参数

<pre><yaml>build: ./dir
build:
  context: ./dir
  dockerfile: Dockerfile-alternate
  args:
    buildno: 1</yaml>  </pre>

下面的例子构建了一个名字为`webapp`的image，tag为`tag`
<pre>build: ./dir
image: webapp:tag</pre>

args例子，要在`Dockerfile文件中定义
<pre>
ARG password
RUN echo "Build number: $buildno"
RUN script-requiring-password.sh "$password"</pre>
然后build下面用这个参数
<pre><yaml>build:
  context: .
  args:
    buildno: 1
    password: secret
build:
  context: .
  args:
     `- buildno=1`
     `- password=secret`</yaml></pre>

如果参数后面不指定值，构建的值就从环境变量取<pre>args:
  - buildno
  - password</pre>

#### cap_add, cap_drop: 
增加/去除容器的capabilities
#### command: 
重载缺省command<pre>command: bundle exec thin -p 3000</pre>或者<pre>command: [bundle, exec, thin, -p, 3000]</pre>
#### `cgroup_parent: m-executor-abcd` 
可选，容器的cgroup_parent
#### `container_name: my-web-container` 
注意容器名字唯一
#### 设备映射
<pre>devices:
  - "/dev/ttyUSB0:/dev/ttyUSB0"</pre>
#### `depends_on` 服务依赖.
+ `docker-compose up`按照dependency order启动service,例子中，先启动db，redis
+ `docker-compose up SERVICE`自动包含服务的依赖。启动web自动启动db，redis。不过web不会等待依赖启动完成。
<pre><yaml>version: '2'
services:
  web:
    build: .
    depends_on:
      - db
      - redis
  redis:
      image: redis
  db:
      image: postgres</pre>
</yaml></pre>

#### dns单值或者list
<pre><yaml>dns: 8.8.8.8
dns:
  - 8.8.8.8
  - 9.9.9.9</yaml></pre>

#### `dns_search`
dns查找域
#### `tmpfs`
容器内加载文件系统
#### `entrypoint`
重载缺省entrypoint
#### `env_file`
从文件加载环境变量。文件内使用的路径为yaml文件的相对路径<pre><yaml>env_file: .env
env_file:
  `- ./common.env`
  `- ./apps/web.env`
  `- /opt/secrets.env`</yaml></pre>文件内容<pre># Set Rails/Rack environment
RACK_ENV=development</pre>注意，与environment类似，不是构建时使用args的变量。

#### environment
<pre><yaml>environment:
  RACK_ENV: development
  SHOW: 'true'
  SESSION_SECRET:
environment:
  `- RACK_ENV=development`
  `- SHOW=true`
  `- SESSION_SECRET`</yaml></pre>
 

#### expose 
对linked service暴露端口，不暴露给host。<pre><yaml>expose:
 `- "3000"`
 `- "8000"`</yaml></pre>

+ extends继承docker compose。 `service`:被继承的service， `file`：定义service的compose文件相对于当前文件的位置，如果忽略file，就从当前文件定位service。可以多重继承，但不能循环继承。<pre><yaml>extends:
  file: common.yml
  service: webapp</yaml></pre>

#### external_links:
链接到compose之外的容器。指定容器名，link的alias与links语义类似<pre><yaml>external_links:
 `- redis_1`
 `- project_db_1:mysql`
 `- project_db_1:postgresql`</yaml></pre>

#### extra_hosts 
同dockers的`--add-host`参数<pre><yaml>extra_hosts:
 `- "somehost:162.242.195.82"`
 `- "otherhost:50.31.209.229"`</yaml></pre>在容器内创建记录<pre>162.242.195.82  somehost
50.31.209.229   otherhost</pre>

#### image 
指定容器启动镜像<pre>image: redis
image: ubuntu:14.04
image: tutum/influxdb
image: example-registry.com:4000/postgresql
image: a4bc65fd</pre>
image不存在就pull，除非在build中，那就用指定的选项去build，指定的tag去tag。

#### labels为容器添加元数据，array或者dictionary都可以,避免冲突，用reverse-dns格式。<pre><yaml>labels:
  com.example.description: "Accounting webapp"
  com.example.department: "Finance"
  com.example.label-with-empty-value: ""
labels:
  `- "com.example.description=Accounting webapp"`
  `- "com.example.department=Finance"`
  `- "com.example.label-with-empty-value"`</yaml></pre>

#### links
容器链接到其他service中的容器,直接指定service，或者用service:alias格式。<pre><yaml>web:
  links:
   `- db`
   `- db:database`
   `- redis`</yaml></pre>links也代表依赖关系，决定启动的顺序

#### logger
与docker run --log-driver, --log-opt效果一样<pre><yaml>logging:
  driver: syslog
  options:
        syslog-address: "tcp://192.168.0.42:123"</yaml></pre>缺省使用json-file,也只有json-file支持`docker-compose up`<pre>driver: "json-file"
driver: "syslog"
driver: "none"</pre>
 
#### net网络模式，
与docker client用--net参数一样。container可以带service name<pre>net: "bridge"
net: "host"
net: "none"
net: "container:[service name or container name/id]"</pre>

#### networks
要加入的网络<pre><yaml>services:
  some-service:
    networks:
     `- some-network`
     `- other-network`</yaml></pre>

#### alias：
service在网络上的主机别名。网络上其他主机可以用service名，或者alias访问服务的某个容器。因为alias面向网络范围，因此一个服务在不同的网络可以是不同的alias。一个alias可以被多个容器/服务共享，到底会解析到哪一个不能保证。基本格式<pre><yaml>services:
  some-service:
    networks:
      some-network:
        aliases:
         - alias1
         - alias3
      other-network:
        aliases:
         - alias2</yaml></pre>对应例子
<pre><yaml>version: '2'
services:
  web:
    build: ./web
    networks:
      - new
  worker:
    build: ./worker
    networks:
    - legacy
  db:
    image: mysql
    networks:
      new:
        aliases:
          - database
      legacy:
        aliases:
          - mysql
networks:
  new:
  legacy:</yaml></pre>
其中，三个service， 2个network，在new网， db服务可以用主机名db或者database访问，在legacy网，用db或者mysql访问。

+ `ipv4_address, ipv6_address`容器加入网络使用的静态ip.
  + 要用ipv6，`com.docker.network.enable_ipv6`要设置true
  + 顶级的网络配置模块要有对应`ipam`配置，包含静态地址的子网和网关。
<pre><yaml>version: '2'

services:
  app:
    image: busybox
    command: ifconfig
    networks:
      app_net:
        ipv4_address: 172.16.238.10
        ipv6_address: 2001:3984:3989::10

networks:
  app_net:
    driver: bridge
    driver_opts:
      com.docker.network.enable_ipv6: "true"
    ipam:
      driver: default
      config:
      - subnet: 172.16.238.0/24
        gateway: 172.16.238.1
      - subnet: 2001:3984:3989::/64
        gateway: 2001:3984:3989::1</yaml></pre>

#### `pid: "host"`
打开容器和host之间的pid地址空间共享。这样启动后的容器能够操作其他容器。
####port 暴露端口，
  + 如果只指定一个端口，代表容器使用，主机随意，
  + 如果指定两个，分别是容器和主机。
<pre><yaml>ports:
 - "3000"
 - "3000-3005"
 - "8000:8000"
 - "9090-9091:8080-8081"
 - "49100:22"
 - "127.0.0.1:8001:8001"
 - "127.0.0.1:5000-5010:5000-5010"</yaml></pre>

#### security_opt
每个容器重载缺省的labeling scheme
<pre><yaml>security_opt:
  - label:user:USER
  - label:role:ROLE</yaml></pre>

+ `stop_signal: SIGUSR1`定制stop容器发送的signal.缺省发送`SIGTERM`

#### 重载容器ulimits
<pre><yaml>ulimits:
  nproc: 65535
  nofile:
    soft: 20000
    hard: 40000</yaml></pre>

#### volumn, volumn_driver
加载路径或者volumn。
  + 也可以指定host上的路径[host:container:ro]。
  + volumn在顶级定义配置volumn的key上定义
  + 容器的路径相对于compose配置文件的位置。
  + 如果不用host路径，还可以用`volumn_driver`, `volume_driver: mydriver`
  + 这个driver不能用已命名的volumn。 定义volumn的时候，要用driver选项指定。
  + 用了driver就不能用host路径
  
<pre><yaml>
volumes:
  # Just specify a path and let the Engine create a volume
  - /var/lib/mysql

  # Specify an absolute path mapping
  - /opt/data:/var/lib/mysql

  # Path on the host, relative to the Compose file
  - ./cache:/tmp/cache

  # User-relative path
  - ~/configs:/etc/configs/:ro

  # Named volume
  - datavolume:/var/lib/mysql</yaml></pre>

#### `volumn_from` 从其他服务/容器加载volumn，访问权限缺省rw
<pre><yaml>
volumes_from:
 - service_name
 - service_name:ro
 - container:container_name
 - container:container_name:rw
</yaml></pre>

#### docker run参数对应
`cpu_shares, cpu_quota, cpuset, domainname, hostname, ipc, mac_address, mem_limit, memswap_limit, privileged, read_only, restart, shm_size, stdin_open, tty, user, working_dir`

---
###volumn配置
定义service的同时,定义命名volumn. volumn可以在多个service中重复使用(不依赖volumn_from)，可以轻松用docker 命令/api查看。如docker volumn

#### ` driver: foobar`, 
缺省驱动`local`,指定用哪个驱动。
#### ` driver_opts`,
驱动选项，传给指定驱动的参数，具体内容要看用哪个驱动
<pre><yaml>driver_opts:
   foo: "bar"
   baz: 1</yaml></pre>
#### `external`:
volumn在compose之外已经创建。如果不存在compose报错。外部volumn不可以再使用driver, driver_opts配置。下面的例子，查找已有的data卷并加载到service为db的容器，
 <pre><yaml>version: '2'
services:
  db:
    image: postgres
    volumes:
      - data:/var/lib/postgresql/data
volumes:
  data:
    external: true</yaml></pre>
也可以用compose文件中的volumn名
<pre><yaml>volumes:
  data:
    external:
      name: actual-name-of-volume</yaml></pre>

###创建网络
##### driver.
缺省使用的driver根据docker-engine的配置看，如果是单一主机一般是`bridge`桥接，Swarm一般是`overlay`。<br>
如果driver不可用，docker engine返回错误。`driver: overlay`
#### `driver_opts`. 
driver的参数，看具体使用的driver
#### `ipam`
<pre><yaml>ipam:
  # ipam driver
  driver: default
  config:
    #网段
    - subnet: 172.28.0.0/16
      #分配给容器的ip段
      ip_range: 172.28.5.0/24
      gateway: 172.28.5.254
      aux_addresses:
        host1: 172.28.1.5
        host2: 172.28.1.6
        host3: 172.28.1.7</yaml></pre>
#### `external`
已经在composer外部创建。不可再次使用driver，driver_opts之类的配置命令.例子中，compose查找outside网络，然后把proxy service的容器连上去。
<pre><yaml>version: '2'

services:
  proxy:
    build: ./proxy
    networks:
      - outside
      - default
  app:
    build: ./app
    networks:
      - default

networks:
  outside:
    external: true</yaml></pre>
单独指定compose文件中的网络名
<pre><yaml>networks:
  outside:
    external:
      name: actual-name-of-network</yaml></pre>

#####compose文件版本`Version`

#####变量替换
shell中使用`EXTERNAL_PORT=8000`,docker-compose就可以
<pre><yaml>web:
  build: .
  ports:
    - "${EXTERNAL_PORT}:5000"</yaml></pre>
`docker-compose up`创建容器时，变成了`"8000:5000"`,如果变量没有设置，则为空串，如果要用`$`,使用`$$`表示, `$VARIABLE`,`${VARIABLE}`两种句法都可用。
<pre><yaml>web:
  build: .
  command: "$$VAR_NOT_INTERPOLATED_BY_COMPOSE"</yaml></pre>
其中`command`的值不是一个变量。而是`$VAR_NOT_INTERPOLATED_BY_COMPOSE`

---