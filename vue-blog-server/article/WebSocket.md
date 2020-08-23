---
title: WebSocket
date: 2020-03-05 10:52:21
tags: 
  - WebSocket
  - ES 6
  - JavaScript
category: Note
---

# 简介

## 历程
Websocket(下面用`WS`简称)协议诞生于2008年，于2011年成为标准

具体参考: [RFC6455](https://tools.ietf.org/html/rfc6455)，后由[RFC7936](https://tools.ietf.org/html/rfc7936)补充

WebSocket协议规范将ws（WebSocket）和wss（WebSocket Secure）定义为两个新的 `统一资源标识符`（URI）方案

## 注意
* 是HTML5标准
* WS建立在TCP协议之上
* 不是HTTP协议
* 位于OSI模型的应用层
* 没有同源限制
* 默认工作端口为`80`于`443`
* 协议标识符是ws（如果加密，则为wss）

## 优点
* 与HTTP有良好兼容性(支持HTTP代理和中介)
* 较小开销(用于协议控制的数据包头相对较小)
* 更强实时性(全双工)
* 保持连接状态(持久连接，除非客户端或者服务器一方断开)
* 可发送文本与二进制
* 更好的压缩效果

## 握手协议
WS 是独立的、建立在 TCP 上的协议。WS 通过 HTTP/1.1 协议的101状态码进行握手。


# 为什么需要它

## WS 是什么
WS 是位于应用层的一种TCP`网络传输协议`

## 解决了什么
> 一种技术的出现，必定是为了解决现在有技术解决不了的问题。
> WS的出现，是为了解决HTTP协议的一个缺陷(只能由客户端发起通讯)

## 为什么是它
WS 可在单个TCP连接中进行`全双工通信`；客户端跟服务器端仅进行一次握手就可以建立持久连接，并进行`双向数据传输`。

## 它能做什么
* 聊天室
* 在线协作
* ...


# 协议头
## 一个典型的WS握手请求
客户端请求
```
GET / HTTP/1.1
Upgrade: websocket
Connection: Upgrade
Host: example.com
Origin: http://example.com
Sec-WebSocket-Key: sN9cRrP/n9NdMgdcy2VJFQ==
Sec-WebSocket-Version: 13
```
服务器响应
```
HTTP/1.1 101 Switching Protocols 
Upgrade: websocket 
Connection: Upgrade
Sec-WebSocket-Accept: fFBooB7FAkLlXgRSz0BT3v4hq5s=
Sec-WebSocket-Location: ws://example.com/
```

## 字段说明
* Connection必须设置Upgrade，表示客户端希望连接升级。
* Upgrade字段必须设置Websocket，表示希望升级到Websocket协议。
* Sec-WebSocket-Key是随机的字符串，服务器端会用这些数据来构造出一个SHA-1的信息摘要。把“Sec-WebSocket-Key”加上一个特殊字符串“258EAFA5-E914-47DA-95CA-C5AB0DC85B11”，然后计算SHA-1摘要，之后进行BASE-64编码，将结果做为“Sec-WebSocket-Accept”头的值，返回给客户端。如此操作，可以尽量避免普通HTTP请求被误认为Websocket协议。
* Sec-WebSocket-Version 表示支持的Websocket版本。RFC6455要求使用的版本是13，之前草案的版本均应当弃用。
* Origin字段是可选的，通常用来表示在浏览器中发起此Websocket连接所在的页面，类似于Referer。但是，与Referer不同的是，Origin只包含了协议和主机名称。
* 其他一些定义在HTTP协议中的字段，如Cookie等，也可以在Websocket中使用。


# WebSocket API

## 简单例子
> 这个例子是阮一峰老师博客的，会把发送的消息返回给你
```JavaScript
// 有点像Web Worker

const ws = new WebSocket('wss://echo.websocket.org/');

ws.onopen = evt => {
  console.log('打开连接');
  ws.send('hello! Websocket');
};

ws.onmessage = evt => {
  console.log('接受的消息: ', evt.data);
  ws.close();
};

ws.onclose = () => console.log('断开连接');
```

## WebSocket构造函数
`WebSocket` 对象提供了用于创建和管理 WebSocket 连接，以及可以通过该连接发送和接收数据的 API。

```JavaScript
WebSocket(url[, protocols])
```
例子
```JavaScript
const ws = new WebSocket('wss://echo.websocket.org/');
```

## 常量(readyState)
当前连接状态
| State                | Value | Description        |
| -------------------- | ----- | ------------------ |
| WebSocket.CONNECTION | 0     | 连接中             |
| WebSocket.OPEN       | 1     | 连接成功           |
| WebSocket.CLOSING    | 2     | 正在关闭           |
| WebSocket.CLOSED     | 3     | 已经关闭或连接失败 |
```JavaScript
switch (ws.readyState) {
    case WebSocket.OPEN:
        // do something
        break;
    // ......
}
```

## 事件
`WebSocket.onopen` 连接成功回调
`WebSocket.onmessage` 接收到消息回调
`WebSocket.onclose` 连接关闭后回调
`WebSocket.onerror` 连接失败后回调

```JavaScript
ws.onopen = () => {};
ws.addEventListener('open', fn);
```
> 服务器数据可能是文本，也可能是二进制数据（blob对象或Arraybuffer对象）

### 动态判断收到的类型
```JavaScript
ws.onmessage = function(event) {
  if (typeof event.data === String) {
    console.log("Received data string");
  }
  if (event.data instanceof ArrayBuffer) {
    var buffer = event.data;
    console.log("Received arraybuffer");
  }
};
```

### 指定接收二进制类型
```JavaScript
// blob 类型
ws.binaryType = "blob";
ws.onmessage = function(e) {
  console.log(ws.binaryType, e.data.size)
}
```

## 可读写属性
### WebSocket.binaryType
* 读取数据的类型
* 设置数据的类型

## 只读属性
### WebSocket.bufferedAmount
未发送的二进制数据数
| Key        | Value              |
| ---------- | ------------------ |
| 返回值类型 | unsigned long      |
| 返回值     | 发送数据的字节长度 |

执行 send() 方法后数据会添加到队列，返回队列中**未发送**到网络的**数据的字节数**。
一旦数据都发送到了网络，这个属性会被重置为0。
若这个过程中**断开链接**，这个属性**不会重置**，继续调用 send() 会叠加。

### WebSocket.extensions(没搞懂)
| Key        | Value                  |
| ---------- | ---------------------- |
| 返回值类型 | DOMString              |
| 返回值     | 服务器器已选择的扩展值 |

返回服务器已选择的扩展值。目前，链接可以协定的扩展值只有空字符串或者一个扩展列表。

`WebSocket.protocol`
| Key        | Value                      |
| ---------- | -------------------------- |
| 返回值类型 | DOMString                  |
| 返回值     | 服务器端选中的子协议的名字 |

用于返回服务器端选中的子协议的名字；这是一个在创建WebSocket 对象时，在参数protocols中指定的字符串。

### WebSocket.readyState
当前WebSocket的链接状态

### WebSocket.url
返回值为创建WebSocket实例对象时URL的绝对路径

## 方法

### WebSocket.send(data)
将要发送的数据排入队列
**data必须是以下类型之一**
` USVString `
文本字符串。字符串将以 UTF-8 格式添加到缓冲区，并且 bufferedAmount 将加上该字符串以 UTF-8 格式编码时的字节数的值。
` ArrayBuffer `
您可以使用一有类型的数组对象发送底层二进制数据；其二进制数据内存将被缓存于缓冲区，bufferedAmount 将加上所需字节数的值。
` Blob `
Blob 类型将队列 blob 中的原始数据以二进制中传输。 bufferedAmount 将加上原始数据的字节数的值。
` ArrayBufferView `
您可以以二进制帧的形式发送任何 JavaScript 类数组对象 ；其二进制数据内容将被队列于缓冲区中。值 bufferedAmount 将加上必要字节数的值。

参见 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket/send)

### WebSocket.close([code[, reason]])
关闭连接

**参数:**
` code[可选] `:  数字状态码，它解释了连接关闭的原因。如果没有传这个参数，默认使用1005。[CloseEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/CloseEvent) 的允许的状态码见[状态码列表](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes) 。
`reason[可选] `:  一个字符串，用于向服务器说明关闭原因。`UTF-8`编码，不能超过`123字节`。

参见 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket/close)