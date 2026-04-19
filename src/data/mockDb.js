export const products = [
  {
    _id: "p1",
    title: "খাঁটি গাওয়া ঘি",
    price: 450,
    images: ["https://images.unsplash.com/photo-1602715456214-722a4d95bda3?auto=format&fit=crop&q=80&w=400"],
    description: "১০০% বিশুদ্ধ গরুর দুধ থেকে তৈরি খাঁটি গাওয়া ঘি। পূজার প্রদীপের জন্য আদর্শ।",
    category: "Oil & Ghee",
    badges: ["হাতে তৈরি", "সম্পূর্ণ প্রাকৃতিক"]
  },
  {
    _id: "p2",
    title: "চন্দন ধূপকাঠি (৫০ পিস)",
    price: 120,
    images: ["https://images.unsplash.com/photo-1606118944747-97d8bacc9365?auto=format&fit=crop&q=80&w=400"],
    description: "প্রাকৃতিক চন্দনের নির্যাস থেকে তৈরি সুগন্ধি ধূপকাঠি। ছাইমুক্ত এবং দীর্ঘস্থায়ী।",
    category: "Incense",
    badges: ["সম্পূর্ণ প্রাকৃতিক", "ধর্মীয়ভাবে প্রস্তুত"]
  },
  {
    _id: "p3",
    title: "তুলার সলতে (১০০ পিস)",
    price: 50,
    images: ["https://images.unsplash.com/photo-1596765795412-bc78c2e646fd?auto=format&fit=crop&q=80&w=400"],
    description: "নরম সুতি তুলা দিয়ে হাতে পাকানো সলতে। প্রদীপে দীর্ঘক্ষণ জ্বলে।",
    category: "Wicks",
    badges: ["হাতে তৈরি"]
  },
  {
    _id: "p4",
    title: "পূজার মিষ্টি প্যাক (২৫০ গ্রাম)",
    price: 300,
    images: ["https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400"],
    description: "বিশেষভাবে তৈরি ছানার মিষ্টি, ক্ষীর ও লাড্ডুর মিশ্রণ। প্রসাদের জন্য উপযুক্ত।",
    category: "Sweets",
    badges: ["ধর্মীয়ভাবে প্রস্তুত"]
  }
];

export const packages = [
  {
    _id: "pkg1",
    title: "১০ দিনের নিত্য পূজা প্যাকেজ",
    price: 750,
    savings: 100,
    inclusions: [
      "২৫০ গ্রাম খাঁটি ঘি",
      "৫০টি চন্দন ধূপকাঠি",
      "১০০টি তুলার সলতে",
      "১ প্যাকেট নকুলদানা"
    ]
  },
  {
    _id: "pkg2",
    title: "২০ দিনের নিত্য পূজা প্যাকেজ",
    price: 1400,
    savings: 250,
    inclusions: [
      "৫০০ গ্রাম খাঁটি ঘি",
      "১০০টি চন্দন ধূপকাঠি",
      "২০০টি তুলার সলতে",
      "২ প্যাকেট নকুলদানা"
    ]
  },
  {
    _id: "pkg3",
    title: "৩০ দিনের સંપૂર્ણ পূজা প্যাকেজ",
    price: 2000,
    savings: 450,
    inclusions: [
      "১ কেজি খাঁটি ঘি",
      "২০০টি চন্দন ধূপকাঠি",
      "৩০০টি তুলার সলতে",
      "৩ প্যাকেট নকুলদানা",
      "১টি সুন্দর পিতলের প্রদীপ (উপহার)"
    ]
  }
];

export const reviews = [
  {
    _id: "r1",
    author: "অদিতি বোস",
    location: "কলকাতা",
    rating: 5,
    text: "খুবই সুন্দর এবং পবিত্র একটি বক্স। প্যাকেজিং দেখে মুগ্ধ হয়েছি। ভেতরের জিনিসগুলোর মান অসাধারণ। পূজার জন্য এমন একটি সম্পূর্ন বক্স পেয়ে খুব সুবিধা হলো।"
  },
  {
    _id: "r2",
    author: "সায়ন চ্যাটার্জী",
    location: "হাওড়া",
    rating: 5,
    text: "আমার মায়ের জন্য নিত্য পূজা বক্স অর্ডার করেছিলাম। ঘি এবং ধূপের সুবাস সত্যিই খুব ভালো। ডেলিভারিও খুব দ্রুত হয়েছে।"
  }
];

