/*
 * Most of this code is copy-pasted from facebook/react (https://github.com/facebook/react)
 * The only "creative" part is "createElementTypeChecker" function that actually does the check
 */

var ANONYMOUS = '<<anonymous>>';

var ReactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context'
};

var ElementPropTypes = {
    /**
     * Checks the type of the element
     */
    elementOfType: createElementTypeChecker
};

// Use the same implementation of PropTypeError as in React
function PropTypeError(message) {
    this.message = message;
    this.stack = '';
}
// Make `instanceof Error` still work for returned errors.
PropTypeError.prototype = Error.prototype;

function getDisplayName(Component) {

    return Component.displayName
        || Component.name
        || (typeof Component === 'string' ? Component : 'Component');
}

function createChainableTypeChecker(validate) {
    function checkType(
        isRequired,
        props,
        propName,
        componentName,
        location,
        propFullName
    ) {
        componentName = componentName || ANONYMOUS;
        propFullName = propFullName || propName;
        if (props[propName] == null) {
            var locationName = ReactPropTypeLocationNames[location];
            if (isRequired) {
                if (props[propName] === null) {
                    return new PropTypeError(
                        'The ' + locationName + ' \`' + propFullName + '\` is marked as required ' +
                        'in \`' + componentName + '\`, but its value is \`null\`.'
                    );
                }
                return new PropTypeError(
                    'The ' + locationName + ' \`' + propFullName + '\` is marked as required in ' +
                    '\`' + componentName + '\`, but its value is \`undefined\`.'
                );
            }
            return null;
        } else {
            return validate(props, propName, componentName, location, propFullName);
        }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
}

function createElementTypeChecker(ExpectedElementType) {
    function validate(props, propName, componentName, location, propFullName) {
        var prop = props[propName];
        if (prop && prop.type !== ExpectedElementType) {
            var locationName = ReactPropTypeLocationNames[location];
            var expectedElementTypeName = getDisplayName(ExpectedElementType);

            if (!prop.type) {
                return new PropTypeError(
                    'Invalid ' + locationName + ' \`' + propFullName + '\` with value ' +
                    '\`' + JSON.stringify(prop) + '\` supplied to \`' + componentName + '\`, expected ' +
                    'element of type \`' + expectedElementTypeName + '\`.'
                );
            }

            var actualElementTypeName = getDisplayName(prop.type);

            return new PropTypeError(
                'Invalid ' + locationName + ' \`' + propFullName + '\` of element type ' +
                '\`' + actualElementTypeName + '\` supplied to \`' + componentName + '\`, expected ' +
                'element of type \`' + expectedElementTypeName + '\`.'
            );
        }
        return null;
    }
    return createChainableTypeChecker(validate);
}

module.exports = ElementPropTypes;
