var treeData=[];
var flag = 0;
function tree(m) {
    var margin = {
            top: 20,
            right: 120,
            bottom: 20,
            left: 50
        },
        width = 2000 - margin.right - margin.left,
        height = 960 - margin.top - margin.bottom;

    var i = 0,
        duration = 750,
        root;

    var tree = d3.layout.tree()
        .size([height, width]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) {
            return [d.y, d.x];
        });

    //画布
    var svg = d3.select("#familyTree")
        .append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    root = treeData[m];
    root.x0 = height / 2;
    root.y0 = 0;

    update(root);

    d3.select(self.frameElement).style("height", "500px");

    function update(source) {
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        nodes.forEach(function(d) {
            d.y = d.depth * 180;
        });

        var node = svg.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id || (d.id = ++i);
            });

        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on("click", click);
        nodeEnter.append("rect")
            .attr("x", -35)
            .attr("y", -22)
            .attr("width", 100)
            .attr("height", 25)
            .attr("rx", 10)
            .style("fill", "rgba(71,108,136,0.7)");

        nodeEnter.append("text")
            .attr("x", function(d) {
                return d.children || d._children ? 13 : 13;
            })
            .attr("dy", "-4")
            .attr("text-anchor", "middle")
            .text(function(d) {
                return d.name;
            })
            .style("fill", "white")
            .style("fill-opacity", 1e-6);

        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        nodeUpdate.select("rect")
            .attr("x", -35)
            .attr("y", -22)
            .attr("width", 100)
            .attr("height", 25)
            .attr("rx", 10)
            .style("fill", "rgba(48,165,205,0.7)");

        nodeUpdate.select("text")
            .attr("text-anchor", "middle")
            .style("fill-opacity", 1);

        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();
        nodeExit.select("rect")
            .attr("x", -35)
            .attr("y", -22)
            .attr("width", 100)
            .attr("height", 25)
            .attr("rx", 10)
            .style("fill", "rgba(71,108,136,0.7)");

        nodeExit.select("text")
            .attr("text-anchor", "middle")
            .style("fill-opacity", 1e-6);

        var link = svg.selectAll("path.link")
            .data(links, function(d) {
                return d.target.id;
            });

        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .attr('marker-end', 'url(#arrow)');
        link.transition()
            .duration(duration)
            .attr("d", diagonal);
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();

        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }


    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }
}

function main() {
    var textdata = document.getElementById("text").value;
    var group_data = textdata.split("\n\n");//将文本以空行按段拆分
   //将文本处理保存为json格式
    for (var j = 0; j < group_data.length; j++) {
        var count = 0;
        var flag = 0;
        var tree_count = 0;
        var row_data = group_data[j].split("\n");//将文本数据按行拆分
        for (var i = 0; i < row_data.length; i++) {
            var hb = row_data[i].split("："); //将行以“：”分割
            var head = hb[0];//冒号前
            var body = hb[1];//冒号后
            if (head == "导师") {
                var teacher = {
                    "name": body,
                    "children": [{}]
                }
                treeData[j] = teacher; //将导师名字嵌入根节点
            } else {
                var children = {
                    "name": head,
                    "children": [{}]
                }
                treeData[j].children[count] = children; //将年级及职业嵌入子节点
                var student = body.split("、");//分割出学生的名字
                for (var m = 0; m < student.length; m++) {
                    var children = {
                        "name": student[m]
                    }
                    treeData[j].children[count].children[m] = children;//将学生名字嵌入孙子节点
                }
                count++;
            }
        }
        var teacher_number = treeData[j];
        var teacher_name = treeData[j].name;
        for (n = 0; n < j; n++) {
            findTeacher(treeData[n], teacher_name, teacher_number);
        }
        if (flag != 0) {
            tree_count++;
        }
    }
    for (var i = 0; i <= tree_count; i++) {
        tree(i)
    }
}

function getJsonLength(treeData) {
    var length = 0;
    for (var item in treeData) {
        length++;
    }
    return length;
}

function findTeacher(tree, name, number) {//查询这个老师是不是其他老师的学生
    var length = getJsonLength(tree.children);
    for (var p = 0; p < length; p++) {
        if (tree.children[p].name == name) {
            flag = 1;
            tree.children[p] = number; //将该树添加到子节点作为关联
            return 1;
        } else {
            findTeacher(tree.children[p], name, number);
        }
    }
    return 1;
}