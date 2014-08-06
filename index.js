/* global process, module */
var fs   = require('fs');
var path = require('path');
var AWS  = require('aws-sdk');
var date =  new Date().toISOString().replace(/-/g, '').replace(/T.+/, '');

function S3Publisher(options){
  options = options || {};

  if(!options.projectConfigPath && !options.project) {
    throw new Error("You must specify a project config to use!");
  }

  var projectPath = options.projectConfigPath || path.join(__dirname, "project_configs", options.project + "-proj.js");

  if(!fs.existsSync(projectPath)) {
    throw new Error("Your specified project path isn't available");
  }

  this.projectFileMap = require(projectPath);

  setOption(this, options, 'S3_BUCKET_NAME');
  setOption(this, options, 'TRAVIS_BRANCH', 'CURRENT_BRANCH');
  setOption(this, options, 'TRAVIS_TAG', 'TAG');
  setOption(this, options, 'TRAVIS_COMMIT', 'CURRENT_REVISION');
  setOption(this, options, 'S3_ACCESS_KEY_ID');
  setOption(this, options, 'S3_SECRET_ACCESS_KEY');

  if (!this.S3_BUCKET_NAME || !this.S3_ACCESS_KEY_ID || !this.S3_SECRET_ACCESS_KEY) {
    throw new Error('No AWS credentials exist.');
  }

  AWS.config.update({accessKeyId: this.S3_ACCESS_KEY_ID, secretAccessKey: this.S3_SECRET_ACCESS_KEY});
  this.s3 = new AWS.S3();
}

S3Publisher.prototype.uploadFile = function(data, type, destination, callback) {
  console.log("Destination: " + destination);

  this.s3.putObject({
    Body: data,
    Bucket: this.S3_BUCKET_NAME,
    ContentType: type,
    ACL: 'public-read',
    Key: destination
  }, callback);
};

S3Publisher.prototype.currentBranch = function(){
  return {
    "master": "canary",
    "beta": "beta",
    "stable": "release",
    "release": "release"
  }[this.CURRENT_BRANCH] || process.env.BUILD_TYPE;
};

S3Publisher.prototype.uploader = function(destination, file, files) {
  function finished(err,result) { if(err) { throw new Error("Upload failed with error: " + err); } }
  var filePath = path.join(process.cwd(), "dist", file);

  if(!fs.existsSync(filePath)) {
    throw new Error("FilePath: '" + filePath + "' doesn't exist!");
  }
  filePath = fs.realpathSync(filePath);

  var data = fs.readFileSync(filePath);
  this.uploadFile(data, files[file].contentType, destination, finished);
}

S3Publisher.prototype.publish  = function() {
  try {
    var files = this.projectFileMap(this.CURRENT_REVISION, this.TAG, date);

    for(var file in files) {
      var localDests = files[file].destinations[this.currentBranch() || 'wildcard'];

      if(!localDests) { throw new Error(this.currentBranch() + ': is not a supported branch and no wildcard entry has been specified') }
      if(!localDests.length) { throw new Error('There are no locations for this branch') };

      localDests.forEach(function(destination) { this.uploader(destination, file, files); }.bind(this));
    }
  } catch (err) {
    exitGracefully(err);
  }
};

function setOption(object, options, defaultPropName, setPropName){
  if(!setPropName) { setPropName = defaultPropName};

  if (options.hasOwnProperty(defaultPropName)) {
    object[setPropName] = options[defaultPropName];
  } else {
    object[setPropName] = process.env[defaultPropName];
  }
};

function exitGracefully(err) {
  console.log(err);
  process.exit(1);
};

module.exports = S3Publisher;
module.exports.setOption = setOption;
