---
title: img标签底部空隙问题
date: 2020-01-06 19:45:11
tags:
    - Css
category: Frontend
cover: http://pic.eqingchen.top/side-blog-img-1.jpg
---

# 解决方案
> 以下优先级仅仅是个人建议，如果没有清除的必要，就没必要做这些处理
1. vertical-align: bottom
2. display: block
3. 父元素设置 font-size: 0

# 扩展
> `img`标签是`行内替换元素(inline replace elements)`, 属于`行内元素(inline elements)`类目

图片底部的空隙涉及行内元素的布局模型，行内元素默认的垂直对齐方式是`基线(baseline)`，基线的位置是与字体相关的

所以这个底部空隙的大小是不确定的，会根据字体的大小而改变，所以就有了上面的`font-size: 0`，但给父元素设置字体大小为0会影响其子元素，所以上面把他放到了最后

`img`有一些额外规则，比如设置了图片的宽度，但没有设置高度，你会发现高度会按照比例缩放，参见[W3C CSS2.1 第十章](https://www.w3.org/TR/CSS21/visudet.html#inline-replaced-width)。

* 行内替换元素(有点类似于`inline-block`)
    `height/width/padding/margin`均可用，效果等于块元素
* 行内元素
    `height/width/padding top、bottom/margin top、bottom`均无效果，只能用`padding left、right和margin left、right`改变宽度，`line-height` 改变高度。
