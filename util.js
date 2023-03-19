function shuffle(list) {
    // 从后往前遍历list
    for (let i = list.length - 1; i > 0; i--) {
        // 随机生成一个小于等于i的索引j
        let j = Math.floor(Math.random() * (i + 1));
        // 交换list[i]和list[j]
        [list[i], list[j]] = [list[j], list[i]];
    }
    // 返回打乱后的list
    return list;
}


function weightedRandomSelect(list) {
    // 计算权重的总和
    let total_weight = 0;
    for (let e of list) {
        total_weight += e.weight;
    }

    // 生成一个0到总和之间的随机数
    let random = Math.random() * total_weight;
    // 遍历数组，找到第一个使随机数小于或等于权重的元素
    for (let i = 0; i < list.length; i++) {
        random -= list[i].weight;
        if (random <= 0) {
            return i;
        }
    }
}

// 定义一个函数，根据权重从数组中随机选择指定个数的元素
function weightedRandomSelectMultiple(list, count) {
    // 创建一个结果数组
    let result = [];
    count = Math.min(count, list.length);

    // 循环count次，每次从副本数组中随机选择一个元素，并将其从副本数组和副本权重中移除
    for (let i = 0; i < count; i++) {
        let selected_i = weightedRandomSelect(list);
        result.push(list[selected_i]);
        list.splice(selected_i, 1);
    }
    
    // 返回结果数组
    return result;
}

// 定义一个函数来随机选择数组中的元素
function randomChoiceMultiple(array, num) {
    let result = [];
    num = Math.min(num, array.length);
    // 循环抽取num次
    for (var i = 0; i < num; i++) {
        // 随机生成一个索引
        var index = Math.floor(Math.random() * array.length);
        // 抽取并删除该索引对应的元素，并将其添加到结果数组中
        result.push(array.splice(index, 1)[0]);
    }
    return result;
}

module.exports = {shuffle, weightedRandomSelectMultiple, randomChoiceMultiple};