/**
 * The paid PDF guide. Everything about the product lives here.
 *
 * TO GO LIVE: paste your Stripe Payment Link below (see README, "Sell the guide").
 * While it's empty, the Buy buttons show a "payment link not set" note instead.
 */
export const guide = {
  name: 'The 90-Day Social Media Growth Guide for Local Businesses',
  shortName: 'The 90-Day Social Media Growth Guide',
  tagline: 'Turn followers into customers in 90 days',
  price: '$27',
  pages: 42,
  author: 'Andrew Corter, Founder and CEO of Corter Digital',
  supportEmail: 'andrewcsmma@gmail.com',

  /** Stripe Payment Link, e.g. "https://buy.stripe.com/abc123". Leave '' until you have it. */
  paymentLink: 'https://buy.stripe.com/7sYcN50XpdBj2lx0S9gYU09',

  /** The file buyers download (in public/downloads/). Change this if you replace the PDF. */
  file: '/downloads/The-90-Day-Social-Media-Growth-Guide-f8d92ff4f641.pdf',
  /** The name the file is saved as on the buyer's device */
  downloadName: 'The-90-Day-Social-Media-Growth-Guide.pdf',

  modules: [
    { title: 'Know Your Local Customer', solves: 'Posting for "everyone" and reaching no one' },
    { title: 'Choosing Your Platforms (and Ignoring the Rest)', solves: 'Trying to be everywhere at once' },
    { title: 'Setting Up Profiles That Get Found Locally', solves: 'Profiles that don\'t say what you do or where' },
    { title: 'What to Post When You Don\'t Know What to Post', solves: 'Staring at a blank screen with no ideas' },
    { title: 'Creating Content With No Time, Budget or Camera Confidence', solves: 'No time, no budget, and hating being on camera' },
    { title: 'Getting Seen: Reach and the Algorithm', solves: 'Posting consistently and getting almost no views' },
    { title: 'Turning Followers Into Customers', solves: 'Likes and views that never turn into sales' },
    { title: 'Reviews, Reputation and Community', solves: 'Too few reviews and fear of bad ones' },
    { title: 'Small-Budget Ads and Measuring What Works', solves: 'Wasting money on ads and not knowing what\'s working' },
  ],
} as const;
