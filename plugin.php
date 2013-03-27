<?php

/**
 * Plugin Name: Inline Ajax Comments
 * Plugin URI: http://zanematthew.com/blog/plugins/inline-comments/
 * Description: Displays a single line textarea for entering comments, users can press "enter/return", and comments are loaded and submitted via AJAX.
 * Tags: comments, ajax, security, ajax comments, comment, inline, comment form
 * Version: 0.1-alpha
 * Author: Zane Matthew
 * Author URI: http://zanematthew.com/
 * License: GPL
 */


/**
 * From the WordPress plugin headers above we derive the version number, and plugin name
 */
$plugin_headers = get_file_data( __FILE__, array( 'Version' => 'Version', 'Name' => 'Plugin Name' ) );


/**
 * We store our plugin data in the following global array.
 * $my_unique_name with your unique name
 */
global $my_unique_name;
$my_unique_name = array();
$my_unique_name['version_key'] = strtolower( str_replace( ' ', '_', $plugin_headers['Name'] ) ) . '_version';
$my_unique_name['version_value'] = $plugin_headers['Version'];


/**
 * When the user activates the plugin we add the version number to the
 * options table as "my_plugin_name_version" only if this is a newer version.
 */
$activate_fn = function(){

    global $my_unique_name;

    if ( get_option( $my_unique_name['version_key'] ) && get_option( $my_unique_name['version_key'] ) > $my_unique_name['version_value'] )
        return;

    update_option( $my_unique_name['version_key'], $my_unique_name['version_value'] );

};
register_activation_hook( __FILE__, $activate_fn );


/**
 * Delete our version number from the database when the plugin is activated.
 */
$deactivate_fn = function (){
    global $my_unique_name;
    delete_option( $my_unique_name['version_key'] );
};
register_deactivation_hook( __FILE__, $deactivate_fn );


/**
 * Shared functions between admin and theme
 */
if ( file_exists( plugin_dir_path( __FILE__ ) . 'inc/functions.php' ) )
    require_once plugin_dir_path( __FILE__ ) . 'inc/functions.php';


/**
 * Theme only functions
 */
if ( file_exists( plugin_dir_path( __FILE__ ) . 'inc/template-tags.php' ) )
    require_once plugin_dir_path( __FILE__ ) . 'inc/template-tags.php';


$enqueue_scripts_fn = function(){
    $plugin_headers = get_file_data( __FILE__, array( 'Version' => 'Version', 'Name' => 'Plugin Name' ) );

    $clean_name = strtolower( str_replace( ' ', '-', $plugin_headers['Name'] ) );
    wp_register_style( $clean_name . '-style', plugin_dir_url( __FILE__ ) . 'inc/css/style.css' );

    wp_register_script( 'textarea_auto_expand-script', plugin_dir_url( __FILE__ ) . 'vendor/textarea-auto-expand/jquery.textarea_auto_expand.js' );
    wp_register_script( $clean_name . '-script', plugin_dir_url( __FILE__ ) . 'inc/js/script.js', array('jquery', 'textarea_auto_expand-script') );

};
add_action('wp_enqueue_scripts', $enqueue_scripts_fn, 2);