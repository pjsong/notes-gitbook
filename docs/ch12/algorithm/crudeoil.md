# 分油井问题

## 描述

围绕一片小岛，环绕者M个离散的油田，每个油田藏有油C，要尽可能平均的分配给N个公司(最多与最少相差数最低)， 油田分配要连续。

## 输入

油田数量M， 公司数量N，每个油田藏油C(0)到C(M-1)，例子如下
5
11,34,22,55,66,99,78,33

## 算法

1. 找出最接近平均数的链条，将环打断为两个链条。如果存在超过平均数的油田，直接将最大的油田抽出，将环打断。否则把C数组复制成2份并链接起来， 找出最接近平均数的链条并抽出，将环打断。
2. 剩下的链条中， 更新平均数， 分别从左右两边接近，选出最接近平均数的链条抽出， 直到结束。

## 实现

```java
/** 将一个数组分成若干组合，找出最接近某个值的那一个 **/
public class CrudeOil {
    class Node {
        int weight;
        int index;

        public Node(int weight, int index) {
            super();
            this.weight = weight;
            this.index = index;
        }

        public String toString() {
            return "weight: " + weight + ", index" + index;
        }

        public boolean equals(Node node) {
            return weight == node.weight && index == node.index;
        }
    }

    class InputObj {
        List<Node> listToProcess = new ArrayList<Node>();
        int divider = -1;
    }

    InputObj inputObj = new InputObj();

    private void initInput() throws FileNotFoundException {
        Scanner scanner = new Scanner(new File("SSTest.txt"));
        while (scanner.hasNext()) {
            String line = scanner.nextLine().trim();
            inputObj.divider = Integer.valueOf(line);
            line = scanner.nextLine().trim();
            String[] temp = line.split(",");
            for (int i = 0; i < temp.length; i++) {
                Node nodeToAdd = new Node(Integer.valueOf(temp[i]), i);
                inputObj.listToProcess.add(nodeToAdd);
            }
        }
        scanner.close();
    }

    double getAvg(List<Node> nodeList, int divider) {
        double sum = 0d;
        for (Node n : nodeList) {
            sum += n.weight;
        }
        return sum / divider;
    }

    class MediateObj implements Comparable<MediateObj> {
        int startIndex;
        int endIndex;
        int sum;
        double avg;
        double gap = Double.MAX_VALUE;

        public int compareTo(MediateObj mo) {
            return gap < mo.gap ? -1 : gap == mo.gap ? 0 : 1;
        }
    }
    MediateObj getClosestListIndex() {
        List<Node> newList = new ArrayList<Node>();
        newList.addAll(inputObj.listToProcess);
        newList.addAll(inputObj.listToProcess);
        double avg = getAvg(inputObj.listToProcess, inputObj.divider);
        List<MediateObj> breakList = new ArrayList<MediateObj>();
        for (int i = 0; i < inputObj.listToProcess.size(); i++) {
            MediateObj mo = new MediateObj();
            mo.startIndex = i;
            mo.sum = newList.get(i).weight;
            mo.avg = avg;
            for (int j = i + 1; j < newList.size() - 2; j++) {
                mo.endIndex = j;
                mo.sum += newList.get(j).weight;
                if (Math.abs(mo.sum - avg) < mo.gap) {
                    mo.gap = Math.abs(mo.sum - avg);
                } else {
                    mo.sum -= newList.get(j).weight;
                    breakList.add(mo);
                    break;
                }
            }
        }
        Collections.sort(breakList);
        return breakList.get(0);
    }

    List<Node> divideOriginal() {
        if (inputObj.divider >= inputObj.listToProcess.size() || inputObj.divider <= 1)
            return inputObj.listToProcess;
        Node maxNode = inputObj.listToProcess.get(0);
        for (Node node : inputObj.listToProcess) {
            if (maxNode.weight < node.weight)
                maxNode = node;
        }
        List<Node> ret = new ArrayList<Node>();
        if (maxNode.weight >= getAvg(inputObj.listToProcess, inputObj.divider)) {
            List<Node> nl = new ArrayList<Node>();
            nl.add(maxNode);
            nodesSeperated.add(nl);
            for (int i = maxNode.index + 1; i < inputObj.listToProcess.size(); i++) {
                ret.add(inputObj.listToProcess.get(i));
            }
            for (int i = 0; i < maxNode.index; i++) {
                ret.add(inputObj.listToProcess.get(i));
            }
            return ret;
        }

        MediateObj mo = getClosestListIndex();
        if (mo.endIndex >= inputObj.listToProcess.size()) {
            for (int i = mo.endIndex % inputObj.listToProcess.size(); i < mo.startIndex; i++) {
                ret.add(inputObj.listToProcess.get(i));
            }
        } else {
            for (int i = mo.endIndex; i < inputObj.listToProcess.size(); i++) {
                ret.add(inputObj.listToProcess.get(i));
            }
            for (int i = 0; i < mo.startIndex; i++) {
                ret.add(inputObj.listToProcess.get(i));
            }
        }
        return ret;
    }

    List<List<Node>> nodesSeperated = new ArrayList<List<Node>>();

    void recurDivide(List<Node> nodeList, int divider) {
        if (divider <= 1) {
            nodesSeperated.add(nodeList);
            return;
        }
        if (divider >= inputObj.listToProcess.size()) {
            for (Node node : inputObj.listToProcess) {
                List<Node> nodel = new ArrayList<Node>();
                nodel.add(node);
                nodesSeperated.add(nodel);
            }
            return;
        }
        double avg = getAvg(nodeList, divider);
        double leftGap = Double.MAX_VALUE;
        MediateObj moLeft = new MediateObj();
        moLeft.startIndex = 0;
        for (int i = 0; i < nodeList.size(); i++) {
            moLeft.sum += nodeList.get(i).weight;
            if (Math.abs((double) moLeft.sum - avg) < leftGap) {
                moLeft.endIndex = i;
                leftGap = Math.abs(moLeft.sum - avg);
            } else {
                moLeft.gap = leftGap;
                moLeft.sum -= nodeList.get(i).weight;
                break;
            }
        }
        double rightGap = Double.MAX_VALUE;
        MediateObj moRight = new MediateObj();
        moRight.endIndex = nodeList.size() - 1;
        for (int i = nodeList.size() - 1; i > 0; i--) {
            moRight.sum += nodeList.get(i).weight;
            if (Math.abs((double) moRight.sum - avg) < rightGap) {
                moRight.endIndex = i;
                rightGap = Math.abs(moRight.sum - avg);
            } else {
                moRight.gap = rightGap;
                moRight.sum -= nodeList.get(i).weight;
                break;
            }
        }
        List<Node> nextList = new ArrayList<Node>();
        List<Node> addList = new ArrayList<Node>();

        if (moLeft.gap > moRight.gap) {
            for (int i = 0; i < moRight.endIndex; i++) {
                nextList.add(nodeList.get(i));
            }
            for (int i = moRight.endIndex; i < nodeList.size(); i++) {
                addList.add(nodeList.get(i));
            }
        } else {
            for (int i = moLeft.endIndex + 1; i < nodeList.size(); i++) {
                nextList.add(nodeList.get(i));
            }
            for (int i = 0; i <= moLeft.endIndex; i++) {
                addList.add(nodeList.get(i));
            }
        }
        nodesSeperated.add(addList);
        divider--;
        recurDivide(nextList, divider);
    }

    PrintStream so = System.out;

    void doOutput() {
        List<Node> remain = divideOriginal();
        recurDivide(remain, inputObj.divider - 1);
        for (List<Node> nodeList : nodesSeperated) {
            for (Node node : nodeList) {
                so.print(node.toString());
            }
            so.println();
        }
    }

    public static void main(String[] args) throws FileNotFoundException {
        CrudeOil st = new CrudeOil();
        st.initInput();
        st.doOutput();
    }
}

```