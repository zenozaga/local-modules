/**
 * 
 * 
 * @module utility.js
 * 
 * 
 * many utilities 
 */



 
/**
 * @function type
 * @param {*} value 
 * 
 * return typeof
 * 
 */

module.exports.typeOf = function typeOf(value) {

    var type = typeof value;
    var str = new String(value);

    try {

        type = value.constructor.toString().substring(value.constructor.toString().indexOf(' '), value.constructor.toString().indexOf('()')).trim().toLowerCase();

    } catch (e) {


        if (type == "object") {

            if (str.indexOf('[object Object]') > -1) type = "object";
            if (str.indexOf('[object Promise]') > -1) type = "promise";
            type = "array";
            if (value == null) type = 'null';

        };


    }


    return type;

}


/**
 * @function WaitForResponse
 * @param {*} unknown_content
 * 
 * wait for any return
 *  
 */

module.exports.WaitForResponse = function (unknown_content) {

    var this_ = this;
    var type_content = typeOf(unknown_content);;


    return new Promise(function (resolve) {


        if (type_content == "function") {
            

            var result = unknown_content(this_);

            WaitForResponse(result).then(function (response) {
                resolve(response);
            });

        } else if (type_content == "promise") {

            unknown_content.then(resolve);

        } else if (type_content == "object") {


            if ( unknown_content.content && typeof(unknown_content.content) == "function" ) {

                WaitForResponse(unknown_content.content).then(function (response) {

                    resolve(response);

                });

            }else{

                resolve(unknown_content);

            };


        } else {


            resolve(unknown_content);

        };

    });
}

/**
 * 
 * @function ObjectToString
 * 
 * 
 * convert object to string
 * 
 */

module.exports.ObjectToString =  function ObjectToString(obj) {
                
    var this_ = this;
    var string = [];
 
    if (typeof (obj) == "object" && (obj.join == undefined)) {
        string.push("{");
        for (prop in obj) {
            string.push(prop, ": ", ObjectToString(obj[prop]), ",");
        };
        string.push("}");

        //is array
    } else if (typeof (obj) == "object" && !(obj.join == undefined)) {
        string.push("[")
        for (prop in obj) {
            string.push( ObjectToString(obj[prop]), ",");
        }
        string.push("]")

        //is function
    } else if (typeof (obj) == "function") {
        string.push(obj.toString())

        //all other values can be done with JSON.stringify
    } else {
        string.push(JSON.stringify(obj))
    }

    return string.join("").trim().replace(/\[native code\]/g, '');
}


/**
 * 
 * @function slugify
 * 
 * conver string to slug string
 * 
 */

module.exports.slugify = function  slugify(text) {
    return text
      .toString()                     // Cast to string
      .toLowerCase()                  // Convert the string to lowercase letters
      .normalize('NFD')       // The normalize() method returns the Unicode Normalization Form of a given string.
      .trim()                         // Remove whitespace from both sides of a string
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-');        // Replace multiple - with single -
};