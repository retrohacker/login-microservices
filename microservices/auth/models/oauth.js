var Backbone = require('backbone')

var OAuthModel = module.exports = Backbone.Model.extend({
  validate:function(attr,opts) {
  }
})

OAuthModel.tableName = 'oauth'
OAuthModel.types = {
  oauthid: 'text',
  provider: 'varchar(20)',
  access_token: 'text not null',
  id: 'int references users(id)',
  json: 'text not null'
}
OAuthModel.primary = ['oauthid','provider']
