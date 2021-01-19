var not_circular_parsed = null;
var ori_parsed = null;
var init_show_depth = 3;
var cur_tree = null;
var guide_tree = null;
var ori_subtree = null;
var last_subtree = null;
var tree = null;

function deep_copy(parsed) {
    var new_json = {};
    for (var key in parsed) {
        // console.log(key);
        if (key !== 'children' && key !== 'parent') {
            // console.log('hello');
            new_json[key] = parsed[key];
        }
    }
    if (parsed.children) {
        var new_children = [];
        for (var i = 0; i < parsed.children.length; ++i) {
            new_children.push(deep_copy(parsed.children[i]));
        }
        new_json.children = new_children;
    }
    return new_json;
}

function find_node(name, tmp_tree, ori_tree) {
    if (name === ori_tree.name)
        return [tmp_tree, ori_tree];
    if (ori_tree.children && tmp_tree.children) {
        for (var i = 0; i < tmp_tree.children.length; ++i) {
            var res = find_node(name, tmp_tree.children[i], ori_tree.children[i]);
            if (res !== null)
                return res;
        }
        return null;
    } else {
        return null;
    }
}

function show_subtree(tmp_tree, ori_tree, show_depth) {
    var new_json = {};
    for (var key in tmp_tree) {
        if (key !== 'children') {
            new_json[key] = tmp_tree[key];
        }
    }
    if (!new_json.name || new_json.name === "") {
        new_json.name = ori_tree.name;
    }
    if (tmp_tree.children && tmp_tree.children.length > 0 && show_depth > 0) {
        var new_children = [];
        for (var i = 0; i < tmp_tree.children.length; ++i) {
            new_children.push(show_subtree(tmp_tree.children[i], ori_tree.children[i], show_depth - 1));
        }
        new_json.children = new_children;
    } else
        new_json.children = null;
    return new_json;
}

function edge_exist_in_subtree(source, target, my_tree) {
    if (my_tree.name === source) {
        if (my_tree.children) {
            for (var i = 0; i < my_tree.children.length; ++i) {
                if (my_tree.children[i].name === target)
                    return 1;
            }
            return 0;
        } else
            return 0;
    }
    if (my_tree.children) {
        for (var i = 0; i < my_tree.children.length; ++i) {
            if (edge_exist_in_subtree(source, target, my_tree.children[i]) === 1)
                return 1;
        }
    }
    return 0;
}

function update_guide_tree() {
    guide_tree.modify_selection(function(d) {
        var source = d.source.name;
        var target = d.target.name;
        if (edge_exist_in_subtree(source, target, cur_tree) === 1)
            return 1;
        return 0;
    });
}