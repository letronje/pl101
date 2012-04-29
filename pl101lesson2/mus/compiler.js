var _compile = function(expr, time, notes){
  var pitchToMidi = {
    a4 : 69,
    b4 : 71,
    c4 : 60,
    d4 : 62
  }
  
  if(expr.tag == 'note'){
    notes.push({tag: 'note', 
                pitch: pitchToMidi[expr.pitch], 
                start: time, 
                dur: expr.dur});
    return time + expr.dur;
  }
  else if(expr.tag == 'rest') {
    return time + expr.dur;
  }
  else if(expr.tag == 'par') {
    var lt = _compile(expr.left, time, notes);
    var rt = _compile(expr.right, time, notes);
    return Math.max(lt, rt);
  }
  else if(expr.tag == 'seq') {
    var lt = _compile(expr.left, time, notes);
    var rt = _compile(expr.right, lt, notes);
    return rt;
  }
  else if (expr.tag == 'repeat') {
    var count = expr.count;
    var repeatExpr = expr.section;
    var t = time;
    for (var i=1; i<=count; i++) {
      t = _compile(repeatExpr, t, notes);
    }
    return t;
  }
};

var compile = function (musexpr) {
  var notes = [];
  _compile(musexpr, 0, notes);
  return notes;
};

var melody_mus = { 
  tag: 'seq',
  left: { 
    tag: 'seq',
    left: { tag: 'note', pitch: 'a4', dur: 250 },
    right: { tag: 'note', pitch: 'b4', dur: 250 }
  },
  right: { 
    tag: 'seq',
    left: { tag: 'note', pitch: 'c4', dur: 500 },
    right: { tag: 'note', pitch: 'd4', dur: 500 } 
  } 
};

var repeated_melody_mus = { 
  tag: 'repeat',
  section: melody_mus,
  count: 2
};

console.log(melody_mus);
console.log(compile(melody_mus));

console.log ("\n")
console.log(repeated_melody_mus);
console.log(compile(repeated_melody_mus));
