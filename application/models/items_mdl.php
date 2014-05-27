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
    
    public function getItemsByParentId($parent_id = 0, $order_by = false, $order_direction = false, $date_format = false) {
        
        $this->db->select("
            items.item_id, 
            items.title, 
            items.url, 
            items.last_update, 
            item_types.title as type, 
            item_ad_types.title as ad_type");
        
        if (!is_bool($date_format))
            $this->db->select("DATE_FORMAT (items.last_update, '$date_format') AS last_update_formated", FALSE);
        
        $this->db->join('item_types', 'item_types.type_id = items.type_id', 'inner');
        $this->db->join('item_ad_types', 'item_ad_types.ad_type_id = items.ad_type_id', 'inner');
        
        $this->db->where("items.parent_id", $parent_id);
        $this->db->where("items.deleted", "false");
        
        if (!is_bool($order_by) && !is_bool($order_direction) && (strtoupper($order_direction) == "ASC" || strtoupper($order_direction) == "DESC"))
            $this->db->order_by($order_by, $order_direction);
        
        // show folders on top, after that order by title
        else {
            $this->db->order_by("items.type_id", "ASC");
            $this->db->order_by("items.title", "ASC");
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
    
    public function getItemById($item_id, $date_format = false) {

        $this->db->select("
            items.item_id, 
            items.title, 
            items.url, 
            items.last_update, 
            item_types.title as type, 
            item_ad_types.title as ad_type");
        
        $this->db->join('item_types', 'item_types.type_id = items.type_id', 'inner');
        $this->db->join('item_ad_types', 'item_ad_types.ad_type_id = items.ad_type_id', 'inner');
        
        if (!is_bool($date_format))
            $this->db->select("DATE_FORMAT (items.last_update, '$date_format') AS last_update_formated", FALSE);
        
        $this->db->where("items.item_id", $item_id);
        $this->db->where("items.deleted", "false");
        
        return $this->db->get('items');
        
    }
    
}

?>
