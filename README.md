# Ember Publisher

[![Build Status](https://travis-ci.org/rondale-sc/ember-publisher.svg?branch=master)](https://travis-ci.org/rondale-sc/ember-publisher)

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

- `wildcard` - is the fallback channel.  It can be implemented per project or not.  For example, if I wanted to publish any tagged push.  I could implement a wildcard entry inside destinations ( should be empty by default ) and merge in s3 bucket urls if a tag is present.  Then when no branch is found the wildcard would be used which would (in this case) contain the tag s3 buck urls.  You can see an example of this inside ember.js' project config.

# Assumptions

You _MUST_ have the following defined in your environment to execute publishing correctly:

- `S3_BUCKET_NAME`
- `TRAVIS_BRANCH`
- `TRAVIS_TAG`
- `TRAVIS_COMMIT`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`

The `TRAVIS` prefixed variables are set by travis-ci by default so you shouldn't worry about those unless you are running locally.

# Constructor

`project` - this is the word that when suffixed with `proj.js` points to a file in `project_configs`.  (ie `ember` would yield `project_configs/ember-proj.js`.

`projectConfigPath` - It is now possible to specify the absolute path of your project's config by setting setting `projectConfigPath`.  This will take precedence above the `project` property (see above)

In the above case, if the current branch is master then it will utilize the wildcard destinations.  The `no-op` branch is to ensure that it doesn't default to the `wildcard` branch.

# Channels

Currently the supported channels are as follows

(branch/channel)
- master -> canary
- beta -> beta
- stable -> release
- release -> release

## Utilize wildcard set of destinations

Override channels by overriding the currenBranch function on your instance of publisher.  Like so:

```js
  publisher.currentBranch = function() {
    return (TRAVIS_BRANCH === 'master') ? 'wildcard' : 'no-op';
  };
```

