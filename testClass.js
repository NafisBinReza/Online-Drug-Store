exports.str = () => {
    return 'abc';
}

exports.mul = (l) => {
    var total = 1;
    l.forEach(element => {
        total = total * element;
    });
    return total;
}