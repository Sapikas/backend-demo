const AccessControl = require("accesscontrol");
const ac = new AccessControl();
 
exports.roles = (function() {
ac.grant("user")
 .readOwn(['profile'])
 .updateOwn(['profile'])
 .deleteOwn(['profile'])
 .readAny(['dietAgency'])
 
ac.grant('supervisor')
 .extend('user')
 .createOwn(['diets'])
 .readOwn(['diets'])
 .deleteOwn(['diets'])
 .updateOwn(['diets'])
 
ac.grant('admin')
 .extend('user')
 .extend('supervisor')
 .updateOwn(['dietAgency'])
 .deleteOwn(['dietAgency'])

ac.grant('superAdmin')
  .extend("user")
  .extend("supervisor")
  .extend('admin')
  .readAny(['profile'])
  .updateAny(['profile'])
  .deleteAny(['profile'])
 
return ac;
})();