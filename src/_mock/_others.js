import { label } from 'yet-another-react-lightbox';
import { _mock } from './_mock';
import Image from 'next/image';
import { sizeof } from 'stylis';
import { paths } from 'src/routes/paths';
import { createChainableState } from '@tiptap/core';
import { DesktopDatePicker } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

export const _carouselPackages = [
  {
    id: 1,
    name: '28 Days Dual Meal',
    image: '/menu/HakkaYellowWineChickenwithBlackFungus_360x.webp',
    alt: '28 Days Dual Meal',
    description: 'Lunch and Dinner | $31.57/meal',
    price: '$1,768.00'
  },
  {
    id: 2,
    name: '14 Days Dual Meal',
    image: '/menu/Pigs_Trotter_with_Ginger_Vinegar_and_Egg.webp',
    alt: '14 Days Dual Meal',
    description: 'Lunch and Dinner | $34.57/meal',
    price: '$968.00'
  },
  {
    id: 3,
    name: '7 Days Dual Meal',
    image: '/menu/product-2.webp',
    alt: '7 Days Dual Meal',
    description: 'Lunch and Dinner | $35.57/meal',
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
    name: 'Wok Fried Huai Shan Noodle with Egg',
    image: '/assets/popularDish/Wok Fried Huai Shan Noodle with Egg.webp',
    alt: 'Wok Fried Huai Shan Noodle with Egg',
    description: 'Wok Fried Huai Shan Noodle with Egg is a popular dish during confinement. It is believed that the dish helps to restore energy and strength after childbirth, while also providing essential nutrients for recovery.',
    chineseName: '蛋炒淮山面',
    chineseDescription: '在这个重要的月子期间，吃得好是恢复体力的关键。鱼有助于修复受损细胞，防止肌肉质量的退化。',
  }
];

export const _packageCategories = [
  {
    id: 1,
    name: "Dual Meal",
    description: "Lunch And Dinner",
    image: "/menu/HakkaYellowWineChickenwithBlackFungus_360x.webp",
    startingPrice: "498.00"
  },
  {
    id: 2,
    name: "Single Meal",
    description: "Lunch Or Dinner",
    image: "/menu/Pigs_Trotter_with_Ginger_Vinegar_and_Egg.webp",
    startingPrice: "498.00"
  },
  {
    id: 3,
    name: "Trial Meal",
    description: "Lunch Or Dinner",
    image: "/menu/product-2.webp",
    startingPrice: "38.00"
  }
];

// ----------------------------------------------------------------------

