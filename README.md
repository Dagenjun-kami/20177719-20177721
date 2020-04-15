# 20177719-20177721
FamilyTree
## 目录

- index.html（在浏览器运行）
- style.css（外部样式表）
- tree.js（文本的获取使用及家族树的生成代码）
- background.jpg（背景图片）
- d3.v3.min.js（js的函数库）
- README.md(使用说明书)

## 使用方法（测试人员运行方法）

下载该项目到本地，打开index.html，进入家庭树生成界面，在文本框中输入家庭树文本形式，点击“创建家庭树”按钮，即可在下方生成家庭树。

## 文本格式

### 输入:

学术家族树以文本形式输入，点击“创建家庭树”，即可。

学术家族树的文本格式是这样的：
导师：张三
2016级博士生：天一、王二、吴五
2015级硕士生：李四、王五、许六
2016级硕士生：刘一、李二、李三
2017级本科生：刘六、琪七、司四

**其中，"导师："，"级博士生："，"级硕士生："，"级本科生："和"、"当做关键词处理；若有多组输入，中间空一行，如：**

导师：张三
2016级博士生：天一、王二、吴五
2015级硕士生：李四、王五、许六
2016级硕士生：刘一、李二、李三
2017级本科生：刘六、琪七、司四

导师：天一
2016级博士生：天1、王二、吴五
2015级硕士生：李四、王五、许六
2016级硕士生：刘一、李二、李三
2017级本科生：刘六、琪七、十四

**注意！！！结尾不能有多余的空行。否则，无法生成树。**

### 输出:

树的节点，鼠标点击后是可以缩放的。同时，支持呈现多棵树并存、两棵关联树共存等形式