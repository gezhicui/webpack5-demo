// ./ index.js

import './main.css';
// import './less.less';
import logo from '../public/logo.png';

const a = 'Hello ITEM';
console.log(a);

const img = new Image();
img.src = logo;

document.getElementById('imgBox').appendChild(img);

// 新增装饰器的使用
@log('hi')
class MyClass {}

function log(text) {
  return function (target) {
    target.prototype.logger = () => `${text}，${target.name}`;
  };
}

const test = new MyClass();
console.log(test.logger());
