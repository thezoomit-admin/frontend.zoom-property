/**
 * Frontend CMS Schema Definition.
 *
 * Defines all pages, sections, fields, field types, and bilingual placeholders.
 * Strictly adheres to the top-to-bottom visual layout sequence of the live pages.
 */

export type CmsFieldType =
  | "text"
  | "textarea"
  | "url"
  | "image"
  | "images"
  | "icon"
  | "richtext";

export interface CmsField {
  key: string;
  label: string;
  type: CmsFieldType;
  en: string;
  bn: string;
  groupHeader?: string;
  hint?: string;
  maxLength?: number;
}

export interface CmsRepeatableField {
  suffix: string;
  label: string;
  type: CmsFieldType;
  defaultEn?: string;
  defaultBn?: string;
  hint?: string;
  maxLength?: number;
}

export interface CmsRepeatable {
  itemPrefix: string;
  itemName: string;
  addButtonText?: string;
  initialCount?: number;
  maxItems?: number;
  titleSuffix?: string;
  itemFields: CmsRepeatableField[];
  defaultItems?: Record<string, string>[];
}

export interface CmsSection {
  id: string;
  label: string;
  description?: string;
  fields: CmsField[];
  repeatable?: CmsRepeatable;
}

export interface CmsPageDef {
  id: string;
  label: string;
  description: string;
  sections: CmsSection[];
}

