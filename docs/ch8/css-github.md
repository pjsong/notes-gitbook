# 开源范例

## [You dont need javascript](https://github.com/you-dont-need/You-Dont-Need-JavaScript)

### 配置coder

`ctrl+shift+P`, 打开Command Pallete，选择`configure task runner`, 添加下面的内容。选择html文件，`ctrl+shift+b`用浏览器打开。

+ osx:

```json
{
    "version": "0.1.0",
    "command": "Chrome",
    "osx": {
        "command": "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    },
    "args": ["${file}"]
}
```

+ windows：

```json
{
    "version": "0.1.0",
    "command": "Chrome",
    "windows": {
        "command": "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    },
    "args": ["${file}"]
}
```

+ linux

```json
{
    "version": "0.1.0",
    "command": "Firefox",
    "linux": {
        "command": "/usr/bin/firefox"
    },
    "args": ["${file}"]
}
```

### 例子

