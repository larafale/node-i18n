fs  = require('fs')
_   = require('underscore')._

module.exports = function (options) {
  
  var options = _.extend({
      'default'             : 'en'
    , 'enabled'             : ['en']
    , 'dir'                 : './assets/private/i18n'
    , 'helper_translate'    : '__'
    , 'helper_path'         : '__p'
    , 'helper_path_current' : '__c'
    , 'helper_locale'       : '__l'
  }, options)

  options.dir = process.cwd() + '/' + options.dir

  var findLabels = function(word) {
    var labels   = []
    while (match = /({{.*?}})/.exec(word)) {
      labels.push(match[1].replace(/{{/, '').replace(/}}/, ''))
      word = word.replace(/{{.*?}}/, '')
    }
    return labels
  }

  var findHooks  = function(word) {
    var hooks    = []
    while (match = /({{{.*?}}})/.exec(word)) {
      hooks.push((match[1].replace(/{{{/, '').replace(/}}}/, '')).split('|'))
      word = word.replace(/{{{.*?}}}/, '')
    }
    return hooks
  }
  
  var i18n = function(){
    
    var self      = this
    this.options  = options
    this.words    = {}
    this.files    = fs.readdirSync(this.options.dir)

    this.locales = function() { return self.options.enabled }
    
    this.load = function(){
      _.each(this.files, function(file){
        fileContents = require(self.options.dir + '/' + file)
        fileLocale = _.keys(fileContents)[0]
        self.words[fileLocale] = _.extend(self.words[fileLocale] || {}, fileContents[fileLocale])
      })
      return this
    }

    this.translateHelper = function(current){
      return function(key, variables, force) {
        return self.translate(force || current, key, variables)
      }
    }

    this.pathHelper = function(current){
      return function(path, force) {
        var locale = force || current || self.options.default
          , reg = new RegExp("^\/("+self.options.enabled.join("|")+")\/?.*$")

        if(reg.test(path)) path = path.substring(3)
        return (locale === self.options.default) ? path : '/' + locale + path
      }
    }
  
    this.pathCurrentHelper = function(path) {
      return function(locale) {
        var current = path.replace(new RegExp("^(\/("+self.options.enabled.join("|")+"))?", "i"), '');
        if(locale!=undefined)
          locale = locale.replace(/\//, '');
          var langIndex = self.options.enabled.indexOf(locale);
          if(langIndex>=0&&self.options.default!=locale)
            current = '/' + self.options.enabled[langIndex] + current;
        return current;
      };
    };

    this.route = function(route) {
      return new RegExp("^(\/("+self.options.enabled.join("|")+"))?\/?" + (route ? route : "") + "\/?$", "i");
    }

    this.rootRegex = new RegExp("^\/$|^\/("+self.options.enabled.join("|")+")?\/?$")

    this.middleware = function(req, res, next){
      var reg     = new RegExp("^\/("+self.options.enabled.join("|")+")\/?.*$")
        , match   = reg.exec(req.path)
        , locale  = match ? match[1] : self.options.default

      // binding view helpers in jade for current res
      res.locals[self.options['helper_translate']]    = self.translateHelper(locale);
      res.locals[self.options['helper_path']]         = self.pathHelper(locale);
      res.locals[self.options['helper_path_current']] = self.pathCurrentHelper(req.path);
      res.locals[self.options['helper_locale']]       = locale;
      next()
    }
      
    this.translate = function(locale, key, variables){

      if(typeof(variables) === 'string') {
        locale = variables
        variables = {}
      }
      
      var word = this.words[locale]
        , keys = key.split(".")
      
      if(!word && !(word = this.words[self.options['default']])) return key
      
      //finding key in dictionnary
      for(var i=0; i<keys.length; i++){
        if(word[keys[i]]) word = word[keys[i]]
        else return key
      }

      if(_.isEmpty(variables)) return word

      //replace hooks
      _.each(findHooks(word), function(hook) {
        text = variables[hook[0]] ? variables[hook[0]].replace(new RegExp("\\$" + hook[0]), hook[1]) : ''
        word = word.replace(new RegExp("{{{"+hook[0]+"\\|.*?}}}"), text)
      })
    
      //replace labels
      _.each(findLabels(word), function(label) { word = word.replace(new RegExp("{{" + label + "}}"), variables[label]) })

      return word

    }

    return this
    
  }
  
  return new i18n().load()
}
