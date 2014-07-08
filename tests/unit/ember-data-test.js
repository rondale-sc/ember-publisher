var projectFileMap = require("../../project_configs/ember-data-proj");
var assert = require("assert");

describe('ember.projectFileMap', function(){
  it('returns appropriate locations for master', function(){
    var date =  new Date().toISOString().replace(/-/g, '').replace(/T.+/, '');


    expectedLocations = [
      'canary/ember-data.js',
      'canary/daily/' + date + '/ember-data.js',
      'canary/shas/foo-commit/ember-data.js',
      'canary/ember-data.min.js',
      'canary/daily/' + date + '/ember-data.min.js',
      'canary/shas/foo-commit/ember-data.min.js',
      'canary/ember-data.prod.js',
      'canary/daily/' + date + '/ember-data.prod.js',
      'canary/shas/foo-commit/ember-data.prod.js'
    ];

    var files = projectFileMap('foo-commit', 'foo-tag', date);
    var uploadFileLocations = [];

    for (var file in files) {
      files[file].destinations.canary.forEach(function(destination){
        uploadFileLocations.push(destination);
      });
    }
    assert.deepEqual(expectedLocations, uploadFileLocations, "Destinations were not correct.");
  });
})
