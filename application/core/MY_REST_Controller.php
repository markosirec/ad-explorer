<?php defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH.'/libraries/REST_Controller.php';

class MY_REST_Controller extends REST_Controller {
    
    // overriden method from the REST controller library - check the comments below
    public function _remap($object_called, $arguments) { 
        
        // Should we answer if not over SSL?
        if (config_item('force_https') and !$this->_detect_ssl()) {
            $this->response(array('status' => false, 'error' => 'Unsupported protocol'), 403);
        }

        /* Original library code - tries to map an url to an arbitrary array, with a function call in the beginning.
         * For example this style of urls is valid in the old version:
         * /items/item/id/5 -> calls the method item_get(5) - parameters are added with key/value.
         * 
         * We chose not to follow such a verbose style, so let's comment out this functionality.
         * 
         */
        
        /*
        $pattern = '/^(.*)\.('.implode('|', array_keys($this->_supported_formats)).')$/';

        if (preg_match($pattern, $object_called, $matches)) {
            $object_called = $matches[1];
        } */

        
        
        /*
         * NEW solution:
         * 
         * everything in the url is put into the arguments array, and a default method is called:
         * methodAction. for example: Items->getAction, for the url items/5. The number 5 is added as the first argument.
         * 
         * (by Marko Širec)
         */
        
        array_unshift($arguments, $object_called);
        $object_called = "Action";
        
        
        /*
         * Another change, purely cosmetic - since we write methods for our own code in camel case, 
         * let's change the call so it corresponds to this style.
         * 
         * (by Marko Širec)
         */
        
        //$controller_method = $object_called.'_'.$this->request->method;
        $controller_method = $this->request->method.$object_called;

        
        // from here on out, the code is the same as in the library controller
        
        
        // Do we want to log this method (if allowed by config)?
        $log_method = !(isset($this->methods[$controller_method]['log']) and $this->methods[$controller_method]['log'] == false);

        // Use keys for this method?
        $use_key = !(isset($this->methods[$controller_method]['key']) and $this->methods[$controller_method]['key'] == false);

        // They provided a key, but it wasn't valid, so get them out of here.
        if (config_item('rest_enable_keys') and $use_key and $this->_allow === false) {
            if (config_item('rest_enable_logging') and $log_method) {
                $this->_log_request();
            }

            $this->response(array('status' => false, 'error' => 'Invalid API Key.'), 403);
        }

        // Check to see if this key has access to the requested controller.
        if (config_item('rest_enable_keys') and $use_key and !empty($this->rest->key) and !$this->_check_access()) {
            if (config_item('rest_enable_logging') and $log_method) {
                $this->_log_request();
            }

            $this->response(array('status' => false, 'error' => 'This API key does not have access to the requested controller.'), 401);
        }

        // Sure it exists, but can they do anything with it?
        if ( ! method_exists($this, $controller_method)) {
            $this->response(array('status' => false, 'error' => 'Unknown method.'), 404);
        }

        // Doing key related stuff? Can only do it if they have a key right?
        if (config_item('rest_enable_keys') and !empty($this->rest->key)) {
            // Check the limit
            if (config_item('rest_enable_limits') and !$this->_check_limit($controller_method)) {
                $response = array('status' => false, 'error' => 'This API key has reached the hourly limit for this method.');
                $this->response($response, 401);
            }

            // If no level is set use 0, they probably aren't using permissions
            $level = isset($this->methods[$controller_method]['level']) ? $this->methods[$controller_method]['level'] : 0;

            // If no level is set, or it is lower than/equal to the key's level
            $authorized = $level <= $this->rest->level;

            // IM TELLIN!
            if (config_item('rest_enable_logging') and $log_method) {
                $this->_log_request($authorized);
            }

            // They don't have good enough perms
            $response = array('status' => false, 'error' => 'This API key does not have enough permissions.');
            $authorized or $this->response($response, 401);
        }

        // No key stuff, but record that stuff is happening
        else if (config_item('rest_enable_logging') and $log_method) {
            $this->_log_request($authorized = true);
        }

        // and...... GO!
        $this->_fire_method(array($this, $controller_method), $arguments);
    }
    
    
    
    /**
     * Check to see if the there is a DB error - output the error no. and end
     * 
     * @author Marko Širec
     * @param integer $error
     */
    protected function checkQueryForErrors($error) {
        
        if ($error > 0) {
            $this->response(array("error" => "Database error: ".$error), 400);
            exit();
        }

    }
    
    
}
