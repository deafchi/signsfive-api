// for authentication
var jwt = require('express-jwt');
var jwksRsa = require('jwks-rsa');
var config  = require('../config');

var authz = expectedScopes => {
  expectedScopes = expectedScopes || '';
  if (!Array.isArray(expectedScopes)) expectedScopes = expectedScopes.split(' ').filter(scope=>scope);

  return function(req, res, next) {
    if (expectedScopes.length === 0) return next();
    if (!req.user || typeof req.user.scope !== 'string') return res.send(401, {error: 'Not logged in.'});
    var scopes = req.user.scope.split(' ');
    var allowed = expectedScopes.some(scope => {return scopes.indexOf(scope) !== -1;});

    return allowed ? next() : res.send(401, {error: 'Insufficient scope.'});
  }
};

var jwtCheck = jwt({
  // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint
  secret: jwksRsa.expressJwtSecret(config.jwks),
  // Validate the audience and the issuer
  audience: 'https://api.signsfive.com/',
  issuer: 'https://signsfive-api.auth0.com/',
  algorithms: [ 'RS256' ]
});

module.exports.authz = authz;
module.exports.jwtCheck = jwtCheck;