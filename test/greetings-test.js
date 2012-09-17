var vows = require('vows')
  , assert = require('assert')
  , i18n = require('../index')({ dir: './test/fixtures'}).load()

vows.describe('Greetings')
  .addBatch({
    'when greeting someone': {
      topic: 'greeting',
      'in English, we say Hello': function(topic) {
        assert.equal(i18n.translate('en', topic), 'Hello')
      },
      'in French, we say Bonjour': function(topic) {
        assert.equal(i18n.translate('fr', topic), 'Bonjour')
      },
      'in the evening': {
        topic: function(sayWhat) { return 'evening.' + sayWhat },
        'in English, we say Good evening': function(topic) {
          assert.equal(i18n.translate('en', topic), 'Good evening')
        },
        'in French, we say Bonsoir': function(topic) {
          assert.equal(i18n.translate('fr', topic), 'Bonsoir')
        }
      }
    }
  })
  .addBatch({
    'when greeting Billy the kid and Calamity Jane': {
      topic: function() {
        this.callback('greetingTwoPeople', {
          person1: 'Billy the kid',
          person2: 'Calamity Jane'
        })
      },
      'in English, we say Hello Billy the kid and Calamity Jane': function(sayWhat, toWho) {
        assert.equal(i18n.translate('en', sayWhat, toWho), 'Hello Billy the kid and Calamity Jane')
      },
      'in French, we say Bonjour Billy the kid et Calamity Jane': function(sayWhat, toWho) {
        assert.equal(i18n.translate('fr', sayWhat, toWho), 'Bonjour Billy the kid et Calamity Jane')
      }
    }
  })
  .export(module)