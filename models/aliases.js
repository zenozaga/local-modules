/**
 * 
 * @class Aliases
 * 
 *  add, edit, get or remove aliases
 * 
 */


// import modules
const fs = require('fs');
const path = require('path');

const {
    ObjectToString,
    typeOf,
    slugify
} = require('./../helpers/utility');


// cosntantes
const data_path = __dirname + "/../data";
const aliases_file_path = data_path + "/aliases.json";
const modules_files_path = __dirname + '/../modules'


class Aliases {

    static file_load;

    /**
     * @function File
     * 
     * get json aliases file
     * 
     */

    File() {

        if (this.file_load) return this.file_load;

        var returner = this.file_load;

        if (!fs.existsSync(aliases_file_path)) {

            fs.writeFileSync(aliases_file_path, '{}');
            returner = {};

        } else {

            returner = require(aliases_file_path);

        };

        this.file_load = returner;
        return this.file_load;

    }


    /**
     * @method add
     * @param {*} alias 
     * @param {*} handlerModuleOrsource 
     * 
     * add an alias to object
     * 
     */

    add(alias, handlerModuleOrsource) {

        if (!handlerModuleOrsource) throw new Error("Expected 2 arguments, but got 1");

        var $this = this;
        var file = this.File();

        var source = handlerModuleOrsource;
        var type = typeOf(handlerModuleOrsource);


        // validation
        if (alias && alias.constructor != String) throw Error("alias must be a String subtype");



        if (type == "function") {

            source = source.toString();



        } else if (type == "object" || type == "array") {

            source = ObjectToString(handlerModuleOrsource);

        } else if (type == "string") {

            
 
             if (path.isAbsolute(handlerModuleOrsource)) {


                try {

                    var module_path = path.resolve(handlerModuleOrsource);

                    require(module_path);
                    type = "require";
                    source = `require("${module_path.replace(/\\/g,"/")}")`;


                } catch (error) {

                    eval(handlerModuleOrsource);
                    source = `(function(){
                        ${handlerModuleOrsource};
                    })();`;                    

                };



            } else {

                try {

                    eval(handlerModuleOrsource);
                    source = `(function(){
                        ${handlerModuleOrsource};
                    })();`;

                } catch (error) {

                }

            }




        };


        var file_path = this.createFile(alias, `(function(){ return ${source}; })()`);

        file[alias] = {
            type: type,
            path: file_path
        };

        return $this.save();

    }


    /**
     * @method remove
     * @param {*} alias 
     * 
     * remove alias from alaise file
     * 
     */

    remove(alias) {

        var file = this.File();

        if (file[alias]) {
            delete file[alias];
        };


        this.save();
        this.removeFile(alias);

        return true;

    }








    /**
     * 
     * 
     * @method require
     * 
     * require local module
     * 
     * 
     */

    require(alias) {

        var file = this.File();
        var info = file[alias];

        if (info) {

            var source = this.getFile(alias);

            if (source) {



                if (info.type == "require") {

                    return eval(source.toString());

                } else if (info.type == "function") {

                    var fn = eval(source.toString());

                    if (fn) {

                        if (fn.name && fn.name.indexOf('$Export') == 0) {

                            return fn;

                        } else {

                            try {

                                var value = fn();
                                return fn ? value : module.exports;

                            } catch (error) {
                                

                                if (error.message && error.message.indexOf('Class constructor') == 0) {

                                    return fn;

                                };

                            };


                        };

                    };


                } else if (info.type == "object" || info.type == "array") {

                    return eval(source.toString());

                } else if (info.type == "string") {

                    var module__ = eval(source.toString());
                    return module__ ? module__ : module.exports;


                }


            };

        };


        throw Error('Local Module not found');


    }



    /**
     * @method createFile
     * @param {*} filename 
     * @param {*} source 
     * 
     * create file for regitered alias
     * 
     */

    createFile(filename, source) {

        var file_name = slugify(filename) + ".module";
        var file_path = modules_files_path + '/' + file_name;

        fs.writeFileSync(file_path, source);

        return fs.writeFileSync(file_path, source) ? file_path : null;

    }


    /**
     * @method removeFile
     * @param {*} filename 
     * 
     * 
     * remove file for regitered alias
     * 
     */

    removeFile(filename) {

        var file_name = slugify(filename) + ".module";
        var file_path = modules_files_path + '/' + file_name;

        if (fs.existsSync(file_path)) fs.unlinkSync(file_path);

        return file_path;

    }


    /**
     * @method getFile
     * @param {*} filename 
     * 
     * 
     * get file for registered alias
     * 
     */

    getFile(filename) {

        var file_name = slugify(filename) + ".module";
        var file_path = modules_files_path + '/' + file_name;
        if (fs.existsSync(file_path)) return fs.readFileSync(file_path);

        return null;

    }




    /**
     * 
     * @method save
     * 
     * save file source
     * 
     */

    save() {

        return fs.writeFileSync(aliases_file_path, JSON.stringify(this.file_load));

    }


    /**
     * 
     * @method clear
     * 
     * remove all alias from aliases file
     */

    clear() {

        var file = this.File();

        for (const alias in file) {
            this.removeFile(alias);
        };

        this.file_load = {};
        this.save();
    }



}



module.exports = Aliases;