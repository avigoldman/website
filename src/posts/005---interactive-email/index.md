import Tutorial from './Tutorial' 
import MoreReading from 'components/Post/MoreReading'

export const frontmatter = { 
  title: 'How does Interactive Email Work?',
  date: '2018-05-14',
  draft: true
}

An interactive email is an email that does something based on a user's action. The interaction can be as simple as changing the background color of a button when the user hovers over it or as complex as a [full shopping cart](https://gorebel.com/shop.html). 

Email clients strip out JavaScript to protect us from dangerous senders. The key is that the functionality is entirely driven through some clever HTML and CSS hacks. There are definitely challenges in doing this, not least of which is the [limited support](http://blog.gorebel.com/email-client-support/) `61%`. But there is a lot of potential [business value](https://litmus.com/blog/qa-with-rebelmail-how-to-get-buy-in-for-interactive-email) and opportunities to [delight our recipients](https://www.sparkpost.com/blog/interactive-email/)!


## The punched card technique

We have [a few techniques](http://freshinbox.com/blog/category/interactive-email-tutorial/) we can use for different pieces of interactivity. The one that we'll use is the [punched card](https://www.webdesignerdepot.com/2015/10/punched-card-coding-the-secret-of-interactive-email/) method coined by [Mark Robbins](https://twitter.com/m_j_robbins). It is probably the most versatile and powerful way to add interactivity.


We need an email client that supports 3 things.

1. the `<input />` tag
2. the `:checked` selector
3. the `+` and `~` selectors to target siblings


## Let's code

Let's build a simple example with a button that shows and hides some text.


<Tutorial />

---

### Review


We successfully made a simple interactive email with a safe fallback! You can take this concept and build some really awesome stuff. With some CSS animations you could make this into a scratch off promotion, a simple accordion, or even a hamburger menu.


Have suggestions or corrections? Let me know at <a href="https://twitter.com/theavigoldman">@theavigoldman</a>.

### More Reading

<MoreReading links={[
  {
    text: 'Punched Card Coding: the Secret of Interactive Email',
    link: 'https://www.webdesignerdepot.com/2015/10/punched-card-coding-the-secret-of-interactive-email/'
  },
  {
    text: 'Build an Interactive Carousel for Email',
    link: 'https://www.emailonacid.com/blog/article/email-development/build-an-interactive-carousel-for-email'
  },
  {
    text: 'Four Interactive Email Fallback Strategies',
    link: 'https://www.emailonacid.com/blog/article/email-development/four-interactive-email-fallback-strategies'
  }
]} />