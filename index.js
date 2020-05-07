

/**
 * 
 * 
 * clear all modules before return
 * local modules
 * 
 * 
 */



 var __lm = require('./local-module');
 
 if(!global.LOCAL_MODULE_CONSTANTS.run){
     global.LOCAL_MODULE_CONSTANTS.run = true;
    __lm.clear();
 };


 module.exports = __lm;