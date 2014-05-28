// create the app namespace/main object
var AX = {

    // config object - here we could also store the urls for the ajax requests if needed, etc.
    config: {
        base_url: "http://konverzija.com/ad-explorer/index.php/api/",
        response_format: "json",
        date_format: "%m/%d/%Y %H:%i"
    },


    // holds the data for the current state (back button functionality)
    call_stack: new Array({
        id: 0,
        title: ""
    }),


    // builds the <li> items in the <ul>
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
        data.format = (data.format !== undefined ? data.format : AX.config.response_format);
        data.date_format = (data.date_format !== undefined ? data.date_format : AX.config.date_format);

        $.ajax({
            url: url,
            type: "GET",
            dataType: 'jsonp',
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
                
                try {
                    
                    var error_text = $.parseJSON(xhr.responseText);
                    if (error_text.error !== undefined)
                        alert(error_text.error);
                    else
                        alert(error_thrown);
                }
                
                catch(e) {
                    alert(error_thrown);
                }

            }
        });

    },
    

    registerEventListeners: function() {  
   
        // our default event for when a new list is built
        $(document).on("listBuilt", AX.event_handlers.onListBuilt);

        // before an ajax request
        $(document).on("beforeAjaxRequest", AX.event_handlers.onBeforeAjaxRequest);

        // after ajax request
        $(document).on("afterAjaxRequest", AX.event_handlers.onAfterAjaxRequest);


        /* the list mouse/touch event
        instead of registering every list item, we register only the <ul> for 
        better performance (event delegation) */
        
        // also check for dragging/scrolling. in this case stop the event
        var dragging = false;
        
        $("#items").on("touchend", function(event) {
            if (!dragging)
                AX.event_handlers.onListTouch(event);
        });
        
        $("#items").on("touchmove", function(){
            dragging = true;
        });
        
        $("#items").on("touchstart", function(){
            dragging = false;
        });

        // on back button touch
        $("#back-button").on("touchend", AX.event_handlers.onBack);

        // on refresh button touch
        $("#refresh-button").on("touchend", AX.event_handlers.onRefresh);

    },
    
    
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

            
            // if item is an ad, follow the url
            if ($list_item.attr("data-type") == "file") {

                var url = $list_item.attr("data-url");

                if (url !== undefined)
                    window.location = url;
                else
                    alert("This item has a missing url!");

            }

            // load folder children and set current folder title
            else {
                
                // add data to the call stack
                AX.call_stack.push({
                    id: parseInt($list_item.attr("id")), 
                    title: $list_item.find(".title").first().html()
                });

                $("#back-button").html(" .. / "+AX.call_stack[AX.call_stack.length-1].title);
                
                AX.getData(
                AX.config.base_url+"items/"+$list_item.attr("id")+"/children", 
                {}, 
                AX.buildList
            );
            }

        },

        // when the user presses the back button, load the previous list children
        onBack: function() {
            
            // remove last array item from the call stack
            AX.call_stack.pop();
            
            // get index of last element
            var index = AX.call_stack.length-1; 
            
            // get folder title
            var title = AX.call_stack[index].title;
            
            // show folder title
            if (title != "")
                $("#back-button").html(" .. / "+title);
            
            // don't show folder title if we are in the root
            else
                $("#back-button").html("");
            
            AX.getData(
            AX.config.base_url+"items/"+AX.call_stack[index].id+"/children", 
            {}, 
            AX.buildList
        );
        },

        // when the user presses the refresh button, load the current list children
        onRefresh: function() {
            AX.getData(
            AX.config.base_url+"items/"+AX.call_stack[AX.call_stack.length-1].id+"/children", 
            {}, 
            AX.buildList
        );
        },

        // when a new list is built, this handler is called
        onListBuilt: function() {

            // scroll to top so the screen is not somewhere in the middle where it left off
            window.scrollTo(0, 0);

            // slightly animate the list
            $("#items").fadeIn("fast");

            // show/hide back button
            if (AX.call_stack[AX.call_stack.length-1].id !== 0)
                $("#back-button").show();

            else
                $("#back-button").hide();


        },

        onBeforeAjaxRequest: function() {
            // show the load screen
            $("#loading-screen").show();
        },

        onAfterAjaxRequest: function() {
            // hide the load screen
            $("#loading-screen").hide();
        }

    }
};



// yeah baby, let's kick things off
(function() {
    
    //start app - load the root items and build list
    AX.registerEventListeners();
    AX.getData(AX.config.base_url+"items/0/children", {}, AX.buildList);
   
})();