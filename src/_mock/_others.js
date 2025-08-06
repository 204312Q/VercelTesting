import { label } from 'yet-another-react-lightbox';
import { _mock } from './_mock';
import Image from 'next/image';
import { sizeof } from 'stylis';
import { paths } from 'src/routes/paths';
import { createChainableState } from '@tiptap/core';

// ----------------------------------------------------------------------

export const _carouselPackages = [
  {
    id: 1,
    name: '28 Days Dual Meal',
    image: '/menu/HakkaYellowWineChickenwithBlackFungus_360x.webp',
    alt: '28 Days Dual Meal',
    description: 'Lunch and Dinner | $$/meal',
    price: '$1,768.00'
  },
  {
    id: 2,
    name: '14 Days Dual Meal',
    image: '/menu/Pigs_Trotter_with_Ginger_Vinegar_and_Egg.webp',
    alt: '14 Days Dual Meal',
    description: 'Lunch and Dinner | $$/meal',
    price: '$968.00'
  },
  {
    id: 3,
    name: '7 Days Dual Meal',
    image: '/menu/product-2.webp',
    alt: '7 Days Dual Meal',
    description: 'Lunch and Dinner | $$/meal',
    price: '$498.00'
  }
];

export const _carouselBenefits = [
  {
    id: 1,
    name: 'Convenience & Quality',
    image: '/assets/benefitsImage/Benefit-1.webp',
    alt: 'Convenience & Quality',
    size: 'cover',
    description: 'Our unique thermal wares ensure that warm and nutritious meals are delivered to your doorstep timely. Skip the hassle on meal planning, grocery shopping, cooking or washing dishes. Indulge in the luxury of spending quality time with your newborn and family.',
  },
  {
    id: 2,
    name: 'Meals crafted for your recovery',
    image: '/assets/benefitsImage/Benefit-2.webp',
    alt: 'Meals crafted for your recovery',
    size: 'cover',
    description: 'Our meals are prepared low in sodium and MSG-free without compromising the taste. These essential nutrients and traditional herbs improve digestion, support healthy lactation and restore the body\'s core energy.',
  },
  {
    id: 3,
    name: 'Alchemy Fibre™ For healthier mum',
    image: '/assets/benefitsImage/Benefit-3.webp',
    alt: 'Alchemy Fibre™ For healthier mum',
    size: 'contain',
    description: 'At Chilli Padi Confinement, we enhance our Fragrant White Rice with Alchemy Fibre™ for Rice, providing a healthier choice for new mothers. This revolutionary blend of low GI, high fibre, and prebiotics transforms white rice, significantly increasing its fibre content without compromising taste or texture.',
  }
];

export const _carouselPromotion = [
  {
    id: 1,
    name: 'Baby Full Month Gift Set',
    url: paths.product.root,
    image: '/assets/feature/feature-3.webp',
    alt: 'Baby Full Month Gift Set',
    size: 'cover',
    description: 'Celebrate the arrival of your newborn! Full Month Gift Sets are typically given to friends and relatives to announce the birth of a baby. A time-honoured tradition in Chinese culture, these symbolic gift sets, also known as Full Moon Gift Boxes (满月礼盒), typically contain red eggs, ang ku kueh, and cake.',
  },
  {
    id: 2,
    name: 'BMB Packages',
    url: paths.product.root,
    image: '/assets/feature/feature-1.webp',
    alt: 'BMB Packages',
    size: 'cover',
    description: 'BMB\'s team of certified professionals specializes in both Traditional Chinese Massage (TCM) and Javanese methods. Their proprietary massage strokes combine Javanese techniques and Meridian points, effectively decreasing swelling, relieving pain, and regulating hormones.',
  },
  {
    id: 3,
    name: 'Baby Shower Catering',
    url: 'https://chilliapi.com.sg/catering/menu/baby-shower-buffet',
    image: '/assets/feature/feature-2.webp',
    alt: 'Baby Shower',
    size: 'cover',
    description: 'Our catering services go beyond just great food. We also offer thematic set-ups at an additional cost to make your baby shower even more special and memorable. Our team of experienced and professional caterers will work closely with you to ensure that your event is a success and that your guests are thoroughly impressed.',
  }
];

export const _carouselPopularDish = [
  {
    id: 1,
    name: 'Pig\'s Trotter with Ginger, Vinegar and Egg',
    image: '/assets/popularDish/pigtrotters_flatlay 1.webp',
    alt: 'Pig Trotter with Ginger, Vinegar and Egg',
    description: 'Pig trotters are often consumed during confinement as they are rich in collagen. When combined with vinegar, pig trotters can help to alleviate joint pain, improve skin conditions and have a warming effect on the body. ',
    chineseName: '猪脚醋',
    chineseDescription: '猪脚醋是坐月子必备的滋补美食。猪脚醋富含胶原蛋白，养颜美肤，并且可以帮助缓解关节疼痛以及驱寒祛风',
  },
  {
    id: 2,
    name: 'Milk Boosting Fish and Papaya Soup',
    image: '/assets/popularDish/Milk Boosting Fish and Papaya Soup.webp',
    alt: 'Milk Boosting Fish and Papaya Soup',
    description: 'Papaya fish soup is a traditional dish highly recommended for confinement mothers. The combination of papaya and fish helps to enhance the healing process, support lactation and improve digestion.',
    chineseName: '木瓜鱼汤',
    chineseDescription: '木瓜鱼汤是一道非常适合产后妈妈的传统菜肴。木瓜鱼汤有助于愈合过程、促进催 乳以及促进消化。',
  },
  {
    id: 3,
    name: 'Wok Fried Huai Shan Noodle with Egg' ,
    image: '/assets/popularDish/Wok Fried Huai Shan Noodle with Egg.webp',
    alt: 'Wok Fried Huai Shan Noodle with Egg',
    description: 'Wok Fried Huai Shan Noodle with Egg is a popular dish during confinement. It is believed that the dish helps to restore energy and strength after childbirth, while also providing essential nutrients for recovery.',
    chineseName: '蛋炒淮山面',
    chineseDescription: '在这个重要的月子期间，吃得好是恢复体力的关键。鱼有助于修复受损细胞，防止肌肉质量的退化。',
  }
];

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
    href: 'https://www.facebook.com/chillipadiconfinement/',
  },
  {
    value: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/chillipadiconfinement/',
  }
];

export const _paymenttypes = [
  {
    id: 1,
    value: 'Visa',
    image: '/payment/visa.svg',
  },
  {
    id: 2,
    value: 'Mastercard',
    image: '/payment/mastercard.svg',
  },
  {
    id: 3,
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
