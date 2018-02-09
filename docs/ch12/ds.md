# 数据结构和算法

## [算法分类](https://www.tutorialspoint.com/data_structures_algorithms/divide_and_conquer.htm)

### 贪婪

比如，面值1,7,10的硬币，怎样数量最少组成15
可能的方法首先用最大的10开始试，得到10+1+1...数量为6
然后使用7,7+1+1，数量最少.

经典算法包括

1. Travelling Salesman Problem
2. Prim's Minimal Spanning Tree Algorithm
3. Kruskal's Minimal Spanning Tree Algorithm
4. Dijkstra's Minimal Spanning Tree Algorithm
5. Graph - Map Coloring
6. Graph - Vertex Cover
7. Knapsack Problem
8. Job Scheduling Problem

### 分而治之

1. 打碎/分开
2. 逐个解决
3. 合并

经典算法包括：

1. Merge Sort
2. Quick Sort
3. Binary Search
4. Strassen's Matrix Multiplication
5. Closest pair (points)

### 动态算法

在打碎问题方面和分而治之相似，不同的是，子问题并不能独立解决，这些子问题的解决结果被记下来用于类似或者重复的问题。

主要用于一个问题可以分解成为类似的子问题，使得他们的结果能被重用。在用于优化的算法中，解决当前问题之前，动态算法会检查之前解决的子问题。为了达到最佳方案，合并之前问题的解决结果。

经典算法

1. Fibonacci number series
2. Knapsack problem
3. Tower of Hanoi
4. All pair shortest path by Floyd-Warshall
5. Shortest path by Dijkstra
6. Project scheduling

## 参考资源

<http://wangkuiwu.github.io/>

## 拓扑排序

目标： 将一个有向无环图(Directed Acyclic Graph简称DAG)进行排序进而得到一个有序的线性序列。

步骤：

1. 构造一个队列Q(queue) 和 拓扑排序的结果队列T(topological)；
2. 把所有没有依赖顶点的节点放入Q；
3. 当Q还有顶点的时候，执行下面步骤：
    1. 从Q中取出一个顶点n(将n从Q中删掉)，并放入T(将n加入到结果集中)；
    2. 对n每一个邻接点m(n是起点，m是终点)；
        1. 去掉边<n,m>;
        2. 如果m没有依赖顶点，则把m放入Q;

注：顶点A没有依赖顶点，是指不存在以A为终点的边。

