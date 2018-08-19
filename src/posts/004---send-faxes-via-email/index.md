export const frontmatter = { 
  title: 'How To Send Faxes Via Email Using SparkPost, Twilio & Cloudinary',
  date: '2018-01-12',
  description: 'It’s time to ditch the old fashioned fax machine! Learn how to send faxes via email using the SparkPost API, Twilio, and Cloudinary.',
  canonical: 'https://www.sparkpost.com/blog/send-faxes-via-email/'
}


### No Fax Machine? No Problem! SparkPost, Twilio, and Cloudinary Are Here To Save The Day!

I don’t know about you, but I don’t have a fax machine. Once in a blue moon, I have to send or receive a fax, so I was excited when Twilio shared an awesome way to receive faxes straight to your email using SparkPost. But that is only half the battle. I decided to build the ability to send faxes from an email so I would never need a fax machine again!

We’ll build a function so we can send a PDF attachment to FAX\_NUMBER@YOUR\_DOMAIN, which will automatically fax the PDF to the phone number before the at sign (a.k.a. the local part, for all you [email geeks](https://www.meetup.com/emailgeeksSF/) out there). To do this, we’ll use SparkPost’s inbound functionality, Twilio’s Fax API, and Cloudinary to glue them together. We’ll receive an email to a Twilio function, pull off the attached PDF, save it to Cloudinary, and send it as a fax.

### Sign Up and Configure Your SparkPost Account

The first thing you’ll need is a [SparkPost account](https://app.sparkpost.com/join) and a domain you want to use to receive mail (a.k.a. an [inbound domain](https://developers.sparkpost.com/api/inbound-domains.html)). You’ll also need to create an API key with permissions to read and write`inbound domains` and `relay webhooks`

![](https://media.sparkpost.com/uploads/2018/01/Screen-Shot-2018-01-10-at-3.27.28-PM.png)

Next, add the [SparkPost MX](https://www.sparkpost.com/docs/tech-resources/inbound-email-relay-webhook/#add-mx-records) records for your inbound domain. Once you[ verify](https://mxtoolbox.com/) that they are set up correctly, run the following cURL to add your inbound domain.

```sh
curl -XPOST \\
  https://api.sparkpost.com/api/v1/inbound-domains \\
  -H "Authorization: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "domain": "YOUR_DOMAIN" }'
```

### Sign Up For Cloudinary

Next, we’ll need a [Cloudinary account](https://cloudinary.com/users/register/free) to store the PDF we’ll fax. If you don’t know, Cloudinary is a powerful solution for storing, manipulating, and delivering all your media. Grab your cloud name, API key, and API secret and put them somewhere safe for later.

![](https://media.sparkpost.com/uploads/2018/01/Screen-Shot-2018-01-10-at-3.41.58-PM.png)

### Create & Configure Twilio

We’ll use Twilio to consume the incoming emails and send the faxes. To get started, [sign up](https://www.twilio.com/try-twilio) for an account, and [buy a phone number](https://www.twilio.com/login?g=%2Fconsole%2Fphone-numbers%2Fsearch%2Fbuy%2Fresults&t=3a4d26ea80f7766974e80da9f2835d8e4df28f63a511efd5ae0093c5cb47e0d9) that can send and receive faxes.

![](https://media.sparkpost.com/uploads/2018/01/Screen-Shot-2018-01-10-at-3.43.40-PM.png)

Twilio’s serverless functions are perfect for this project. This isn’t a stateful application and it doesn’t need to be running all the time. Using one, we can quickly get set up and run our application.

---

We’ll need the following NPM modules for our function:

![](https://media.sparkpost.com/uploads/2018/01/Screen-Shot-2018-01-10-at-3.45.46-PM.png)

Let’s also add in our environment variables for Cloudinary and enable Twilio’s option to pass through our `ACCOUNT_SID` and `AUTH_TOKEN` so we can use their client library without worrying about our credentials:

![](https://media.sparkpost.com/uploads/2018/01/Screen-Shot-2018-01-10-at-3.48.59-PM.png)

### The Code

First things first, let’s write our basic Twilio function and pull in our dependencies:

```js
const cloudinary = require('cloudinary')
const { MailParser } = require('mailparser')
const { toArray } = require('lodash')
exports.handler = function(context, messages, callback) {
  const twilio = context.getTwilioClient()
  cloudinary.config({
    cloud_name: context.CLOUDINARY_NAME,
    api_key: context.CLOUDINARY_KEY,
    api_secret: context.CLOUDINARY_SECRET
  })
}
```

The `messages` variable is an object full of the messages SparkPost handed off to us. We’ll need to loop through the messages, pull off the attachment, save it to Cloudinary, and send off the fax.

```js
// after the cloudinary config
const promises = toArray(messages).map((message) => {
    const toNumber = pickPhoneNumber(message)
    return pickPdfAttachment(message)
      .then((attachment) => {
        if (!attachment) { return false }
        return uploadAttachment(attachment)
      })
      .then((mediaUrl) => {
        return sendFax(twilio, toNumber, mediaUrl)
      })
  })
  Promise.all(promises)
    .then(() => callback(null, 'success'))
    .catch((error) => callback(error))
```

### Parsing The Email

You can see an example the [payload SparkPost sends](https://developers.sparkpost.com/api/relay-webhooks.html#header-example-payloads) in the API documentation. The important parts for us are the `rcpt_to`and the
`content` which will contain the raw email. These live inside `message.msys.relay_message`.

We can pull out the phone number by splitting off the local part from the `rcpt_to` value – everything before the `@`.

```js
function pickPhoneNumber(message) {
  return message.msys.relay_message.rcpt_to.split('@')[0]
}
```

We’ll also need to pull the PDF off of the message. To do this, we’ll parse the RFC 822 value using the `mailparser` library and return the content of the first PDF attached.

```js
function pickPdfAttachment(message) {
  return new Promise((resolve, reject) => {
    const content = message.msys.relay_message.content
    const isBase64 = content.email_rfc822_is_base64
    const body = isBase64 ? Buffer.from(content.email_rfc822, 'base64') : content.email_rfc822
    const parser = new MailParser({ streamAttachments: true })
    let attachment
    parser.on('data', (data) => {
      if(!attachment &&
          data.type === 'attachment' &&
          data.contentType === 'application/pdf') {
        attachment = data.content
      }
    })
    parser.on('error', reject)
    parser.write(body)
    parser.end(() => resolve(attachment))
  })
}
```

### Saving The Attachment

Assuming we get an attachment, we’ll need to put it in an accessible spot for Twilio to pull it from. Enter Cloudinary. Using their Node library we can easily pipe the PDF and get the publicly accessible URL.

```js
function uploadAttachment(attachment) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream((error, result) => {
      if (error) {
        reject(error)
      }
      else {
        resolve(result.url)
      }
    })
    attachment.pipe(stream)
  })
}
```

### Sending The Fax

The last step for our code is to send the fax! Twilio makes this really easy. We need three values: the number we are sending to, the number we are sending from, and the media url. We’ll use the number we bought earlier to send for the “from” number. And we should have a phone number from the local part of the email and the media url from Cloudinary!

```js
function sendFax(twilio, toNumber, mediaUrl) {
  return twilio.fax.v1.faxes.create({
      to: toNumber,
      from: YOUR_PHONE_NUMBER,
      mediaUrl: mediaUrl,
    })
    .then((res) => {
      console.log('sent', mediaUrl, 'to', toNumber)
    })
}
```

### Create A Relay Webhook

The last piece of the puzzle it to tie our inbound domain from SparkPost to our Twilio function. Let’s create a relay webhook to pass all mail sent to our inbound domain onto our Twilio function. Copy your function path and pass it into this cURL request to create the relay webhook. Make sure that “Check for valid Twilio signature” is unchecked so that SparkPost can access it!

![](https://media.sparkpost.com/uploads/2018/01/Screen-Shot-2018-01-10-at-4.13.11-PM.png)

```sh
curl -XPOST \
  https://api.sparkpost.com/api/v1/relay-webhooks \\
  -H "Authorization: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "target": "YOUR_TWILIO_PATH", "match": { "domain": "YOUR_INBOUND_DOMAIN", "protocol": "SMTP" }, "name": "Email-to-Fax" }'
```

### Send The Fax!! 🎉

Send an email over to FAX\_NUMBER@YOUR\_DOMAIN with your fax attached as a PDF and it should go through!

You can set up receiving faxes for a fully working email fax machine with some [guidance](https://www.twilio.com/blog/2017/12/fax-to-email-twilio-functions-sparkpost.html) from our friend [Patrick](https://twitter.com/kolencherry) at [Twilio](https://www.twilio.com/)! Feel free to [reach](https://twitter.com/theavigoldman) out if you’ve got any questions and have fun faxing!

-Avi

P.S. Before you launch this to the world, you’ll probably want to validate the phone numbers you’re sending to and add some security to who can send. I’d suggest a token in the email that you verify in the Twilio function.