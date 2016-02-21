<?php

/**
 * Get description of the occupation.
 * 
 * @param string $url_description
 *   Url of description to request about.
 * 
 * @return string
 *   The occupation description else empty string.
 */
function _get_description_occupation($url_description = '') {
  if (empty($url_description)) {
    return '';
  }
  require_once('simple_html_dom.php');
  // Create DOM from URL or file
  $html = file_get_html($url_description);
  $occupation_description = '';
  // Find all p 
  foreach($html->find('p') as $element) {
    if (strlen(trim($element->plaintext)) >= 250) {
      $occupation_description = trim($element->plaintext);
    }
  }
  return $occupation_description;
}

$url_description = !empty($_GET['url_description']) ? $_GET['url_description'] : '';
print json_encode(array('description' => _get_description_occupation($url_description)));
exit();