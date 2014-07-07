# Ember Publisher

This is a micro-lib designed to help unify s3 publishing for Ember and related Ember projects.

Each project using Ember Publisher needs a file in `project_configs` that gives information about how it'll be published to S3.  That project file needs to export a function that returns an object that looks like this:

```js
{ 'ember.js':
  { contentType: 'text/javascript',
    destinations: {
      canary: [ 'my-bucket-url' ]  //list of urls you'd like to publish to canary
    }
  }
};
```

Each key should be the name of the file in the `dist` folder of the project.  `destinations` should contain a key for each channel you'd like to publish to whose value is an array of bucket urls.  See `project_configs/ember-proj.js` for more details.


# Assumptions

You _MUST_ have the following defined in your environment to execute publishing correctly:

- `S3_BUCKET_NAME`
- `TRAVIS_BRANCH`
- `TRAVIS_TAG`
- `TRAVIS_COMMIT`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- `project` - this is the word that when suffixed with `proj.js` points to a file in `project_configs`.  (ie `ember` would yield `project_configs/ember-proj.js`.

The `TRAVIS` prefixed variables are set by travis-ci by default so you shouldn't worry about those unless you are running locally.

# Channels

Currently the supported channels are as follows

(branch/channel)
- master -> canary
- beta -> beta
- stable -> release
- release -> release
