<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

require APPPATH.'/libraries/REST_Controller.php';

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

class Items extends REST_Controller {

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
        
        if ($item_id !== null && $sub_action == "children")
            $this->getChildren($item_id);
        
        else if ($item_id !== null)
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
        
        $this->_check_query_for_errors($this->db->_error_number());
        
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
        $this->_check_query_for_errors($this->db->_error_number());
        
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
    
    
}
