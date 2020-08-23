---
title: Flutter_BLoC 初步使用
date: 2020-03-27 21:37:53
tags:
  - Flutter
  - Dart
category: Note
cover: http://cdn.eqingchen.top/blog/images/flutter-BLoC.png
---

# 前言

为了给App加上更换主题的功能，就需要更改动态更改Theme，然后组件更新Widget，为了快速构建，使用了 [flutter_bloc](https://s0pub0dev.icopy.site/packages/flutter_bloc) 这个插件，简单记录下使用方法

> 有关BLoC相关的知识可以进行搜索学习



分析官网的例子进行学习，去除多余的内容


# 安装

编辑项目根目录下的`pubspec.yaml`文件，找到`dependencies`，如下添加

```yaml
	dependencies:
  	flutter:
    	dk: flutter
+ 	flutter_bloc: 3.2.0
```

# 使用

使用方法相对简单

## 先是引入文件

导入需要的包

```dart
import 'package:flutter/material.dart';
import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
```

## Main函数

运行App

```dart
void main() => runApp(App());
```



## 构建 ThemeBloc

写法比较固定，必须重写`initialState` 跟 `mapEventToState`

* initialState：用于返回初始数据
* mapEventToState：事件触发后会调用这个方法

```dart
// Bloc<事件枚举, 数据类型>
class ThemeBloc extends Bloc<ThemeEvent, ThemeData> {
  @override
  ThemeData get initialState => ThemeData.light();

  @override
  Stream<ThemeData> mapEventToState(ThemeEvent event) async* {
    // event 是 context.bloc<ThemeBloc>().add(ThemeEvent.toggle) 传进来的事件枚举
    switch (event) {
      case ThemeEvent.toggle:
        yield state == ThemeData.dark() ? ThemeData.light() : ThemeData.dark();
        break;
    }
  }
}
```



## App Widget

官方原文翻译:

**BlocProvider**  是Flutter小部件，一般用于创建Bloc, 它通过 `BlocProvider.of<T>(context)` 为其子级提供Bloc。它用于依赖项注入(DI) 小部件，以便可以将一个 Bloc 的单个实例提供给子树中的多个小部件。

在某些情况下，可以使用`BlocProvider`向小部件树的新部分提供现有的Bloc. 当需要将现有`bloc`用于新路由时，这将是最常用的. 在这种情况下， `BlocProvider`不会自动关闭该块，因为它没有创建它。

>  大白话就是，他是用来给子widget注入依赖的，以便于可以在子widget中可以用 context.bloc<BlocA>() 这种方式跟Bloc进行交互，通常用于创建Bloc



```dart
class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      // 传个函数，需要返回要创建的Bloc，'_'为当前上下文，这里创建的是ThemeBloc
      create: (_) => ThemeBloc(),
      // ThemeBloc		create创建的ThemeBloc
      // ThemeData		要由ThemeBloc管理的数据类型
      // 原型			   BlocBuilder<BlocA, BlocAState>()
      child: BlocBuilder<ThemeBloc, ThemeData>(
        /*
         * @param	{BuildContext}_		上下文对象
         * @param	{ThemeData}theme	由initialState返回的初始数据
         */
        builder: (_, ThemeData theme) {
          return MaterialApp(
            debugShowCheckedModeBanner: false,
            title: 'Flutter Demo',
            home:Home(),
            theme: theme
          );
        }
      )
    );
  }
}
```



## Home Widget

* `context.bloc<ThemeBloc>()` 获取当前上下文使用**BlocProvider**创建的指定Bloc， 这里是`ThemeBloc`

* `add()` 方法，接收一个事件枚举，通知[bloc]触发[mapEventToState]方法处理事件。

```dart
class Home extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('BLoC Demo')),
      body: Center(child: Text('Hello Flutter')),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.update),
        onPressed: () => context.bloc<ThemeBloc>().add(ThemeEvent.toggle)
      )
    );
  }
}
```



## 完整代码

```dart
import 'package:flutter/material.dart';
import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';

void main() => runApp(App());

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => ThemeBloc(),
      child: BlocBuilder<ThemeBloc, ThemeData>(
        builder: (_, theme) {
          return MaterialApp(
            debugShowCheckedModeBanner: false,
            title: 'Flutter Demo',
            home:Home(),
            theme: theme
          );
        }
      )
    );
  }
}

class Home extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('BLoC Demo')),
      body: Center(child: Text('Hello Flutter')),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.update),
        onPressed: () => context.bloc<ThemeBloc>().add(ThemeEvent.toggle)
      )
    );
  }
}

enum ThemeEvent { toggle }
class ThemeBloc extends Bloc<ThemeEvent, ThemeData> {
  @override
  ThemeData get initialState => ThemeData.light();

  @override
  Stream<ThemeData> mapEventToState(ThemeEvent event) async* {
    switch (event) {
      case ThemeEvent.toggle:
        yield state == ThemeData.dark() ? ThemeData.light() : ThemeData.dark();
        break;
    }
  }
}

```


如有错误，请指出( •̀ ω •́ )✧