var test = require('tape')
var Canon = require('../../lib/canon/canon.js')

test('Canon', function (t) {
  var c = new Canon('D minor', 6, 13)

  t.true(c instanceof Canon)
  t.deepEqual(c.c(), [])
  t.throws(function () {
    c.pop()
  }, Error)
  t.deepEqual(c.choices(), ['D'])
  t.false(c.isValid())

  'D4 E4 F4 C4 D4 F4 E4 G4 Bb3 C4 F4 E4 D4'.split(' ').forEach(c.addNote)
  t.deepEqual(c.c(),
    'D4 E4 F4 C4 D4 F4 E4 G4 Bb3 C4 F4 E4 D4'.split(' '))
  t.deepEqual(c.choices(), [])
  t.true(c.isValid())
  t.deepEqual(c.choices(4), [])

  c = new Canon('C major', 10, 16)
  'C4 G4 F4 D5 C5 G4 A4 B4 C5'.split(' ').forEach(c.addNote)
  t.false(c.isValid())

  t.end()
})
