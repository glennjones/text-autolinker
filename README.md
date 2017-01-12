## text-autolinker
Converts text into HTML, by automatically linking the URLs and twitter elements such as username and hashtags.

 - Twitter `@usersname` and `#hashtags` into  `<a>` links
 - Twitter photo and video links into  `<a>` 
 - URLs into `<a>`
 - Email addresses into `<a href="mailto:">`
 - Natural language dates: `today at 4:15pm` into `<time>`
 - Custom words/term `<a>` linking


## Install

    npm install text-autolinker

    
## Run

1. Move into the project directory `$ cd text-autolinker`
2. Run `$ npm install`
3. Run `$ node bin/text-autolinker.js`
4. Connect to the server using `http://localhost:3007`


## Use

    var autolinker = require('text-autolinker');
    var options = {
      text: 'Meeting @glennjones today at 4:10pm',
      publishedDate: '2014-08-08'
    };
    autolinker.parse(options, function(err, result){
      // do something with data
    });



#### Available options

* `className`
  - `autoLink` - the class for any link added, the default is `auto-link`
  - `url` - the class added any web address links, the default is `u-url`
  - `email` - the class added any web address links, the default is `u-email`
  - `user` - the class added for twitter username links, the default is `h-x-username`
  - `tag` - the class added for tag links, the default is `p-category`
  - `photo` - the class added for twitter photo links, the default is `u-photo`
  - `video` - the class added for twitter video links, the default is `u-video`
  - `date` - the class for any time tag added, the default is `auto-date-discovery dt-start`
* `escapeHtml` - switch to escape the text, default is `true`
* `expandUrls` - switch to expanded any shortened urls, default is `true`
* `urls` - JSON object of terms to link as urls


## Twitter usersname and hashtags parsing
The module will parse  Twitter `@usersname` and `#hashtags` from the text. It wraps these items in `<a>` tags with classes. The text "@glennjones likes #javascript" is parsed into:

    <a class=\"auto-link h-x-username\" href=\"https://twitter.com/glennjones\">&#x40;glennjones</a> likes <a class=\"auto-link p-category\" href=\"https://twitter.com/search?q=#javascript&amp;src=hash\">&#x23;javascript</a>

The parser also provides metadata for usersname and hashtags:

    {
      "html": "<a class=\"auto-link h-x-username\" href=\"https://twitter.com/glennjones\">&#x40;glennjones</a> likes <a class=\"auto-link p-category\" href=\"https://twitter.com/search?q=#javascript&amp;src=hash\">&#x23;javascript</a>",
      "account": [{
        "match": "@glennjones",
        "username": "glennjones",
        "domain": "twitter.com"
      }],
      "category": ["javascript"]
    }
  

## Twitter photo and video link parsing
The module will parse Twitter photo and video links from the text. It wraps these items in `<a>` tags with classes. Where possible the links are expanded. The text "I like pic.twitter.com/FzYI36MKFN and vine.co/v/b55LOA1dgJU" is parsed into:

    I like <a class=\"auto-link u-photo\" href=\"https://twitter.com/adactio/status/501407682558177282/photo/1\">https://twitter.com/adactio/status/501407682558177282/photo/1</a> and <a class=\"auto-link u-video\" href=\"https://vine.co/v/b55LOA1dgJU\">vine.co&#x2f;v&#x2f;b55LOA1dgJU</a>
  
The parser also provides metadata for media types:

    {
      "html": "I like <a class=\"auto-link u-photo\" href=\"https://twitter.com/adactio/status/501407682558177282/photo/1\">https://twitter.com/adactio/status/501407682558177282/photo/1</a> and <a class=\"auto-link u-video\" href=\"https://vine.co/v/b55LOA1dgJU\">vine.co&#x2f;v&#x2f;b55LOA1dgJU</a>",
      "media": [{
        "match": "pic.twitter.com/FzYI36MKFN",
        "type": "image",
        "url": "https://pic.twitter.com/FzYI36MKFN",
        "expanded": "https://twitter.com/adactio/status/501407682558177282/photo/1"
      },{
        "match": "vine.co/v/b55LOA1dgJU",
        "type": "video",
        "url": "https://vine.co/v/b55LOA1dgJU"
     }]
    }


## URL parsing
The module will parse any word that looks like a URL. It wraps these items in `<a>` tags with classes. Where possible the links are expanded. The text "I like http://glennjones.net" is parsed into:

      I like <a class=\"auto-link u-url\" href=\"http://glennjones.net\">http://glennjones.net</a>

The parser also provides metadata for URLs:

    {
      "html": "I like <a class=\"auto-link u-url\" href=\"http://glennjones.net\">http://glennjones.net</a>",
      "url": [{
        "match": "http://glennjones.net",
        "expanded": "http://glennjones.net"
      }]
    }


## Email parsing
The module will parse any word that looks like a email address. It wraps these items in `<a href="mailto:">` tags with classes. The text "Contact me at joe.bloggs@eaxmpla.com" is parsed into:

    Contact me at <a class=\"auto-link u-email\" href=\"mailto:joe.bloggs@eaxmpla.com\">joe.bloggs@eaxmpla.com</a>

The parser also provides metadata for URLs:

    {
      "html": "Contact me at <a class=\"auto-link u-email\" href=\"mailto:joe.bloggs@eaxmpla.com\">joe.bloggs@eaxmpla.com</a>",
      "email": [{
        "address": "joe.bloggs@eaxmpla.com",
        "local": "joe.bloggs",
        "domain": "eaxmpla.com"
      }]
    }
 
## Time parsing
The module will try and parse any time from natural language. Some examples are:

 - 15 May 2014
 - 15th May 2014
 - 14 Jun 2014
 - Aug 17 2014
 - 9 May 2014 at 16:10
 - 9 May 2014 at 4:10pm
 - 4:10pm
 - this Monday
 - yesterday, today, tonight and tomorrow

For this function to work well you need to provide a `publishedDate`. This should be in the ISO format and where possible have the correct timezone information i.e `2014-05-15T04:10:00-04:00`. The parser will add date and time using the HTML5 `<time>` tag:

    <time class=\"auto-date-discovery\" datetime=\"2014-08-08T16:10:00\">today at 4:10pm</time>

The parser also provides metadata for dates:

    {
      "html": "<time class=\"auto-date-discovery dt-start\" datetime=\"2014-08-08T16:10:00\">today at 4:10pm</time>",
      "time": [{
        "start": {
          "year": 2014,
          "month": 7,
          "day": 8,
          "hour": 16,
          "minute": 10,
          "second": 0,
          "meridiem": "pm"
        },
        "startDate": "2014-08-08T15:10:00.000Z",
        "referenceDate": "2014-08-08T23:00:00.000Z",
        "text": "today at 4:10pm"
      }]
    }

## Custom words/term
You can add words/term to the `options.urls` array and have them linked within the HTML output automatically :

    options.urls": [{
      "match": "transmat.io",
      "expanded": "https://transmat.io"
    }]



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



