var vows = require('vows')
  , assert = require('assert')
  , i18n = require('../index')({ dir: './test/fixtures'}).load()

vows.describe('Greetings').addBatch({
  'when greeting someone': {
    topic: 'greeting',
    'in English, we say Hello': function(topic) {
      assert.equal(i18n.setLocale('en').t(topic), 'Hello')
    },
    'in French, we say Bonjour': function(topic) {
      assert.equal(i18n.setLocale('fr').t(topic), 'Bonjour')
    },
    'in the evening': {
      topic: function(sayWhat) { return 'evening.' + sayWhat },
      'in English, we say Good evening': function(topic) {
        assert.equal(i18n.setLocale('en').t(topic), 'Good evening')
      },
      'in French, we say Bonsoir': function(topic) {
        assert.equal(i18n.setLocale('fr').t(topic), 'Bonsoir')
      }
    }
  }
}).export(module)