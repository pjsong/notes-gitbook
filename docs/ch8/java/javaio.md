# java io处理

## 例子

### jdk

```java
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.io.IOException;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.io.BufferedReader;
import java.io.InputStreamReader;

class Main{
  public static void main(String... args){
    System.out.println("started with filename " + args[0]);
    File file = new File(args[0]);
    try(Scanner scanner=new Scanner(file)){
      while(scanner.hasNext()){
        System.out.println(scanner.nextLine());
      }
    }catch(FileNotFoundException e){
      System.out.println(e);
    }


   System.out.println("+++++++++++++++++++++++++++++++++++++++");
   String line = null;
   try{
     BufferedReader bsr = new BufferedReader(new InputStreamReader(new FileInputStream(file)));
     while((line=bsr.readLine())!=null){
       System.out.println(line);
     }
   } catch(IOException e){
      System.out.println(e);
   }

   System.out.println("+++++++++++++++++++++++++++++++++++++++");
   StringBuilder sb = new StringBuilder();
   try{
     Files.lines(Paths.get(args[0])).forEachOrdered(s->{
     sb.append(s);
     sb.append(System.lineSeparator());
   });
   }catch(IOException e){
     System.out.println(e);
   }
   System.out.println(sb.toString());
  }
}
```

### third party

```java
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import org.apache.commons.io.IOUtils;
import org.apache.commons.io.FileUtils;

import com.google.common.base.Charsets;
import com.google.common.io.Files;

public class Main {
    public static void main(String[] args) throws FileNotFoundException,
            IOException {
        String fileName = args[0];
        try (FileInputStream inputStream = new FileInputStream(fileName)) {
            String allLines = IOUtils.toString(inputStream, "UTF-8");
            System.out.println(allLines);
        }

        String content = FileUtils.readFileToString(new File(fileName), "UTF-8");
        System.out.println(content);

        List<String> lines = Files.readLines(new File(fileName),
                Charsets.UTF_8);
        for(line in lines){
            System.out.println(line);
        }

        content = Files.toString(new File(fileName), Charsets.UTF_8);
        System.out.println(content);
    }
}
```