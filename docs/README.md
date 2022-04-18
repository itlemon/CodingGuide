# Hello, 程序员乐源! <Badge text="beta" type="warning"/>

```javascript
module.exports = {
  plugins: ['one-click-copy', {
    copySelector: ['div[class*="language-"] pre', 'div[class*="aside-code"] aside'],
    copyMessage: 'Copied successfully!',
    toolTipMessage: 'Copy to clipboard',
    duration: 2000
  }]
}
```
