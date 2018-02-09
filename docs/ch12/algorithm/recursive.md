# 递归

递归的三个法则：

+ 有一个base case
+ 通过改变自己的状态，向base case靠近
+ 自我调用,一次调用一个栈操作

## 例子1 求和

递归

```python
def listsum(numList):
   if len(numList) == 1:
        return numList[0]
   else:
        return numList[0] + listsum(numList[1:])
print(listsum([1,3,5,7,9]))
```

改堆栈

```python
from python.basic.stack import Stack
rstack = Stack()

def listsum(numList):
    n = len(numList)
    while n > 0:
        rstack.push(numList[n-1])
        n = n-1
    sum = 0
    while not rstack.isEmpty():
        sum = sum + rstack.pop()
    return sum
```

## 例子2 改10进制为16进制

递归

```python
def toHexStr(n,base):
   strDict = "0123456789ABCDEF"
   if n < base:
      return strDict[n]
   else:
      return toHexStr(n//base,base) + strDict[n%base]

print(toHexStr(1453,16))
```

堆栈

```python
from pythonds.basic.stack import Stack

rStack = Stack()

def toHexStr(n,base):
    convertString = "0123456789ABCDEF"
    while n > 0:
        if n < base:
            rStack.push(convertString[n])
        else:
            rStack.push(convertString[n % base])
            n = n // base
    res = ""
    while not rStack.isEmpty():
        res = res + str(rStack.pop())
    return res

print(toHexStr(1453,16))
```

## 例子3 hanoi塔问题

<https://www.teakki.com/p/57df7a7f1201d4c1629bc085>

```python
def moveTower(height,fromPole, toPole, withPole):
    if height >= 1:
        moveTower(height-1,fromPole,withPole,toPole)
        moveDisk(fromPole,toPole)
        moveTower(height-1,withPole,toPole,fromPole)

def moveDisk(fp,tp):
    print("moving disk from",fp,"to",tp)

moveTower(3,"A","B","C")
```

```java
public void play_recursive(int num, char A, char B, char C) {
    if (num == 1) {
        System.out.println(A + " -> " + C);
        return;
    } else {
        play_recursive(num - 1, A, C, B);
        System.out.println(A + " -> " + C);
        play_recursive(num - 1, B, A, C);
    }
}
```

非递归，

```java
class Disk {
    // 从A塔通过B塔移动到C塔
    char A;
    char B;
    char C;
    // 塔的状态:当height=1时，表示可以直接将该Disk移动到目标塔
    int height;

    public Disk(int height, char A, char B, char C) {
        this.height = height;
        this.A = A;
        this.B = B;
        this.C = C;
    }
}

public void play_non_recursive(int diskNum) {
    Stack<Disk> stack = new Stack<Disk>();
    stack.push(new Disk(diskNum, 'A', 'B', 'C'));
    Disk popDisk = null;
    while (!stack.isEmpty()) {
        popDisk = stack.pop();
        if (popDisk.height == 1) {
            System.out.println(popDisk.A + " -> " + popDisk.C);
        } else {
            // 反顺序添加
            // 将执行移动 popDisk 的下一步的Disk添加到Stack
            stack.push(new Disk(popDisk.height - 1, popDisk.B, popDisk.A, popDisk.C));
            // 将一个status为 "1" 且移动顺序与 popDisk 相同的Disk 添加到Stack中
            stack.push(new Disk(1, popDisk.A, popDisk.B, popDisk.C));
            // 将执行移动 popDisk 的前一步的Disk添加到Stack中
            stack.push(new Disk(popDisk.height - 1, popDisk.A, popDisk.C, popDisk.B));
        }
    }
}

```

## 例子4 前序遍历

<http://www.cnblogs.com/dolphin0520/archive/2011/08/25/2153720.html>

```c
void preOrder1(BinTree *root)     //递归前序遍历
{
    if(root!=NULL)
    {
        cout<<root->data<<" ";
        preOrder1(root->lchild);
        preOrder1(root->rchild);
    }
}
```

