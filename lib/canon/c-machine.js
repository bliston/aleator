var MusicMachine = require('music-machine')
var cGrammar = require('./grammar/c-grammar.js')

// filters to be applied to the machine
var filters = [
  // immediate repetition of 2-group or 3-group patterns  (no 1 2 1 2) (no 1 2 3 1 2 3)
  require('./grammar/pattern-filter.js'),

  // ensures valid melodic outlines (no longer than 5 notes in same direction, do not outline dissonance)
  require('./grammar/melodic-outline-filter.js'),

  // avoids leaping back to the same note after leaving it via a leap (no 1 3 1)
  require('./grammar/no-leap-back-filter.js'),

  // restrict interval quality to Major, minor, or Perfect
  MusicMachine.filter.allowedIntervalQualities('M', 'm', 'P')
]

/**
 * A [MusicMachine]{@link https://github.com/jrleszcz/music-machine/blob/master/api.md#MusicMachine}
 * configured to create guides that generate Cantus Firmi
 *
 * @type {MusicMachine}
 */
var cMachine = new MusicMachine(cGrammar, 'Start')

// apply all filters
filters.forEach(cMachine.addFilter)

module.exports = cMachine
