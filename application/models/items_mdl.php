<?php

/**
* 
* Model for the items resource.
* 
* @author Marko Širec
*/

class Items_mdl extends CI_Model {
    
    public function __construct() {
        parent::__construct();
    }

    /**
     * 
     * Retrieves items by parent_id
     *
     * @param integer $parent_id
     * @param string|boolean $order_by
     * @param string|boolean $order_direction
     * 
     * @return Object (CI_DB_mysql_result) Result object
     */
    
    public function getItemsByParentId($parent_id = 0, $order_by = false, $order_direction = false) {
        
        $this->db->select("item_id, title, type, url, last_update");
        $this->db->where("parent_id", $parent_id);
        $this->db->where("deleted", "false");
        
        if (!is_bool($order_by) && !is_bool($order_direction))
            $this->db->order_by($order_by, $order_direction);
        
        // show folders on top, after that order by title
        else {
            $this->db->order_by("type", "DESC");
            $this->db->order_by("title", "ASC");
        }
        
        return $this->db->get('items');

    }
    
    
    /**
     * 
     * Retrieves item by item_id
     *
     * @param integer $item_id
     * 
     * @return Object (CI_DB_mysql_result) Result object
     */
    
    public function getItemById($item_id) {

        $this->db->select("item_id, title, type, url, last_update");
        $this->db->where("item_id", $item_id);
        $this->db->where("deleted", "false");
        
        return $this->db->get('items');
        
    }
    
}

?>
