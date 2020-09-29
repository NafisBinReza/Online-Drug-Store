const { TestScheduler } = require('jest');
const { add } = require('../app');
Test('sould output summation', () => {
    const text = add(4,5);
    expect(text).toBe(9);
});

Test('sould output summation', () => {
    const text = add(4,5);
    expect(text).toBe(11);
});
