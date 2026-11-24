const fs = require('fs');
let js = fs.readFileSync('js/main.js', 'utf8');

const oldDocSnap = `      const origSnapshot = docRef.onSnapshot ? docRef.onSnapshot.bind(docRef) : null;
      if (origSnapshot) {
        docRef.onSnapshot = function(onNext, onError) {
          recordFsUsage('read', 1);
          return origSnapshot(function(doc) {
            recordFsUsage('read', 1);
            if (typeof onNext === 'function') onNext(doc);
          }, onError);
        };
      }`;

const newDocSnap = `      const origSnapshot = docRef.onSnapshot ? docRef.onSnapshot.bind(docRef) : null;
      if (origSnapshot) {
        docRef.onSnapshot = function(onNext, onError) {
          return origSnapshot(function(doc) {
            recordFsUsage('read', 1);
            if (typeof onNext === 'function') onNext(doc);
          }, onError);
        };
      }`;

if (js.includes(oldDocSnap)) {
  js = js.replace(oldDocSnap, newDocSnap);
  console.log('Fixed double counting on docRef.onSnapshot (LF)');
} else if (js.includes(oldDocSnap.replace(/\n/g, '\r\n'))) {
  js = js.replace(oldDocSnap.replace(/\n/g, '\r\n'), newDocSnap.replace(/\n/g, '\r\n'));
  console.log('Fixed double counting on docRef.onSnapshot (CRLF)');
} else {
  console.log('Pattern not matched');
}

fs.writeFileSync('js/main.js', js, 'utf8');

