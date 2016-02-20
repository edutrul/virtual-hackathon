<?php
ini_set('display_errors', 1);

function list_tweeter_users_occupations($occupation) {
  require_once('TwitterAPIExchange.php');
  /** Set access tokens here - see: https://dev.twitter.com/apps/ **/
  $settings = array(
      'oauth_access_token' => "58298798-CJeFGysn7fhg7ov9yV8a0Hv6n2iLZNWSW5es10noo",
      'oauth_access_token_secret' => "nqUwhbUavq7Szz2Vzkmes3VFgXQibxdkERGTl8fDtnHwj",
      'consumer_key' => "RuRGuCqylE4kazQQvIODg",
      'consumer_secret' => "Wii8B0xeVOxnArEqiuUJmOZb43SXcCx9wuwWkgPBFU"
  );

  $data_geop = unserialize(file_get_contents('http://www.geoplugin.net/php.gp?ip=' . $_SERVER['REMOTE_ADDR']));
  $country = !empty($data_geop['geoplugin_countryName']) ? $data_geop['geoplugin_countryName'] : '';

  /** Perform a GET request and echo the response **/
  /** Note: Set the GET field BEFORE calling buildOauth(); **/
  $url = 'https://api.twitter.com/1.1/users/search.json';
  //$url = 'https://api.twitter.com/1.1/search/tweets.json';
  //$getfield = 'q=chef&geocode=-9.189967,-75.015152&lang=es';
  $getfield = 'q=' . $occupation . '+' . $country . '&count=3';
  $requestMethod = 'GET';
  $twitter = new TwitterAPIExchange($settings);
  $result = $twitter->setGetfield($getfield)
               ->buildOauth($url, $requestMethod)
               ->performRequest();
  $users_list = json_decode($result);
  $users = array();
  $width = 200; ///< @TODO update this with Ricardo explanation.
  $height = 200; ///< @TODO update this with Ricardo explanation.
  foreach ($users_list as $user) {
    $users[] = array(
      'name' => $user->name,
      'twitter_handle' => $user->screen_name,
      'location' => !empty($user->location) ? $user->location : '',
      'description' => !empty($user->description) ? $user->description : '',
      'url' => !empty($user->url) ? $user->url : '',
      'image' => !empty($user->profile_image_url_https) ? str_replace('normal', $width . 'x' . $height, $user->profile_image_url_https) : '',
    );
  }

  return $users;
}