# 最短遍歷問題

## 描述

从办公室出发，访问所有客户，回到家中，最短路径是多少。

## 输入

办公室和家的最表， 所有客户坐标。 举例
2 3 17 13
2 3 6 32 66 98 71 82 91 42 1 58 5 11 22 55 45 65 32 44 11 62 84 79 59 28 47 32 65 64 21 96 24 8 17 13 51 22

## 算法

1. 从坐标中分离出办公室和家的坐标， 将客户坐标两两组合， 以每个客户的坐标为起始点，找出遍历完成所需要的最短路径和结束坐标。
2. 将起始点和办公室坐标距离加起来，将结束坐标和家的距离加起来， 得到最后选择每个客户作为起始点的总距离。
3. 从中选出最近的

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

public class CoordiTraverse {
    PrintStream so = System.out;
    class Edge implements Comparable<Edge> {
        Point startP;
        Point endP;
        public Edge(Point startP, Point endP) {
            super();
            this.startP = startP;
            this.endP = endP;
        }
        int dist() {
            return Math.abs(startP.x - endP.x) + Math.abs(startP.y - endP.y);
        }
        public String toString() {
            StringBuilder sb = new StringBuilder();
            sb.append(startP.toString() + "," + endP.toString());
            return sb.toString();
        }
        @Override
        public int compareTo(Edge o) {
            return dist() < o.dist() ? -1 : dist() == o.dist() ? 0 : 1;
        }
    }

    class Point {
        int x;
        int y;
        int index;

        int groupIndex = Integer.MAX_VALUE;
        int connectedEdgeCnt = 0;

        public Point() {
            super();
        }

        public Point copy() {
            Point p = new Point();
            p.x = x;
            p.y = y;
            p.index = index;
            p.groupIndex = groupIndex;
            p.connectedEdgeCnt = connectedEdgeCnt;
            return p;
        }

        public Point(int x, int y, int index) {
            super();
            this.x = x;
            this.y = y;
            this.index = index;
        }
        public boolean equals(Point p) {
            return (x == p.x && y == p.y);
        }
        public String toString() {
            return "(" + x + ", " + y + ")";
        }
        public int dist(Point p) {
            return Math.abs(x - p.x) + Math.abs(y - p.y);
        }
    }

    class InputObj {
        List<Point> points = new ArrayList<Point>();
        Point startP;
        Point endP;
        List<Edge> edges = new ArrayList<Edge>();

        InputObj copy() {
            InputObj ret = new InputObj();
            for (Point p : points) {
                Point newp = new Point(p.x, p.y, p.index);
                ret.points.add(newp);
            }
            if (startP != null) {
                ret.startP = startP.copy();
            }
            if (endP != null) {
                ret.endP = endP.copy();
            }
            for (int i = 0; i < ret.points.size() - 1; i++) {
                for (int j = i + 1; j < ret.points.size(); j++) {
                    ret.edges.add(new Edge(ret.points.get(i), ret.points.get(j)));
                }
            }
            return ret;
        }
    }

    class PointCalc {
        Point point;
        int minLen;
        Point minLenPoint;
        List<Edge> edgeList = new ArrayList<Edge>();
        int startLen = 0;
        int endLen = 0;

        public PointCalc() {
            super();
        }
        public PointCalc(Point point) {
            super();
            this.point = point;
        }
        int totalLen() {
            return startLen + minLen + endLen;
        }

        public String toString() {
            StringBuilder sb = new StringBuilder();
            sb.append(point.toString()).append(", minLen: ").append(minLen).append(", totalLen:").append(totalLen())
                    .append(", minPoint:").append(minLenPoint.toString()).append("\n");
            if (startLen != 0 && endLen != 0)
                sb.append("startLen: ").append(startLen).append(", endLen: ").append(endLen).append("\n");
            for (Edge edge : edgeList) {
                sb.append("start: (").append(edge.startP.toString()).append("), end: (").append(edge.endP.toString())
                        .append(")\n");
            }
            return sb.toString();
        }
    }

    InputObj inputObj = new InputObj();
    InputObj outputObj = new InputObj();

    void initInput() throws FileNotFoundException {
        Scanner sc = new Scanner(new File("CoordiTraverse.txt"));
        while (sc.hasNext()) {
            String[] se = sc.nextLine().split(" ");
            Point startP = new Point(Integer.valueOf(se[0]), Integer.valueOf(se[1]), -1);
            Point endP = new Point(Integer.valueOf(se[2]), Integer.valueOf(se[3]), -1);
            String[] points = sc.nextLine().split(" ");
            for (int i = 0; i < points.length; i += 2) {
                Point newP = new Point();
                newP.x = Integer.valueOf(points[i]);
                newP.y = Integer.valueOf(points[i + 1]);
                newP.index = i / 2;
                if (newP.equals(startP)) {
                    inputObj.startP = newP;
                    continue;
                }
                if (newP.equals(endP)) {
                    inputObj.endP = newP;
                    continue;
                }
                inputObj.points.add(newP);
            }
            for (int i = 0; i < inputObj.points.size() - 1; i++) {
                for (int j = i + 1; j < inputObj.points.size(); j++) {
                    inputObj.edges.add(new Edge(inputObj.points.get(i), inputObj.points.get(j)));
                }
            }
            Collections.sort(inputObj.edges);
        }
        sc.close();
    }

