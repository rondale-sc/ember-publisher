var Publisher = require('../../index.js');
var setOption = require('../../index.js').setOption;
var assert    = require('assert');

describe('S3Publisher', function(){
  describe('setOption', function(){
    it('sets passed in option', function(){
      var dummyObj = {};
      setOption(dummyObj, {'foo': 'bar' }, 'foo');
      assert.equal(dummyObj.foo, 'bar');
    });

    it('allows the specifying of an alias name', function(){
      var dummyObj = {};
      setOption(dummyObj, {'foo': 'bar' }, 'foo', 'aliasName');
      assert.equal(dummyObj.aliasName, 'bar');
    });
  });

  describe('constructor', function(){
    it('has the correct default options', function(){
      var defaultOptions = {
        S3_BUCKET_NAME: 'myBucket',
        TRAVIS_BRANCH: 'master',
        TRAVIS_TAG: 'foo-tag',
        TRAVIS_COMMIT: 'foo-commit',
        S3_SECRET_ACCESS_KEY: 's3-secret-access-key',
        S3_ACCESS_KEY_ID: 's3-access-key',
        project: 'ember'
      }

      publisher = new Publisher(defaultOptions);
      assert(publisher.hasOwnProperty('S3_BUCKET_NAME'));
      assert(publisher.hasOwnProperty('CURRENT_BRANCH'));
      assert(publisher.hasOwnProperty('TAG'));
      assert(publisher.hasOwnProperty('CURRENT_REVISION'));
      assert(publisher.hasOwnProperty('S3_SECRET_ACCESS_KEY'));
      assert(publisher.hasOwnProperty('S3_ACCESS_KEY_ID'));
    });

    describe("required options", function() {
      var defaultOptions;
      beforeEach(function(){
        defaultOptions = {
          S3_BUCKET_NAME: 'Present',
          S3_SECRET_ACCESS_KEY: 'Present',
          S3_ACCESS_KEY_ID: "Present",
          project: 'ember'
        }
      })

      it('errors when S3_BUCKET_NAME is absent', function(){
        defaultOptions.S3_BUCKET_NAME = undefined;
        assert.throws(function(){ new Publisher(defaultOptions) }, /No AWS credentials exist./)
      });

      it('errors when S3_SECRET_ACCESS_KEY is absent', function(){
        defaultOptions.S3_SECRET_ACCESS_KEY = undefined;
        assert.throws(function(){ new Publisher(defaultOptions) }, /No AWS credentials exist./)
      });

      it('errors when S3_ACCESS_KEY_ID is absent', function(){
        defaultOptions.S3_ACCESS_KEY_ID = undefined;
        assert.throws(function(){ new Publisher(defaultOptions) }, /No AWS credentials exist./)
      });

      it('errors when project is absent from options', function(){
        defaultOptions.project = undefined;
        assert.throws(function(){ new Publisher(defaultOptions); }, /must specify a project config/)
      });

      it('errors when projectPath does not exist', function(){
        defaultOptions.project = 'non-existent-project-config';
        assert.throws(function() { new Publisher(defaultOptions) }, /path isn't available/);
      });
    });
  });
});
