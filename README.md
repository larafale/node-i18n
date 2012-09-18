node-i18n
=========

i18n for node with expressJS

```
var i18n = require('node-i18n')({
    default : 'en'
  , enabled : ['en', 'fr']
  ,	'dir'   : './assets/private/i18n'
  ,	'helper_translate'	: '__'
})

app.use(i18n.middleware)

//call before app.use(app.router)

```

`dir` start on the same level as your express application file  
<br/>

#### Express route

let's say you have a route `/products` where you want to implement i18n  
Before implementing i18n your route would have look like so :

```
app.get('/products', function(req, res){
	res.end()
})
```
After

```
app.get(i18n.route('products'), function(req, res){
	res.end()
})
```
Note that the argument that `i18n.route()` takes is a `RegExp`, and we ommitted the `/` before `products`  
<br/>
Now `/products`, `/en/products` and `/fr/products` will match the route  
<br/>
As `en` is set to be the default, when making a request to `/en/products` you will be redirected to `/products`

#### exemple of en.json

```
{ "en": {

    "baseline" : "Welcome to my site"

  ,  "header": {
      "menu": {
	       "h1" : "Hello {{person}} !"
		 , "h2" : "What's up"
	  }
  }
  
  , "footer": {
      "who": "Who are we ?"
  }
  
}}
```

#### Jade template

```
p __('baseline')

div.header
   h1= __('header.menu.h1', 'Batman')
   h2= __('header.menu.h2')
   
div.footer
   a(href="#") __('footer.who')

```


## Tests


`npm test`