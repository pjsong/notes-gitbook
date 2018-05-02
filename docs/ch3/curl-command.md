# curl

全面教程<https://curl.haxx.se/docs/httpscripting.html>
简略说明<https://gist.github.com/subfuzion/08c5d85437d5d4f00e58>

## 参数

+ `X： request`
  + `put`和`post`使用`application/json，application/x-www-form-urlencoded`两种`Content-Type`，许多api同时支持两种格式，
  + curl缺省使用后一种格式，比较简单如`-d "param1=value1&param2=value2"` or `-d @data.txt`
  + `json`格式`-d '{"key1":"value1", "key2":"value2"}'` 或者 `-d @data.json`。
+ `-#, --progress-bar` Make curl display a simple progress bar instead of the more informational standard meter.
+ `-b, --cookie <name=data>` Supply cookie with request. If no =, then specifies the cookie file to use (see -c).
+ `-c, --cookie-jar <file name>` File to save response cookies to.
+ `-d, --data <data>` Send specified data in POST request. Details provided below.
+ `-f, --fail` Fail silently (don't output HTML error form if returned).
+ `-F, --form <name=content>` Submit form data.
+ `-H, --header <header>` Headers to supply with request`-H "Content-Type: application/x-www-form-urlencoded"`, `-H "Content-Type: application/json"`, `-H “Host:localhost” -H “Content-Type:text/xml”`.
+ `-i, --include` Include HTTP headers in the output.
+ `-I, --head` Fetch headers only.
+ `-k, --insecure` Allow insecure connections to succeed.
+ `-L, --location` Follow redirects.
+ `-o, --output <file>` Write output to . Can use `--create-dirs` in conjunction with this to create any directories specified in the -o path.
+ `-O, --remote-name` Write output to file named like the remote file (only writes to current directory).
+ `-s, --silent` Silent (quiet) mode. Use with -S to force it to show errors.
+ `-v, --verbose` Provide more information (useful for debugging).
+ `-w, --write-out <format>` Make curl display information on stdout after a completed transfer. See man page for more details on available variables. Convenient way to force curl to append a newline to output: -w "\n" (can add to ~/.curlrc).
+ -X, --request The request method to use.

## 任务举例

+ get`curl "http://www.hotmail.com/when/junk.cgi?birthyear=1905&press=OK"`

```html
 <form method="GET" action="junk.cgi">
 <input type=text name="birthyear">
 <input type=submit name=press value="OK">
 </form>
 ```

+ post`curl --data "birthyear=1905&press=%20OK%20"  http://www.example.com/when.cgi`或者`curl --data-urlencode "name=I am Daniel" http://www.example.com`

```html
<form method="POST" action="junk.cgi">
 <input type=text name="birthyear">
 <input type=submit name=press value=" OK ">
 </form>
 ```

+ post上传文件`curl --form upload=@localfilename --form press=OK [URL]`

```html
 <form method="POST" enctype='multipart/form-data' action="upload.cgi">
 <input type=file name=upload>
 <input type=submit name=press value="OK">
</form>
```

+ 隐藏字段`curl --data "birthyear=1905&press=OK&person=daniel" [URL]`

```html
 <form method="POST" action="foobar.cgi">
 <input type=text name="birthyear">
 <input type=hidden name="person" value="daniel">
 <input type=submit name="press" value="OK">
</form>
```

+ put上传文件，服务器要能接受put流`curl --upload-file uploadfile http://www.example.com/receive.cgi`

+ 认证`curl --user name:password http://www.example.com`

+ 代理认证`curl --proxy-user proxyuser:proxypassword curl.haxx.se`

+ 加入referer `-e`或者`--referer`， `curl --referer http://www.example.come http://www.example.com`

+ 指定浏览器`curl --user-agent "Mozilla/4.73 [en] (X11; U; Linux 2.2.15 i686)" [URL]`

+ 带有重定向头响应的回复`curl --location http://www.example.com`

+ 发送cookie`curl --cookie "name=Daniel" http://www.example.com`
+ 通过录制header存储cookie`curl --dump-header headers_and_cookies http://www.example.com`,注意`--cookie-jar`是个更好的保存方法
+ curl内置有cookie解析引擎(--cookie参数启用)，使用先前的cookie重新链接`curl --cookie stored_cookies_in_file http://www.example.com`
+ `curl --header "Host:" http://www.example.com`去掉Header的Host
