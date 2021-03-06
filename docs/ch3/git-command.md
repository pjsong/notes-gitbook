# GIT 指令备忘

## gitignore文件

地址[official](https://git-scm.com/docs/gitignore)
该文件每一行定义一个模式，对于多个文件按照优先级进行。优先级参考原文。
对于同一个文件中的模式，最后的那个生效。
空行可以作为分隔符。

1.#注释\转义, 如果patter带有`#`号，用`\`放前边。最后的空格被忽略，除非有转义符。
2.！重新加入

## [log]

<https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History>

1.git log --pretty=oneline
2.git log --pretty=format:"%h - %an, %ar : %s"

## git 配置

+ 配置scope:

<pre>
`---------------------------------------------------`
` 系统           | 用户/全局/global    | 库(本地/local)`
`---------------------------------------------------`
` /etc/gitconfig | ~/.gitconfig       | .git/config`
</pre>

## commit comment

+[参考](http://chris.beams.io/posts/git-commit/), [git-scm](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration)
+默认push匹配分支`git config --global push.default matching`
+添加编辑器`$ git config --global core.editor emacs`
+添加编辑模板文件`vi ~/.gitmessage.txt`
+设置使用模板文件`$ git config --global commit.template ~/.gitmessage.txt`

## 代理

+ 给GIT加上代理。 全局配置文件在 `%UserHome%/.gitconfig`。
> `git config --global http.proxy http://loginNameOfYourLocalHost:password@localhost:yourproxyPort`

+ 查看配置情况
> git config --global --list

+ 重置全局配置
> git config --global --unset-all user.name

+ 修改全局配置
> git config --global --replace-all user.name "New User Name"

+ 提交时使用用户名
> git config --local add user.name pjsong

+ 验证,只有用户名
> git config --local --add credential.username pjsong

+ 验证,help方式，store方式
> git config credential.helper yourStoreName

### 任务

[stackoverflow](http://stackoverflow.com/questions/4114095/how-to-revert-git-repository-to-a-previous-commit)

#### 从最初的提交添加分支

> git checkout 0d1d7fc32
> git checkout -b old-state 0d1d7fc32

#### 放弃修改，回退到index区或者commit区

> git checkout -- file

#### 撤销index区

> git reset HEAD readme

#### 从前的版本来回

> git checkout 2sa332 
> git reflog

#### 远程

+ list远程名reference
> git remote -v

+ 删除远程名reference
> git remote rm remoteName

+ 添加远程名reference
> git remote add remoteName urlAddress
> git push -u origin master

#### fork一个merge一个提交一个

[参考](http://www.pengzz.cn/2016/06/apereo-cas-branch-422_23.html)

+ clone https://github.com/pjsong/configserver.git
+ remote add upstream https://github.com/spring-cloud-samples/configserver.git
+ fetch upstream
+ merge upstream/master
+ push origin

#### 分支

+同步本地库到远程新创建的库

> git remote add origin http://xx.git && git branch --set-upstream-to=origin/master && git pull && maybe conflict resolve needed && git add . &&git commit -m 'xxx' && git push 

+ 编辑当前分支并同步远程添加一个新的分支
> git checkout -b newBranchName && git push -u origin newBranchName

+ 提取远程分支到本地分支
> git checkout -b test remoteName/branchName 

+ 列出全部/远程分支
> git branch -a/r -v 

+ 提取远程时指定分支
> git clone --branch branchName gitAddress

自动安装本地master分支track远程master

+ 提取远程分支到本地分支
> git checkout -b test remoteName/branchName 

+ 获取远程tag信息
> git fetch --tags

+ 列举远程head/tag [参考](https://git-scm.com/docs/git-ls-remote.html)
> git ls-remote --tags

+ checkout 远程tag
> git checkout -b branchName tagname.用git log检查commit查看是否成功

---

### 常用指令

+ clone
> git clone ssh://username@onboard.com/srv/git/repo
> git clone http://username:password@onboard.com/srv/git/repo.git
> sshpass -p password git clone ssh://username@onboard.com/srv/git/repo  (需要安装sshpass)

+ status
> 工作空间没有track的路径； 索引文件和HEAD有变化的路径；索引文件和本地工作空间有变化的路径

+ ls-files
> 检查索引的文件列表

+ checkout -f path/fileName
> 还原某个文件

+ checkout -p path
> 还原某个文件夹

+ checkout-index
> 从索引拷贝文件，不覆盖工作区。

+ diff
> 显示没有添加到索引的内容

+ diff commit or branch
> 查看工作空间相对于 `commit`的变化. 比如用HEAD来比较最近的一次提交，用分支名来比较其他分支上的内容。

+ add file... or dir...
> 添加准备提交的内容。 `add --interactive` 交互添加工作空间的内容. 

+ add -u
> 添加修改的文件到索引。 与`git commit -a` 提交前的步骤类似。

+ rm file(s)...
> 从工作空间和索引中删除。

+ mv file(s)...
> 在工作空间和索引中移动

+ commit -a -m 'msg'
> 提交上次提交之后所有文件的更改(排除没有索引的文件)，删除索引中存在工作空间中已经删除的索引。

+ checkout files(s)... or dir
> 更新工作空间文件但不切换分支

+ reset HEAD file(s)...
> 下次提交忽略文件，重置索引而不是工作树，也就是保留更改，但本次不提交。 reports what has not been updated

+ reset --soft HEAD^
> 回退上次提交，变化保留在索引中。

+ reset --hard
> 工作空间和索引匹配到本地树。 working tree上所有tracked文件的变更将从上次commit丢失，当merge出现太多冲突，想重新来过时使用，可以使用参数`ORIG_HEAD` 撤销merge和后面的变更

+ checkout branch
> 通过更新索引和工作空间切换分支，并更新HEAD到该分支。

+ checkout -b name of new branch
> 创建并切换到新的分支

+ merge commit or branch
> 合并分支的变更到当前分支。用`--no-commit` 来让变更不产生提交。

+ merge --no-ff -m "merge with no-ff" dev
> 合并禁止用fast-forward

+ rebase upstream
> 回滚并在upstream的当前head基础上重新提交。

+ cherry-pick commit
> 把该次提交的变更应用到当前分支。

+ revert commit
> 回滚到提交并提交结果。需要working tree干净(自HEAD提交没有变更)

+ diff --cached commit
> 比较索引文件与某次提交之间的变更。

+ commit -m 'msg'
> 新提交索引区内容并加上注释。`commit --amend` 补充上一次的提交

+ log
> 显示最近的提交

  1. `--decorate` 显示分支/tag
  2. `--stat` 显示统计
  3. `author=<em>author</em>`仅限某作者
  4. `after="MMM DD YYYY"`ex. ("Jun 20 2008") 某天之后
  5. `before="MMM DD YYYY"`某天之前。
  6. `merge` 与当前的merge冲突的提交

+ diff commit commit

+ branch
> 列出当前分支. `-r` 列出远程分支, `-a` 两者都显示. 

+ branch -d branch
> 删除分支。

+ branch -m `oldname` `newname`
> 分支改名

+ branch -m `newname`
> m是move，mv的意思， 当前分支改名

+ branch --track new remote/branch
> 创建本地分支来track远程分支

+ pull remote refspec
> 合并远程仓库的变更到当前的分支. <code>git pull</code> 等价于<br> <code>git fetch</code> <br> <code>git merge FETCH_HEAD</code>. 
 
+ reset --hard remote/branch
> 重置本地库/working tree到远程分支。 <code>reset &#8209;&#8209;hard origin/master</code> 丢弃本地master的所有提交。用来重新merge. 

+ fetch remote refspec
> 从远程库下载Objects/Refs. 只是下载数据到仓库，不会碰工作内容。

+ push
> 提交本地分支到远程的对应分支。本地没有push过的除外。

+ push remote branch
> push新/已经存在的分支到远程

+ push remote branch:branch
> push新的分支到远程，使用别的名字。

+ push remote :branch
> 移除远程分支。实际上是push空到该分支。

+ clean
> 递归删除不在版本控制的文件。

+ tag
> 列出标签 `-l 'v4.2.*` 只显示感兴趣的v4.2打头的标签。

+ git tag -a v1.4 -m 'my version 1.4'
> 添加标签/说明，

+ `-a`为annotation的标签，有作者信息；
+ 变`-a` 为 `-s`使用签名标签,如果有私钥。
+ 没有`-a`或者`-s`则标签只有提交信息。

+ git show v1.5
> 显示标签信息

+ git push origin --tags
> 推送所有tags到远程。 `git push origin v1.5` 只推送v1.5标签

## 脚本使用

+ 获取commit号的方法
  + `git log -n 1 | head -n 1 | sed -e 's/^commit //' | head -c 8`
  + `git rev-parse --short=5 HEAD`
  + `git log --oneline -1 --pretty=format:%h --graph --pretty=oneline --abbrev-commit`
  + `git rev-parse HEAD | cut -c1-5`