export const blogs = [
  {
    _id: "b1",
    title: 'নিত্য পূজার সঠিক নিয়ম ও উপাচার',
    excerpt: 'প্রতিদিন ঠাকুরঘরে নিত্য পূজা করার কিছু সাধারণ কিন্তু গুরুত্বপূর্ণ নিয়ম রয়েছে, যা আমরা অনেকেই মেনে চলি না। শুদ্ধ বস্ত্রে একাগ্র চিত্তে পূজা করলে মানসিক শান্তি ও আধ্যাত্মিক উন্নতি সম্ভব।',
    image: 'https://images.unsplash.com/photo-1590050752117-23a9d7fc2173?auto=format&fit=crop&q=80&w=800',
    date: '10 April, 2026',
    readTime: '৩ মিনিট',
    category: 'পূজা পদ্ধতি'
  },
  {
    _id: "b2",
    title: 'পূজায় ঘি-প্রদীপের মাহাত্ম্য কী?',
    excerpt: 'যে কোনো পূজায় প্রদীপ জ্বালানো অত্যন্ত শুভ বলে মনে করা হয়। কিন্তু ঘিয়ের প্রদীপ কেন জ্বালানো উচিত তা জানুন। ঘিয়ের প্রদীপ ঘরের নেতিবাচক শক্তি দূর করে ইতিবাচকতা বৃদ্ধি করে।',
    image: 'https://images.unsplash.com/photo-1545642981-1984714d6106?auto=format&fit=crop&q=80&w=800',
    date: '05 April, 2026',
    readTime: '২ মিনিট',
    category: 'আধ্যাত্মিকতা'
  },
  {
    _id: "b3",
    title: 'কোন ফুলে কোন দেবতার পুজো হয়?',
    excerpt: 'দেব-দেবীদের নিজস্ব প্রিয় ফুল রয়েছে। সঠিক ফুল দিয়ে পুজো করলে ঈশ্বর সন্তুষ্ট হন বলে শাস্ত্রে উল্লেখিত রয়েছে। যেমন শিবের প্রিয় বেলপাতা ও ধুতরা ফুল।',
    image: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=800',
    date: '28 March, 2026',
    readTime: '৪ মিনিট',
    category: 'পূজা তথ্য'
  },
  {
    _id: "b4",
    title: 'শ্রীমদ্ভগবদ্গীতার সারকথা ও দৈনন্দিন জীবনে প্রয়োগ',
    excerpt: 'গীতা কেবল ধর্মগ্রন্থ নয়, এটি জীবনের একটি দর্শন। কীভাবে গীতার বাণী আমাদের প্রতিদিনের কর্মক্ষেত্রে সহায়তা করতে পারে তার আলোচনা।',
    image: 'https://images.unsplash.com/photo-1614715838608-dd527c46231d?auto=format&fit=crop&q=80&w=800',
    date: '25 March, 2026',
    readTime: '৬ মিনিট',
    category: 'দর্শন'
  },
  {
    _id: "b5",
    title: 'ধ্যান ও প্রাণায়ামের মাধ্যমে মানসিক শান্তি',
    excerpt: 'বর্তমান ব্যস্ত জীবনে মনের প্রশান্তি বজায় রাখা চ্যালেঞ্জিং। নিয়মিত ধ্যান এবং শ্বাস-প্রশ্বাসের ব্যায়াম কীভাবে মানসিক চাপ কমাতে সাহায্য করে।',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    date: '20 March, 2026',
    readTime: '৫ মিনিট',
    category: 'যোগব্যায়াম'
  },
  {
    _id: "b6",
    title: 'সনাতন ধর্মে তুলসী গাছের গুরুত্ব',
    excerpt: 'হিন্দু পরিবারে তুলসী গাছ অত্যন্ত পবিত্র। বৈজ্ঞানিক ও আধ্যাত্মিক উভয় দিক থেকেই তুলসীর উপকারিতা অপরিসীম।',
    image: 'https://images.unsplash.com/photo-1621272666872-a7d0e3ec92ac?auto=format&fit=crop&q=80&w=800',
    date: '15 March, 2026',
    readTime: '৩ মিনিট',
    category: 'আচার-অনুষ্ঠান'
  },
  {
    _id: "b7",
    title: 'একাদশী ব্রতের মাহাত্ম্য ও পালন পদ্ধতি',
    excerpt: 'একাদশী তিথি অত্যন্ত পুণ্যময়। শরীরের বিষমুক্তকরণ এবং আধ্যাত্মিক সংযোগ স্থাপনে এই ব্রতের রয়েছে বিশেষ ভূমিকা।',
    image: 'https://images.unsplash.com/photo-1518398046578-8cca57732e17?auto=format&fit=crop&q=80&w=800',
    date: '10 March, 2026',
    readTime: '৪ মিনিট',
    category: 'উপবাস'
  },
  {
    _id: "b8",
    title: 'রুদ্রাক্ষ ধারণের নিয়মাবলী ও উপকারিতা',
    excerpt: 'শিবের প্রতীক রুদ্রাক্ষ। এটি ধারণ করলে শরীরের সূক্ষ্ম শক্তি প্রবাহ উন্নত হয় এবং মন শান্ত থাকে।',
    image: 'https://images.unsplash.com/photo-1616036740257-9449ea1f6605?auto=format&fit=crop&q=80&w=800',
    date: '05 March, 2026',
    readTime: '৫ মিনিট',
    category: 'আধ্যাত্মিক গয়না'
  },
  {
    _id: "b9",
    title: 'মহাভারতের শিক্ষণীয় কিছু ঘটনা',
    excerpt: 'মহাভারতের যুদ্ধের পেছনের কারণ এবং তার থেকে আমরা কী কী শিক্ষা পেতে পারি, যা আমাদের চরিত্র গঠনে সহায়তা করে।',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800',
    date: '01 March, 2026',
    readTime: '৭ মিনিট',
    category: 'ইতিহাস ও পুরাণ'
  },
  {
    _id: "b10",
    title: 'ওঁ (ॐ) ধ্বনির রহস্য ও বৈজ্ঞানিক ব্যাখ্যা',
    excerpt: 'ব্রহ্মাণ্ডের আদি ধ্বনি ওঁ। এই ধ্বনির কম্পন শরীরের চক্রগুলোকে জাগ্রত করতে এবং একাগ্রতা বাড়াতে কতটা কার্যকর।',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    date: '25 February, 2026',
    readTime: '৩ মিনিট',
    category: 'বিজ্ঞান ও আধ্যাত্মিকতা'
  },
  {
    _id: "b11",
    title: 'ঠাকুরঘরে শঙ্খ কেন রাখা হয়?',
    excerpt: 'মাঙ্গলিক কাজে শঙ্খধ্বনি অপরিহার্য। এর পেছনের ধর্মীয় তাৎপর্য এবং বাতাস শুদ্ধ করার বৈজ্ঞানিক কারণ জানুন।',
    image: 'https://images.unsplash.com/photo-1609137233825-7037748805f6?auto=format&fit=crop&q=80&w=800',
    date: '20 February, 2026',
    readTime: '২ মিনিট',
    category: 'পূজা সামগ্রী'
  },
  {
    _id: "b12",
    title: 'কাকভোরে ঘুম থেকে ওঠার আধ্যাত্মিক সুফল',
    excerpt: 'ব্রাহ্ম মুহূর্ত সাধনার জন্য শ্রেষ্ঠ সময়। এই সময় প্রকৃতির নির্মলতা কীভাবে মন ও শরীরের আমূল পরিবর্তন ঘটায়।',
    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=800',
    date: '15 February, 2026',
    readTime: '৪ মিনিট',
    category: 'জীবনধারা'
  },
  {
    _id: "b13",
    title: 'শিবলিঙ্গে জল ও দুধ কেন নিবেদন করা হয়?',
    excerpt: 'মহাদেবের উপাসনায় জলাভিষেক অত্যন্ত গুরুত্বপূর্ণ। এর পেছনের পৌরাণিক কাহিনী এবং আধ্যাত্মিক তাৎপর্য নিয়ে আলোচনা।',
    image: 'https://images.unsplash.com/photo-1620215175664-cb9ef6170425?auto=format&fit=crop&q=80&w=800',
    date: '10 February, 2026',
    readTime: '৩ মিনিট',
    category: 'ধর্মীয় আচার'
  },
  {
    _id: "b14",
    title: 'পবিত্র গঙ্গাস্নানের মাহাত্ম্য ও বিশ্বাস',
    excerpt: 'গঙ্গা কেবল একটি নদী নয়, এটি হিন্দু ধর্মীয় ভাবাবেগের প্রাণকেন্দ্র। গঙ্গাস্নানের গুরুত্ব এবং এর পবিত্রতা নিয়ে প্রবন্ধ।',
    image: 'https://images.unsplash.com/photo-1545642981-1984714d6106?auto=format&fit=crop&q=80&w=800',
    date: '05 February, 2026',
    readTime: '৫ মিনিট',
    category: 'তীর্থস্থান'
  },
  {
    _id: "b15",
    title: 'সনাতন ধর্মে দান ও সেবার গুরুত্ব',
    excerpt: 'অন্যের সেবার মধ্যেই ঈশ্বর বাস করেন। নর সেবা করে কীভাবে নারায়ণ সেবা করা যায় এবং দানের আধ্যাত্মিক সুফল।',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
    date: '01 February, 2026',
    readTime: '৪ মিনিট',
    category: 'মানবধর্ম'
  },
  {
    _id: "b16",
    title: 'ঘট স্থাপনের সঠিক নিয়ম ও প্রয়োজনীয়তা',
    excerpt: 'পূজার শুরুতে ঘট স্থাপন করা কেন জরুরি এবং শুদ্ধভাবে ঘট স্থাপনের জন্য কী কী উপকরণের প্রয়োজন হয়।',
    image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=800',
    date: '25 January, 2026',
    readTime: '৩ মিনিট',
    category: 'পূজা বিধি'
  },
  {
    _id: "b17",
    title: 'সূর্য দেবতার আরধনা ও গায়ত্রী মন্ত্র',
    excerpt: 'প্রত্যক্ষ দেবতা সূর্যকে অর্ঘ্য নিবেদন এবং গায়ত্রী মন্ত্রের শক্তি কীভাবে আমাদের মেধা ও তেজ বৃদ্ধি করে।',
    image: 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&q=80&w=800',
    date: '20 January, 2026',
    readTime: '৫ মিনিট',
    category: 'উপাসনা'
  },
  {
    _id: "b18",
    title: 'ঠাকুরঘরের পবিত্রতা বজায় রাখার উপায়',
    excerpt: 'বাস্তুশাস্ত্র অনুযায়ী ঠাকুরঘরের অবস্থান এবং কীভাবে প্রতিদিন পরিষ্কার-পরিুন্ন রাখার মাধ্যমে ঘরে শান্তি ফিরিয়ে আনা যায়।',
    image: 'https://images.unsplash.com/photo-1616036740257-9449ea1f6605?auto=format&fit=crop&q=80&w=800',
    date: '15 January, 2026',
    readTime: '৩ মিনিট',
    category: 'বাস্তু ও পরিবেশ'
  },
  {
    _id: "b19",
    title: 'রামায়ণের চিরন্তন চরিত্র ও আদর্শ',
    excerpt: 'রাম, সীতা, লক্ষ্ণণ ও হনুমানের চরিত্রের গুণাবলী কীভাবে এখনো আমাদের সমাজ ও পরিবার গঠনে পথপ্রদর্শক।',
    image: 'https://images.unsplash.com/photo-1590050752117-23a9d7fc2173?auto=format&fit=crop&q=80&w=800',
    date: '10 January, 2026',
    readTime: '৬ মিনিট',
    category: 'মহাকাব্য'
  },
  {
    _id: "b20",
    title: 'পঞ্চ প্রদীপে আরতির তাৎপর্য',
    excerpt: 'আরতির সময় পঞ্চ প্রদীপের ব্যবহার কেন করা হয় এবং এর মাধ্যমে দেহের পঞ্চতত্ত্বের শুদ্ধিকরণ কীভাবে ঘটে।',
    image: 'https://images.unsplash.com/photo-1545642981-1984714d6106?auto=format&fit=crop&q=80&w=800',
    date: '05 January, 2026',
    readTime: '৩ মিনিট',
    category: 'পূজা তথ্য'
  }
];
