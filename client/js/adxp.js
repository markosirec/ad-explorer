
// create the app namespace/object
var ADXP = {};

// config object - here we could also store the urls for the ajax requests if needed
ADXP.config = {
    base_url: "/",
    response_format: "json",
    date_format: "%m/%d/%Y %H:%i"
};


// holds the data for the current state
ADXP.data = {
    current_parent_id: 0,
    previous_parent_id: null
};


// the default event handlers
ADXP.event_handlers = {
    
    onListTouch: function(event) {
        
        ADXP.data.previous_parent_id = ADXP.data.current_parent_id;
        
        // get item 
        var $list_item = $(event.targetChildren[0]); // ??
        
        // save current parent id for future reference
        ADXP.data.current_parent_id = parseInt($list_item.attribute("data-id"));

        // if item is an ad, follow the url
        if ($list_item.attribute("data-type") == "ad") {
            
            var url = $list_item.attribute("data-url");
            
            if (url !== undefined)
                window.location = url;
            else
                alert("This item has a missing url!");
            
        }
        
        // else if item type is a folder, show folder children
        else
            ADXP.getData(ADXP.config.base_url+"items/"+ADXP.data.current_parent_id+"/children", {}, ADXP.buildList);
        
    },
    
    // when the user presses the back button, load the previous list children
    onBack: function() {
        ADXP.getData(ADXP.config.base_url+"items/"+ADXP.data.previous_parent_id+"/children", {}, ADXP.buildList);
    },
    
    // when the user presses the refresh button, load the current list children
    onRefresh: function() {
        ADXP.getData(ADXP.config.base_url+"items/"+ADXP.data.current_parent_id+"/children", {}, ADXP.buildList);
    },
    
    // when a new list is built, this handler is called
    onListBuilt: function() {
        
        // slightly animate the list
        $("#items").fadeIn();

        // show/hide back button
        if (ADXP.data.current_parent_id !== 0)
            $("#back-button").show();
        
        else if (ADXP.data.current_parent_id === 0)
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
    
    
};


ADXP.buildList = function(json_data) {
    
    // hide the list so we can fadein later
    $("#items").hide();
    
    // clear the old list
    $("#items").remove("li");
    
    // get item template so we have to acces it only once, saving on time
    var item_template = $("#items-template").children(":first");
    
    for (var i = 0; i <= json_data.length; i++) {
        
        // generate new item from template
        var new_item = item_template.clone();
        $(new_item).attribute("data-id", json_data[i].item_id);
        $(new_item).attribute("data-type", json_data[i].type);
        $(new_item).attribute("data-url", json_data[i].url);
        
        // set up icon
        var icon = $(new_item).find(".list-icon");
        icon.attribute("src", icon.attribute("data-src").replace("{type}", json_data[i].type));
        
        $(new_item).find(".title").html(json_data[i].title);
        $(new_item).find(".last-update").html(json_data[i].last_update_formated);
        
        $("#items").append(new_item);
        
    }
    
    // fire the event, signaling the build process is done
    $.event.trigger("listBuilt");
    
}



// wrapper function for ajax GET requests
ADXP.getData = function(url, data, successCallback, errorCallback) {
    
    $.event.trigger("beforeAjaxRequest");
    
    // set the default format
    data.format = (data.format !== undefined ? data.format : ADXP.config.response_format);
    data.date_format = (data.date_format !== undefined ? data.date_format : ADXP.config.date_format);

    $.ajax({
        url: url,
        type: "GET",
        data: data,
        success: function(data) {
            
            $.event.trigger("afterAjaxRequest");
            
            var response = $.parseJSON(data);
            
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
   
});