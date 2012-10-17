node-i18n
=========

i18n for node with expressJS

- key => value Style
- Deep file structure
- View helpers

## Start


```
var i18n_options = {}
var i18n = require('node-i18n')(i18n_options)

app.use(i18n.middleware) //call before app.use(app.router)
```

## Options (default)

```
{
    default             : 'en'
  , enabled             : ['en']
  , dir                 : './assets/private/i18n'
  , helper_translate    : '__'
  , helper_path         : '__p'
  , helper_locale       : '__l'
}
```

`dir` is where translation files are stored. Relative to your express application file.  
`helper*` are the avaible function in Jade templates
<br/>

## Express route

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

## Translation files
Every translation file is JSON and must end with .json  
You can have as many files as you want for each locale. This let you seperate content.  
For example : `en.json` `header_en.json` `footer_en.json`  
<br/>
Each file start with the `locale` key.  
You can now write your definition going how deep as you like in objects.

```
{ "en": {

  "baseline": "Welcome to my site",

  "header"  : {
    "menu"  : {
      "h1"  : "Hello {{name}} !",
      "h2"  : "What's up"
    }
  },
  
  "footer"  : {
    "who"   : "Who are we ?",
    "info"  : "Contact us by clicking {{{link|on this text}}}"
  }
  
}}
```

## Labels & Hooks

**Labels** are variables that you pass to your text definition and are defined in double brackets : `"Hello {{name}} !"`  
If you call `__('header.menu.h1', { name: 'Batman' })` you'll get `Hello Batman`

<br>
**Hooks** are like labels except the value passed is defined in the dictionnary. This let you **wrap** the value.  
Imagine you need to include a link in your dictionnary, you could define it like so :

```
//dictionnary
{ "en": {
	"key" : "click on <a href='/url'>this link</a>"
}}
```

The disadvantage of this is that you write html in your dictionnary and you don't have control of the `<a/>` tag in your template. This is where you want to use hooks :

```
//dictionnary
{ "en": {
	"key" : "click on {{{link|this link}}}"	
}}
```

Hooks use 3 brackets, the first paramater `link` is the key that will match with the object that you pass in the template and is separated with `|` with the second parameter wich is the translated text that you will call later on in your template like `$link`.  
<br>On your template you can now write :

```
__('key', { link: '<a href="/url">$link</a>' })
```

Notice that `$link` refer to the translated text on the `link` key. You just need to add `$`  
You will get the following :

`"click on <a href="/url">this link</a>"`

Don't forget to unescape it in your jade as it's html


## Jade template

```
p= __('baseline')
p Current locale is #{__l}

div.header
   h1= __('header.menu.h1', { name: 'Batman' })
   h2= __('header.menu.h2')
   
div.footer
   a(href="#{__p('/contact')}")= __('footer.who')

   - var info = __('footer.info', { link: '<a href="mailto:mail@me.fr">$link</a>' })
   p !{info}
```

`__l` return current locale  
`__p('/contact')` return given path prefixed with locale

<br/><br/>
## Tests


`npm test`