export const frontmatter = { 
  title: 'Announcing HEML: An Open Source Framework for Email',
  date: '2017-10-27',
  description: 'HEML makes building emails as easy as building websites. We walk through why we’ve decided to launch this exciting open source project.',
  canonical: 'https://www.sparkpost.com/blog/heml-open-source/'
}


Today I am excited to announce the first release of [HEML](https://heml.io/), an open source markup language for crafting clean, responsive emails.

### Why
If you’re not familiar with writing HTML emails, [it can be a painful process](https://www.sparkpost.com/blog/topol-html-email-templates/). A few months ago I started to play with some exciting interactive developments on the front end. I found the bottleneck wasn’t sending or testing the email, but simply building the email itself. At our next company hackathon, I took the opportunity to solve this problem, and thus HEML was born.

Each element in HEML renders into email-ready HTML so that you can send without worry. HEML also works to iron out CSS bugs and limitations of different email clients. An excellent example of one such bug is an obscure issue in Lotus Notes where if you use RGB decimal value, the entire style declaration will be ignored. HEML will handle that bug for you.

### Our Goals
We wanted HEML to help make email more accessible to developers. The idea is for developers to jump in quickly and build their emails without wrestling with Outlook (or any other email inbox). To do this, we focused on three things.

### Native feel
We wanted HEML to look and feel like HTML. As a result, it mirrors HTML as closely as possible and uses plain ol’ CSS for styling.

### Forward Thinking
HEML doesn’t limit you from taking advantage of all that HTML and CSS can do. It encourages progressive enhancements. [Email doesn’t have to look the same everywhere.](https://emails.hteumeuleu.com/do-emails-need-to-look-exactly-the-same-in-every-client-5c0ec5ca541d?gi=91ed85e8f084)

Extendable

HEML lets you create your custom elements, share them, and pull in other elements made by the community.

### Using HEML
There are a couple of different ways to use HEML.

Get started quickly using our editor at [heml.io/editor](https://heml.io/editor).

![](https://media.sparkpost.com/uploads/2017/10/ezgif-5-df93edf292.gif)


To use it locally, install it with:

```sh
npm install -g heml
```

Create your HEML email in `email.heml`:

```html
<heml>
  <head>
    <subject>Email Rox!</subject>
    <style>
      body { background: SkyBlue; }
      h1 { color: DarkViolet; }
    </style>
  </head>
  <body>
    <container>
      <marquee><h1>Hello world 💌</h1></marquee>
    </container>
  </body>
</heml>
```

and run: 

```sh
heml develop email.heml
```
That starts a development server that will auto-reload your browser whenever you make a change.

Once you’re ready to send your email into the wild, run:

```sh
heml build email.heml
```

This generates an `email.html` file that is ready to be sent.

Give it a spin!

This is our take on a difficult problem. It doesn’t solve every problem presented by email, but it can help you create solutions for your unique email challenges. There has been amazing work done to simplify this challenge by [MJML](https://mjml.io/), [Foundation for Email](https://foundation.zurb.com/emails.html), and many others. We hope you find this equally as helpful!

So give it a try! Hopefully, it makes your life easier. If you have any feedback, suggestions, or bugs, [let us know](https://github.com/SparkPost/heml/issues).

 

Happy Coding!

Avi, Developer Advocate
[@theavigoldman](https://twitter.com/theavigoldman)