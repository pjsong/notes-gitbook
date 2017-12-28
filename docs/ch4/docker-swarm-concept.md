# [Docker-SWARM-Concept](https://docs.docker.com/engine/swarm/key-concepts/#what-is-a-swarm)

## 概念，什么是SWARM

Docker Engine中的集群管理和调度功能通过**swarmkit**来构建。这个项目实现了Docker的调度层，在Docker中直接使用。

一个swarm有多个Docker运行在swarm模式下主机构成，作为Manager, 管理成员关系和成员代理功能，同时作为Worker,运行swarm的服务。一个Docker主机可以是Manager角色，也可以是worker角色，也可以同时充当两个角色。

创建服务时， 定义了服务的最有配置(复制数量，网络，存储，可用的资源，暴露给外部的端口等)。docker致力于维护该状态。比如， 如果一个worker节点不可用， Docker把该节点的任务分配给其他节点。任务就是一个运行的容器， 是swarm服务的一个部分，任务由swarm manager来管理，有别于单独运行的容器。

相对于单独运行的容器， swarm服务的关键优势在于， 你可以修改服务的配置，包括服务链接的网络和数据卷，而无需手动重启服务。Docker将更新配置，停止配置过期的任务，创建新的配置任务。

当Docker在swarm模式下运行， 你仍然能在参与swarm的主机上运行单独容器， 也可以运行swarm服务。单独运行容器和swarm服务的关键区别，在于只有swarm manager可以管理swarm,而单独运行容器可以在任何daemon上启动。 daemon可以在swarm中充当manager, worker,或者同时两个角色。

与用compose来定义和运行容器一样， 你可以定义swarm service栈。

## 节点(Nodes)

节点是参与swarm的一个engine实例。一台物理机上可以运行多个节点，当然生产部署，一般采用跨越多个物理主机的的节点。

要把应用部署到swarm, 首先要给manager节点一个服务定义。manager节点分配task给worker节点。

manager节点还从事调度和集群管理。选取一个leader来做调度任务。

worker节点接受和执行manager分配下来的任务。缺省情况下， manager节点和worker节点一样运行服务，但可以配置成他们仅运行manager任务。在每个worker节点，有一个agent向manager报告分配给他的任务状态，这样manager能够维护每个worker的状态。

## 服务和任务

一个服务就是节点上要执行的任务的定义。他是swarm系统的中心结构，是与swarm交互的根本。

当创建一个服务， 你要指定用哪个容器镜像， 容器中要执行哪个命令

在复制服务模型中，swarm manager根据状态中你的设定的scale，来在节点中分配特定数量的复制任务。

对于全局服务，swarm在集群中的所有节点上，仅运行一个任务。

一个任务包括了一个docker容器和要在容器中运行的命令。是swarm调度的原子单元。manager节点根据service scale设定的复制数量，分配任务给worker节点。一旦任务分配给一个节点，该任务就不能转到其他节点，只能在给定节点运行或者失败。

## 负载均衡

swarm manager使用ingress负载均衡来暴露服务。 swarm manager能自动分配(或者你自己配置)给服务一个发布端口(30000-32767之间)

外部组件，比如云负载均衡,可以访问集群中任意节点发布端口上的服务，不管节点是否正在运行服务的任务.在swarm的所有节点都能把入口链接到一个运行的任务实例。

swarm模式有个内部DNS组件，能自动分配给swarm的每个服务一个DNS条目. swarm manager用内部负载均衡，来在集群中的服务之间，基于服务的DNS名字，来分配请求。

## [功能亮点](https://docs.docker.com/engine/swarm/#feature-highlights)

+ 集群管理与引擎整合。用engine-cli来创建一个engine的swarm，在swarm中部署服务。不需要其他的软件来创建/管理swarm.

+ 无中心设计。引擎可以同时部署两种节点manager和worker，也就是可以从单个磁盘镜像来构建一个swarm. 而不是在部署时处理不同的节点角色之间的差异。

+ 声明式的服务模型。引擎使用声明式的方式，让你定义应用栈中不同服务的状态。比如， 你可以描述一个应用由web前端服务和消息队列服务以及数据库后台组成。

+ 规模扩展。每个服务可以声明你想运行的任务数。 当你要扩大/缩小规模， swarm manager能自动添加/减少任务来适应。

+ 目标状态协调。 swarm manager持续监控集群状态，调整实际状态和目标状态之间的差异。比如， 如果你设置一个服务运行来10个容器复制，一个运行了2个复制的worker崩溃，manager将自动创建两个新的复制来替换崩溃的复制。swarm分配两个新的复制给运行良好的worker.

+ 多主机网络。你可以为服务指定一个覆盖网络。swarm manager能在应用初始化或者更新时，自动给overlay上的容器分配地址。

+ 服务发现。manager节点分配给swarm中每个服务一个唯一的dns名字，在运行的容器中负载均衡。你可以通过swarm中的dns服务器，查询每个swarm中运行的容器

+ 负载均衡。可以包服务的端口暴露给外部的负载均衡。内部，swarm让你确定怎样在节点中分配服务的那些容器。

+ 缺省安全。swarm中的每个节点必须使用tls双向认证和加密保证他自己和其他节点的通信安全。你可以用自签名的根证书或者其他根证书。

+ 滚动更新。 更新时，你可以增量给节点实行服务更新。swarm manager允许你控制部署到不同节点上时间的延时。如果有问题，你可以回滚任务到服务的先前版本。
