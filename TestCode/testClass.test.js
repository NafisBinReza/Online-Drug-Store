const { str  , mul } = require('../app');
Test('sould output abc', () => {
    const text = str();
    expect(text).toBe('abc');
});

Test('sould output abc', () => {
    const text = str();
    expect(text).toBe('abcd');
});

Test('sould output multiplication', () => {
    var l = [1,1,1,1];
    const text = str(l);
    expect(text).toBe(1);
});

Test('sould output multiplication', () => {
    var l = [1,1,1,1];
    const text = str(l);
    expect(text).toBe(3);
});