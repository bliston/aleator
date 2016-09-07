var createCguide = require('./create-c-guide.js')
var Pitch = require('nmusic').Pitch
var intervalSize = require('nmusic').intervalSize
var sortPitches = require('../utils/sort-pitches.js')

var MIN_C_LENGTH = 8     // minimum length of a canon
var MAX_C_LENGTH = 16    // maximum length of a canon

/**
 * @typedef {string} PitchString - a string consisting of a music Letter [A-G], optional accidental,
 *                                 and optional octave number
 * @example
 * 'C4'     // middle C on a piano, the fourth octave
 * 'Eb3'    // Eb in octave 3
 * 'F#'     // no octave number provided, a pitch class
 * 'F##'    // F double sharp
 * 'Dbb'    // D double flat
 */

/**
 * @typedef {string} KeyString - a string consisting of a {@link PitchString} and a mode name
 *                               seperated by whitespace
 * @example
 * 'Eb major'
 * 'C minor'
 * 'F# dorian'
 */

/**
 * create a CantusFirmus that follows the rules of species counterpoint
 *
 * @constructor
 *
 * @param {KeyString} [key='C major'] - the key of this c
 * @param {number} [maxRange=10] - the max range this machine will allow
 * @param {number} [maxLength=16] - the maxLength of this machine
 */
var Canon = function (key, maxRange, maxLength) {
  key = key || 'C major'        // key of the c
  maxRange = maxRange || 10     // max range of c
  maxLength = maxLength || 16   // max length of c

  var guide = createCguide(key, maxRange, maxLength)

  /**
   * get the current canon
   * @returns {PitchString[]} an array of pitch strings
   */
  this.c = function () {
    return guide.construction()
  }

  /**
   * adds the given pitch to the canon
   * @param {PitchString} pitch - a pitch string in the current set of {@link CantusFirmus#nextNoteChoices}
   * @throws throws an error if given pitch is not in the
   *      current set of {@link CantusFirmus#nextNoteChoices}
   */
  this.addNote = function (pitch) {
    guide.choose(pitch)
  }

  /**
   * pop the last note choice off the canon
   * @throws throws an error if called when canon is empty
   * @returns {PitchString} the last pitch string of the canon
   * submitted through {@link CantusFirmus#addNote}
   */
  this.pop = function () {
    return guide.pop()
  }

  /**
   * @typedef {object} TreeNode
   * @property {PitchString} val - a pitch string
   * @property {TreeNode[]} next - a list of TreeNodes this node links to
   */

  /**
   * returns an array of all possible next pitches, or an array of
   * nDeep [TreeNodes]{@link TreeNode}.
   *
   * @param {number} [nDeep=1] - will search for nDeep possible choices
   * @returns {PitchString[]|TreeNode[]} if nDeep=1, an array of pitch strings, else
   * an array of nDeep {@link TreeNodes}
   */
  this.choices = function (nDeep) {
    return guide.choices(nDeep || 1)
  }

  /**
   * is the current canon a complete and valid canon?
   * @returns {boolean} is the current canon a complete and valid canon?
   */
  this.isValid = function () {
    var c = this.c()

    // is it long enough
    if (c.length < MIN_C_LENGTH || c.length > MAX_C_LENGTH) {
      return false
    }

    // is last note tonic?
    if (Pitch(c[c.length - 1]).pitchClass() !== guide.tonic()) {
      return false
    } else if (Pitch(c[0]).pitchClass() === guide.tonic()) {
      // if first note is tonic, last note should end in the same octave
      // if first note is not tonic, this is probably a first species counterpoint
      if (c[0] !== c[c.length - 1]) {
        return false
      }
    }

    // is the penultimate note scale degree 2 or possible 7?
    if (intervalSize(c[c.length - 2], c[c.length - 1]) !== 2) {
      return false
    }

    // is there a unique climax (highest note is not repeated)?
    var sorted = sortPitches(c)
    if (sorted[sorted.length - 1] === sorted[sorted.length - 2]) {
      return false
    }

    return true
  }
}

module.exports = Canon
