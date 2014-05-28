Ad Explorer (AX)
=========

A simple mobile web app for showing ads and folders. **Beware** - this is not a "real life" application, it's just an exercise. The data in the app is purely fictional.


  - Features a RESTful server side application written in PHP
  - An HTML5/JavaScript client application for Android and iOS mobile devies
  - MySQL database
  - Backend integration with the CodeIgniter PHP framework



Usage
----

To run the client app, simply open: *http://konverzija.com/ad-explorer/client* with your mobile device or an emulator.
The client will fetch the data by default from the test server.

API URIs
----

 - */api/items* - get all the items in the root folder
 - */api/items/2* - get the item with the item_id 2
 - */api/items/2/children* - get all the children of an item (a folder in this case)

When GETting the item children, you can also use a couple of extra parameters:

 - ?format=json (supported are json, xml, jsonp, serialized, php, html and csv. Default is json)
 - ?order_by=your_mysql_field&order_direction=DESC (supported are all the fields in the tables, check the SQL for more info)

Why I chose this design is documented at the end of this file.


Requirements (server side)
----

If you want to install your own server side application then you will need **PHP 5.2+** and **MySQL**. Not sure if it will work on anything else than **Apache**. But you can try :)


Installation - setting up your own server side API
----

Go to /sql and import the file import.sql. 

The server side code resides in /application. Head over to /application/config and extract database.php.zip. Open it and set your database username and password.

If everything went as planned you should be able to get the RESTful API running at this point. Just type into your browser window http://you-server.com/api/items . The API should return a bunch of JSON objects containing the files in the root folder.

** *Please note**, if you have mod_rewrite installed and running, then your API URIs are going to be without index.php (/api/items). Otherwise, your RESTful URIs will be something like /index.php/api/items .

If you want the client to load the data from your own server side API, change the property AX.config.base_url in /client/js/src/ax.js .

That's it :)


What's with all these folders in /application?
----

Yes, CodeIgniter (as any serious framework), creates a lot of files. Just to make things easier for the reviewer, I will pinpoint the main files where our own logic resides in:

Controllers: 

 - /application/controllers/api/items.php 
(The main Controller class for the items API)

 - /application/core/MY_REST_Controller.php 
(Items extends this class, which features a couple of overrides from the REST Controller which it extends)

 - /application/libraries/REST_Controller.php 
(REST Controller - A library for RESTful requests - made by Phil Sturgeon and Chris Kacerguis)


Models:

 - /application/models/items_mdl


And... ... ... that's it basically :) simple stuff.


External libraries and frameworks
=========

Server side
----

The heart of the project is the **CodeIgniter 2.1.4 PHP framework**.  

https://github.com/EllisLab/CodeIgniter/

Another very important piece of the puzzle is the **REST Server plugin for CodeIgniter** by Phil Sturgeon and Chris Kacerguis. It handles everything, from authentication (albeit turned off in this exercise), to autoloading and formating of output data. You can find it here:

https://github.com/philsturgeon/codeigniter-restserver/


Client side
----

For the client app, only jQuery 2.1.1. was used. Everything else is hand made, with love <3.


Tests
=========

To run a couple of automated tests on the server app, open the url /api/items/test. The test code resides in the Items Controller. I used CodeIgniters native testing library.

The frontend client has been tested on Samsung Galaxy S3, Samsung Galaxy mini and in Xcodes iPhone and iPad emulator. I sure would wish to have more devices with me, but alas it is what it is... 


Choices
=========

**Why did I choose PHP and CodeIgniter as my main server side language/framework?**

 - I have been working with PHP for the last 7 years. Any other solution would mean I would have to learn a whole new language and/or concept. There was absolutely not enough time to do that.
 - CI has been my framework of choice for the last 4 years, therefore development time was small and I got the code out pretty fast.
 - CI is fairly lightweight and is among the fastest PHP frameworks around. Not THE fastest, but usually in the top 5 according to some blog posts.
 - It has been around since 2006 and has strong community support. This framework has been plenty battle tested and survived.
 - It also features a bunch of libraries which make your life a lot easier (the testing class for example).
 - The MVC design pattern I find to be meaningful and intuitive, the code is clean and organized.

If this was a real life application with high traffic and longer development time, would I choose something else? Perhaps! I have not delved into nodeJS yet but I hear good things, especially for creating high volume aps which use a lot of JavaScript on the client side. This would be an attractive option but I would need to give it more thought and study time.

**Why did I choose a MySQL database?**

To be fair I did think about setting up a NoSQL database (UnQLite or MongoDB) because my first plan was to have all the data in one table therefore no joins would be needed. This also posed as a good opportunity to learn something new. In the end though I wanted to create a more flexible data-model, so I broke it up into more tables. Also, I wanted the application to scale more easily (content, not performance wise).

Another deciding factor was the hosting provider for the test app - only MySQL and PHP were possible. Sure, I could try to find some other hosting god-knows-where, but time is of the essence here and in the end I went the KISS route.


**Why did I choose a RESTful architectural style?**

REST does not contain an additional messaging layer, it is clean and perfect for JavaScript client side scripts (JSON!). It makes sense to use this style for mobile apps since data size should be as small as possible (no SOAP envelope to wrap every call in, like with SOAP). It is based on normal HTTP requests (GET = retrive, DELETE = remove, etc...) which enables intent to be inferred from the type of request being made.

**How did I choose the URI design?**

Well, here I had some thinking to do since there are multiple ways of doing this. By default the REST Controller wanted me to implement something like this:

*/api/items/item-id/4/action/children*

Something like an associative array if you wish. This seemed way to cumberstone for me so I decided on a design that would be hackable upwards. In the end we are dealing with folders so every time I remove the last part of the URI it should take me one step up the tree. This seemed logical in the end.

The end result is a URI design like:

 - */api/items/2/children* - the children of item with id 2. Children deeper in the tree have the same URI (except the id part of course)

 - */api/items/2* - remove the children and you get the parent info.

 - */api/items* - remove the id and you arrive at the root folder.

One option was to keep adding the ids as we move deeper into the structure, but I decided it would be too complicated and ugly to have something like this:

 - */api/items/21/40/62/34/children*

I could go either way and in the end I chose the simplest design.
