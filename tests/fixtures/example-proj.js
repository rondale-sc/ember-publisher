module.exports = function(revision, tag, date) {
  return { 'ember-data.js':
    { contentType: 'text/javascript',
      destinations: {
        canary: [ 'my-bucket-url' ],
        wildcard: [ 'wildcard-url' ]
      }
    }
  };
};
