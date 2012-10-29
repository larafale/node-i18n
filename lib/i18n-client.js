var i18nClient = function(options) {
  
  var options = _.extend({
      'default' : 'en'
    , 'locale'  : 'en'
    , 'enabled' : ['en', 'fr', 'es']
  }, options)

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
    this.files    = []
    
    this.load = function(){

      $.getJSON('/i18n.json?locale='+this.options.locale, function(data){
        _.each(data.results, function(result) {
          resultLocale = _.keys(result)[0]
          self.words[resultLocale] = _.extend(self.words[resultLocale] || {}, result[resultLocale])
        })
      })

      return this
    }

      
    this.translate = function(locale, key, variables){

      if(typeof(variables) === 'string') {
        locale    = variables
        variables = {}
      }
      
      var word = this.words[locale]
        , keys = key.split(".")
      
      //no dictionnary found
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
      _.each(findLabels(word), function(label) { word  = word.replace(new RegExp("{{" + label + "}}"), variables[label]) })

      return word

    }
      

    this.__ = function(key, variables, locale) {
      if(typeof(variables) === 'string') locale = variables
      return self.translate(local || self.options.locale, key, variables)
    }

    return this
    
  }
  
  return new i18n().load()
}