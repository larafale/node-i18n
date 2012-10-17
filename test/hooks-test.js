var vows = require('vows')
  , assert = require('assert')
  , i18n = require('../index')({ dir: './test/fixtures'}).load()

vows.describe('Hooks')
  .addBatch({
    'Test': {
      topic: true,
      'in English': function() {
        assert.equal(i18n.translate('en', 'hooks', { link: '<a href="">$link</a>' }), 'Click on <a href="">me</a>')
      },
      'in French': function() {
        assert.equal(i18n.translate('fr', 'hooks', { link: '<a href="">$link</a>' }), 'Click sur <a href="">moi</a>')
      }
    }
  })
  .export(module)