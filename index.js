/* global process, module */
var fs   = require('fs');
var path = require('path');
var AWS  = require('aws-sdk');
var date =  new Date().toISOString().replace(/-/g, '').replace(/T.+/, '');

function S3Publisher(options){
  options = options || {};

  setOption(this, options, 'S3_BUCKET_NAME');
  setOption(this, options, 'TRAVIS_BRANCH', 'CURRENT_BRANCH');
  setOption(this, options, 'TRAVIS_TAG', 'TAG');
  setOption(this, options, 'TRAVIS_COMMIT', 'CURRENT_REVISION');
  setOption(this, options, 'S3_ACCESS_KEY_ID');
  setOption(this, options, 'S3_SECRET_ACCESS_KEY');

  if(!options.project) {
    throw new Error("You must specify a project config to use!");
  }
  var projectPath = "./project_configs/" + options.project + "-proj.js";
  if(!fs.existsSync(projectPath)) {
    throw new Error("Your specified project path isn't available");
  }
  this.projectFileMap = require(projectPath);

  if (!this.S3_BUCKET_NAME || !this.S3_ACCESS_KEY_ID || !this.S3_SECRET_ACCESS_KEY) {
    throw new Error('No AWS credentials exist.');
  }

  AWS.config.update({accessKeyId: this.S3_ACCESS_KEY_ID, secretAccessKey: this.S3_SECRET_ACCESS_KEY});
  this.s3 = new AWS.S3();
}

function setOption(object, options, defaultPropName, setPropName){
  if(!setPropName) { setPropName = defaultPropName};

  if (options.hasOwnProperty(defaultPropName)) {
    object[setPropName] = options[defaultPropName];
  } else {
    object[setPropName] = process.env[defaultPropName];
  }
};

S3Publisher.prototype.uploadFile = function(data, type, destination, callback) {
  console.log("Type: " + type);
  console.log("Destination: " + destination);

  this.s3.putObject({
    Body: data,
    Bucket: this.S3_BUCKET_NAME,
    ContentType: type,
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

S3Publisher.prototype.publish  = function() {
  var files = this.projectFileMap(this.CURRENT_REVISION, this.TAG, date);

  function finished(err,result) { if(err) { throw Error("Upload failed with error: " + err); } }

  var uploader = function(destination) {
    var filePath = path.join(process.cwd(), "dist", file);

      if(!fs.existsSync(filePath)) {
        throw new Error("FilePath: '" + filePath + "' doesn't exist!");
      }
      filePath = fs.realpathSync(filePath);

      var data = fs.readFileSync(filePath);
      this.uploadFile(data, files[file].contentType, destination, finished);
    }.bind(this);

  for(var file in files) {
    var localDests = files[file].destinations[this.currentBranch()]
    if(localDests.length <= 0) { throw Error("There are no locations for this branch") };

    localDests.forEach(uploader);
  }
};

module.exports = S3Publisher;
module.exports.setOption = setOption;
