---
title: Qt WebEngine Overview
date: 2020-03-29 19:02:36
tags:
  - Qt
  - Qt 5
category: Note
---
> 声明: 本文基于qt官方文档 [Qt WebEngine Overview](https://doc.qt.io/qt-5/qtwebengine-overview.html) 翻译而成，便于以后查阅使用


Qt WebEngine模块提供了一个Web浏览器引擎，可以轻松地将万维网上的内容嵌入到没有本机Web引擎的平台上的Qt应用程序中。


Qt WebEngine提供了用于渲染HTML，XHTML和SVG文档的C ++类和QML类型，它们使用级联样式表（CSS）进行样式设置并使用JavaScript编写脚本。通过使用`contenteditable`HTML元素上的属性，用户可以完全编辑HTML文档。

# Qt WebEngine 架构

![](http://cdn.eqingchen.top/blog/images/qt/qtwebengine-architecture.png)


QWebEngine的架构就如上图所示

* [Qt WebEngine Widgets Module](https://doc.qt.io/qt-5/qtwebengine-overview.html#qt-webengine-widgets-module) : 用于创建基于Widget的Web应用
* [Qt WebEngine Module](https://doc.qt.io/qt-5/qtwebengine-overview.html#qt-webengine-module) : 用于创建基于Qt Quick的Web应用
* [Qt WebEngine Core Module](https://doc.qt.io/qt-5/qtwebengine-overview.html#qt-webengine-core-module) : 用于与Chromium交互

## Qt WebEngine Widgets Module

![](http://cdn.eqingchen.top/blog/images/qt/qtwebenginewidgets-model.png)

***Web engine view*** 是Qt WebEngine模块的主要Widget组件。它可以用于各种应用程序中加载Web内容。在视图中，***Web engine page*** 包含一个主框架，该主框架负责Web内容，导航链接的操作和历史记录。***view*** 和 ***page***非常相似，因为它们提供了一组通用功能。


所有页面都属于一个 ***Web engine profile***，其中包含共享 ***setting 、script、cookie***。配置文件可用于将页面彼此隔离。一个典型的用例是***private browsing(隐私浏览，通俗点就是：无痕模式)*** 模式的专用配置文件，其中不会永久保存任何信息。


> 注意：Qt WebEngine Widgets 模块使用 [Qt Quick scene graph](https://doc.qt.io/qt-5/qtquick-visualcanvas-scenegraph.html) 将网页的元素组成一个视图。这意味着UI进程需要OpenGL ES 2.0或OpenGL 2.0进行渲染。

## Qt WebEngine Module

![](http://cdn.eqingchen.top/blog/images/qt/qtwebengine-model.png)

Qt WebEngine QML有着Qt WebEngine Widgets相同的实现（不太确定，补上原文：The Qt WebEngine QML implementation contains the same elements as the Qt WebEngine Widgets implementation），不同之处在于没有可单独访问的 web engine page。支持的页面功能已集成到 web engine view中。


## Qt WebEngine Core Module

Qt WebEngine core 基于 [Chromium Project](http://www.chromium.org/) 。Chromium提供了自己的网络和绘制引擎，并与其相关模块紧密合作开发。


> 注意：Qt WebEngine基于Chromium，但不包含或使用任何可能是由Google构建和交付的Chrome浏览器一部分的服务或附加组件。您可以在此概述中找到有关Chromium和Chrome的差异的更多详细信息，该信息是  [Chromium Project](http://www.chromium.org/) 上游源代码树中文档的一部分。


此版本的Qt WebEngine基于Chromium的77.0.3865版本，并具有较新版本的其他安全修复程序。


## Qt WebEngine Process

Qt WebEngine进程是一个单独的可执行文件，用于呈现网页和执行JavaScript。这样可以缓解安全问题，并隔离由特定内容引起的崩溃。


# 使用

## 将Web内容嵌入到基于Widgets的应用程序中

使用 [QWebEngineView](https://doc.qt.io/qt-5/qwebengineview.html) 类用最简单的方式显示web页面，因为他是一个Widget。您可以将 [QWebEngineView](https://doc.qt.io/qt-5/qwebengineview.html) 嵌入到forms中，并使用其便捷功能下载和显示网站。


```c++
QWebEngineview *view = new QWebEngineView(parent);
view->load(QUrl("http://www.qt.io/"));
view.show();
```

[QWebEngineView](https://doc.qt.io/qt-5/qwebengineview.html) 的实例具有一个 [QWebEnginePage](https://doc.qt.io/qt-5/qwebenginepage.html)。[QWebEnginePage](https://doc.qt.io/qt-5/qwebenginepage.html) 可以具有 [QWebEngineHistory](https://doc.qt.io/qt-5/qwebenginehistory.html) （可访问页面的导航历史记录）和几个 [QAction](https://doc.qt.io/qt-5/qaction.html) 对象，这些对象可对网页执行操作。此外， [QWebEnginePage](https://doc.qt.io/qt-5/qwebenginepage.html) 能够在页面主框架的上下文中运行JavaScript代码，并能够为特定事件（例如显示自定义身份验证对话框）启用自定义处理程序的。


每个 [QWebEnginePage](https://doc.qt.io/qt-5/qwebenginepage.html) 都属于一个 [QWebEngineProfile](https://doc.qt.io/qt-5/qwebengineprofile.html) ，有一个设置页面的 [QWebEngineSettings](https://doc.qt.io/qt-5/qwebenginesettings.html) ，用于在页面上运行脚本的 [QWebEngineScriptCollection](https://doc.qt.io/qt-5/qwebenginescriptcollection.html) 和用于访问Chromium的HTTP cookie的 [QWebEngineCookieStore](https://doc.qt.io/qt-5/qwebenginecookiestore.html) 。 [QWebEnginePage](https://doc.qt.io/qt-5/qwebenginepage.html) 也可以直接指向脚本集合（QWebEngineScriptCollection）。


对于基于Widget的应用程序，Web引擎会自动初始化，除非将其放置在插件中。在这种情况下，必须使用 [QtWebEngine::initialize](https://doc.qt.io/qt-5/qtwebengine.html#initialize) 在应用程序主源文件中对其进行初始化，如以下代码段所示：

```c++
int main(int argc, char **argv)
{
    QApplication app(argc, argv);
    
    QtWebEngine::initialize();
    
    QMainWindow window;
    window.show();
    
    return app.exec();
}
```


## 将Web内容嵌入Qt Quick应用程序

[WebEngineView](https://doc.qt.io/qt-5/qml-qtwebengine-webengineview.html) QML类型允许Qt Quick应用程序呈现动态web内容的区域。 *[WebEngineView](https://doc.qt.io/qt-5/qml-qtwebengine-webengineview.html)* 类型可以与其他QML类型共享屏幕，也可以包含Qt Quick应用程序中指定的全屏。


为了确保可以在GUI和渲染进程之间共享OpenGL上下文，必须使用应用程序主源文件中的[QtWebEngine::initialize](https://doc.qt.io/qt-5/qtwebengine.html#initialize)初始化Web引擎，如以下代码片段所示：

```c++
int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);

    QtWebEngine::initialize();

    QQmlApplicationEngine engine;
    engine.load(QUrl("qrc:/main.qml"));

    return app.exec();
}
```


应用程序可以使用URL或HTML字符串将页面加载到 [WebEngineView](https://doc.qt.io/qt-5/qml-qtwebengine-webengineview.html) 中，并在会话历史记录中导航。默认情况下，指向不同页面的链接会加载到同一 [WebEngineView](https://doc.qt.io/qt-5/qml-qtwebengine-webengineview.html) 对象中，但是网站可能会要求将其打开为新的选项卡、窗口或对话框。


以下示例QML应用程序使用 [url](https://doc.qt.io/qt-5/qml-qtwebengine-webengineview.html#url-prop) 属性加载网页：

```qml
import QtQuick 2.0
import QtQuick.Window 2.0
import QtWebEngine 1.0

Window {
	width: 1024
	height: 750
	visible: true
	WebEngineView {
		anchors.fill: parent
		url: "https://www/qt.io"
	}
}
```


## 注入脚本（Script Injection）

Qt WebEngine不允许直接访问页面的文档对象模型（DOM）。但可以通过注入脚本来检查和修改DOM。


页面的DOM是在文档准备就绪时构造的，通常是在页面完全加载时构造。因此，在创建文档后不适合立即执行脚本操作DOM，因为该操作必须等待DOM准备就绪。


此外，注入的脚本与页面上执行的其他脚本共享相同的 *world（环境）*，这可能会导致冲突。为了避免这种情况，[QWebEngineScript](https://doc.qt.io/qt-5/qwebenginescript.html) 类和 [WebEngineScript](https://doc.qt.io/qt-5/qml-qtwebengine-webenginescript.html) QML类型提供了用于内容脚本扩展的Chromium API的实现。它们指定要运行的脚本，注入点以及运行脚本的环境。这使访问DOM可以在一个 *world（环境）*中进行操作。


从Qt 5.8开始，Qt WebEngine支持通过使用以下类似于  [Greasemonkey-like attributes](https://wiki.greasespot.net/Metadata_Block#.40name) 来扩展脚本：

- @exclude  <regexp>
- @include  <regexp>
- @match  <regexp>
- @name  <free text>
- @run-at [document-start|document-end|document-idle]


这些属性确定是否以及何时运行 [user script](https://www.chromium.org/developers/design-documents/user-scripts) 。必须将它们放在脚本的开头在 `== UserScript ==` 注释内：

```qml
// ==UserScript==
// @include http://*.qt.io/*
// @exclude http://wiki.qt.io/*
// ==/UserScript==

window.alert("Page is from qt.io, but not wiki.qt.io");
```

如果您的 [WebEngine](https://doc.qt.io/qt-5/qml-qtwebengine-webengine.html) 应用程序是使用Qt Quick Compiler构建的，并且该应用程序在.qrc资源中附带了JavaScript文件，请考虑阅读 [JavaScript Files in Qt Resource Files](https://doc.qt.io/qt-5/qtwebengine-deploying.html#javascript-files-in-qt-resource-files) 部分。


## 管理证书（Managing Certificates）

Qt WebEngine使用其自己的网络堆栈，因此  [QSslConfiguration](https://doc.qt.io/qt-5/qsslconfiguration.html) 不用于打开SSL连接。作为代替，Qt WebEngine使用来自操作系统的根CA证书来验证对等方的证书。


[WebEngineCertificateError::error](https://doc.qt.io/qt-5/qml-qtwebengine-webenginecertificateerror.html#error-prop) 和 [QWebEngineCertificateError::Error](https://doc.qt.io/qt-5/qwebenginecertificateerror.html#Error-enum) 枚举提供了有关可能发生的证书错误类型的信息。可以通过使用 [WebEngineView::certificateError](https://doc.qt.io/qt-5/qml-qtwebengine-webengineview.html#certificateError-signal)  QML方法或重新实现[QWebEnginePage::certificateError](https://doc.qt.io/qt-5/qwebenginepage.html#certificateError) 函数来处理错误。


## 代理支持（Proxy Support）

Qt WebEngine使用来自 [Qt Network](https://doc.qt.io/qt-5/qtnetwork-index.html) 的代理设置，并将其转发到Chromium的网络堆栈。如果设置 [QNetworkProxy::applicationProxy](https://doc.qt.io/qt-5/qnetworkproxy.html#applicationProxy) ，它也将用于Qt WebEngine。如果启用了[QNetworkProxyFactory::usesSystemConfiguration](https://doc.qt.io/qt-5/qnetworkproxyfactory.html#usesSystemConfiguration)()，则将从系统中自动检索代理设置。但已安装的 [QNetworkProxyFactory](https://doc.qt.io/qt-5/qnetworkproxyfactory.html) 中的设置将被忽略。


如果设置了 [QNetworkProxy::user](https://doc.qt.io/qt-5/qnetworkproxy.html#user)() 和 [QNetworkProxy::password](https://doc.qt.io/qt-5/qnetworkproxy.html#password)()，则这些凭据将自动用于代理身份验证。由于没有错误处理回调，因此由用户提供有效的凭据。


如果没有使用 [QNetworkProxy](https://doc.qt.io/qt-5/qnetworkproxy.html) 设置凭据，但是代理需要身份验证，则会发出[QWebEnginePage::proxyAuthenticationRequired](https://doc.qt.io/qt-5/qwebenginepage.html#proxyAuthenticationRequired) 。对于Qt Quick，将显示一个对话框。


Qt WebEngine并不支持 [QNetworkProxy](https://doc.qt.io/qt-5/qnetworkproxy.html) 的所有属性。也就是说，只考虑[QNetworkProxy::type](https://doc.qt.io/qt-5/qnetworkproxy.html#type)() ,  [QNetworkProxy::hostName](https://doc.qt.io/qt-5/qnetworkproxy.html#hostName)()和[QNetworkProxy::port](https://doc.qt.io/qt-5/qnetworkproxy.html#port)()。所有其他代理设置，例如[QNetworkProxy::rawHeader](https://doc.qt.io/qt-5/qnetworkproxy.html#rawHeader)()都将被忽略。


## 高DPI支持（High DPI Support）

为了支持High DPI设备，建议将应用程序属性  [Qt::AA_EnableHighDpiScaling](https://doc.qt.io/qt-5/qt.html#ApplicationAttribute-enum) 设置为：启用基于监视器像素密度的自动缩放。在Qt WebEngine应用程序中，缩放比例会影响默认的缩放系数和滚动条大小。


For example:

```c++
int main(int argc, char *argv[])
{
  QCoreApplication::setAttribute(Qt::AA_EnableHighDpiScaling);
  QApplication app(argc, argv);
  // or
  // app.setAttribute(Qt::AA_EnableHighDpiScaling);
  // ...
}
```


Qt WebEngine将具有正常和高分辨率分辨率的图像捆绑到qtwebengine_resources_100p.pak和qtwebengine_resources_200p.pak文件中。根据目标分辨率，需要部署这些文件中的一个或两个。


有关更多信息，请参见 [High DPI Displays](https://doc.qt.io/qt-5/highdpi.html).


## Using WebEngine Core

Qt WebEngine Core 提供了Qt WebEngine和Qt WebEngine Widget 共享的API，用于处理为Chromium的网络堆栈发出的URL请求以及访问其HTTP cookie。


实现 [QWebEngineUrlRequestInterceptor](https://doc.qt.io/qt-5/qwebengineurlrequestinterceptor.html) 接口并将拦截器安装在配置文件上，可以在URL请求([QWebEngineUrlRequestInfo](https://doc.qt.io/qt-5/qwebengineurlrequestinfo.html))到达Chromium的网络堆栈之前对其进行拦截，阻止和修改。


可以为配置文件注册 [QWebEngineUrlSchemeHandler](https://doc.qt.io/qt-5/qwebengineurlschemehandler.html) 以添加对自定义URL方案的支持。然后，将对方案的请求作为 [QWebEngineUrlRequestJob](https://doc.qt.io/qt-5/qwebengineurlrequestjob.html) 对象发布到[QWebEngineUrlSchemeHandler::requestStarted](https://doc.qt.io/qt-5/qwebengineurlschemehandler.html#requestStarted)。


[QWebEngineCookieStore](https://doc.qt.io/qt-5/qwebenginecookiestore.html) 类提供用于访问Chromium的HTTP cookie的功能。这些功能可用于将cookie与 [QNetworkAccessManager](https://doc.qt.io/qt-5/qnetworkaccessmanager.html) 同步，以及在导航期间设置，删除和拦截cookie。


## 平台说明

Qt WebEngine当前仅支持Windows，Linux和macOS。由于Chromium构建要求，它通常还需要比Qt其余版本更新的编译器。有关更多详细信息，请参见 [Qt WebEngine Platform Notes](https://doc.qt.io/qt-5/qtwebengine-platform-notes.html) 。


## 相关模块

Qt WebEngine取代了Qt WebKit模块，该模块基于WebKit项目，但是自Qt 5.2以来一直未与上游WebKit代码进行主动同步，并且在Qt 5.5中已弃用。有关如何将Qt WebKit Widget 应用程序更改为使用Qt WebEngine Widget 的提示，请参阅 [Porting from Qt WebKit to Qt WebEngine](https://doc.qt.io/qt-5/qtwebenginewidgets-qtwebkitportingguide.html) 。


 [Qt WebView](https://doc.qt.io/qt-5/qtwebview-index.html) 模块允许在可用的平台上使用本机Web浏览器。

 [Qt WebChannel](https://doc.qt.io/qt-5/qtwebchannel-index.html) 模块可用于在C ++端的QObject对象和QML端的JavaScript之间创建双向通信通道。



如有错误，请指出( •̀ ω •́ )✧