<?php

/**
 * Lists books.
 * 
 * @param string $occupation
 *   The occupation requested.
 * @param int $count
 *   How many times books will be displayed.
 * 
 * @return string
 *   Books in json format.
 */
function _list_books($occupation = '', $count = 3) {
  if (empty($occupation)) {
    return '';
  }
  require_once('simple_html_dom.php');
  // Create DOM from URL or file
  //$html = file_get_html("http://www.amazon.com/s/ref=sr_nr_n_0?keywords=" . $occupation . "&ie=UTF8&qid=1456026660");
  $html = file_get_html("http://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Dstripbooks&field-keywords=" . $occupation . "&rh=n%3A283155%2Ck%3A" . $occupation);
  $books = array();
  $i = 0;
  // Find all img books.
  foreach ($html->find('img.s-access-image') as $element) {
    $books[$i]['image'] = $element->src;
    if ($i == $count-1) {
      break;
    }
    $i++;
  }
  $i = 0;
  // Find all href books.
  foreach ($html->find('a.s-access-detail-page') as $element) {
    $books[$i]['href'] = $element->href;
    if ($i == $count-1) {
      break;
    }
    $i++;
  }
  $i = 0;
  // Find all title.
  foreach ($html->find('h2.s-access-title') as $element) {
    print $element->plain_text;
    $books[$i]['title'] = $element->plaintext;
    if ($i == $count-1) {
      break;
    }
    $i++;
  }
  $i = 0;
  return $books;
}

$occupation = !empty($_GET['occupation']) ? $_GET['occupation'] : '';
$count = !empty($_GET['count']) ? $_GET['count'] : 3;
print json_encode(_list_books($occupation, $count));
exit();