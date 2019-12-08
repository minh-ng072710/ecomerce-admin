const admin = require('firebase-admin');

let serviceAccount = require('../sdk.json');


let db = admin.firestore();

const util = require('util');
console.log(util.inspect('index.js', { showHidden: false, depth: null }));
module.exports=db
