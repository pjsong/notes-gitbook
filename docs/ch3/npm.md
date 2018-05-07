# npm

## npm [官方文档](https://docs.npmjs.com/getting-started/using-a-package.json)

+ <docs.npmjs.com/misc/config>`npm config set http-proxy http://192.168.0.7:1084 && npm config set https-proxy http://192.168.0.7:1084`
+ `npm config set no-proxy "localhost,172.18.0.20"`

## 安装Nodejs

<https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04>

+ `sudo apt-get remove nodejs`, `sudo apt-get purge nodejs`, `sudo apt-get autoremove`
+ `sudo apt-get update`,`sudo apt-get install build-essential libssl-dev`,`curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh -o install_nvm.sh`,`. install_nvm.sh`， `source ~/.profile`

## NVM使用

+ `ls-remote`， `install`, `use`,`ls`,`help`
+ 给`use`参数加别名`alias default 8.9.4`,
+ 卸载当前版本之前，需要`deactivate`

## semver

+ `>v`greater than v, `^`compatible with v,`~`approximately equivalent,`v1,v2,v3`, `*`or `""`any version,`range1||range2`

```javascript
{ "dependencies" :
  { "foo" : "1.0.0 - 2.9999.9999"
  , "bar" : ">=1.0.2 <2.1.2"
  , "baz" : ">1.0.2 <=2.3.4"
  , "boo" : "2.0.1"
  , "qux" : "<1.0.0 || >=2.3.1 <2.4.5 || >=2.5.2 <3.0.0"
  , "asd" : "http://asdf.com/asdf.tar.gz"
  , "til" : "~1.2"
  , "elf" : "~1.2.3"
  , "two" : "2.x"
  , "thr" : "3.3.x"
  , "lat" : "latest"
  , "dyl" : "file:../dyl"
  }
}
```
