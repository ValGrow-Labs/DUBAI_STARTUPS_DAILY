/**
 * Curated Dubai business setup playbooks and regulatory guides.
 */
export const SETUP_GUIDES = [
  {
    slug: "free-zone-vs-mainland",
    title: "Dubai Free Zone vs. Mainland: Which is Right for Your Startup?",
    summary: "A practical breakdown of 100% foreign ownership, commercial license types, office requirements, and UAE market access.",
    category: "Structure & Strategy",
    readTime: "6 min read",
    updated: "Nov 2026",
    sections: [
      {
        heading: "The Fundamentals",
        content: "Foreign entrepreneurs can own 100% of both Free Zone and Mainland commercial entities in Dubai. The core choice comes down to where your customers are and where your team works.",
      },
      {
        heading: "When to Choose a Free Zone",
        content: "Ideal for B2B tech startups, SaaS, international consultancy, and holding companies. Free zones offer 0% corporate tax exemptions on qualifying income, streamlined visa processing, and dedicated startup hubs like DIFC Innovation Hub or Dtec.",
      },
      {
        heading: "When to Choose Mainland (DED)",
        content: "Essential if you operate retail locations, direct B2C commerce inside the domestic UAE market, local warehousing, or government contracting. Mainland licenses are issued directly by the Dubai Department of Economy and Tourism (DET).",
      },
    ],
  },
  {
    slug: "top-startup-free-zones-dubai",
    title: "Comparison of Top Dubai Startup Free Zones in 2026",
    summary: "DIFC, DMCC, DWTC, Dtec and in5 compared on licensing fees, flexi-desk options, visa quotas, and fintech regulations.",
    category: "Free Zones",
    readTime: "8 min read",
    updated: "Nov 2026",
    sections: [
      {
        heading: "DIFC (Dubai International Financial Centre)",
        content: "The premier financial hub of the Middle East, governed by common law with its own independent English-language courts (DIFC Courts) and regulator (DFSA). Perfect for fintech, regtech, venture studios, and VC funds. The DIFC Innovation Hub offers subsidized licensing starting around AED 5,500/yr for early-stage startups.",
      },
      {
        heading: "DMCC (Dubai Multi Commodities Centre)",
        content: "Ranked global free zone of the year multiple times. Excellent for Web3, crypto, global commodity trading, and tech consulting. Houses the DMCC Crypto Centre and Gaming Centre at JLT.",
      },
      {
        heading: "DWTC (Dubai World Trade Centre)",
        content: "Centrally located right by Sheikh Zayed Road, offering flexible licensing packages and a progressive sandbox for digital assets, technology consulting, and event businesses.",
      },
      {
        heading: "Dtec (Dubai Technology Entrepreneur Campus)",
        content: "Situated in Dubai Silicon Oasis, Dtec is the largest tech entrepreneurship hub in the region, offering low-cost flexi-desks, venture funding access via DSO ventures, and high community engagement.",
      },
    ],
  },
  {
    slug: "dubai-corporate-bank-account-guide",
    title: "Opening a Corporate Bank Account in Dubai: The Realistic Playbook",
    summary: "How tech founders navigate KYC, compliance checks, physical address requirements, and digital-first business banks like Wio.",
    category: "Banking & Compliance",
    readTime: "5 min read",
    updated: "Nov 2026",
    sections: [
      {
        heading: "The Challenge & The Solution",
        content: "Traditionally, corporate banking in the UAE could take 2 to 3 months due to rigorous AML/KYC regulations. Digital neo-banks have changed the landscape completely for licensed startups.",
      },
      {
        heading: "Digital Banking: Wio Business",
        content: "Wio Bank (backed by ADQ and Alpha Dhabi) allows licensed UAE companies to open a fully digital multi-currency business account within 48 to 72 hours with instant virtual cards and payment links.",
      },
      {
        heading: "Tier-1 Legacy Banks (Emirates NBD, Mashreq, FAB)",
        content: "For startups raising Series A+ or handling large trade finance volumes, opening with Emirates NBD or Mashreq NEOBiz requires a clear business plan, verified client contracts, 6 months of personal bank statements, and a physical lease (Ejari).",
      },
    ],
  },
  {
    slug: "uae-golden-visa-for-founders",
    title: "The 10-Year UAE Golden Visa Guide for Tech Founders and Executives",
    summary: "Eligibility criteria, business incubators endorsements, minimum capital thresholds, and step-by-step application steps.",
    category: "Visas & Residency",
    readTime: "7 min read",
    updated: "Nov 2026",
    sections: [
      {
        heading: "Who Qualifies?",
        content: "Founders of approved startups valued at AED 2M+, or entrepreneurs whose projects have received an official endorsement from accredited UAE business incubators (such as in5, Hub71, or Area 2071).",
      },
      {
        heading: "Key Benefits",
        content: "10-year renewable residency without the need for an employer or local sponsor. Freedom to sponsor spouses, children of any age, and unlimited domestic helpers, with no limit on time spent outside the UAE to keep the visa valid.",
      },
    ],
  },
];

