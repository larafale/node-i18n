fs  = require('fs')
_   = require('underscore')._

module.exports = function (options) {
  
  var options = _.extend({
      'default'           : 'en'
    , 'enabled'           : ['en']
    , 'dir'               : './assets/private/i18n'
    , 'helper_translate'  : '__'
    , 'helper_path'       : '__p'
    , 'helper_locale'     : '__l'
  }, options)

  options.dir = process.cwd() + '/' + options.dir

  var findLabels = function(word) {
    var labels = []
    while (match = /({{.*?}})/.exec(word)) {
      labels.push(match[1].replace(/{{/, '').replace(/}}/, ''))
      // remove caught variable
      word = word.replace(/{{.*?}}/, '')
    }
    return labels
  }
  
  var i18n = function(){
    
    var self      = this

    this.options  = options
    this.words    = {}
    this.files    = fs.readdirSync(this.options.dir)
    
    this.load = function(){
      _.each(this.files, function(file){
        this.words = _.extend(self.words, require(self.options.dir + '/' + file))
      })
      return this
    }

    this.translateHelper = function(locale){
      return function(key, variables, forcedLocale) {
        return self.translate(forcedLocale || locale, key, variables)
      }
    }

    this.pathHelper = function(locale){
      return function(path, forcedLocale) {
        locale = forcedLocale || locale
        if(locale === self.options.defaults) return path
        return '/' + locale + path
      }
    }
    
    this.route = function(route) {
      return new RegExp("^(\/[a-z]{2})?\/" + (route ? route : ""))
    }

    this.middleware = function(req, res, next){
      matches = /^(\/[a-z]{2}\/?)$|^\/([a-z]{2}\/)?(.*)$/.exec(req.path)
      locale  = matches[1] || matches[2] ? matches[2].replace('/', '') : null

      // remove incorrect explicit locale
      if((locale && !(_.indexOf(self.options.enabled, locale) >= 0)) || locale === self.options.default) return res.redirect(matches[3] || '/')

      locale = locale || self.options.default

      // binding view helpers
      res.locals[self.options['helper_translate']] = self.translateHelper(locale)
      res.locals[self.options['helper_path']] = self.pathHelper(locale)
      res.locals[self.options['helper_locale']] = locale

      next()
    }
      
    this.translate = function(locale, key, variables){

      word = this.words[locale]
      
      if(!word){
        if(!this.words[self.options['default']]) return '' //no definition found for any locale
        else word = this.words[self.options['default']]
      }
      
      keys = key.split(".")
      for(var i=0; i<keys.length; i++){
        tmp = word[keys[i]]
        if(tmp) word = tmp
        else return '' //no definition found for given key
      }

      /* Replace {{labels}} with variables */ 
      if(!_.isEmpty(variables)) {
        labels = findLabels(word)
        _.each(labels, function(label) {
          finder  = new RegExp("{{" + label + "}}")
          word    = word.replace(finder, variables[label])
        })
      }
      
      return word

    }

    return this
    
  }
  
  return new i18n().load()
}