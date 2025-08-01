import { label } from 'yet-another-react-lightbox';
import { _mock } from './_mock';
import Image from 'next/image';

// ----------------------------------------------------------------------

export const _carouselsMembers = Array.from({ length: 6 }, (_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  role: _mock.role(index),
  avatarUrl: _mock.image.portrait(index),
}));

// ----------------------------------------------------------------------

export const _faqs = Array.from({ length: 8 }, (_, index) => ({
  id: _mock.id(index),
  value: `panel${index + 1}`,
  heading: `Questions ${index + 1}`,
  detail: _mock.description(index),
}));

// ----------------------------------------------------------------------

export const _addressBooks = Array.from({ length: 24 }, (_, index) => ({
  id: _mock.id(index),
  primary: index === 0,
  name: _mock.fullName(index),
  email: _mock.email(index + 1),
  fullAddress: _mock.fullAddress(index),
  phoneNumber: _mock.phoneNumber(index),
  company: _mock.companyNames(index + 1),
  addressType: index === 0 ? 'Home' : 'Office',
}));

// ----------------------------------------------------------------------

export const _contacts = Array.from({ length: 20 }, (_, index) => {
  const status =
    (index % 2 && 'online') || (index % 3 && 'offline') || (index % 4 && 'always') || 'busy';

  return {
    id: _mock.id(index),
    status,
    role: _mock.role(index),
    email: _mock.email(index),
    name: _mock.fullName(index),
    phoneNumber: _mock.phoneNumber(index),
    lastActivity: _mock.time(index),
    avatarUrl: _mock.image.avatar(index),
    address: _mock.fullAddress(index),
  };
});

// ----------------------------------------------------------------------

export const _notifications = Array.from({ length: 9 }, (_, index) => ({
  id: _mock.id(index),
  avatarUrl: [
    _mock.image.avatar(1),
    _mock.image.avatar(2),
    _mock.image.avatar(3),
    _mock.image.avatar(4),
    _mock.image.avatar(5),
    null,
    null,
    null,
    null,
    null,
  ][index],
  type: ['friend', 'project', 'file', 'tags', 'payment', 'order', 'chat', 'mail', 'delivery'][
    index
  ],
  category: [
    'Communication',
    'Project UI',
    'File manager',
    'File manager',
    'File manager',
    'Order',
    'Order',
    'Communication',
    'Communication',
  ][index],
  isUnRead: _mock.boolean(index),
  createdAt: _mock.time(index),
  title:
    (index === 0 && `<p><strong>Deja Brady</strong> sent you a friend request</p>`) ||
    (index === 1 &&
      `<p><strong>Jayvon Hull</strong> mentioned you in <strong><a href='#'>Minimal UI</a></strong></p>`) ||
    (index === 2 &&
      `<p><strong>Lainey Davidson</strong> added file to <strong><a href='#'>File manager</a></strong></p>`) ||
    (index === 3 &&
      `<p><strong>Angelique Morse</strong> added new tags to <strong><a href='#'>File manager<a/></strong></p>`) ||
    (index === 4 &&
      `<p><strong>Giana Brandt</strong> request a payment of <strong>$200</strong></p>`) ||
    (index === 5 && `<p>Your order is placed waiting for shipping</p>`) ||
    (index === 6 && `<p>Delivery processing your order is being shipped</p>`) ||
    (index === 7 && `<p>You have new message 5 unread messages</p>`) ||
    (index === 8 && `<p>You have new mail`) ||
    '',
}));

// ----------------------------------------------------------------------

export const _mapContact = [
  { latlng: [33, 65], address: _mock.fullAddress(1), phoneNumber: _mock.phoneNumber(1) },
  { latlng: [-12.5, 18.5], address: _mock.fullAddress(2), phoneNumber: _mock.phoneNumber(2) },
];

// ----------------------------------------------------------------------

export const _socials = [
  {
    value: 'facebook',
    label: 'Facebook',
    path: 'https://www.facebook.com/chillipadiconfinement/',
  },
  {
    value: 'instagram',
    label: 'Instagram',
    path: 'https://www.instagram.com/chillipadiconfinement/',
  }
];

