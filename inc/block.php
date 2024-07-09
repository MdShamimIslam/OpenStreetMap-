<?php
class OSMHelloBlock{
	public function __construct(){
		add_action( 'init', [$this, 'onInit'] );
	}
	
	function onInit() {
		wp_register_style( 'osm-hello-style', OSM_DIR_URL . 'dist/style.css', [ ], OSM_VERSION ); // Style
		wp_register_style( 'osm-hello-editor-style', OSM_DIR_URL . 'dist/editor.css', [ 'osm-hello-style' ], OSM_VERSION ); // Backend Style

		register_block_type( __DIR__, [
			'editor_style'		=> 'osm-hello-editor-style',
			'render_callback'	=> [$this, 'render']
		] ); // Register Block

		wp_set_script_translations( 'osm-hello-editor-script', 'open-street-map', OSM_DIR_PATH . 'languages' );
	}

	function render( $attributes ){
		
		extract( $attributes );

		wp_enqueue_style( 'osm-hello-style' );
		wp_enqueue_script( 'osm-hello-script', OSM_DIR_URL . 'dist/script.js', [ 'react', 'react-dom' ], OSM_VERSION, true );
		wp_set_script_translations( 'osm-hello-script', 'open-street-map', OSM_DIR_PATH . 'languages' );

		$className = $className ?? '';
		$blockClassName = "wp-block-osm-hello $className align$align";

		ob_start(); ?>
<div class='<?php echo esc_attr( $blockClassName ); ?>' id='osmHelloBlock-<?php echo esc_attr( $cId ) ?>'
    data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'></div>

<?php return ob_get_clean();
	}
}
new OSMHelloBlock();


//  function shamim_vai_ajax_shiktese(){
	
// 	// echo json_encode([
// 	// 	'sccess' => true,
// 	// 	'data'=> 'data will go here'
// 	// ]);
// 	// wp_die();
// 	$name = $_GET['name'];
// 	wp_send_json_success($name);
//  }


// add_action('wp_ajax_nopriv_shamim_vai', 'shamim_vai_ajax_shiktese');
// add_action('wp_ajax_shamim_vai', 'shamim_vai_ajax_shiktese');



add_action('wp_ajax_open_stream_api_key', function(){

	$nonce = sanitize_text_field($_POST['nonce']);
	if(!wp_verify_nonce($nonce, 'wp_rest')){
		wp_send_json_error('you have successfully fetch an error!');
	}
	$apiKey = sanitize_text_field($_POST['apiKey']);

	$db_apiKey = get_option('map_api_key', []);

	if(!$apiKey){
		wp_send_json_success($db_apiKey);
	}

	update_option('map_api_key', $apiKey);
	
	wp_send_json_success($apiKey);

});