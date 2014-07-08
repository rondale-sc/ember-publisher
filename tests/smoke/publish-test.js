var path      = require('path');
var Publisher = require('../../index.js');
var assert    = require('assert');

describe('S3Publisher.publish', function(){

  it('publishes!', function(){
    publisher = new Publisher({
      S3_BUCKET_NAME: 'myBucket',
      TRAVIS_BRANCH: 'master',
      TRAVIS_TAG: 'foo-tag',
      TRAVIS_COMMIT: 'foo-commit',
      S3_SECRET_ACCESS_KEY: 's3-secret-access-key',
      S3_ACCESS_KEY_ID: 's3-access-key',
      project: 'example'
    });

    publisher.s3 = {
      putObject: function(){
        arg = arguments[0]
        assert.equal(arg.Body.toString(),'foo\n');
        assert.equal(arg.Bucket, 'myBucket');
        assert.equal(arg.ContentType, 'text/javascript');
        assert.equal(arg.Key, 'my-bucket-url');
      }
    }

    var superUploader = publisher.uploader;
    publisher.uploader = function(){
      var startDir = process.cwd()
      process.chdir(path.join(startDir, 'tests', 'fixtures'));
      superUploader.apply(this, arguments);
      process.chdir(startDir);
    }

    publisher.publish()
  });

  it('publishes from wildcard when branch is not available', function(){
    publisher = new Publisher({
      S3_BUCKET_NAME: 'myBucket',
      TRAVIS_BRANCH: 'not-a-defined-branch',
      TRAVIS_TAG: 'foo-tag',
      TRAVIS_COMMIT: 'foo-commit',
      S3_SECRET_ACCESS_KEY: 's3-secret-access-key',
      S3_ACCESS_KEY_ID: 's3-access-key',
      project: 'example'
    });

    publisher.s3 = {
      putObject: function(){
        arg = arguments[0]
        assert.equal(arg.Body.toString(),'foo\n');
        assert.equal(arg.Bucket, 'myBucket');
        assert.equal(arg.ContentType, 'text/javascript');
        assert.equal(arg.Key, 'wildcard-url');
      }
    }

    var superUploader = publisher.uploader;
    publisher.uploader = function(){
      var startDir = process.cwd()
      process.chdir(path.join(startDir, 'tests', 'fixtures'));
      superUploader.apply(this, arguments);
      process.chdir(startDir);
    }

    publisher.publish()
  });
});