export const _paymenttypes = [
  {
    value: 'Visa',
    image: '/payment/visa.svg',
  },
  {
    value: 'Mastercard',
    image: '/payment/mastercard.svg',
  },
  {
    value: 'UnionPay',
    image: '/payment/unionpay.svg',
  }
];
    

// ----------------------------------------------------------------------

export const _pricingPlans = [
  {
    subscription: 'basic',
    price: 0,
    caption: 'Forever',
    lists: ['3 prototypes', '3 boards', 'Up to 5 team members'],
    labelAction: 'Current plan',
  },
  {
    subscription: 'starter',
    price: 4.99,
    caption: 'Saving $24 a year',
    lists: [
      '3 prototypes',
      '3 boards',
      'Up to 5 team members',
      'Advanced security',
      'Issue escalation',
    ],
    labelAction: 'Choose starter',
  },
  {
    subscription: 'premium',
    price: 9.99,
    caption: 'Saving $124 a year',
    lists: [
      '3 prototypes',
      '3 boards',
      'Up to 5 team members',
      'Advanced security',
      'Issue escalation',
      'Issue development license',
      'Permissions & workflows',
    ],
    labelAction: 'Choose premium',
  },
];

// ----------------------------------------------------------------------

export const _testimonials = [
  {
    name: 'Rachel Lee @rachellrq',
    ratingNumber: _mock.number.rating(1),
    content: `Been having my confinement meals taken care by @chillipadiconfinement.
Really love their services. Delivery is always on time. PLUS their food is always store in insulated thermal lunchbox to ensure food is always served hot!
Both lunch and dinner always comes with 2 dishes, 1 rice, a soup & a flask of red dates tea. Their food even includes fish, scallops & even soups that helps postpartum mummies to recover!`,
  },
  {
    name: 'Hazel Low @16.75cnt',
    ratingNumber: _mock.number.rating(2),
    avatarUrl: _mock.image.avatar(2),
    content: `Thank you @chillipadiconfinement for the delicious confinement food the past 28 days! It feels great waking up to lunch and dinner without having to worry about what to eat and most importantly, it smells real good and taste just like home cook, not your mix veg-rice stall!`,
  },
  {
    name: 'Crystal and Family',
    ratingNumber: _mock.number.rating(3),
    content: `Customer support After much consideration and reccomendation from friends, I decided to engage Chilli Padi Confinement after my confinement Nanny left. To my amazement, their food tasted really good if not better than what the nanny prepared! Especially their "zhu jiao chu"! realy fast and helpful the desgin of this theme is looks amazing also the code is very clean and readble realy good job !`,
  },
  {
    name: 'Umehara Rei (The Amazing Race Asia 5 Finalist',
    ratingNumber: _mock.number.rating(4),
    content: `Therefore, I'm so thankful for @chillipadiconfinment making these 21 days a breeze as I get pampered with hot nutritious meals delivered in vacuum sealed containers everyday for lunch and dinner.`,
  },
  {
    name: 'Xue Han Yu Yue',
    ratingNumber: _mock.number.rating(5),
    content: `I have always thought that confinement food would not be tasty until I try out your confinement food. It is really good and have the homely taste, reminds me of my mum's cooking.`,
  },
  {
    name: 'Ruby Liang - FamilyStaycationSG',
    ratingNumber: _mock.number.rating(6),
    content: `Every single time we opened up the container, it felt as if there’s a caring mum in the kitchen who SPEND hours preparing delicious herbal soup, savoury protein (meat) and a wide variety of veggies. Making sure we were full and satisfied! Never failed to give us more than enough portion to fill our hungry tummies.`,
  },
  {
    name: 'Adeline Miller @adeline_miller',
    ratingNumber: _mock.number.rating(6),
    content: `Really grateful to have @chillipadiconfinement deliver their nutritious confinement meals to me during the last few weeks. It's my first time trying out confinement meals catering and I feel really pampered because of their generous portion.`,
  },
];
