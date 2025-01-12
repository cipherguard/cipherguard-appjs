steal.config({
  main: 'cipherguard',
  map: {
    "jquery/jquery": "jquery",
    "urijs": "node_modules/urijs/src"
  },
  paths: {
    "can": "node_modules/can/can.js",
    "can/*": "node_modules/can/*.js",
    "jquery": "node_modules/jquery/dist/jquery.js",
    "moment": "node_modules/moment/moment.js",
    "moment-timezone-with-data": "node_modules/moment-timezone/builds/moment-timezone-with-data.js",
    "sha1": "node_modules/jssha/src/sha.js",
    "underscore": "node_modules/underscore/underscore.js",
    "xregexp": "node_modules/xregexp/xregexp-all.js",
    "cipherguard-mad": "node_modules/cipherguard-mad/cipherguard-mad.js",
    "cipherguard-mad/*": "node_modules/cipherguard-mad/*.js"
  },
  "meta": {
    "mocha": {
      "format": "global",
      "exports": "mocha",
      "deps": [
        "steal-mocha/add-dom"
      ]
    }
  },
  ext: {
    "ejs": "cipherguard-mad/lib/can/viewEjsSystem"
  }
});
System.config({
  buildConfig: {
    map: {
      "can/util/util": "can/util/domless/domless"
    }
  }
});
