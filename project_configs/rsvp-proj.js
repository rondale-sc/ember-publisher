/*
 * Using wildcard because RSVP does not currently have a
 * channel system in place.
 */
module.exports = function(revision,tag,date){
  return {
    'rsvp.js':
      { contentType: 'text/javascript',
        destinations: {
          wildcard: [
            'rsvp-latest.js',
            'rsvp-' + revision + '.js'
          ]
        }
      },
    'rsvp.amd.js':
      { contentType: 'text/javascript',
        destinations: {
          wildcard: [
            'rsvp-latest.amd.js',
            'rsvp-' + revision + '.amd.js'
          ]
        }
      }
  }
}