    List<PointCalc> calcLen() {
        List<PointCalc> ret = new ArrayList<PointCalc>();
        for (Point p : inputObj.points) {
            InputObj io = inputObj.copy();
            Point point = null;
            for (Point po : io.points) {
                if (po.equals(p))
                    point = po;
            }
            point.groupIndex = -1;
            PointCalc pc = new PointCalc(point);
            List<Point> pointAdded = new ArrayList<Point>();
            Collections.sort(io.edges);
            for (Edge edge : io.edges) {
                if (pointAdded.size() == io.points.size())
                    break;
                if (edge.startP.connectedEdgeCnt == 2 || edge.endP.connectedEdgeCnt == 2)
                    continue;
                if (edge.startP.groupIndex == edge.endP.groupIndex && edge.endP.groupIndex != Integer.MAX_VALUE)
                    continue;
                if (edge.startP.equals(point) || edge.endP.equals(point)) {
                    if (point.connectedEdgeCnt == 1)
                        continue;
                    point.connectedEdgeCnt++;
                    pointAdded.add(point);
                    Point pairPoint = findPairPoint(edge, point);
                    pairPoint.connectedEdgeCnt++;
                    if (pairPoint.connectedEdgeCnt == 2) {
                        pointAdded.add(pairPoint);
                    }
                    setAllGroupIndex(pc.edgeList, pairPoint, point);
                    pc.edgeList.add(edge);
                    pc.minLen += edge.dist();
                    continue;
                } else {
                    Point startP = edge.startP;
                    Point endP = edge.endP;
                    startP.connectedEdgeCnt++;
                    endP.connectedEdgeCnt++;
                    if (edge.startP.connectedEdgeCnt == 2)
                        pointAdded.add(edge.startP);
                    if (edge.endP.connectedEdgeCnt == 2)
                        pointAdded.add(edge.endP);
                    if (edge.startP.groupIndex == edge.endP.groupIndex && edge.endP.groupIndex == Integer.MAX_VALUE)
                        edge.startP.groupIndex = edge.startP.index;
                    Point minGroupIndex = edge.startP.groupIndex < edge.endP.groupIndex ? edge.startP : edge.endP;
                    Point pairGroupIndex = findPairPoint(edge, minGroupIndex);
                    setAllGroupIndex(pc.edgeList, pairGroupIndex, minGroupIndex);
                    pc.edgeList.add(edge);
                    pc.minLen += edge.dist();
                }
            }
            for (Edge edge : pc.edgeList) {
                if (edge.startP.connectedEdgeCnt == 1 || edge.endP.connectedEdgeCnt == 1) {
                    if (edge.startP.equals(pc.point) || edge.endP.equals(pc.point))
                        continue;
                    pc.minLenPoint = edge.startP.connectedEdgeCnt == 1 ? edge.startP : edge.endP;
                }
            }
            pc.startLen = inputObj.startP.dist(point);
            pc.endLen = inputObj.endP.dist(pc.minLenPoint);
            ret.add(pc);
        }
        return ret;
    }

    void doOutput() {
        List<PointCalc> pcCalc = calcLen();
        so.println("start: " + inputObj.startP.toString() + ", end:" + inputObj.endP.toString());
        for (PointCalc pc : pcCalc) {
            so.println(pc.toString());
        }
    }

    Edge findNextEdge(List<Edge> edgeList, Point point, Point pointExclude) {
        for (Edge edge : edgeList) {
            if (pointExclude != null && (edge.startP.equals(pointExclude) || edge.endP.equals(pointExclude)))
                continue;
            if (edge.startP.equals(point) || edge.endP.equals(point)) {
                return edge;
            }
        }
        return null;
    }

    void setAllGroupIndex(List<Edge> edgeList, Point currPoint, Point pointExclude) {
        currPoint.groupIndex = pointExclude.groupIndex;
        Edge edge = findNextEdge(edgeList, currPoint, pointExclude);
        while (edge != null) {
            Point pairPoint = findPairPoint(edge, currPoint);
            if (pairPoint == null)
                break;
            pairPoint.groupIndex = currPoint.groupIndex;
            edge = findNextEdge(edgeList, pairPoint, currPoint);
            currPoint = pairPoint;
        }
    }

    Point findPairPoint(Edge edge, Point point) {
        if (point.equals(edge.endP)) {
            return edge.startP;
        } else if (point.equals(edge.startP))
            return edge.endP;
        return null;
    }

    void printHeader(int size, int width) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < width; i++) {
            sb.append("0");
        }
        String prefix = sb.toString();
        sb.delete(0, sb.length());
        for (int i = 0; i < size; i++) {
            String formatted = (prefix + i).substring((prefix + i).length() - ("" + i).length());
            sb.append(formatted);
        }
        so.println(sb.toString());
    }

    public static void main(String args[]) throws FileNotFoundException {
        CoordiTraverse ct = new CoordiTraverse();
        ct.initInput();
        ct.doOutput();
    }
}

```