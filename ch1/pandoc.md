#Pandoc
[原文地址](http://pandoc.org/getting-started.html#step-5-text-editor-basics)
[github地址](https://github.com/jgm/pandoc)
##安装
1. [下载地址](https://github.com/jgm/pandoc/releases/tag/1.17.2) 
  1.  `wget https://github.com/jgm/pandoc/releases/download/1.17.2/pandoc-1.17.2-1-amd64.deb`
  2. `sudo dpkg -i /path/to/deb/file`
  3. `sudo apt-get install -f`
2. 使用
  1. ctrl+alt+t打开终端输入`pandoc -v`验证安装
  2. `pandoc`，`ctrl+D`退出,默认输入markdown，<pre>Hello *pandoc*!
`-` one <br>`- two `</pre>
    输出为html4<pre>`<p>Hello <em>pandoc</em>!</p>`<br>`<ul>
	<li>one</li>
	<li>two</li>
	</ul>`</pre>
  3. `pandoc -f html -t markdown`输入html<pre>`<p>Hello <em>pandoc</em>!</p>`</pre>,ctrl+D退出时输出<pre>`Hello *pandoc*!`</pre>

3. `pandoc test1.md -f markdown -t html -s -o test1.html` 
  + `-f` 指定文件格式
  + `-t` 目标格式
  + `-s`, standalone，生成独立文件，带header， footer。
  + `-o`, 输出文件名