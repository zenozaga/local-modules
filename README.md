# @zenozaga/local-modules
![Build Status][build-image]

##### Register modules, functions and objects locally for use anywhere via aliases


> I'm new to this, so hello everyone.
> I have created this package for personal use. If this can help you in something, I will be happy if I did something wrong > I will be happy to help me solve it and learn.
> Thank you.
> 


### Usage Examples
##### Register a function without execute

```js

const localModules = require("@zenozaga/local-modules");

//To register a function you need to add the name $Export
localModules.register('@randomNumber',function $Export( length ){

    if(!length) length = 10;

    var numbers = "0123456789";
    var array_numbers = numbers.split("");
    var returner = "";

    for( var t = length; t > 0; t--){

        var rand_index = Math.floor(Math.random() * array_numbers.length)
        returner += array_numbers[rand_index];

    }

    return returner;

});

// random numbers
console.log(localModules.require('@randomNumber')(15));

```


##### Register an Object or Array
```js

const localModules = require("@zenozaga/local-modules");

// register object
localModules.register('@configuration',{

    port: 8080,
    host: "example.com",
    getSize: function(size){

        return size * 24;
    }

});


// get object
var config = localModules.require('@configuration');


// use
console.log(`
  Host: ${config.host},
  Port: ${config.port},
`);

console.log("Size: ",config.getSize(10));


 // Output


/*

Host: example.com,
Port: 8080,

Size:  240

 */


```


##### Register a module function
```js

const localModules = require("@zenozaga/local-modules");

// register a source module
localModules.register('@Helpers',function(){

    const fs = require('path');


    module.exports.isString = function (str){

        return ( str && str.constructor == String ) || false;

    };


    module.exports.isFunction = function(fn){

        return ( fn && fn.constructor == Function ) || false;

    };

    module.exports.path_join = function ( path1, path2){
        
        return path.join(path1,path2);

    };


    

});


// get module
var Helpers = localModules.require('@Helpers');

// string validation
console.log( "valdiate:string ", Helpers.isString("hello"));
console.log( "valdiate:string ", Helpers.isString(13434));

//function validation

function functionExample (){

};

console.log('\n')
console.log( "valdiate:function ",  Helpers.isFunction(13434) );
console.log( "valdiate:function ", Helpers.isFunction( functionExample ) );


//join path
console.log('\n')
console.log( Helpers.path_join(__dirname, "example.js") );


 // Output


/*

valdiate:string  true
valdiate:string  false


valdiate:function  false
valdiate:function  true

[path joined]

 */

```
##### Register a custom module file

moduleExample.js
```js
const fs = require('fs');

function FileExist(path_file){

    return fs.existsSync(path_file);

};

module.exports = FileExist;
```

index.js
```js

const localModules = require("@zenozaga/local-modules");
const path = require("path");

// register a custom module
localModules.register('@moduleExample',  path.join( __dirname, './moduleExample') );


// get module
var moduleExample = localModules.require('@moduleExample');

console.log( "File exist" , moduleExample(  path.join(__dirname, "file_is_no_exist.js")  ));
console.log( "File exist" , moduleExample( __filename ));

 // Output


/*

File exist false
File exist true

 */

```

##### Register a remote string source module using [axios](https://www.npmjs.com/package/axios)

remote file moduleExample.js
```js
const fs = require('fs');

function FileExist(path_file){
    return fs.existsSync(path_file);
};

module.exports = FileExist;
```

index.js
```js

const axios = require("axios");
const localModules = require("@zenozaga/local-modules");

(async function(){

	const  { data } = await axios.get("http://example.com/moduleExample.js");
	ocalModules.register( '@moduleExample' , data );

	const moduleExample = localModules.require("@moduleExample");

	console.log( "File exist" , moduleExample(  path.join(__dirname, "file_is_no_exist.js")  ));
	console.log( "File exist" , moduleExample( __filename ));


	// Output
	/*
		File exist false
		File exist true
	 */


})();

```

[build-image]: https://img.shields.io/badge/build-passing-brightgreen
 