```c
void preOrder2(BinTree *root)     //非递归前序遍历
{
    stack<BinTree*> s;
    BinTree *p=root;
    while(p!=NULL||!s.empty())
    {
        while(p!=NULL)
        {
            cout<<p->data<<" ";
            s.push(p);
            p=p->lchild;
        }
        if(!s.empty())
        {
            p=s.top();
            s.pop();
            p=p->rchild;
        }
    }
}
```

## 例子5 中序遍历

```c
void inOrder1(BinTree *root)      //递归中序遍历
{
    if(root!=NULL)
    {
        inOrder1(root->lchild);
        cout<<root->data<<" ";
        inOrder1(root->rchild);
    }
}
```

```c
void inOrder2(BinTree *root)      //非递归中序遍历
{
    stack<BinTree*> s;
    BinTree *p=root;
    while(p!=NULL||!s.empty())
    {
        while(p!=NULL)
        {
            s.push(p);
            p=p->lchild;
        }
        if(!s.empty())
        {
            p=s.top();
            cout<<p->data<<" ";
            s.pop();
            p=p->rchild;
        }
    }
}
```

## 例子6 全排列

### 递归选择

```java
public static void permutation1(String str ,String result ,int len){
    if(result.length()==len){            //表示遍历完了一个全排列结果
    System.out.println(result);
    }
    else{
        for(int i=0;i<str.length();i++){
            if(result.indexOf(str.charAt(i))<0){    //返回指定字符在此字符串中第一次出现处的索引。
                //System.out.println("字母："+str.charAt(i));
                permutation1(str, result+str.charAt(i), len);
            }
        }
    }
}
```

### 非递归选择

```java
    public static class StackElement {
        String str;
        String result;
        int len;
        public StackElement(String str, String result, int len) {
            super();
            this.str = str;
            this.result = result;
            this.len = len;
        }
        public StackElement copy(){
            StackElement ret = new StackElement(str, result, len);
            return ret;
        }
    }

    public static void permutation1Stack(StackElement stackElement){
        Deque<StackElement> stack = new ArrayDeque<StackElement>();
        stack.add(stackElement);
        while(!stack.isEmpty()){
            StackElement se = stack.pop();
            if(se.result.length() == se.len){
                System.out.println(se.result);
            }else{
                String result = se.result;
                for(int i=0; i<se.str.length(); i++){
                    if(se.result.indexOf(se.str.charAt(i)) == -1){
                        se = se.copy();
                        se.result = result + se.str.charAt(i);
                        stack.push(se);
                    }
                }
            }
        }
    }
```

### 交换算法, 非递归待解

```java
    public static void permutation(String[] str, int first, int end) {
        //输出str[first..end]的所有排列方式
        if(first == end) {    //输出一个排列方式
            for(int j=0; j<= end ;j++) {
                System.out.print(str[j]);
            }
            System.out.println();
        }
        for(int i = first; i <= end ; i++) {
           swap(str, i, first);
            //else System.out.println("pre: "+ i + "\n");
            permutation(str, first+1, end);  //输出
           swap(str, i, first);//换回来
        }
    }
    public static void main(String args[]) throws Exception { 
        String[] str = {"a","b","c"};
        permutation(str, 0, 2);//输出str[0..2]的所有排列方式
   }
```

## 例子7 组合问题

<http://www.kuqin.com/algorithm/20070920/1158.html>

```c
void combine( int a[], int n, int m,  int b[], const int M )
{
  for(int i=n; i>=m; i–)  // 注意这里的循环范围
  {
    b[m-1] = i - 1;
    if (m > 1)
    combine(a,i-1,m-1,b,M);
    else      // m == 1, 输出一个组合
      {
        for(int j=M-1; j>=0; j–)
        cout << a[b[j]] << ” “;
        cout << endl;
 }
}
```

