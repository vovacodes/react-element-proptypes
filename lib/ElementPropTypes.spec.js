var test = require('tape');
var React = require('react');
var ElementPropTypes = require('./ElementPropTypes');

var HOST_COMPONENT_NAME = 'HostComponent';
var PROP_LOCATION = 'prop';
var PROP_NAME = 'testProp';

var elementOfType = ElementPropTypes.elementOfType;

function TestComponent() {
    return null;
}

function AnotherTestComponent() {
    return null;
}

function WrongComponent() {
    return null;
}

test('ElementPropTypes.elementOfType should warn when passing a non-element', function (assert) {
    var declaration = elementOfType(TestComponent);
    var props = {};
    props[PROP_NAME] = 'this is string, not an element';

    var error = declaration(props, PROP_NAME, HOST_COMPONENT_NAME, PROP_LOCATION);

    assert.true(error instanceof Error, 'should return an Error');
    assert.equal(
        error.message,
        'Invalid prop `testProp` with value `"this is string, not an element"` supplied to `HostComponent`, ' +
        'expected element of type `TestComponent`.',
        'error message is correct'
    );
    assert.end();
});

test('ElementPropTypes.elementOfType should warn when passing an element of the wrong type', function (assert) {
    var declaration = elementOfType(TestComponent);
    var props = {};
    props[PROP_NAME] = React.createElement(WrongComponent);

    var error = declaration(props, PROP_NAME, HOST_COMPONENT_NAME, PROP_LOCATION);

    assert.true(error instanceof Error, 'should return an Error');
    assert.equal(
        error.message,
        'Invalid prop `testProp` of element type `WrongComponent` supplied to `HostComponent`, ' +
        'expected element of type `TestComponent`.',
        'error message is correct'
    );
    assert.end();
});

test('ElementPropTypes.elementOfType should NOT warn when passing an element of the right type', function (assert) {
    var declaration = elementOfType(TestComponent);
    var props = {};
    props[PROP_NAME] = React.createElement(TestComponent);

    var error = declaration(props, PROP_NAME, HOST_COMPONENT_NAME, PROP_LOCATION);

    assert.equal(error, null, 'should not return an Error');
    assert.end();
});

test('ElementPropTypes.elementOfType support "isRequired" modifier', function (assert) {
    var declaration = elementOfType(TestComponent).isRequired;
    var props = {};
    props[PROP_NAME] = null;

    var error = declaration(props, PROP_NAME, HOST_COMPONENT_NAME, PROP_LOCATION);

    assert.true(error instanceof Error, 'should return an Error');
    assert.equal(
        error.message,
        'The prop `testProp` is marked as required in `HostComponent`, but its value is `null`.',
        'error message is correct'
    );
    assert.end();
});

test('ElementPropTypes.elementOfType should work with React.PropTypes.arrayOf', function (assert) {
    var declaration = React.PropTypes.arrayOf(elementOfType(TestComponent));
    var props = {};
    props[PROP_NAME] = [
        React.createElement(TestComponent),
        React.createElement(WrongComponent)
    ];

    var error = declaration(props, PROP_NAME, HOST_COMPONENT_NAME, PROP_LOCATION);

    assert.true(error instanceof Error, 'should return an Error');
    assert.equal(
        error.message,
        'Invalid prop `testProp[1]` of element type `WrongComponent` supplied to `HostComponent`, ' +
        'expected element of type `TestComponent`.',
        'error message is correct'
    );
    assert.end();
});

test('ElementPropTypes.elementOfType should work with React.PropTypes.oneOfType', function (assert) {
    var declaration = React.PropTypes.oneOfType([
        elementOfType(TestComponent),
        elementOfType(AnotherTestComponent)
    ]);
    var props = {};
    props[PROP_NAME] = React.createElement(WrongComponent);

    var error = declaration(props, PROP_NAME, HOST_COMPONENT_NAME, PROP_LOCATION);

    assert.true(error instanceof Error, 'should return an Error');
    assert.equal(
        error.message,
        'Invalid prop `testProp` supplied to `HostComponent`.',
        'error message is correct'
    );
    assert.end();
});
