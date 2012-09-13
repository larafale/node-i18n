fs 	= require('fs')
_ 	= require('underscore')._

module.exports = function (options) {
	
	var options = _.extend({
			'lang': 'fr'
		,	'dir' : process.cwd() + '/assets/private/i18n'
	}, options)
	
	var i18n = function(){
		
		this.options 	= options
		this.words 		= {}
		this.files 		= fs.readdirSync(this.options.dir)
		
		this.setLocale = function(){
			e
		}
		
		this.load = function(){
			self = this
			_.each(this.files, function(file){
				this.words = _.extend(self.words, require(self.options.dir + '/' + file))
			})
			return this
		}
		
		this.setLocale = function(lang){
			this.options.lang = lang
		}
			
		this.t = function(key, lang){
			
			word = ''
			
			if(!this.words[lang ? lang : this.options.lang]){
				if(!this.words['en']) return '' //no lang found
				else word = this.words['en']
			}else{
				word = this.words[lang ? lang : this.options.lang]
			}
			
			keys = key.split(".")
			for(var i=0; i<keys.length; i++){
				tmp = word[keys[i]]
				if(tmp) word = tmp
				else return '' //no text found
			}
			
			return word

		}
		
	}
	
	return new i18n()
}