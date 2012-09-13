var vows = require('vows')
	,	assert = require('assert')
	,	i18n = require('../index')({ dir: './test/fixtures'}).load()

vows.describe('Translate constants').addBatch({
  'when saying hello': {
    topic: 'hello',

    'in English, we get Hello': function(topic) {
      assert.equal(i18n.setLocale('en').t('hello'), 'Hello')
    },

    'in French, we get Bonjour': function(topic) {
      assert.equal(i18n.setLocale('fr').t('hello'), 'Bonjour')
    }
  }
}).export(module)