node-i18n
=========

i18n for node with expressJS

- key => value Style
- Deep file structure
- View helpers

#### Start


```
var i18n_options = {}
var i18n = require('node-i18n')(i18n_options)

app.use(i18n.middleware) //call before app.use(app.router)
```

#### Options (default)

```
{
    default : 'en'
  , enabled : ['en']
  ,	'dir'   : './assets/private/i18n'
  ,	'helper_translate'	: '__'
  ,	'helper_path'		: '__p'
  ,	'helper_locale'		: '__l'
}
```

`dir` is where translation files are stored. Relative to your express application file.  
`helper*` are the avaible function in Jade templates
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
Now this route will match `/products` and `/en/products`  
<br/>
As `en` is set to be the default, when making a request to `/en/products` you will be redirected to `/products`

#### Translation files
Every translation file is JSON and must end with .json  
You can have as many file you want for each locale. This let you seperate content.  
For example : `en.json` `header_en.json` `footer_en.json`  
<br/>
Each file start with the `locale` key.  
You can now write your definition going how deep as you like in objects.

```
{ "en": {

    "baseline" : "Welcome to my site"

  ,  "header": {
      "menu": {
	       "h1" : "Hello {{name}} !"
		 , "h2" : "What's up"
	  }
  }
  
  , "footer": {
      "who": "Who are we ?"
  }
  
}}
```

To make a dynamic definition, put the key of the object you are going to pass later on between double brackets `{{name}}`

#### Jade template

```
p= __('baseline')
p Current locale is #{__l}

div.header
   h1= __('header.menu.h1', { name: 'Batman' })
   h2= __('header.menu.h2')
   
div.footer
   a(href="#{__p('/contact')}")= __('footer.who')
```

`__l` return current locale  
`__p('/contact')` return given path prefixed with locale

<br/><br/>
## Tests


`npm test`