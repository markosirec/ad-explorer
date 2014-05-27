<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
* 
* RESTful controller for the items resource. 
* 
* Example of GET URIs:
*    
* /items -> returns all the items in the root (parent_id = 0) 
* /items/7 -> returns the item where item_id = 7
* /items/7/children -> return all the items with parent_id = 7 
* 
* @author Marko Širec
*/

require APPPATH.'/core/MY_REST_Controller.php';

class Items extends MY_REST_Controller {

    public function __construct() {
        
        parent::__construct();
        
        $this->load->database();
        
        // load the items model
        $this->load->model("items_mdl", "Items_mdl");  
    }
    

    /**
     * 
     * Main GET router. All GET requests to the items resource go through here.
     * 
     * @param integer $item_id
     * @param string $sub_action 
     */
    
    public function getAction($item_id = null, $sub_action = null) {
        
        // if test call, go for it!
        if ($item_id == "tests")
            $this->tests();
        
        if ($item_id !== null && $sub_action == "children")
            $this->getChildren($item_id);
        
        else if ($item_id !== null && $item_id !== "index")
            $this->getItem($item_id);
        
        // no parameters - show the root!
        else
            $this->getChildren(0);

    }
    
    
    
    /**
     * 
     * Gets the children from the model and outputs the data
     * 
     * @param integer $parent_id
     */
    
    private function getChildren($parent_id = 0) {
        
        if (!is_numeric($parent_id)) {
            $this->response(array("error" => "The parent id is not valid!"), 400);
            return;
        }

        // get the data from the DB
        $result = $this->Items_mdl->getItemsByParentId(
            $parent_id, 
            $this->get("order_by"), 
            $this->get("order_direction"), 
            $this->get("date_format"));

        $this->checkQueryForErrors($this->db->_error_number());
        
        // output the data
        $this->response($result->result_array(), 200);
        
    }
    
    
    
    /**
     * 
     * Gets the item from the model and outputs the data
     * 
     * @param integer $item_id
     */
    
    private function getItem($item_id) {
        
        if (!is_numeric($item_id)) {
            $this->response(array("error" => "The id is not valid!"), 400);
            return;
        }
        
        $result = $this->Items_mdl->getItemById($item_id, $this->get("date_format"));
        $this->checkQueryForErrors($this->db->_error_number());
        
        $result = $result->result_array();
        
        if (count($result) == 0) {
            $this->response(array('error' => 'Item could not be found'), 404);
            return;
        }

        // output the data
        $this->response($result, 200);
        
    }
    
    
    /**
     * 
     * Main POST router. All POST requests to the items resource go through here.
     * 
     * @param integer $item_id
     */
    
    public function postAction($item_id = null) {
        
    }
    
    
    /**
     * 
     * Main PUT router. All PUT requests to the items resource go through here.
     * 
     * @param integer $item_id
     */
    
    public function putAction($item_id = null) {
        
    }
    
    
    /**
     * 
     * Main DELETE router. All DELETE requests to the items resource go through here.
     * 
     * @param integer $item_id
     */
    
    public function deleteAction($item_id = null) {
        
    }
    
    
    
    
    
    /**
     * 
     * Automated tests for this controller.
     * CI makes it practically impossible to access constrollers outside the framework,
     * therefore forcing you to call controller methods from here.
     * 
     */
    
    public function tests() {
        
        /* here we could make a check if the ENVIRONMENT is development, 
         * or make an IP check, etc. The url is public after all. 
         * But for now, lets not complicate too much
         */
        
        $this->load->library('unit_test');
        
        // run a bunch of tests on models
        $test = $this->Items_mdl->getItemsByParentId();
        echo $this->unit->run($test, "is_object", "Items_mdl->getItemsByParentId()");
        
        $test = $this->Items_mdl->getItemsByParentId(false);
        echo $this->unit->run($test, "is_object", "Items_mdl->getItemsByParentId(false)");
        
        $test = $this->Items_mdl->getItemsByParentId(0, "test", "123", "fsfs"); 
        echo $this->unit->run($test, "is_object", "Items_mdl->getItemsByParentId(..) with wrong order by and date_format parameters");
        
        exit();
    }
    
}
