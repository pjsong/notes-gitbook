# reactjs

## getStarted

<https://reactjs.org/tutorial/tutorial.html>

基于javascript, 更纯，更灵活。

## Create React App

+ `npm install -g create-react-app`, `create-react-app myapp`, `cd myapp && npm start`, `npm run build`输出到build文件夹

## 组件

### React.Component

组件告诉React提交的内容。当数据有更改，react负责更新和提交。
组件带有属性参数props，通过render方法返回视图的描述，也就是`react element`。JSX句法可以简化写法。
JSX内可以写javascript表达式，可以赋给变量，或者方法间传递，是一个javascript对象。

```javascript
class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
      </div>
    );
  }
}
//等价
return React.createElement('div', {className: 'shopping-list'},
  React.createElement('h1', /* ... h1 children ... */)
);
```