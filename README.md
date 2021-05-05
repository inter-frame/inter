# Interjs
Inter is a Javascript library designed to build interactive front-end applications.
It's: **simple**, **intuitive** and **powerful**.

# If you know Javascript, you know Inter

````html 
<div id="exemple">
  <p>Hey, { message }</p>
</div> 

````

```javascript
toHTML({
in:"exemple",
data:{
message:"i program in Inter!"
},
react:"change"
})
```

# There is no directives

Directives are good for simple interactivities, but in complex situations
it's weaknesses is obvious, rather than use directives,  *Inter* use just the *Jvascrit*
that you already Know.

```html
<div id="conditional-rendering">
  <p>Hey</p>
</div>
```
```javascript
// A reactive object
const reactive:{
rendered:false
}
Inter.renderIf({
in:"conditional-rendering",
watch:reactive,
conditions:[{
index:0,
render(){
if(reactive.rendered){

return template({
elements:[{
tag:"p", text:"I'm a conditional tag!"
}]
})
}
}
}]
})
```
Go in console and set:

```javascript
reactive.rendered=false;
```

And you'll see the magic!

# Reactivity

*Inter* is super reactive.

# Compatibility

*Inter* just supports the modern browsers, it's mean that no Internet Explorer support.

# Lincense

*Inter* was realede under the MIT LICENSE.

# Guide

To get an in-depth guide just read the official tutorial at [tutorial](http://interjs.epizy.com/v1/tutorial/instalacao)

