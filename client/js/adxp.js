
// create the app namespace/object
var ADXP = {

    // config object - here we could also store the urls for the ajax requests if needed
    config: {
        base_url: "/api/",
        response_format: "json",
        date_format: "%m/%d/%Y %H:%i"
    },


    // holds the data for the current state
    call_stack: new Array({
        id: 0,
        title: ""
    }),


    // the default event handlers
    event_handlers: {

        onListTouch: function(event) {

            // find item 
            var counter = 0,
                stop = false,
                $event_items = $(event.target),
                $list_item;
            
            // go max 8 levels deep and find the LI (it has the id of the item) 
            // the counter limit is implemented in case of errors, the loop doesn't go on forever
            while (!stop && counter < 8) {

                if ($event_items.prop('tagName') == "LI") {
                    $list_item = $event_items;
                    stop = true;
                }
                
                else
                    $event_items = $($event_items[0].parentElement);
                
                counter++;
            } 
            
            // add data to the call stack
            ADXP.call_stack.push({
                id: parseInt($list_item.attr("id")), 
                title: $list_item.find(".title").first().html()}
            );

            // if item is an ad, follow the url
            if ($list_item.attr("data-type") == "ad") {

                var url = $list_item.attr("data-url");

                if (url !== undefined)
                    window.location = url;
                else
                    alert("This item has a missing url!");

            }

            // load folder children and set current folder title
            else {
                console.log(ADXP.call_stack[ADXP.call_stack.length-1]);
                $("#back-button").html(" .. / "+ADXP.call_stack[ADXP.call_stack.length-1].title);
                
                ADXP.getData(
                    ADXP.config.base_url+"items/"+$list_item.attr("id")+"/children", 
                    {}, 
                    ADXP.buildList
                );
            }

        },

        // when the user presses the back button, load the previous list children
        onBack: function() {
            
            // remove last array item from the call stack
            ADXP.call_stack.pop();
            
            // get index of last element
            var index = ADXP.call_stack.length-1; 
            
            var title = ADXP.call_stack[index].title;
            
            // show parent folder title
            if (title != "")
                $("#back-button").html(" .. / "+title);
            
            // don't show parent folder title if we are in the root
            else
                $("#back-button").html("");
            
            ADXP.getData(
                ADXP.config.base_url+"items/"+ADXP.call_stack[index].id+"/children", 
                {}, 
                ADXP.buildList
            );
        },

        // when the user presses the refresh button, load the current list children
        onRefresh: function() {
            ADXP.getData(
                ADXP.config.base_url+"items/"+ADXP.call_stack[ADXP.call_stack.length-1].id+"/children", 
                {}, 
                ADXP.buildList
            );
        },

        // when a new list is built, this handler is called
        onListBuilt: function() {

            // slightly animate the list
            $("#items").fadeIn();

            // show/hide back button
            if (ADXP.call_stack[ADXP.call_stack.length-1].id !== 0)
                $("#back-button").show();

            else
                $("#back-button").hide();


        },

        onBeforeAjaxRequest: function() {
            // show the load screen
            $("#load-screen").fadeIn();
        },

        onAfterAjaxRequest: function() {
            // hide the load screen
            $("#load-screen").hide();
        }

    },


    buildList: function(json_data) {
    
        // hide the list so we can fadein later
        $("#items").hide();

        // clear the old list
        $("#items").children().remove("li");

        // get item template so we have to acces it only once, saving on time
        var templates = {
            folder: $("#items-template li.folder").first(),
            file: $("#items-template li.file").first()
        };

        for (var i = 0; i < json_data.length; i++) {

            var data = json_data[i];

            // generate new item from template
            var $new_item = $(templates[data.type].clone());
            
            $new_item.attr({
                "id": data.item_id,
                "data-type": data.type,
                "data-url": data.url
            });
            
            $new_item.find(".title").html(data.title);
            $new_item.find(".date").html(data.last_update_formated);
            $new_item.find(".format").html(data.ad_type);

            $("#items").append($new_item);

        }

        // fire the event, signaling the build process is done
        $.event.trigger("listBuilt");

    },



    // wrapper function for ajax GET requests
    getData: function(url, data, successCallback, errorCallback) {
  
        $.event.trigger("beforeAjaxRequest");

        // set the default format
        data = (data === undefined ? {} : data);
        data.format = (data.format !== undefined ? data.format : ADXP.config.response_format);
        data.date_format = (data.date_format !== undefined ? data.date_format : ADXP.config.date_format);


        $.ajax({
            url: url,
            type: "GET",
            data: data,
            success: function(response) {

                $.event.trigger("afterAjaxRequest");

                if (response.error !== undefined && errorCallback !== undefined)
                    errorCallback(response);

                else if (response.error !== undefined)
                    alert(response.error);

                else if (successCallback !== undefined)
                    successCallback(response);

            },

            error: function(xhr, status, error_thrown) {
                $.event.trigger("afterAjaxRequest");
                alert(error_thrown);
            }
        });

    }
};



// the constructor - kicks things off
(function() {
   
   /*
    *  register events
    */
   
   // our default event for when a new list is built
   $(document).on("listBuilt", ADXP.event_handlers.onListBuilt);
   
   // before an ajax request
   $(document).on("beforeAjaxRequest", ADXP.event_handlers.onBeforeAjaxRequest);
   
   // after ajax request
   $(document).on("afterAjaxRequest", ADXP.event_handlers.onAfterAjaxRequest);
   
   /* the list mouse/touch event
   instead of registering every list item, we register only the <ul> for 
   better performance (event bubbling) */
   $("#items").on("mousedown touchstart", ADXP.event_handlers.onListTouch);
   
   // on back button touch
   $("#back-button").on("mousedown touchstart", ADXP.event_handlers.onBack);
   
   // on refresh button touch
   $("#refresh-button").on("mousedown touchstart", ADXP.event_handlers.onRefresh);
   

   /*
    *  start app - load the root items and build list
    */

   ADXP.getData(ADXP.config.base_url+"items/0/children", {}, ADXP.buildList);
   
})();