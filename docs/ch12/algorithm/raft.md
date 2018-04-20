# raft <https://medium.freecodecamp.org/in-search-of-an-understandable-consensus-algorithm-a-summary-4bc294c97e0d>

动画： <http://thesecretlivesofdata.com/raft/>
站点：<https://raft.github.io/>

易于理解的分布式一致性算法，解决存在可能故障的情况下，多个服务器仍然有一个一致、共享的状态，该状态是一个由replicated log支撑的数据结构。只要大部分机器正常，整个系统则仍然可用。

raft把一致性问题分解为三个子问题

+ 当前leader如果fail，怎样选出新的leader
+ leader怎样同步所有服务器的日志
+ 日志只添加，不可覆盖或者删除

raft保证：

+ 只有1个leader
+ leader不删除/覆盖日志
+ 如果在不同的log有两个entry的termNo和index相同，则他们存储的是同一个命令，且之前的entry都相同
+ 如果一个log entry在给定的term有提交，则该entry在leader所有高于该term的的日志中均存在
+ 如果有server在给定index用了log entry, 其他server在该index不能用不同的log entry.

## 基础

每个server三种状态leader, follower, candidate.
![状态图](https://cdn-images-1.medium.com/max/1600/1*_B3mkKkJiCXJDQJNdd17KA.png)

+ raft通过集群中的选举leader来实现，leader接受所有client请求，还管理到复制到其他server的log。数据单向从leader流向其他服务器。
+ follower自己不发送请求，只是响应leader和candidate的请求，如果client请求到了follower, follower转给leader.
+ candidate用于选举新的leader
+ 所有时间可根据term划分，每个term从选举开始，如果哪个candidate胜出，在该term它就是leader，如果选票平分秋色，该term在没有leader的情况下结束。
+ termNo单向增长，每个服务器都存储一个termNo，通信时相互交换。如果follower发现自己的termNo小，则使用大的termNo, 如果leader或者candidate发现自己的termNo过时，则马上把进入follower状态。 如果server接收到一个过期的termNo请求，直接拒绝。

## 选举

+ leader向follower发送heartbeat保持状态
+ follower接收heartbeat超时，则进入candidate状态，增加自己的termNo, 选举自己之后给其他server发送选举请求。
  + 可能1： 收到大部分服务器的投票并成为新的leader，开始发送heartbeat
  + 可能2： 其他candidate收到请求，检查termNo谁的大，如果比自己大，就选人家并回到follower,否则拒绝请求，继续做candidate
  + 可能3： candidate要么成功要么失败，如果同时多个server进入candidate，选举平局，没有明显的多数，则在某个candidate超时之后，再来一次选举。 raft使用随机选举超时保证平局尽可能少并尽快解决。为了在第一时机避免平局，选举超时是一个随机数，因此大部分时机只有一个server超时，在其他server超时之前它赢得选举并发送心跳。处理平局一样，candiate在选举开始，会重设随机的超时，在开始下一次选举之前等待。

## 日志复制

+ client请求是只写请求，每个请求包含一个命令，该命令被所有server的`replicated state machines`执行
+ leader收到请求，添加到自己的log，log的entry包含`command`命令，entry的位置，termNo
+ leader并行发送RPC给follower,直到所有的follower接收并复制成功
+ 如果大多数server复制完成，该entry就认为已提交。在已提交后leader执行命令，返回结构给client.
+ leader维护它log中最高的待提交index并发送给follower. 一旦follower发现entry已提交，则应用到自己的状态机`state machine`
+ leader发送`AppendEntries`RPC请求时，带上上一个entry，如果follower找不到该entry，则拒绝接收。
+ 当leader宕机，可能出现leader和follower不一致。比如leader在发送给1/3的follower之后宕机了，新的leader没有该entry。此时要求follower与新的leader一致。
+ leader维护每个server的nextindex,新成为leader之后，把自己最后的entry下一个作为nextIndex.
+ 如果发给follower失败，leader把该server的nextIndex降低重发，

## Safety

+ 为保证`state machine执行同样的指令集`，leader含有所有之前term的已提交log。选举时，`request`RPC包含了自己的log信息，如果投票方发现自己的log更新，则会拒绝投票。
+ 不能有两个leader。

