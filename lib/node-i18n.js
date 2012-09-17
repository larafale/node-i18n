fs 	= require('fs')
_ 	= require('underscore')._

module.exports = function (options) {
	
	var options = _.extend({
			'locale': 'en'
		,	'dir' : './assets/private/i18n'
	}, options)

	options.dir = process.cwd() + '/' + options.dir

	var findLabels = function(word) {
		var labels = []
		var finder = /({{.*?}})/
		while (match = finder.exec(word)) {
    	var l = match[1];
    	l = l.replace(/{{/, '').replace(/}}/, '')
    	labels.push(l)
    	// remove caught variable
    	word = word.replace(/{{.*?}}/, '')
  	}
  	return labels
	}
	
	var i18n = function(){
		
		this.options 	= options
		this.words 		= {}
		this.files 		= fs.readdirSync(this.options.dir)
		
		this.load = function(){
			self = this
			_.each(this.files, function(file){
				this.words = _.extend(self.words, require(self.options.dir + '/' + file))
			})
			return this
		}

		this.helper = function(locale){
			var self = this
			return function(key, variables, locale) {
				return self.translate(locale, key, variables)
			}
		}

		this.middleware = function(req, res, next){
			matches = /^(\/[a-z]{2}\/?)$|^\/([a-z]{2}\/)?(.*)$/.exec(req.path)
			locale 	= matches[1] || matches[2] ? matches[2].replace('/', '') : null

			// remove incorrect explicit locale
			if((locale && !(_.indexOf(app.locals.langs_front, locale) >= 0)) || locale === 'en') return res.redirect(matches[3] || '/')

	 		res.locals.t = app.locals.i18n.helper(locale || 'en')
			next()
		}
			
		this.translate = function(locale, key, variables){

			word = this.words[locale]
			
			if(!word){
				if(!this.words['en']) return '' //no locale found
				else word = this.words['en']
			}
			
			keys = key.split(".")
			for(var i=0; i<keys.length; i++){
				tmp = word[keys[i]]
				if(tmp) word = tmp
				else return '' //no text found
			}

			/* Replace {{labels}} with variables */ 
			if(!_.isEmpty(variables)) {
				labels = findLabels(word)
				_.each(labels, function(l) {
					var finder = new RegExp("{{" + l + "}}")
					word = word.replace(finder, variables[l])
				})
			}
			
			return word

		}

		return this
		
	}
	
	return new i18n()
}