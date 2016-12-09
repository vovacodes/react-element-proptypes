# react-element-proptypes
React PropTypes for props-elements

## Install

```
npm install --save react-element-proptypes
```

## Usage

```js
const ElementPropTypes = require('react-element-proptypes');

const Modal = ({ header, items }) => (
    <div>
        <div>{header}</div>
        <div>{items}</div>
    </div>
);

Modal.propTypes = {
    header: ElementPropTypes.elementOfType(Header).isRequired,
    items: React.PropTypes.arrayOf(ElementPropTypes.elementOfType(Item))
};

// render Modal
React.render(
    <Modal
       header={<Header title="This is modal" />}
       items={[
           <Item/>,
           <Item/>,
           <Item/>
       ]}
    />,
    rootElement
);
```

## API

### `elementOfType(Component)`

checks the type of a React element


