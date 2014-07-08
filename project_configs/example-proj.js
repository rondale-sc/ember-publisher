module.exports = function() {
  return { 'ember.js':
    { contentType: 'text/javascript',
      destinations: {
        canary: [ 'my-bucket-url' ],
        wildcard: [ 'wildcard-url' ]
      }
    }
  };
};