[参考](http://www.cnblogs.com/skywang12345/p/3711489.html)

## Kruscal算法

[代码地址](https://github.com/wangkuiwu/datastructs_and_algorithm/blob/master/source/graph/kruskal/udg/c/matrix_udg.c)
目标：在含有n个顶点的连通图中选择n-1条边，构成一棵极小连通子图，并使该连通子图中n-1条边上权值之和达到最小，则称其为连通图的最小生成树。

步骤：

1. 按照权值从小到大的顺序选择n-1条边，并保证这n-1条边不构成回路。
2. 首先构造一个只含n个顶点的森林，然后依权值从小到大从连通网中选择边加入到森林中，并使森林中不产生回路，直至森林变成一棵树为止. 回路判断根据联通树进行，是算法的难点。

回路判断ABCD四个点，下标分别是数组vend的0123

+ 加入AB边，vend[1]=0
+ 加入AC边，vend[2]=0
  + 加入BC，vend[2]重复，回环出现
+ 加入CD边，vend[3]=2
+ 加入BC边，vend[2]=1
  + 加入AD边，vend[3]重复，回环出现

## Prim算法

和克鲁斯卡尔算法一样，是用来求加权连通图的最小生成树的算法.不同的是，先选择一个起始节点做节点遍历，前者是边的遍历。
一次添加一个节点，不会产生回环。
初始状态：V是所有顶点的集合，即V={A,B,C,D,E,F,G}；U和T都是空！

1. 将顶点A加入到U中。此时，U={A}
2. 将顶点B加入到U中。
    上一步操作之后，U={A}, V-U={B,C,D,E,F,G}；因此，边(A,B)的权值最小。将顶点B添加到U中；此时，U={A,B}。
3. 将顶点F加入到U中。
    上一步操作之后，U={A,B}, V-U={C,D,E,F,G}；因此，边(B,F)的权值最小。将顶点F添加到U中；此时，U={A,B,F}。
4. 将顶点E加入到U中。
    上一步操作之后，U={A,B,F}, V-U={C,D,E,G}；因此，边(F,E)的权值最小。将顶点E添加到U中；此时，U={A,B,F,E}
5. 将顶点D加入到U中。
    上一步操作之后，U={A,B,F,E}, V-U={C,D,G}；因此，边(E,D)的权值最小。将顶点D添加到U中；此时，U={A,B,F,E,D}。
6. 将顶点C加入到U中。
    上一步操作之后，U={A,B,F,E,D}, V-U={C,G}；因此，边(D,C)的权值最小。将顶点C添加到U中；此时，U={A,B,F,E,D,C}。
7. 将顶点G加入到U中。
    上一步操作之后，U={A,B,F,E,D,C}, V-U={G}；因此，边(F,G)的权值最小。将顶点G添加到U中；此时，U=V。

## Dijestra算法

<http://www.cnblogs.com/skywang12345/p/3711512.html>

用于计算一个节点到其他节点的最短路径。
它的主要特点是以起始点为中心向外层层扩展(广度优先搜索思想)，直到扩展到终点为止。

1. 初始时，S只包含起点s；U包含除s外的其他顶点，且U中顶点的距离为"起点s到该顶点的距离"[例如，U中顶点v的距离为(s,v)的长度，如果s和v不相邻，则v的距离为∞]。
2. 从U中选出"距离最短的顶点k"，并将顶点k加入到S中；同时，从U中移除顶点k。
3. 更新U中各个顶点到起点s的距离。之所以更新U中顶点的距离，是由于上一步中确定了k是求出最短路径的顶点，从而可以利用k来更新其它顶点的距离；例如，(s,v)的距离可能大于(s,k)+(k,v)的距离。
4. 重复步骤(2)和(3)，直到遍历完所有顶点。

## 深度优先搜索

和树的先序遍历比较类似

## 广度有限搜索

## 二叉树

### 性质

1. 二叉树第i层上的结点数目最多为 2^(i-1) (i≥1)。
2. 深度为k的二叉树至多有2^k - 1个结点(k≥1)。
3. 包含n个结点的二叉树的高度至少为log2 (n+1)。
4. 在任意一棵二叉树中，若终端结点的个数为n_{0}，度为2的结点数为n_{2}，则n_{0}=n_{2}+1。

### 哈夫曼树

给定n个权值作为n个叶子结点，构造一棵二叉树，若树的带权路径长度达到最小，则这棵树被称为哈夫曼树。

+ 路径：在一棵树中，从一个结点往下可以达到的孩子或孙子结点之间的通路，称为路径
+ 若将树中结点赋给一个有着某种含义的数值，则这个数值称为该结点的权

构造规则

1. 将w1、w2、…，wn看成是有n 棵树的森林(每棵树仅有一个结点)；
2. 在森林中选出根结点的权值最小的两棵树进行合并，作为一棵新树的左、右子树，且新树的根结点权值为其左、右子树根结点权值之和；
3. 从森林中删除选取的两棵树，并将新树加入森林；
4. 重复(02)、(03)步，直到森林中只剩一棵树为止，该树即为所求得的哈夫曼树。

## 排序

[参考](https://www.tutorialspoint.com/data_structures_algorithms/selection_sort_algorithm.htm)
排序类别和算法(举例找最小值)

+ 归并: O(nlogn),以排好序的两个arr为输入，输出一个合并的排好序arr.简单的写法用递归

+ 冒泡: Ο(n^2), 相邻两个比较，小的往上冒。一次遍历找出一个最小值,将得到的最小值写入arr
+ 选择: Ο(n^2)，扫描整个list，把第一个和最小的那个交换位置，一次遍历找出一个最小值
+ 插入: Ο(n^2)，相邻两个比较，小的在前，每次得出一个完整排好的arr
+ 希尔: O(n^2), 基于插入排序的改进。使用一个初始步长h，组成n/2个子列表(每个列表2个元素)。子列表排好序，再使用h/2作步长。
+ 快速: O(n^2), 适用于大量数据集.[演示].选定第一个或者最后一个作为pivot,剩下的元素小的排左边，大的右边， 分为两组，为partition, 每一组再递归使用partition<https://www.tutorialspoint.com/data_structures_algorithms/images/quick_sort_partition_animation.gif>

## 有序搜索

+ 二分搜索: Ο(log n), 与中间值比较，向左或向右，找到为止。
+ 插值搜索: Ο(log (log n)), 与`lo + ((double)(hi-lo) / (arr[hi]-arr[lo]))*(x - arr[lo]);`比较， `lo`为低位，`hi`为高位, `x`为搜索目标，`arr`为搜索来源

## 例子

### 排序例子

```java
/* Java program for Merge Sort */
class MergeSort
{
    // Merges two subarrays of arr[].
    // First subarray is arr[l..m]
    // Second subarray is arr[m+1..r]
    void merge(int arr[], int l, int m, int r)
    {
        // Find sizes of two subarrays to be merged
        int n1 = m - l + 1;
        int n2 = r - m;

        /* Create temp arrays */
        int L[] = new int [n1];
        int R[] = new int [n2];

        /*Copy data to temp arrays*/
        for (int i=0; i<n1; ++i)
            L[i] = arr[l + i];
        for (int j=0; j<n2; ++j)
            R[j] = arr[m + 1+ j];

        /* Merge the temp arrays */
        // Initial indexes of first and second subarrays
        int i = 0, j = 0;

        // Initial index of merged subarry array
        int k = l;
        while (i < n1 && j < n2)
        {
            if (L[i] <= R[j])
            {
                arr[k] = L[i];
                i++;
            }
            else
            {
                arr[k] = R[j];
                j++;
            }
            k++;
        }

        /* Copy remaining elements of L[] if any */
        while (i < n1)
        {
            arr[k] = L[i];
            i++;
            k++;
        }

        /* Copy remaining elements of R[] if any */
        while (j < n2)
        {
            arr[k] = R[j];
            j++;
            k++;
        }
    }

    // Main function that sorts arr[l..r] using
    // merge()
    void sort(int arr[], int l, int r)
    {
        if (l < r)
        {
            // Find the middle point
            int m = (l+r)/2;

            // Sort first and second halves
            sort(arr, l, m);
            sort(arr , m+1, r);

            // Merge the sorted halves
            merge(arr, l, m, r);
        }
    }

    /* A utility function to print array of size n */
    static void printArray(int arr[])
    {
        int n = arr.length;
        for (int i=0; i<n; ++i)
            System.out.print(arr[i] + " ");
        System.out.println();
    }

    // Driver method
    public static void main(String args[])
    {
        int arr[] = {12, 11, 13, 5, 6, 7};

        System.out.println("Given Array");
        printArray(arr);

        MergeSort ob = new MergeSort();
        ob.sort(arr, 0, arr.length-1);

        System.out.println("\nSorted array");
        printArray(arr);
    }
}
```

```c
/** merging sort **/
#include <stdio.h>
#define max 10

int a[11] = { 10, 14, 19, 26, 27, 31, 33, 35, 42, 44, 0 };
int b[10];

void merging(int low, int mid, int high) {
   int l1, l2, i;

   for(l1 = low, l2 = mid + 1, i = low; l1 <= mid && l2 <= high; i++) {
      if(a[l1] <= a[l2])
         b[i] = a[l1++];
      else
         b[i] = a[l2++];
   }
   while(l1 <= mid)
      b[i++] = a[l1++];

   while(l2 <= high)
      b[i++] = a[l2++];

   for(i = low; i <= high; i++)
      a[i] = b[i];
}

void sort(int low, int high) {
   int mid;
   if(low < high) {
      mid = (low + high) / 2;
      sort(low, mid);
      sort(mid+1, high);
      merging(low, mid, high);
   } else {
      return;
   }
}

int main() {
   int i;
   printf("List before sorting\n");
   for(i = 0; i <= max; i++)
      printf("%d ", a[i]);
   sort(0, max);
   printf("\nList after sorting\n");
   for(i = 0; i <= max; i++)
      printf("%d ", a[i]);
}
```