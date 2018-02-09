# 雷电游戏问题

## 描述

底部一架飞机停留在N内的任意坐标， 上面是N*M的数组， 0代表空，1代表金币，2代表炸弹。
雷只能用一次，用过之后，接下来K层之内的炸弹消失。
飞机可以左右移动，亦可以停留原地。
问最多能获得多少个金币

## 算法

1. 每个节点分为左中右三个孩子。左右孩子在边界上为null.
2. 创建结构记录遍历当时的记录。
3. 对N*M的数组，用三叉树递归遍历，得到结果集合，对结果集合排序，选择最多金币的那一个结果

## 实现

```java
public class TripleTreeCnt {
    PrintStream so = System.out;
    class Node{
        int value;
        int index;
        public Node(int value, int index) {
            super();
            this.value = value;
            this.index = index;
        }
        Node leftChild(){
            int pos = index + inputObj.horiSize -1;
            if(inputObj.obs.size()> pos && pos%inputObj.horiSize !=inputObj.horiSize-1) return inputObj.obs.get(pos);
            return null;
        }
        Node midChild(){
            int pos = index + inputObj.horiSize;
            if(inputObj.obs.size()> pos) return inputObj.obs.get(pos);
            return null;
        }
        Node rightChild(){
            int pos = index + inputObj.horiSize + 1;
            if(inputObj.obs.size()> pos && pos % inputObj.horiSize != 0) return inputObj.obs.get(pos);
            return null;
        }
        public String toString(){
            return "index:" + index + ", value" + value;
        }
    }

    class TravNode implements Comparable<TravNode>{
        Deque<Node> nodes = new ArrayDeque<Node>();
        int coinCnt = 0;
        int bompCnt = 0;
        int bompPos = -1;
        public String toString(){
            StringBuilder sb = new StringBuilder();
            sb.append("bompCnt:").append(bompCnt).append(", coinCnt:").append(coinCnt).append("\n");
            for(Node node: nodes){
                sb.append(node.toString()).append("\n");
            }
            return sb.toString();
        }
        @Override
        public int compareTo(TravNode o) {
            return coinCnt < o.coinCnt ? 1 : coinCnt == o.coinCnt ? 0 : -1;
        }
    }

    class InputObj{
        List<Node> obs = new ArrayList<Node>();
        int horiSize;
        int bompSize;
    }
    InputObj inputObj = new InputObj();
    List<TravNode> outputObj = new ArrayList<TravNode>();

    void initInput() throws FileNotFoundException{
        Scanner sc = new Scanner(new File("TripleTreeCnt.txt"));
        String[] size = sc.nextLine().trim().split(" ");
        inputObj.horiSize = Integer.valueOf(size[0]);
        inputObj.bompSize = Integer.valueOf(size[1]);
        int i=0;
        while(sc.hasNext()){
            String[] obsIn = sc.nextLine().trim().split(" ");
            for(String obs:obsIn) inputObj.obs.add(new Node(Integer.valueOf(obs), i++));
        }
        sc.close();
    }

    void buildTree(TravNode tnPre, Node startNode){
        tnPre.nodes.push(startNode);
        if(startNode.value == 1) tnPre.coinCnt++;
        if(tnPre.bompCnt == 0 && startNode.value == 2) {
            tnPre.bompCnt ++;
            tnPre.bompPos = startNode.index;
        };
        boolean secondBompOutOfReach = tnPre.bompCnt == 1  && startNode.value == 2
                && startNode.index >= tnPre.bompPos - tnPre.bompPos % inputObj.horiSize + inputObj.horiSize*inputObj.bompSize;

        if(secondBompOutOfReach) {
            TravNode tn = new TravNode();
            tn.nodes.addAll(tnPre.nodes);
            tn.coinCnt = tnPre.coinCnt;
            tn.bompCnt = tnPre.bompCnt;
            outputObj.add(tn);
            tnPre.nodes.pop();
            if(startNode.value == 1)tnPre.coinCnt --;
            if(startNode.value == 2)tnPre.bompCnt --;
            return;
        };

        if(startNode.index >= inputObj.obs.size() - inputObj.horiSize) {
            TravNode tn = new TravNode();
            tn.nodes.addAll(tnPre.nodes);
            tn.coinCnt = tnPre.coinCnt;
            tn.bompCnt = tnPre.bompCnt;
            outputObj.add(tn);
            tnPre.nodes.pop();
            if(startNode.value == 1)tnPre.coinCnt --;
            if(startNode.value == 2)tnPre.bompCnt --;
            return;
        }
        Node leftNode = startNode.leftChild();
        Node midNode = startNode.midChild();
        Node rightNode = startNode.rightChild();
        if(leftNode != null){
            buildTree(tnPre, leftNode);
        }
        if(midNode != null){
            buildTree(tnPre, midNode);
        }
        if(rightNode != null){
            buildTree(tnPre, rightNode);
        }
        //恢复到上一次的结果，迎合递归的返回。
        tnPre.nodes.pop();
        if(startNode.value == 1)tnPre.coinCnt --;
        if(startNode.value == 2)tnPre.bompCnt --;
    }

    void outputResult(){
        buildTree(new TravNode(), inputObj.obs.get(3));
        Collections.sort(outputObj);
        TravNode tn = outputObj.get(0);
        so.println(tn);
    }

    public static void main(String[] args) throws FileNotFoundException{
        TripleTreeCnt ttc = new TripleTreeCnt();
        ttc.initInput();
        ttc.outputResult();
    }

}

```
