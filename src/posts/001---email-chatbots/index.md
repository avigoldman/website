export const frontmatter = { 
  title: 'Building Email Chatbots with SparkPost',
  date: '2017-04-21',
  description: 'Ever wanted to send physical mail via your computer? Today we’ll demo an app that uses email chatbots to send a physical postcard to the White House.',
  canonical: 'https://www.sparkpost.com/blog/email-chatbots/'
}


SparkPost has some awesome functionality, including the ability to receive email [through webhooks](https://www.sparkpost.com/blog/webhooks-beyond-the-basics/). Whenever I’ve seen anything built with inbound email it’s always required sending an email back, whether the tool collected data or added [songs to a spotify playlist](https://github.com/aydrian/jukepost). I thought it would be fun to take the SparkPost API one step further and fuse *ahem* the abilities to send and receive email, ie email chatbots. And thus, [Fuse-email](https://github.com/avigoldman/fuse-email).

### What is it?
Anyone familiar with chatbots has probably used or heard of [Botkit](https://github.com/howdyai/botkit). At its core, it’s a wrapper around several bot APIs to make it easy to get chatbots up and running. Fuse-email is a library written in Node.js, with the same goal but for email chatbots. It could be used to build something like [x.ai](https://x.ai/), or anything else really. So let’s build something!

### What to build…
Let’s build a basic email bot that helps you send a postcard to the White House. There are troves of cool APIs out there, including a favorite of mine called [Lob](https://lob.com/) which is like SparkPost but for physical mail. They have an API for sending postcards, letters, and checks.

When designing a new bot, I always like to start by writing a script for how I believe the bot should respond. Our bot should have the following conversation:

* Me: Let’s send a card to the White House
* Bot: Ok, what message should your postcard have?
* Me: Hello there!
* Bot: Got it 🙂 What image should we put on the postcard?
* Me: &lt;some attached file&gt;
* Bot: Sweet! We’ll send that off for you. Here is a link to the card preview &lt;some link&gt;.

### The Setup
Getting set up is pretty straight forward. First, we’ll need a [SparkPost account](https://app.sparkpost.com/join). We will also need to add a [sending domain](https://www.sparkpost.com/docs/getting-started/getting-started-sparkpost/#preparing-your-from-address) and an [inbound domain](https://www.sparkpost.com/docs/tech-resources/inbound-email-relay-webhook/).

Once we have those things set up it’s time to start writing our bot. Let’s start a project and grab the fuse-email framework:

```sh
npm init
npm install lob --save
npm install fuse-email --save
```

We then want to configure it to start developing:

```js
const Fuse = require('fuse-email');
const port = process.env.PORT || 3000;

var fuse = Fuse({
	email_key: 'YOUR_SPARKPOST_KEY',
	domain: YOUR_DOMAIN,
	endpoint: '/relay',
	name: 'Card Bot',
	address: 'whitehouse@sendmailfor.me',
});
```

I’m going to set this up for local development. Because SparkPost needs to have a URL to pass the inbound email to via relay webhooks, I’ll use [ngrok](https://ngrok.com/) which will expose my localhost at a specific port to the outside world. Fuse has a function called `setupTransport` that will verify whether our SparkPost sending and inbound domains are correctly set up, and then create a relay webhook targeting the endpoint on the given domain as provided in the options.

```js
const Fuse = require('fuse-email');
const port = process.env.PORT || 3000;
var fuse;

ngrok.connect(port, function(err, url) {
	fuse = Fuse({
		email_key: 'YOUR_SPARKPOST_KEY',
		domain: url,
		endpoint: '/relay',
		name: 'Card Bot',
		address: 'whitehouse@sendmailfor.me',
	});
	
	setupServer();
	setupTheConversation();
});
```


Now we can write the `setupServer` function to use the shortcut methods from Fuse to set up the server and endpoint:

```js
function setupServer() {
	fuse.setupTransport(function() {
		fuse.setupServer(port, function(err, server) {
			fuse.setupEndpoint(server);
		});
	});
}

...
const Lob = require('lob')('YOUR_LOB_TEST_KEY');
```


### Building the Bot
After we set up the server, we called the `setupTheConversation` function. Let’s build that out. Here we can add a listener to Fuse that will start the conversation when it “hears” or matches the pattern in the email subject or body. Let’s listen for any of the following keywords: `'postcard', 'card', 'start', 'send'`. Now if we send a message with the body or subject that contains any of these words, we will start the process of sending a postcard.

```js
fuse.hears(['postcard', 'card', 'start', 'send'], 'direct_email', function(responder, inboundMessage) {
	responder.startPrivateConversation('Send a Postcard', startSending);
});
```

Next we need to define the function `startSending`, which will kick off our conversation. We’ll add a postcard key to the convo as a way to store the user’s responses.

```js
function startSending(convo) {
	convo.postcard = {};

	convo.ask({
		body: 'Ok, what message should your postcard have?',
	}, getMessage);
}
```

The `getMessage` function will be called when they respond with the message for the postcard. Fuse has a few [helper methods](https://github.com/aymg/fuse-email#helper-functions) to pull out their response. We’ll use `fuse.getLatest` to get their response to the question and `fuse.clean` to strip out any html or extra whitespace from the message.

```js
function getMessage(convo, inboundMessage) {
	convo.postcard.message = fuse.clean(fuse.getLatest(inboundMessage)) || '';

	if (convo.postcard.message.length === 0) {
		return convo.ask({
			body: 'Huh, I didn\'t get your message. Can you send me one?',
		}, getMessage);
	}
	
	convo.ask({
		body: 'Got it 🙂 What image should we put on the postcard?',
	}, getImage);
}
```

Following the same pattern we can define the `getImage` function in order to pull out the image the user sent us. We need to call `convo.wait()` to keep the conversation alive while we do some async work with the Lob API.

```js
function getImage(convo, inboundMessage) {
	let image = inboundMessage.attachments.length > 0 ? inboundMessage.attachments[0] : null;
	
	convo.postcard.image = image ? image : null;
	
	if (!image) {
		return convo.ask({
			body: 'Huh, I didn\'t get your image. Can you send me one?',
		}, getImage);
	}
	
	convo.wait();
	sendTheCard(convo, inboundMessage);
}
```

Finally, we want to create the `sendTheCard` function. This will end the bot conversation with a link to the preview that Lob has created for us.

```js
function sendTheCard(convo, inboundMessage) {
	Lob.postcards.create({
		description: `Postcard to the White House from ${inboundMessage.from}`,
		to: {
			name: 'The White House',
			address_line1: '1600 Pennsylvania Ave',
			address_city: 'Washington',
			address_state: 'DC',
			address_zip: '20500'
		},
		front: `<html><body><img src="data:${convo.postcard.image.contentType};base64,'${convo.postcard.image.content.toString('base64')}"/></html>`,
		message: convo.postcard.message
	}, function (err, res) {
		convo.send({
			body: `Sweet! We'll send that off for you. Here is a link to the card preview ${res.url}.`
		});
	});
}
```

And that’s it! We’ve created an email bot that will send postcards to the White House. You can view a preview of a postcard [here](https://drive.google.com/file/d/0BxmoST0Dole9VGQ1T2xOdzZST00/view). Interested in the code? Feel free to [fork the repo](https://github.com/avigoldman/fuse-email) or submit a pull request. Leave a comment below or come chat in our [Community Slack](http://slack.sparkpost.com/) — I’d love to hear what you build.

— [Avi Goldman](https://twitter.com/theavigoldman)