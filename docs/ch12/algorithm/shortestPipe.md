# 最平均的管子组合

## 问题描述

有M根管子， 将它们任意组合成N组，使组合之后，差距最小。

## 算法

1. 将管子排序，不断更新平均数， 找出所有大于平均数的管子，并抽取出来，不参与组合。
2. 将剩下的管子排序，更新平均数从右边(大数)开始，一直加到不超过平均数为止。做到N组，剩下都是的零散管子。
3. 将N组已分好的管子，按照离平均数的间隙排序。将零散管子排序，最长的给间隙最大的组，如果超过了平均数则直接抽取出来。否则，一直加到不超过平均数为止。
4. 重复步骤3,直到所有的管子分配完成。

## 输入

分为N=5组，和M根管子长度
5
2 3 6 32 66 98 71 82 91 42 1 58 5 11 22 55 45 65 32 44 11 62 84 79 59 28 47 32 65 64 21 96 24 8 17 13 51

## 实现

```java
package cn.oursmedia;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;

//给出一个正整数N和长度L，找出一段长度大于等于L的连续非负整数，他们的和恰好为N。答案可能有多个，我我们需要找出长度最小的那个。

public class SumOfSubNum {
    PrintStream so = System.out;
    class Node implements Comparable<Node>{
        int value;int index;
        public Node(int value, int index) {
            super();
            this.value = value;
            this.index = index;
        }
        public int compareTo(Node n){
            return value < n.value? -1: value == n.value ?  0: 1;
        }
        public String toString(){
            StringBuilder sb = new StringBuilder();
            sb.append("value:").append(value).append(", index:").append(index);
            return sb.toString();
        }
    }
    class InputObj{
        List<Node> nodes = new ArrayList<Node>();
        int dividedNum;
        double avgValue;
        public String toString(){
            StringBuilder sb = new StringBuilder();
            for(Node n:nodes){
                sb.append(n.toString()).append(",");
            }
            return sb.toString();
        }
    }
    InputObj inputObj = new InputObj();
    class MediateObj implements Comparable<MediateObj>{
        List<Node> selectedNodes = new ArrayList<Node>();
        int value;
        public String toString(){
            StringBuilder sb = new StringBuilder();
            sb.append("value:").append(value).append(". size:").append(selectedNodes.size());
            for(Node n:selectedNodes){
                sb.append(n.toString()).append(",");
            }
            return sb.toString();
        }
        @Override
        public int compareTo(MediateObj o) {
            return value < o.value ? -1: value == o.value? 0: 1;
        }
    }
    class OutputObj{
        List<MediateObj> outputArr = new ArrayList<MediateObj>();
        List<Node> nodeLeft = new ArrayList<Node>();
        double avgCurr;
        double updateAvg(){
            double sum = 0;
            for(Node node: nodeLeft){
                sum += node.value;
            }
            avgCurr = sum/(inputObj.dividedNum - outputArr.size());
            return avgCurr;
        }
        public String toString(){
            StringBuilder sb = new StringBuilder();
            for(MediateObj mo: outputArr){
                sb.append("len: ").append(mo.value);
                for(Node node: mo.selectedNodes){
                    sb.append(", ").append(node.toString());
                }
                sb.append("\n");
            }
            return sb.toString();
        }
    }
    OutputObj outputObj = new OutputObj();
    void initInput() throws FileNotFoundException{
        Scanner scanner = new Scanner(new File("SumOfSubNum.txt"));
        while(scanner.hasNext()){
            String le = scanner.nextLine().trim();
            inputObj.dividedNum = Integer.valueOf(le);
            String[] inputNum = scanner.nextLine().trim().split(" ");
            double sum = 0d;
            for(int i = 0;i<inputNum.length; i++){
                int value = Integer.valueOf(inputNum[i]);
                sum+=value;
                inputObj.nodes.add(new Node(value, i));
            }
            Collections.sort(inputObj.nodes);
            inputObj.avgValue = sum/inputObj.dividedNum;
        }
        scanner.close();
    }

    void filterOutAboveAvg(OutputObj outputObj){
        double avg = outputObj.updateAvg();
        List<Node> nodes = outputObj.nodeLeft;
        if(nodes.size() == 0)return;
        int currPos = nodes.size()-1;
        Node endNode = nodes.get(currPos);
        while(endNode.value >= avg){
            outputObj.nodeLeft.remove(endNode);
            MediateObj mo = new MediateObj();
            mo.value+=endNode.value;
            mo.selectedNodes.add(endNode);
            outputObj.outputArr.add(mo);
            avg = outputObj.updateAvg();
            currPos --;
            endNode = nodes.get(currPos);
        }
    }

    void doOutput(){
        outputObj.nodeLeft.addAll(inputObj.nodes);
        filterOutAboveAvg(outputObj);

        double avgValue = outputObj.updateAvg();
        int currIndex = outputObj.nodeLeft.size()-1;
        while(outputObj.outputArr.size() <= inputObj.dividedNum -1){
            MediateObj mo = new MediateObj();
            Node node = outputObj.nodeLeft.get(currIndex);
               int currSum = node.value;
               while(currSum <= avgValue && currIndex>=0){
                   mo.value = currSum;
                   mo.selectedNodes.add(outputObj.nodeLeft.get(currIndex));
                   if(currSum == avgValue){
                       outputObj.nodeLeft.removeAll(mo.selectedNodes);
                       outputObj.outputArr.add(mo);
                       currIndex --;
                       break;
                   }
                   currIndex --;
                   currSum += outputObj.nodeLeft.get(currIndex).value;
               }
               outputObj.nodeLeft.removeAll(mo.selectedNodes);
               outputObj.outputArr.add(mo);
        }
        recurList(outputObj.outputArr, outputObj.nodeLeft);

        for(MediateObj mo: outputObj.outputArr){
            so.println(mo.toString());
        }
        Collections.sort(outputObj.outputArr);
    }

    double recurListCalcAvg(List<MediateObj> toRecur, List<Node> nodesLeft){
        double currSum = 0d;
        for(MediateObj mo: toRecur){
            currSum+=mo.value;
        }
        for(Node node: nodesLeft){
            currSum+=node.value;
        }
        return currSum/toRecur.size();
    }
    void recurList(List<MediateObj> toRecur, List<Node> nodesLeft){
        Collections.sort(toRecur);
        if(nodesLeft.size() == 1){
            MediateObj mo = toRecur.get(0);
            Node node = nodesLeft.get(0);
            mo.value += node.value;
            toRecur.get(0).selectedNodes.add(node);
            return;
        }else{
            double avgValue = recurListCalcAvg(toRecur, nodesLeft);
            List<MediateObj> moList = new ArrayList<MediateObj>();
            moList.addAll(toRecur);
            List<Node> nodesLeftInput = new ArrayList<Node>();
            nodesLeftInput.addAll(nodesLeft);

            int moIndex = 0;
            for(MediateObj mo: toRecur){
                int nodesLeftIndex = nodesLeftInput.size() - 1;
                Node node = nodesLeft.get(nodesLeftIndex);
                if(mo.value + node.value >= avgValue){
                    if(moIndex == 0){
                        mo.value += node.value;
                        moList.remove(mo);
                        nodesLeftInput.remove(node);
                        outputObj.nodeLeft.remove(node);
                    }
                    moIndex++;
                      continue;
                }
                  moIndex++;
                while(mo.value + node.value < avgValue && nodesLeftIndex >=1){
                    mo.selectedNodes.add(node);
                    mo.value += node.value;
                    nodesLeftInput.remove(node);
                    node = nodesLeft.get(--nodesLeftIndex);
                }
            }
            recurList(moList, nodesLeftInput);
        }
    }

    public static void main(String args[]) throws FileNotFoundException{
         SumOfSubNum ssn = new SumOfSubNum();
         ssn.initInput();
         ssn.doOutput();
    }
}
```