```java
public class ZuHe {
    //不重复取
    public void combine(int[] a, int n) {
        int[] b = new int[n];//辅助空间，保存待输出组合数
        getCombination(a, n , 0, b, 0);
    }

    private void getCombination(int[] a, int n,
    int begin/*原始数组中开始遍历的位置*/,
    int[] b/*保存待输出组合*/,
    int index/*输出组合的第index位*/) {
        if(n == 0){//如果够n位了，输出b数组
            for(int i = 0; i < index; i++){
                System.out.print(b[i] + " ");
            }
            System.out.println();
            return;
        }

        for(int i = begin; i < a.length; i++){
            b[index] = a[i];
            getCombination(a, n-1, i+1, b, index+1);
        }
    }

    public static void main(String[] args){
        ZuHe robot = new ZuHe();
        int[] a = {1,2,3,4};
        int n = 2;
        robot.combine(a,n);
    }
}
```

```java
//非递归
    static class StackObj{
        int[] a;
        int n;
        int begin;
        int[] b;
        int indexB;
        public StackObj(int[] a, int n, int begin, int[] b, int indexB) {
            super();
            this.a = a;
            this.n = n;
            this.begin = begin;
            this.b = b;
            this.indexB = indexB;
        }
        public StackObj copy(){
            int[] soa = new int[a.length];
            for(int i=0;i<a.length;i++) soa[i] = a[i];
            int[] sob = new int[b.length];
            for(int i=0;i<b.length;i++) sob[i] = b[i];
            return new StackObj(soa,n,begin,sob,indexB);
        }
    }

    public static void doWithStack(StackObj stackObj){
        Stack<StackObj> stack = new Stack<StackObj>();stack.add(stackObj);
        while(!stack.isEmpty()){
            StackObj sobj = stack.pop();
            if(sobj.n == 0){
                for(int i = 0; i < sobj.indexB; i++){
                    System.out.print(sobj.b[i] + " ");
                }
                System.out.println();
            }
            else{
                for(int i=stackObj.begin;i<stackObj.a.length;i++){
                    StackObj newso = sobj.copy();
                    newso.b[newso.indexB] = newso.a[i];
                    newso.indexB++;newso.begin++;newso.n--;
                    stack.push(newso);
                }
            }
        }
    }
```

```java
public static void combination() {
    /*基本思路：求全组合，则假设原有元素n个，则最终组合结果是2^n个。原因是：
        * 用位操作方法：假设元素原本有：a,b,c三个，则1表示取该元素，0表示不取。故去a则是001，取ab则是011.
        * 所以一共三位，每个位上有两个选择0,1.所以是2^n个结果。
        * 这些结果的位图值都是0,1,2....2^n。所以可以类似全真表一样，从值0到值2^n依次输出结果：即：
        * 000,001,010,011,100,101,110,111 。对应输出组合结果为：
            空,a, b ,ab,c,ac,bc,abc.
            这个输出顺序刚好跟数字0~2^n结果递增顺序一样
            取法的二进制数其实就是从0到2^n-1的十进制数
    * */
    String[] str = {"a" , "b" ,"c"};
    int n = str.length;                                  //元素个数。
    //求出位图全组合的结果个数：2^n
    int nbit = 1<<n;                                     // “<<” 表示 左移:各二进位全部左移若干位，高位丢弃，低位补0。:即求出2^n=2Bit。
    System.out.println("全组合结果个数为："+nbit);

    for(int i=0 ;i<nbit ; i++) {                        //结果有nbit个。输出结果从数字小到大输出：即输出0,1,2,3,....2^n。
        System.out.print("组合数值  "+i + " 对应编码为： ");
        for(int j=0; j<n ; j++) {                        //每个数二进制最多可以左移n次，即遍历完所有可能的变化新二进制数值了
            int tmp = 1<<j ;
            if((tmp & i)!=0) {                            //& 表示与。两个位都为1时，结果才为1
                System.out.print(str[j]);
            }
        }
        System.out.println();
    }
}
```
