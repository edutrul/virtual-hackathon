<?php

/**
 * Get json array videos.
 * 
 * @param String $occupation
 *   The occupation requested.
 * @param int $count
 *   How many videos are going to be displayed.
 * 
 * @return string
 *   JSON array of videos.
 */
function list_video_tutorials($occupation, $count = 2) {
  if (empty($occupation)) {
    return '';
  }
  include_once __DIR__ . '/google-api-php-client/vendor/autoload.php';

  $client = new Google_Client();
  $client->setApplicationName("Client_Library_Examples");

  // Warn if the API key isn't set.
  $apiKey = 'AIzaSyDfJZY4eDfxVRgvNRabzqKaCKLZr35aKmM';
  $client->setDeveloperKey($apiKey);
  $youtube_service = new Google_Service_YouTube($client);
  $searchResponse = $youtube_service->search->listSearch('id,snippet', array(
        'q' => "What is " . $occupation,
        'maxResults' => $count,
      ));

  $videos = array();
  // Add each result to the appropriate list, and then display the lists of
  // matching videos, channels, and playlists.
  foreach ($searchResponse['items'] as $searchResult) {
    switch ($searchResult['id']['kind']) {
      case 'youtube#video':
        $videos[] = array(
          'videoId' => $searchResult['id']['videoId'],
          'title' => $searchResult['snippet']['title'],
          'description' => $searchResult['snippet']['description'],
        );
        break;
    }
  }
  
  return $videos;
}

$occupation = !empty($_GET['occupation']) ? $_GET['occupation'] : '';
$count = !empty($_GET['count']) ? $_GET['count'] : '';
print json_encode(list_video_tutorials($occupation, $count));
exit();