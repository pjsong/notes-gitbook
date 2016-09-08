## java 随机数生成
[原文参考](http://resources.infosecinstitute.com/random-number-generation-java/)
###概念
1. 随机数：不可预测，不可重现。
2. 单一随机数：从一个有限集合中以平均机率选取的数据
3. 随机数队列：每个数字都统计上独立

###随机数的生成两种方法
#####PRNG(Pseudo-Random Number Generator)
PRNG使用数学公式或者预计算好的表来生成随机数。给定一个固定起始点，生成的序列将会重复，是确定的。

#####TRNG(True-Random Number Generator)
TRNG使用物理上的一些状态/现象来生成随机数。用外设的状态/事件/终端来生成。

###Java中的RNG有两类： 
Random和SecureRandom
#####Random算法：
当知道开始种子或者前面的值，很容易就能找出后面的那个值。如果两个Random实例的种子相同，方法顺序也相同，那生成的结果也一样。

Random的其他方法nextInt, nextLong都用了next()的定义来计算。而next()是用原子更新种子的方法来进行的。

缺省的种子是从毫秒时间70年1月1日算起的时间。这样如果人家找到程序的运行时间，就不难找出生成的随机数了。

<pre>import java.util.Random;
public class RandomGenerator {;

public static void main(String[] args) {
Random rand = new Random(123456);

for (int j = 0; j<5; j++)
{
int nextRandom = rand.nextInt(5);
System.out.print(nextRandom+” “);
}
}
}</pre>

######SecureRandom：
使用加密强伪随机数生成器CSPRNG(Cryptographically Strong Pseudo Random Number Generator)生成随机数。用到了熵(entropy),熵是一个不可预测的输入，熵可以是硬件随机数生成器，或者不可预测系统进程如中断，时间事件。

SecureRandom随机性，安全性和效率取决于采用的算法。如果要真的强加密随机，就要选择一个熵源。熵就是操作系统采集的随机性，熵源负责采集随机数提供给目标。

负责配置SecureRandom API的文件在 `$JAVA_HOME/lib/security/java.security`. 通过`java.security`文件中`securerandom.source`属性，指定熵采集设备，选取种子数据的源。比如<pre>securerandom.source=file:/dev/urandom
OR securerandom.source=file:/dev/random</pre>

linux系统如果指定文件/dev/urandom存在， NativePRNG直接从那里读取随机字节。Windows下，这两个url文件可以使用Microsoft CryptoAPI种子功能。

系统属性` -Djava.security.egd=file:/dev/urandom`可以重载securerandom.source属性，优先级更高。

除了熵，CSPRNG还一个方面是provider，provider就是提供具体Java Security API实现的软件包。provider可以实现数字签名算法，消息加密算法。
SecureRandomSpi为SecureRandom定义spi，三个抽象方法(`engineSetSeed,engineGenerateSeed,and engineNextBytes`)由spi来实现。
Linux缺省SecureRandom实现是NativePRNG， windows下是SHA1PRNG。linux也可以用SHA1PRNG。

NativePRNG是一个linux下扩展了SecureRandomSPI的类， 读取`/dev/random和/dev/urandom`, 这两个文件必须存在。
NativePRNG的setSeed补充而不是代替现有的种子。因此与Random函数基于种子重复调用重复序列不同，保证了随机性。

`setSeed() -> engineSetSeed() -> implSetSeed()`

`implSetSeed()`发送随机字节到OS并尝试写入/dev/(u)random. 在NativePRNG内还有一个平行的SHA1PRNG实例，算法中它也会使用setSeed方法的字节，同时如果熵池空了，它还能生成随机数。

NativePRNG相比SHA1PRNG的另外一个优势，他能持续从OS拿到熵。

SecureRandom的效率因此依赖于基本算法，linux就是NativePRNG，也就是/dev/(u)random行为的效率。


######Random/Urandom
都是用于产生随机数的设备，区别是，从/dev/random设备读取时如果熵位不足会阻塞，urandom在熵位充足才会去读熵池，否则，它用SHA加密哈希算法来生成随机数。

看看两个设备30秒能生成多少随机数。
<pre>$ dd if=/dev/random of=/tmp/parul
0+29 records in
1+0 records out
512 bytes (512 B) copied, 36.2981 seconds, 0.0 kB/s
$ dd if=/dev/urandom of=/tmp/parul
653417+0 records in
653416+0 records out
334548992 bytes (335 MB) copied, 37.1233 seconds, 9.0 MB/s</pre>
因此如果我们想要短时间要更多的随机数，用urandom。只有在长期的GPG/SSL
SSHkey上用random。

人们通常高估他们需要的随机性，低估urandom的随机性，导致了random的过度使用。