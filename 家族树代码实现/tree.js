var treeData = [{
    "name": "",
    "parent": "",
    "children": [{
        "name": "",
        "parent": "",
        "children": [{
            "name": "",
            "parent": ""
        }, {
            "name": "",
            "parent": "",
            "children": [{
                "name": "",
                "parent": ""
            }]
        }, {
            "name": "",
            "parent": ""
        }, {
            "name": "",
            "parent": ""
        }]
    }, {
        "name": "",
        "parent": "",
        "children": [{
            "name": "",
            "parent": ""
        }, {
            "name": "",
            "parent": ""
        }, ]

    }, {
        "name": "",
        "parent": ""
    }, ]
}];

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
            .style("fill", "rgba(0,202,205,0.7)");

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

function getJsonLength(ctreeData) {
    var length = 0;
    for (var item in ctreeData) {
        length++;
    }
    return length;
}

function check(nodes, cname, ctree) {
    var length = getJsonLength(nodes.children);
    for (var p = 0; p < length; p++) {
        if (nodes.children[p].name == cname) {
            flag = 1;
            nodes.children[p] = ctree; //将该json树添加到儿子节点作为关联
            return 1;

        } else {
            check(nodes.children[p], cname, ctree);
        }
    }

    return 0;
}

function main() {
    var count = 0; //定义儿子节点的编号
    var all_data = document.getElementById("text").value;
    var group_data = all_data.split("\n\n");

    //生成树型结构数据
    for (var j = 0; j < group_data.length; ++j) {
        count = 0;
        flag = 0;
        tree_count = 0;
        var row_data = group_data[j].split("\n");

        for (var i = 0; i < row_data.length; ++i) {
            var hb = row_data[i].split("："); //从冒号分割一层字符串
            var head = hb[0];
            var body = hb[1];
            //处理冒号前的部分
            if (head == "导师") {
                var teacher = {
                    "name": body,
                    "parent": "null",
                    "children": [{}]
                }
                treeData[j] = teacher; //将导师嵌入节点
            } else {
                var children = {
                    "name": head,
                    "parent": "null",
                    "children": [{}]
                }
                treeData[j].children[count] = children; //将年级及职业嵌入节点
                var student = body.split("、");
                for (var m = 0; m < student.length; ++m) {
                    var children = {
                        "name": student[m],
                        "parent": "null",

                    }
                    treeData[j].children[count].children[m] = children;
                }
                count++;
            }
        }

        var tree_tmp = treeData[j];
        var name_tmp = treeData[j].name;
        for (num_tmp = 0; num_tmp < j; num_tmp++) {
            check(treeData[num_tmp], name_tmp, tree_tmp);
        }
        if (!flag) {
            tree_count++;
        }
    }

    for (var i = 0; i <= tree_count; i++) {
        tree(i)
    }
}