export const FREEZONES_DIRECTORY = [
  {
    name: "DIFC Innovation Hub",
    short: "DIFC",
    location: "Gate Avenue, DIFC",
    focus: "Fintech, AI, Web3, Venture Capital",
    licenseFee: "From AED 5,500/year (Innovation License)",
    visas: "Up to 4 visas on flexi desk",
    highlight: "Common Law jurisdiction & independent DFSA regulator",
  },
  {
    name: "DMCC",
    short: "DMCC",
    location: "Jumeirah Lakes Towers (JLT)",
    focus: "Tech, Crypto, Gaming, Commodity Trade",
    licenseFee: "From AED 11,500/year",
    visas: "1-3 visas per flexi desk",
    highlight: "Direct access to DMCC Crypto & Gaming communities",
  },
  {
    name: "Dtec (Dubai Silicon Oasis)",
    short: "Dtec",
    location: "Dubai Silicon Oasis",
    focus: "SaaS, Hardware, DeepTech, Early-stage",
    licenseFee: "From AED 12,000/year (including flexi desk)",
    visas: "2 visas standard package",
    highlight: "Largest physical tech incubator hub with hardware labs",
  },
  {
    name: "DWTC Authority",
    short: "DWTC",
    location: "Sheikh Zayed Road",
    focus: "Global consulting, events tech, digital assets",
    licenseFee: "From AED 14,000/year",
    visas: "Flexible scale-up packages",
    highlight: "Prime central business district location",
  },
  {
    name: "in5 Dubai",
    short: "in5",
    location: "Dubai Internet City & Design District",
    focus: "Tech, Design, Media startups",
    licenseFee: "Subsidized incubator rate",
    visas: "Tiered by startup stage",
    highlight: "TECOM group incubator with mentorship & prototyping labs",
  },
];

export const SETUP_STEPS = [
  {
    step: "01",
    title: "Determine Jurisdiction & Activity",
    desc: "Choose between Free Zone (100% digital, zero customs within zone, common law at DIFC) or Mainland (unlimited direct local retail and government trade).",
  },
  {
    step: "02",
    title: "Reserve Trade Name & Initial Approval",
    desc: "Submit three name options compliant with UAE naming guidelines and obtain security clearance via the relevant authority (DET or Free Zone).",
  },
  {
    step: "03",
    title: "Office Space or Flexi-Desk",
    desc: "Secure an Ejari lease (for mainland) or lease agreement with your chosen free zone incubator/coworking space to satisfy economic substance rules.",
  },
  {
    step: "04",
    title: "Issue Commercial License",
    desc: "Sign company Memorandum of Association (MOA), pay licensing fees, and receive official trade license certificate.",
  },
  {
    step: "05",
    title: "Establishment Card & Investor Visas",
    desc: "Register with the General Directorate of Residency and Foreigners Affairs (GDRFA), complete medical fitness tests, and receive Emirates ID.",
  },
  {
    step: "06",
    title: "Open Corporate Bank Account",
    desc: "Set up multi-currency accounts with Wio Business (fast digital track) or traditional corporate desks at Emirates NBD or Mashreq.",
  },
];
