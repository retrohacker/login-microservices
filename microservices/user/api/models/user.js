var Backbone = require('backbone')

var UserModel = module.exports = Backbone.Model.extend({
  validate:function(attributes,options){
    if(attributes.id && (typeof attributes.id != 'number' || attributes.id < 0))
      return 'expected number for id'
    if(typeof attributes.firstname != 'string')
      return 'expected string for firstname'
    if(typeof attributes.lastname != 'string')
      return 'expected string for lastname'
    if(attributes.email) {
      if(typeof attributes.email != 'string')
        return 'expected string for email'
      var re = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
      if(!attributes.email.match(re))
        return 'email not valid error'
    }
  },
  isLoggedIn: function() {
    return this.attributes.id != null
  },
  hasUniversity: function() {
    return this.attributes.university != null
  }
});

UserModel.tableName = "users"
UserModel.types = {
  id: 'serial',
  firstname: 'varchar (50) not null',
  lastname: 'varchar(50) not null',
  email: 'varchar(254) unique'
}
UserModel.primary = ['id']