export const _faqs = [
  {
    id: 1,
    category: 'Confinement Meals',
    questions: [
      {
        id: 'cm-1',
        value: 'panel-cm-1',
        heading: 'What is Confinement food?',
        detail: 'The emphasis of confinement food is to ensure that mothers gain the essential nutrients during their postnatal recovery. Consuming the right food cooked in the right manner would help revitalize your body’s immune system, expel ‘wind’ from the body, strengthen your joints and supports healthy lactation and improve blood circulation.\n\nAt Chilli Padi, we seek not just to maintain the Chinese confinement food tradition but also to innovate and create fusion dishes to satisfy the taste buds of modern mummies!'
      },
      {
        id: 'cm-2',
        value: 'panel-cm-2',
        heading: 'Are your confinement meals Halal?',
        detail: 'Apologies, our confinement meals are not halal.'
      },
      {
        id: 'cm-3',
        value: 'panel-cm-3',
        heading: 'How long is the Confinement period and are the dishes different each week?',
        detail: 'A typical confinement period would last 4 weeks and our meals are designed to cater to your dietary requirements through this period.\n\nRecovery Stage Day 1 - 7 confinement meals\' purpose is to expel the ‘wind’ in the body and also has detoxification effect especially to drive out the stale blood from the body.\n\nNourish Stage Day 8 - 28 confinement meals are to replenish your ‘Qi’ regulate and balance the bodily functions as well as boosting the immune system for postnatal recovery.'
      },
      {
        id: 'cm-4',
        value: 'panel-cm-4',
        heading: 'I intend to breastfeed my child, does your food promote lactation and how it benefits me?',
        detail: 'We have incorporated ingredients that promotes lactation into our confinement menu such as Green Papaya, Spinach and Salmon.\n\nGreen Papaya is popular as a galactagogue as it increases the production of oxytocin hormones which helps regulate the production of milk and is also rich in Vitamins. It is a must-have super food for lactating moms!\n\nAs for Spinach, it is rich in Iron and is effective in replenishing your iron levels. Studies have shown that low iron levels are associated with low milk supply. Hence, our confinement meals are deftly crafted to replenish your nutrients and to balance your body.\n\nFish such as Salmon are a great source of Omega-3 (DHA) which is vital for healthy brain development and function in babies. While breastfeeding, the mummy’s own supply of Omega-3 will diminish, hence this ensures mummies will get their intake of Omega-3.'
      },
      {
        id: 'cm-5',
        value: 'panel-cm-5',
        heading: 'What should I avoid?',
        detail: 'Post-partum meals place emphasis on keeping the body warm. Traditional beliefs are that post-partum mothers should avoid cooling foods; such as melons and shellfish in general.\n\nIt is advisable to consume dishes which has wine, old ginger and sesame oil as these help ‘heat’ the body.\n\nThese ingredients have been incorporated into the dishes we provide for our confinement meals.'
      },
      {
        id: 'cm-6',
        value: 'panel-cm-6',
        heading: 'Does ginger cause jaundice in babies?',
        detail: 'There has been no evidence that ginger consumed by breastfeeding mothers would cause a baby to be jaundiced. Ginger can be taken during confinement and breastfeeding.'
      },
      {
        id: 'cm-7',
        value: 'panel-cm-7',
        heading: 'How important is it to incorporate soups into the diet of mothers going through Confinement?',
        detail: 'Most soups provided with our meals are double boiled. The Double boiling technique is a slow and gentle process which better extract the flavour, essence and nutrients of the ingredients and offers maximum benefit to post-partum mums for their recovery.\n\nFish and Papaya Soup are also incorporated into the confinement meals we provide, and are beneficial for mummies who intend to breastfeed.'
      }
    ]
  },
  {
    id: 2,
    category: 'Service Fulfillment',
    questions: [
      {
        id: 'sf-1',
        value: 'panel-sf-1',
        heading: 'What time is the Confinement Meal Delivery?',
        detail: 'Our Confinement Food Delivery Timing is:\n\nLunch: Between 10.00AM to 1.00PM Dinner: Between 4.00PM to 7.00PM\n\n*There is no confinement meal delivery on Christmas Day, CNY Eve, CNY  Day 1 and Day 2. Meals would be replaced. *We are unable to guarantee meal delivery at a specific timing as many factors are to be considered such as traffic and weather conditions.'
      },
      {
        id: 'sf-2',
        value: 'panel-sf-2',
        heading: 'Where do we deliver?',
        detail: 'We deliver island wide (strictly to residential address only regardless trial meal or package meal) except Tuas areas.\nFor delivery to Sentosa, additional $20 per trip.'
      },
      {
        id: 'sf-3',
        value: 'panel-sf-3',
        heading: 'How will Chilli Padi Confinement Meal be delivered?',
        detail: 'Our meals are served using thermal containers (High Quality Tingkat).\n\n*For trial meal & the very last meal of the package, microwavable containers will be used for the meal delivery.'
      },
      {
        id: 'sf-4',
        value: 'panel-sf-4',
        heading: 'As my due date is only an estimate. What if I deliver much earlier or later?',
        detail: 'Once your booking is confirmed, we will deliver the meal upon request even if it is earlier or later. All you would have to do is to inform us 1 working day in advance before 2:00PM (for delivery on weekdays) or 2 working days in advance before 2:00PM (for delivery on weekends and PH) for your confinement meal delivery to commence.'
      },
      {
        id: 'sf-5',
        value: 'panel-sf-5',
        heading: 'I do not take certain ingredients; can I request to remove or replace the dish?',
        detail: 'This will be subjected to availability. Do inform us on the ingredients or dishes that you do not consume, we will try our best to accommodate to your request.\n\nAs to what the dish will be replaced to, it will be decided by our Chef on the day itself and we will not be able to provide a menu for this.'
      },
      {
        id: 'sf-6',
        value: 'panel-sf-6',
        heading: 'Can I upgrade my package?',
        detail: 'Customers may upgrade their package by informing us 3 working days in advance by 2:00PM, before the last day of the package.\n\nCustomers would have top-up the difference in packages price and payment can be done by Bank Transfer.'
      },
      {
        id: 'sf-7',
        value: 'panel-sf-7',
        heading: 'How do I commence or postpone my meals?',
        detail: 'Customer may call us at 6914 9900, email us (confinement@chillipadi.com.sg) or chat with us on Messenger.\n\nCommencing meal deliveries:\n• Customers would have to inform us 1 working day in advance before 2:00PM (for delivery on weekdays) or 2 working days in advance before 2:00PM (for delivery on weekends and PH) for the commencement of your confinement delivery.\n• Remainder payment of package would have to be made by 3rd Day of meal delivery, failing which Chilli Padi Confinement reserves the rights to terminate the service.\n\nMeal postponement:\n• Customers would have to inform us 1 working day in advance before 2:00PM (for delivery on weekdays) or 2 working days in advance before 2:00PM (for delivery on weekends and PH). The meal will be replaced (please note that we only allow maximum 3 postpone dates).\n• In the event that the meal has to be cancelled without sufficient notice provided, there will be no meal replacements and refunds.'
      },
      {
        id: 'sf-8',
        value: 'panel-sf-8',
        heading: 'Can I change my delivery address?',
        detail: 'Yes you may. Customers would have to inform us 1 working day in advance before 2:00PM (for delivery on weekdays) or 2 working days in advance before 2:00PM (for delivery on weekends and PH) in order for us to make the necessary arrangements.'
      }
    ]
  },
  {
    id: 3,
    category: 'Cancellation & Refunds',
    questions: [
      {
        id: 'cr-1',
        value: 'panel-cr-1',
        heading: 'What is your cancellation and refund policy?',
        detail: 'Cancellation of service:\n• Cancellation requests for purchased packages are generally not permitted and will only be considered in exceptional circumstances, strictly on a case-by-case basis.\n• Once a package is cancelled, it cannot be reinstated.\n\nRefunds:\n• Refunds for purchased packages are strictly not offered. In exceptional cases, a refund may be granted at management’s sole discretion, assessed on a case-by-case basis.'
      }
    ]
  },
  {
    id: 4,
    category: 'Add-Ons',
    questions: [
      {
        id: 'ao-1',
        value: 'panel-ao-1',
        heading: 'Add-Ons Products',
        detail: 'Add-Ons: Only available with purchase of any confinement meal packages. Not available for ala carte orders.'
      },
    ]
  },
  {
    id: 5,
    category: 'BMB Postnatal Massage Services',
    questions: [
      {
        id: 'bmb-1',
        value: 'panel-bmb-1',
        heading: 'When should I begin Postnatal Massages?',
        detail: 'For natural delivery, massage sessions will begin after 7 days. \n\nFor caesarean section (C-section), BMB recommend beginning sessions after 3 weeks or with the recommendation of your gynae. Before then, mummies can still be massaged on other parts of their body to soothe body aches. Also relieve water retention, without disturbing the fresh wound on the tummy.'
      },
      {
        id: 'bmb-2',
        value: 'panel-bmb-2',
        heading: 'How do I start my massage sessions?',
        detail: 'Upon ordering the bundle package through Chilli Padi Confinement website, BMB will reach out to you to arrange your postnatal massage sessions.'
      },
      {
        id: 'bmb-3',
        value: 'panel-bmb-3',
        heading: 'Are products used in massages and facials safe for pregnant mums?',
        detail: 'All products used are safe for pregnant mums.'
      },
      {
        id: 'bmb-4',
        value: 'panel-bmb-4',
        heading: 'Can I change my therapist mid-treatment?',
        detail: 'A change of therapist can be fulfilled upon request, at no additional cost. If you encounter issues, please contact BMB at 6235 0688 or email them at enquiry@beautymumsbabies.com.'
      },
      {
        id: 'bmb-5',
        value: 'panel-bmb-5',
        heading: 'How do I cancel my session?',
        detail: 'All cancellations must be communicated to BMB 3 hours in advance, otherwise 1 (one) session may be chargeable.'
      },
      {
        id: 'bmb-6',
        value: 'panel-bmb-6',
        heading: 'What is your cancellation / refund policy?',
        detail: 'For the full T&C, please <a href="https://beautymumsbabies.com/terms-and-conditions/" target="_blank" rel="noopener noreferrer">click here</a>.'
      }
    ]
  }
];

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
  },
  {
    value: 'tiktok',
    label: 'TikTok',
    href: 'https://www.tiktok.com/@cpconfinement?is_from_webapp=1&sender_device=pc',
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