export const cmsPages: CmsPageDef[] = [
  {
    id: "home",
    label: "Home Page",
    description: "Homepage sections from top to bottom.",
    sections: [
      {
        id: "hero",
        label: "Hero Section",
        description: "Main banner background photos.",
        fields: [
          {
            key: "hero.backgroundImages",
            label: "Background Slideshow Images",
            type: "images",
            hint: "Photographs that rotate in the hero background (approx 2000px wide).",
            en: "[]",
            bn: "[]",
          },
        ],
      },
      {
        id: "listings",
        label: "Featured Properties",
        description: "Heading above verified listings grid.",
        fields: [
          {
            key: "listings.title",
            label: "Section Title",
            type: "text",
            en: "Verified residences and commercial floors",
            bn: "যাচাই করা ফ্ল্যাট ও বাণিজ্যিক ফ্লোর",
            maxLength: 100,
          },
        ],
      },
      {
        id: "showcase",
        label: "Film Showcase",
        description: "Video showcase banner and player details.",
        fields: [
          {
            key: "showcase.eyebrow",
            label: "Eyebrow Tag",
            type: "text",
            en: "Film",
            bn: "চিত্র",
            maxLength: 40,
          },
          {
            key: "showcase.title",
            label: "Showcase Title",
            type: "text",
            en: "A rooftop in Gulshan, at dusk",
            bn: "গুলশানের এক ছাদ, গোধূলিতে",
            maxLength: 100,
          },
          {
            key: "showcase.description",
            label: "Description",
            type: "textarea",
            en: "Three minutes on one building — the pool deck, the sky lounge and the view that sells it. Shot by our team, not the developer.",
            bn: "একটি ভবন নিয়ে তিন মিনিট — পুল ডেক, স্কাই লাউঞ্জ আর যে দৃশ্য দেখে মানুষ রাজি হয়। ডেভেলপার নয়, আমাদের দলের তোলা।",
            maxLength: 350,
          },
          {
            key: "showcase.play",
            label: "Play Button Label",
            type: "text",
            en: "Play the film",
            bn: "চিত্রটি দেখুন",
            maxLength: 40,
          },
          {
            key: "showcase.duration",
            label: "Video Duration",
            type: "text",
            en: "3 min",
            bn: "৩ মিনিট",
            maxLength: 20,
          },
          {
            key: "showcase.poster",
            label: "Video Poster Image",
            type: "image",
            hint: "High-resolution preview thumbnail image.",
            en: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=80",
            bn: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=80",
          },
          {
            key: "showcase.video",
            label: "Video URL",
            type: "url",
            hint: "YouTube or direct MP4 video link.",
            en: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
            bn: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
          },
        ],
      },
      {
        id: "areasSection",
        label: "Service Areas",
        description: "Neighborhoods headline and highlight accents.",
        fields: [
          {
            key: "areas.service.titleLead",
            label: "Title (Before Accent)",
            type: "text",
            en: "We Serve Across ",
            bn: "আমরা আছি ",
            maxLength: 50,
          },
          {
            key: "areas.service.titleAccent",
            label: "Title (Green Accent Words)",
            type: "text",
            en: "Dhaka & Nearby Areas",
            bn: "ঢাকা ও আশপাশের এলাকাজুড়ে",
            maxLength: 60,
          },
          {
            key: "areas.service.titleTail",
            label: "Title (After Accent)",
            type: "text",
            en: "",
            bn: "",
            maxLength: 50,
          },
        ],
      },
      {
        id: "projectsSection",
        label: "Audited Projects",
        description: "Shown on the home page, grouped by area.",
        fields: [
          {
            key: "projects.homeTitle",
            label: "Heading Text",
            type: "text",
            hint: "Use {area} where the selected area's name should appear.",
            en: "Our projects in {area}",
            bn: "{area}-এ আমাদের প্রজেক্ট",
            maxLength: 100,
          },
        ],
      },
      {
        id: "statsBanner",
        label: "Stats Banner",
        description: "Four prominent metric counters over background image.",
        fields: [
          {
            key: "statsBanner.backgroundImage",
            label: "Background Image",
            type: "image",
            groupHeader: "Banner Visuals",
            en: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85",
            bn: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85",
          },
          {
            key: "statsBanner.stat1Value",
            label: "Stat 1 Number",
            type: "text",
            groupHeader: "Metric 1",
            en: "8",
            bn: "8",
            maxLength: 15,
          },
          {
            key: "statsBanner.stat1Suffix",
            label: "Stat 1 Suffix",
            type: "text",
            en: "k+",
            bn: "k+",
            maxLength: 10,
          },
          {
            key: "statsBanner.stat1Label",
            label: "Stat 1 Label",
            type: "text",
            en: "Projects completed",
            bn: "সম্পূর্ণ প্রজেক্ট",
            maxLength: 50,
          },
          {
            key: "statsBanner.stat2Value",
            label: "Stat 2 Number",
            type: "text",
            groupHeader: "Metric 2",
            en: "3",
            bn: "3",
            maxLength: 15,
          },
          {
            key: "statsBanner.stat2Suffix",
            label: "Stat 2 Suffix",
            type: "text",
            en: "k+",
            bn: "k+",
            maxLength: 10,
          },
          {
            key: "statsBanner.stat2Label",
            label: "Stat 2 Label",
            type: "text",
            en: "Global customers",
            bn: "গ্লোবাল গ্রাহক",
            maxLength: 50,
          },
          {
            key: "statsBanner.stat3Value",
            label: "Stat 3 Number",
            type: "text",
            groupHeader: "Metric 3",
            en: "20",
            bn: "20",
            maxLength: 15,
          },
          {
            key: "statsBanner.stat3Suffix",
            label: "Stat 3 Suffix",
            type: "text",
            en: "+",
            bn: "+",
            maxLength: 10,
          },
          {
            key: "statsBanner.stat3Label",
            label: "Stat 3 Label",
            type: "text",
            en: "Years of experience",
            bn: "বছরের অভিজ্ঞতা",
            maxLength: 50,
          },
          {
            key: "statsBanner.stat4Value",
            label: "Stat 4 Number",
            type: "text",
            groupHeader: "Metric 4",
            en: "95",
            bn: "95",
            maxLength: 15,
          },
          {
            key: "statsBanner.stat4Suffix",
            label: "Stat 4 Suffix",
            type: "text",
            en: "+",
            bn: "+",
            maxLength: 10,
          },
          {
            key: "statsBanner.stat4Label",
            label: "Stat 4 Label",
            type: "text",
            en: "Team engineers",
            bn: "টিম ইঞ্জিনিয়ার",
            maxLength: 50,
          },
        ],
      },
      {
        id: "homeReviews",
        label: "Client Reviews",
        description: "Heading above video testimonials.",
        fields: [
          {
            key: "reviews.homeTitle",
            label: "Section Title",
            type: "text",
            en: "What our clients say",
            bn: "আমাদের ক্লায়েন্টরা কী বলেন",
            maxLength: 100,
          },
        ],
      },
      {
        id: "videoSection",
        label: "Video Gallery Section",
        description: "Heading above cinematic property walkthroughs.",
        fields: [
          {
            key: "videoSection.title",
            label: "Section Title",
            type: "text",
            en: "Experience Luxury Living in Motion",
            bn: "ভিডিওতে দেখুন আমাদের লাক্সারি প্রপার্টি",
            maxLength: 100,
          },
        ],
      },
      {
        id: "homeBlog",
        label: "Blog Section",
        description: "Heading above latest news and insights.",
        fields: [
          {
            key: "blog.homeTitle",
            label: "Section Title",
            type: "text",
            en: "Explore News, Insights and Guides",
            bn: "রিয়েল এস্টেট সংবাদ, বিশ্লেষণ ও গাইড",
            maxLength: 100,
          },
        ],
      },
    ],
  },
  {
    id: "about",
    label: "About Page",
    description: "Story, figures, vetting standards and values.",
    sections: [
      {
        id: "about",
        label: "Banner",
        description: "Top hero banner of About page.",
        fields: [
          {
            key: "about.eyebrow",
            label: "Eyebrow Tag",
            type: "text",
            en: "Who we are",
            bn: "আমরা কারা",
            maxLength: 40,
          },
          {
            key: "about.title",
            label: "Banner Title",
            type: "text",
            en: "Fewer listings, checked properly",
            bn: "কম লিস্টিং, ঠিকভাবে যাচাই করা",
            maxLength: 100,
          },
          {
            key: "about.description",
            label: "Banner Description",
            type: "textarea",
            en: "We publish less than the big portals because a listing does not go live until someone from our team has stood in it and read the paperwork.",
            bn: "আমরা বড় পোর্টালগুলোর চেয়ে কম প্রকাশ করি, কারণ আমাদের কেউ সরেজমিনে না দেখা ও কাগজ না পড়া পর্যন্ত কোনো লিস্টিং অনলাইনে যায় না।",
            maxLength: 350,
          },
          {
            key: "about.backgroundImage",
            label: "Background Image",
            type: "image",
            en: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=80",
            bn: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=80",
          },
        ],
      },
      {
        id: "story",
        label: "Our Story",
        description: "Founding narrative, paragraphs and showcase photos.",
        fields: [
          {
            key: "about.story.eyebrow",
            label: "Eyebrow",
            type: "text",
            en: "Who we are",
            bn: "আমরা কারা",
            maxLength: 40,
          },
          {
            key: "about.story.title",
            label: "Story Title",
            type: "text",
            en: "We started because buying here was a leap of faith",
            bn: "আমরা শুরু করেছিলাম কারণ এখানে কেনা ছিল একটি বিশ্বাসের ব্যাপার",
            maxLength: 100,
          },
          {
            key: "about.story.lead",
            label: "Lead Paragraph",
            type: "textarea",
            en: "Zoom Property was built by people who had bought property in Dhaka themselves, and knew how little of it could be checked before the money moved.",
            bn: "জুম প্রপার্টি এমন লোকেদের দ্বারা তৈরি হয়েছিল যারা নিজেরাই ঢাকায় সম্পত্তি কিনেছিলেন এবং জানতেন যে টাকা লেনদেনের আগে এর কত সামান্যই চেক করা যায়।",
            maxLength: 250,
          },
          {
            key: "about.story.bodyOne",
            label: "Body Paragraph 1",
            type: "textarea",
            en: "Every listing on this site has been walked by a member of our survey team, photographed the month it went live, and had its RAJUK plan and title deed read line by line before it was published. Nothing is listed on a developer's word.",
            bn: "এই সাইটের প্রতিটি লিস্টিং আমাদের সার্ভে টিমের একজন সদস্য পরিদর্শন করেছেন, এটি লাইভ হওয়ার মাসেই ছবি তোলা হয়েছে এবং প্রকাশিত হওয়ার আগে এর রাজউক প্ল্যান ও টাইটেল ডিড লাইন বাই লাইন পড়া হয়েছে। কোনো কিছুই ডেভেলপারের কথার ওপর লিস্টিং করা হয় না।",
            maxLength: 500,
          },
          {
            key: "about.story.bodyTwo",
            label: "Body Paragraph 2",
            type: "textarea",
            en: "That is slower than the way this market usually works. It is also the only version of the job we were willing to do — a buyer should be told what is wrong with a property by us, not by their lawyer three months later.",
            bn: "এটি এই বাজার সাধারণত যেভাবে কাজ করে তার চেয়ে ধীর। এটিই একমাত্র কাজ যা আমরা করতে ইচ্ছুক ছিলাম — একজন ক্রেতাকে আমাদেরই বলা উচিত সম্পত্তির কী ভুল আছে, তিন মাস পরে তাদের আইনজীবীর দ্বারা নয়।",
            maxLength: 500,
          },
          {
            key: "about.story.badge",
            label: "Trust Badge Text",
            type: "text",
            en: "Every paper read before it is listed",
            bn: "তালিকাভুক্ত হওয়ার আগে প্রতিটি কাগজ পড়া হয়",
            maxLength: 60,
          },
          {
            key: "about.story.imageOne",
            label: "Story Primary Image",
            type: "image",
            hint: "Landscape photo (approx 1200x900px)",
            en: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
            bn: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
          },
          {
            key: "about.story.imageTwo",
            label: "Story Secondary Image",
            type: "image",
            hint: "Square overlapping photo (approx 900x900px)",
            en: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
            bn: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
          },
        ],
      },
      {
        id: "figures",
        label: "Key Figures",
        description: "Audit figures and numerical proof.",
        fields: [
          {
            key: "about.figuresTitle",
            label: "Figures Title",
            type: "text",
            en: "The numbers behind the promise",
            bn: "প্রতিশ্রুতির পেছনের সংখ্যাগুলো",
            maxLength: 100,
          },
          {
            key: "about.figuresLead",
            label: "Figures Subtitle",
            type: "textarea",
            en: "Counted from our own records, not the market's.",
            bn: "বাজারের নয়, আমাদের নিজেদের রেকর্ড থেকে গণনা করা হয়েছে।",
            maxLength: 200,
          },
        ],
        repeatable: {
          itemPrefix: "about.stats",
          itemName: "Stat",
          addButtonText: "Add Statistic",
          initialCount: 4,
          defaultItems: [
            { valueEn: "4850", suffixEn: " Cr+", compactEn: "true", labelEn: "Portfolio value vetted", valueBn: "৪৮৫০", suffixBn: " কোটি+", compactBn: "true", labelBn: "পোর্টফোলিও মূল্য পরীক্ষিত" },
            { valueEn: "13312", suffixEn: "+", compactEn: "true", labelEn: "RAJUK-cleared listings", valueBn: "১৩৩১২", suffixBn: "+", compactBn: "true", labelBn: "রাজউক-অনুমোদিত লিস্টিং" },
            { valueEn: "99.4", suffixEn: "%", compactEn: "false", labelEn: "On-time handover rate", valueBn: "৯৯.৪", suffixBn: "%", compactBn: "false", labelBn: "সময়মতো হস্তান্তরের হার" },
            { valueEn: "32", suffixEn: "", compactEn: "false", labelEn: "Median days to close", valueBn: "৩২", suffixBn: "", compactBn: "false", labelBn: "ক্লোজ করার গড় দিন" },
          ],
          itemFields: [
            { suffix: "value", label: "Value / Number", type: "text", hint: "e.g. 4850 or 99.4" },
            { suffix: "suffix", label: "Suffix", type: "text", hint: "e.g. Cr+, %, +" },
            { suffix: "label", label: "Description Label", type: "text", hint: "e.g. Portfolio value vetted" },
          ],
        },
      },
      {
        id: "vetting",
        label: "Vetting Checklist",
        description: "Standards and verification steps a property must pass.",
        fields: [
          {
            key: "pages.vetting.title",
            label: "Section Title",
            type: "text",
            en: "What a listing has to pass",
            bn: "একটি লিস্টিংকে যা যা পেরোতে হয়",
            maxLength: 100,
          },
          {
            key: "pages.vetting.image",
            label: "Inspection Photo",
            type: "image",
            hint: "Photo of surveyors / engineers inspecting property.",
            en: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
            bn: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
          },
          {
            key: "pages.vetting.checks.0",
            label: "Check 1: RAJUK Approval",
            type: "text",
            en: "RAJUK approved plan, matched against what is actually built",
            bn: "রাজউক অনুমোদিত নকশা, বাস্তবে যা নির্মিত তার সঙ্গে মিলিয়ে দেখা",
            maxLength: 120,
          },
          {
            key: "pages.vetting.checks.1",
            label: "Check 2: Deed Records",
            type: "text",
            en: "Title deed traced through the CS, SA, RS and BS records",
            bn: "সিএস, এসএ, আরএস ও বিএস রেকর্ড ধরে দলিলের ধারাবাহিকতা",
            maxLength: 120,
          },
          {
            key: "pages.vetting.checks.2",
            label: "Check 3: Mutation",
            type: "text",
            en: "Mutation in the current owner name",
            bn: "বর্তমান মালিকের নামে নামজারি",
            maxLength: 120,
          },
          {
            key: "pages.vetting.checks.3",
            label: "Check 4: Non-encumbrance",
            type: "text",
            en: "Non-encumbrance certificate from the sub-registry",
            bn: "সাব-রেজিস্ট্রি থেকে নির্দায় সনদ",
            maxLength: 120,
          },
          {
            key: "pages.vetting.checks.4",
            label: "Check 5: Survey Inspection",
            type: "text",
            en: "Physical inspection by our surveyor, dated",
            bn: "আমাদের সার্ভেয়ারের সরেজমিন পরিদর্শন, তারিখসহ",
            maxLength: 120,
          },
          {
            key: "pages.vetting.checks.5",
            label: "Check 6: Photography",
            type: "text",
            en: "Our own photography, taken the same month",
            bn: "আমাদের নিজেদের তোলা ছবি, একই মাসের",
            maxLength: 120,
          },
        ],
      },
    ],
  },
  {
    id: "properties",
    label: "Properties Page",
    description: "Listings directory banner and copy.",
    sections: [
      {
        id: "listings",
        label: "Banner",
        fields: [
          {
            key: "listings.eyebrow",
            label: "Eyebrow",
            type: "text",
            en: "Curated portfolio",
            bn: "বাছাই করা তালিকা",
            maxLength: 40,
          },
          {
            key: "listings.pageTitle",
            label: "Page Title",
            type: "text",
            en: "Properties for sale and rent",
            bn: "বিক্রয় ও ভাড়ার সম্পত্তি",
            maxLength: 100,
          },
          {
            key: "listings.pageDescription",
            label: "Description",
            type: "textarea",
            en: "{count} listings, each physically inspected by our survey team and title-checked before upload. Filter by purpose, type and area below.",
            bn: "{count}টি লিস্টিং, প্রতিটি আমাদের সার্ভে দল সরেজমিনে দেখেছে এবং আপলোডের আগে দলিল যাচাই করেছে। নিচে উদ্দেশ্য, ধরন ও এলাকা দিয়ে ছেঁকে নিন।",
            maxLength: 350,
          },
          {
            key: "listings.backgroundImage",
            label: "Background Image",
            type: "image",
            en: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2000&q=80",
            bn: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2000&q=80",
          },
        ],
      },
    ],
  },
  {
    id: "projects",
    label: "Projects Page",
    description: "Developments index banner.",
    sections: [
      {
        id: "projects",
        label: "Banner",
        fields: [
          {
            key: "projects.eyebrow",
            label: "Eyebrow",
            type: "text",
            en: "Under construction",
            bn: "নির্মাণাধীন",
            maxLength: 40,
          },
          {
            key: "projects.pageTitle",
            label: "Page Title",
            type: "text",
            en: "Projects under construction",
            bn: "নির্মাণাধীন প্রকল্প",
            maxLength: 100,
          },
          {
            key: "projects.pageDescription",
            label: "Description",
            type: "textarea",
            en: "You pay in instalments for years before you get keys. Every project here shows its audited structural stage and permit number, updated monthly.",
            bn: "চাবি পাওয়ার আগে বছরের পর বছর কিস্তি দিতে হয়। এখানে প্রতিটি প্রকল্পে নিরীক্ষিত কাঠামোগত পর্যায় ও অনুমোদন নম্বর আছে, প্রতি মাসে হালনাগাদ।",
            maxLength: 350,
          },
          {
            key: "projects.backgroundImage",
            label: "Background Image",
            type: "image",
            en: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=80",
            bn: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=80",
          },
        ],
      },
    ],
  },
  {
    id: "areas",
    label: "Areas Page",
    description: "Neighbourhoods directory banner.",
    sections: [
      {
        id: "areas",
        label: "Banner",
        fields: [
          {
            key: "areas.eyebrow",
            label: "Eyebrow",
            type: "text",
            en: "Our Service Areas & Locations",
            bn: "আমাদের সার্ভিস এরিয়া ও লোকেশন",
            maxLength: 50,
          },
          {
            key: "areas.pageTitle",
            label: "Page Title",
            type: "text",
            en: "Service Areas for Luxury Flats",
            bn: "আমাদের সার্ভিস এরিয়া ও এলাকাসমূহ",
            maxLength: 100,
          },
          {
            key: "areas.pageDescription",
            label: "Description",
            type: "textarea",
            en: "Browse verified luxury apartments, duplexes, and commercial floors across Dhaka & Chattogram's most requested addresses.",
            bn: "জুম প্রপার্টি যেসব প্রাইম এলাকায় ফ্ল্যাট ও অ্যাপার্টমেন্ট সেল করে তার বিস্তারিত তালিকা, ফ্ল্যাটের সংখ্যা, প্রতি বর্গফুটের রেট ও সম্ভাব্য ভাড়ার আয়ের হিসাব।",
            maxLength: 350,
          },
          {
            key: "areas.backgroundImage",
            label: "Background Image",
            type: "image",
            en: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=2000&q=80",
            bn: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=2000&q=80",
          },
        ],
      },
    ],
  },
  {
    id: "contact",
    label: "Contact Page",
    description: "Contact information, phone, email, and address.",
    sections: [
      {
        id: "contact",
        label: "Banner & Details",
        fields: [
          {
            key: "contact.eyebrow",
            label: "Eyebrow",
            type: "text",
            en: "Get in touch",
            bn: "যোগাযোগ করুন",
            maxLength: 40,
          },
          {
            key: "contact.title",
            label: "Page Title",
            type: "text",
            en: "Talk to the desk",
            bn: "আমাদের সঙ্গে কথা বলুন",
            maxLength: 100,
          },
          {
            key: "contact.description",
            label: "Description",
            type: "textarea",
            en: "No call center and no auto-responders. The phone and email below go to the advisors who inspect the properties.",
            bn: "কোনো কল সেন্টার বা স্বয়ংক্রিয় উত্তর নয়। নিচের ফোন ও ইমেইলে যোগাযোগ করলে সরাসরি সেই পরামর্শদাতাদের পাবেন যারা সম্পত্তি পরিদর্শন করেন।",
            maxLength: 350,
          },
          {
            key: "contact.details.phone",
            label: "Primary Phone Number",
            type: "text",
            groupHeader: "Direct Contact Information",
            en: "+880 1711 000 000",
            bn: "+৮৮০ ১৭১১ ০০০ ০০০",
            maxLength: 30,
          },
          {
            key: "contact.details.email",
            label: "Contact Email",
            type: "text",
            en: "info@zoomproperty.com.bd",
            bn: "info@zoomproperty.com.bd",
            maxLength: 60,
          },
          {
            key: "contact.details.dhakaAddress",
            label: "Office Address",
            type: "textarea",
            en: "House 12, Road 34, Gulshan 1, Dhaka 1212",
            bn: "বাড়ি ১২, রোড ৩৪, গুলশান ১, ঢাকা ১২১২",
            maxLength: 200,
          },
        ],
      },
    ],
  },
  {
    id: "legal",
    label: "Legal Pages",
    description: "Terms of service and privacy policy.",
    sections: [
      {
        id: "privacy",
        label: "Privacy Policy",
        fields: [
          {
            key: "privacy.title",
            label: "Title",
            type: "text",
            en: "Privacy Policy",
            bn: "গোপনীয়তা নীতি",
            maxLength: 100,
          },
          {
            key: "privacy.body",
            label: "Full Privacy Policy Content (Rich Text)",
            type: "richtext",
            en: "<p>We respect your privacy and only collect what is strictly necessary to assist with your property search.</p>",
            bn: "<p>আমরা আপনার গোপনীয়তাকে সম্মান করি এবং শুধুমাত্র আপনার অনুসন্ধানের জন্য প্রয়োজনীয় তথ্য সংগ্রহ করি।</p>",
          },
        ],
      },
      {
        id: "terms",
        label: "Terms of Service",
        fields: [
          {
            key: "terms.title",
            label: "Title",
            type: "text",
            en: "Terms of Service",
            bn: "ব্যবহারের শর্তাবলী",
            maxLength: 100,
          },
          {
            key: "terms.body",
            label: "Full Terms Content (Rich Text)",
            type: "richtext",
            en: "<p>By browsing this site, you agree to verified property inspection standards and terms.</p>",
            bn: "<p>এই সাইট ব্যবহার করার মাধ্যমে আপনি আমাদের যাচাইকরণ শর্তাবলী মেনে নিচ্ছেন।</p>",
          },
        ],
      },
    ],
  },
  {
    id: "blog",
    label: "Blog Page",
    description: "Insights and real estate guides banner.",
    sections: [
      {
        id: "blog",
        label: "Banner",
        fields: [
          {
            key: "blog.eyebrow",
            label: "Eyebrow",
            type: "text",
            en: "Our Blog & News",
            bn: "আমাদের ব্লগ ও সংবাদ",
            maxLength: 40,
          },
          {
            key: "blog.title",
            label: "Page Title",
            type: "text",
            en: "Latest Insights & Market Reports",
            bn: "সাম্প্রতিক তথ্য ও রিয়েল এস্টেট বিশ্লেষণ",
            maxLength: 100,
          },
          {
            key: "blog.description",
            label: "Description",
            type: "textarea",
            en: "Market analysis, property legal guides, and construction updates straight from the desk.",
            bn: "বাজার বিশ্লেষণ, প্রপার্টির আইনি গাইড ও নির্মাণের সর্বশেষ আপডেট সরাসরি আমাদের পরামর্শকদের কাছ থেকে।",
            maxLength: 350,
          },
          {
            key: "blog.backgroundImage",
            label: "Background Image",
            type: "image",
            en: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80",
            bn: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80",
          },
        ],
      },
    ],
  },
  {
    id: "reviews",
    label: "Reviews Page",
    description: "Client feedback and testimonial banner.",
    sections: [
      {
        id: "reviews",
        label: "Banner",
        fields: [
          {
            key: "reviews.eyebrow",
            label: "Eyebrow",
            type: "text",
            en: "Client Stories",
            bn: "ক্লায়েন্টদের অভিজ্ঞতা",
            maxLength: 40,
          },
          {
            key: "reviews.pageTitle",
            label: "Page Title",
            type: "text",
            en: "What our clients say",
            bn: "আমাদের ক্লায়েন্টরা কী বলেন",
            maxLength: 100,
          },
          {
            key: "reviews.pageDescription",
            label: "Description",
            type: "textarea",
            en: "Real experiences from families and investors who bought or leased through Zoom Property.",
            bn: "জুম প্রপার্টির মাধ্যমে ফ্ল্যাট ক্রয় ও বিক্রয় করা সম্মানিত ক্লায়েন্টদের বাস্তব অভিজ্ঞতা।",
            maxLength: 350,
          },
          {
            key: "reviews.backgroundImage",
            label: "Background Image",
            type: "image",
            en: "https://images.unsplash.com/photo-1541888946425-d0fbb18015f6?auto=format&fit=crop&w=2000&q=80",
            bn: "https://images.unsplash.com/photo-1541888946425-d0fbb18015f6?auto=format&fit=crop&w=2000&q=80",
          },
        ],
      },
    ],
  },
  {
    id: "landowners",
    label: "Landowners Page",
    description: "Joint venture development partnership banner.",
    sections: [
      {
        id: "landowners",
        label: "Banner",
        fields: [
          {
            key: "landowners.eyebrow",
            label: "Eyebrow",
            type: "text",
            en: "Joint Venture Partnership",
            bn: "যৌথ উদ্যোগ পার্টনারশিপ",
            maxLength: 40,
          },
          {
            key: "landowners.title",
            label: "Page Title",
            type: "text",
            en: "Build with verified standards",
            bn: "যাচাইকৃত মান নিয়ে নির্মাণ করুন",
            maxLength: 100,
          },
          {
            key: "landowners.description",
            label: "Description",
            type: "textarea",
            en: "Transparent developer matching, fair sharing ratios, and milestone-tracked construction for your valuable land.",
            bn: "আপনার জমির সঠিক মূল্যায়ন, বিশ্বস্ত ডেভেলপার নির্বাচন এবং সময়মতো হস্তান্তরের নিশ্চয়তা।",
            maxLength: 350,
          },
          {
            key: "landowner.backgroundImage",
            label: "Background Image",
            type: "image",
            en: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80",
            bn: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80",
          },
        ],
      },
    ],
  },
  {
    id: "agents",
    label: "Agents Page",
    description: "Advisors and surveyors banner.",
    sections: [
      {
        id: "agents",
        label: "Banner",
        fields: [
          {
            key: "agentsSection.eyebrow",
            label: "Eyebrow",
            type: "text",
            en: "Our Surveyors & Advisors",
            bn: "আমাদের সার্ভেয়ার ও উপদেষ্টাবৃন্দ",
            maxLength: 40,
          },
          {
            key: "agentsSection.pageTitle",
            label: "Page Title",
            type: "text",
            en: "Meet the team that vets the property",
            bn: "সম্পত্তি যাচাইকারী দলের সাথে পরিচিত হোন",
            maxLength: 100,
          },
          {
            key: "agentsSection.pageDescription",
            label: "Description",
            type: "textarea",
            en: "Dedicated survey and advisory professionals inspecting Dhaka & Chattogram real estate.",
            bn: "ঢাকা ও চট্টগ্রামের রিয়েল এস্টেট সরাসরি যাচাই ও পরামর্শ দেওয়ার জন্য আমাদের নিবেদিত পেশাদার দল।",
            maxLength: 350,
          },
          {
            key: "agentsSection.backgroundImage",
            label: "Background Image",
            type: "image",
            en: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80",
            bn: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80",
          },
        ],
      },
    ],
  },
];

export const cmsPageById = (id: string): CmsPageDef | undefined =>
  cmsPages.find((p) => p.id === id);

export const cmsSectionById = (
  pageId: string,
  sectionId: string
): { page: CmsPageDef; section: CmsSection } | undefined => {
  const page = cmsPageById(pageId);
  if (!page) return undefined;
  const section = page.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  return { page, section };
};

export const cmsStorageKey = (path: string, lang: "en" | "bn") =>
  `${path}.${lang}`;
