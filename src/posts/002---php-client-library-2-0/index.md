export const frontmatter = { 
  title: 'How And Why We Simplified The SparkPost PHP Client Library',
  date: '2017-07-28',
  description: 'Introducing our PHP 2.0 Library. Check out the changes we’ve made to keep up with the complex areas of our API additions for our PHP client library users.',
  canonical: 'https://www.sparkpost.com/blog/php-client-library-2-0/'
}

You might remember that last year we released the [2.0 version](https://github.com/SparkPost/php-sparkpost/releases/tag/2.0.0) of the SparkPost PHP client library. We’ve talked about the evolution of our [approach across all our client libraries](https://www.sparkpost.com/blog/client-libraries/), but I wanted to dive deeper into the PHP changes.

### Why
After 18 months of having our client libraries in the wild we’ve learned some important lessons. The biggest one was that abstraction is hard when you’re wrapping a living, growing API. With 16 API endpoints and [more coming](https://developers.sparkpost.com/api/labs-introduction.html) we were limiting our users and ourselves as our client libraries fell behind our API additions. We changed our mentality to focus on providing a thin layer of abstraction with some syntactic “sugar” to simplify the more complex areas of our API.

### Using the PHP client library
In the new version we decided to let a single method drive all SparkPost requests. This lets you hit any API endpoint quickly and with a ton of flexibility.

```php
<?php
// in 1.x
$sparky->setupUnwrapped('metrics');
 
$results = $sparky->metrics->get('deliverability', [
  'from'=>'2016-03-07T17:00',
  'to'=>'2016-03-08T17:30',
  'metrics'=>'count_targeted,count_injected,count_rejected',
  'timezone'=>'America/New_York'
]);


// in 2.x
$promise = $sparky->request('GET', 'metrics/deliverability', [
  'from'=>'2016-03-07T17:00',
  'to'=>'2016-03-08T17:30',
  'metrics'=>'count_targeted,count_injected,count_rejected',
  'timezone'=>'America/New_York'
]);
```

In the 1.x version we did a good amount of property mapping. For example, to enable inline css you would set `'inlineCss' => true` when you called `$sparky->transmission->send`. Now in the 2.x release, we simply pass along the data you provide, so to inline css you would set `'options' => [ 'inline_css' => true ]`. While this might look more complex at first it actually makes it easier to use since you can now depend on our main [API docs](https://developers.sparkpost.com/api/transmissions.html) and quickly translate JSON into an associative array.

We also moved off of the deprecated `egeloen/ivory-http-adapter` to use `php-http/httplug`. This means you can continue to bring your own HTTP request library and adds the new ability to use [promises](http://docs.php-http.org/en/latest/components/promise.html) in PHP.

### How To Use It
We have a bunch of examples on how to use our new 2.x library in the [github repo](https://github.com/SparkPost/php-sparkpost/tree/master/examples). Here’s a quick walk through on how to get going.

### Installing & setup
First we need to pull the library from composer. If you don’t have that setup, check out their [getting started page](https://getcomposer.org/doc/00-intro.md). (If you’re using a PHP version earlier than 5.6 or you can’t use composer you can still use our API with some [simple cURL magic](https://github.com/SparkPost/php-sparkpost/issues/164#issuecomment-289888237)!)

We are going to use [guzzle](http://docs.guzzlephp.org/en/stable/) as our request library. You can use any of the [httplug-supported clients](https://packagist.org/providers/php-http/client-implementation).

```sh
composer require guzzlehttp/guzzle
composer require php-http/guzzle6-adapter
composer require sparkpost/sparkpost
```

Now that we have our dependencies we can set up the library. To run our code synchronously we’ll set `async` to `false`.

```php
<?php
require 'vendor/autoload.php';

use SparkPost\SparkPost;
use GuzzleHttp\Client;
use Http\Adapter\Guzzle6\Client as GuzzleAdapter;

$httpClient = new GuzzleAdapter(new Client());
$sparky = new SparkPost($httpClient, ['key'=>'YOUR_API_KEY', 'async' => 
false]);
```

### Building the transmission
Looking at the following transmission, we can see it’s almost identical to a regular SparkPost transmission. The difference is that we added a `cc` and `bcc`. This is that “sugar” I mentioned. The library will go through and format your `cc` and `bcc` recipients to fit the SparkPost API’s requirements.

```php
<?php
$transmissionData = [
	'content' => [
        'from' => [
            'name' => 'SparkPost Team',
            'email' => 'from@sparkpostbox.com',
        ],
        'subject' => 'Mailing via PHP library 2.x',
        'text' => 'Woo! We did the thing!',
    ],
    'recipients' => [
        [
            'address' => [
                'name' => 'YOUR_NAME',
                'email' => 'YOUR_EMAIL',
            ],
        ],
    ],
    'cc' => [
        [ 'address' => [ 'name' => 'ANOTHER_NAME', 'email' => 'ANOTHER_EMAIL' ] ]
    ],
    'bcc' => [
        [ 'address' => [ 'name' => 'AND_ANOTHER_NAME', 'email' => 'AND_ANOTHER_EMAIL' ] ]
    ],
]
```

```php
<?php
try {
    $response = $sparky->transmissions->post($transmissionData);
    echo $response->getStatusCode()."\n";
    print_r($response->getBody())."\n";
}
catch (\Exception $e) {
    echo $e->getCode()."\n";
    echo $e->getMessage()."\n";
}
```

And there you go! Your email is off!

To dig into the library, checkout the repo on [GitHub](https://github.com/SparkPost/php-sparkpost), or come talk to our team in [Slack](http://slack.sparkpost.com/). And if you find a bug (😱) submit an [issue](https://github.com/SparkPost/php-sparkpost/issues) or a [PR](https://github.com/SparkPost/php-sparkpost/pulls). Check back soon for an upcoming post on using SparkPost with some popular PHP frameworks.

– [Avi](https://twitter.com/theavigoldman), Software Engineer