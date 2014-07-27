var projectFileMap = require("../../project_configs/rsvp-proj");
var assert = require("assert");

describe('rsvp.projectFileMap', function(){
  it('returns appropriate locations for master', function(){
    expectedLocations = [
      'rsvp-latest.js',
      'rsvp-foo-commit.js',
      'rsvp-latest.min.js',
      'rsvp-foo-commit.min.js'
    ];

    var files = projectFileMap('foo-commit', 'foo-tag');
    var uploadFileLocations = [];

    for (var file in files) {
      files[file].destinations.wildcard.forEach(function(destination){
        uploadFileLocations.push(destination);
      });
    }
    assert.deepEqual(expectedLocations, uploadFileLocations);
  });
});
