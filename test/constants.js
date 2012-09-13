var vows = require('vows'),
		assert = require('assert')

vows.describe('Translate constants').addBatch({
  'when saying hello in French': {
    topic: 'Bonjour',

    'we get Bonjour': function (topic) {
      assert.equal(topic, 'Bonjour')
    }
  }
}).export(module)