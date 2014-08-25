## text-autolinker
Converts text into HTML, by automatically linking the URLs and twitter elements such as username and hashtags.



## Install

    npm install text-autolinker

    
## Run

1. Move into the project directory `$ cd text-autolinker`
2. Run `$ npm install`
3. Run `$ node bin/text-autolinker.js`
4. Connect to the server using `http://localhost:3007`




#### Available options

* `className`
  - `autoLink` - the class for any link added, the default is `auto-link`
  - `user` - the class added for twitter username links, the default is `h-x-username`
  - `tag` - the class added for tag links, the default is `p-category`
  - `photo` - the class added for twitter photo links, the default is `u-photo`
  - `url` - the class added any web address links, the default is `u-url`
* `escapeHtml` - switch to escape the text, default is `true`

 


## Errors

The error format can have any combination of 4 properties; code, error, message and validation. The fourth property validation, is added if a input value is in the incorrect format. 
    
    {
      "statusCode": 400,
  		"error": "Bad Request",
  		"message": "the value of b must be a number",
  		"validation": {
    		"source": "path",
    		"keys": [
      		"b"
    		]
  		}
	}



## Mocha integration test
The project has a number integration and unit tests. To run the test, `cd` to project directory type the following command

    $ mocha --reporter list




