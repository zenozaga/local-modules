/**
 * 
 * 
 * @module local-module.js
 * 
 * 
 * 
 * 
 */


 var Aliases = require( './models/aliases');
 var path = require("path");
 var aliasControl = new Aliases();

 if(!global.LOCAL_MODULE_CONSTANTS) global.LOCAL_MODULE_CONSTANTS = {
     run:false
 };


 module.exports = {
     
    register(alias, resource){
        return aliasControl.add(alias, resource);
    },

    remove(alias){

       return aliasControl.remove(alias);

    },

    clear(){

        return aliasControl.clear();

    },

    all(){

        var file =  aliasControl.File();
        return Object.keys(file);

    },

    
    exist(alias){

        var file =  aliasControl.File();
        

        return file[alias] ? true : false

    },

    require (alias){

        return aliasControl.require(alias);

    }


};