for key, val of require './src/aurora'
    exports[key] = val
  
// Requiring on servers without soundcard can lead to errors
//require './src/devices/node-speaker'
