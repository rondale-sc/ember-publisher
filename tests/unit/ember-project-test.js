var projectFileMap = require("../../project_configs/ember-proj");
var assert = require("assert");

describe('ember.projectFileMap', function(){
  var date =  new Date().toISOString().replace(/-/g, '').replace(/T.+/, '');
  it('returns appropriate locations for master', function(){
    expectedLocations = [
      'ember-latest.js',
      'latest/ember.js',
      'canary/ember.js',
      'canary/daily/' + date + '/ember.js',
      'canary/shas/foo-commit/ember.js',
      'tags/foo-tag/ember.js',
      'ember-test-latest.js',
      'latest/ember-test.js',
      'canary/ember-test.js',
      'canary/daily/' + date + '/ember-test.js',
      'canary/shas/foo-commit/ember-test.js',
      'tags/foo-tag/ember-test.js',
      'ember-template-compiler-latest.js',
      'latest/ember-template-compiler.js',
      'canary/ember-template-compiler.js',
      'canary/daily/' + date + '/ember-template-compiler.js',
      'canary/shas/foo-commit/ember-template-compiler.js',
      'tags/foo-tag/ember-template-compiler.js',
      'ember-runtime-latest.js',
      'latest/ember-runtime.js',
      'canary/ember-runtime.js',
      'canary/daily/' + date + '/ember-runtime.js',
      'canary/shas/foo-commit/ember-runtime.js',
      'tags/foo-tag/ember-runtime.js',
      'ember.min-latest.js',
      'latest/ember.min.js',
      'canary/ember.min.js',
      'canary/daily/' + date + '/ember.min.js',
      'canary/shas/foo-commit/ember.min.js',
      'tags/foo-tag/ember.min.js',
      'ember.prod-latest.js',
      'latest/ember.prod.js',
      'canary/ember.prod.js',
      'canary/daily/' + date +  '/ember.prod.js',
      'canary/shas/foo-commit/ember.prod.js',
      'tags/foo-tag/ember.prod.js',
      'ember-docs-latest.json',
      'latest/ember-docs.json',
      'canary/ember-docs.json',
      'canary/daily/' + date +  '/ember-docs.json',
      'canary/shas/foo-commit/ember-docs.json',
      'tags/foo-tag/ember-docs.json' ];

    var files = projectFileMap('foo-commit', 'foo-tag', date);
    var uploadFileLocations = [];

    for (var file in files) {
      files[file].destinations.canary.forEach(function(destination){
        uploadFileLocations.push(destination);
      });
    }
    assert.deepEqual(expectedLocations, uploadFileLocations, "Destinations were not correct.");
  });

  it('when tag is present wildcard section has appropriate tag url', function(){
    var files = projectFileMap('foo-commit', 'foo-tag', date);
    var uploadFileLocations = [];
    var expectedLocations = [
      'tags/foo-tag/ember.js',
      'tags/foo-tag/ember-test.js',
      'tags/foo-tag/ember-template-compiler.js',
      'tags/foo-tag/ember-runtime.js',
      'tags/foo-tag/ember.min.js',
      'tags/foo-tag/ember.prod.js',
      'tags/foo-tag/ember-docs.json' ];

    for (var file in files) {
      files[file].destinations.wildcard.forEach(function(destination){
        uploadFileLocations.push(destination);
      });
    }

    assert.deepEqual(expectedLocations, uploadFileLocations, "Destinations were not correct.");
  });
})
