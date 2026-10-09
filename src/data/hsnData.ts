export interface HsnItem {
  code: string;
  description: string;
  category: string;
  gstRate: number; // e.g. 5, 12, 18, 28
  typicalProducts: string[];
}

export const HSN_DATABASE: HsnItem[] = [
  {
    code: '6204',
    description: "Women's or girls' suits, dresses, skirts, trousers (excluding knitted/crocheted)",
    category: 'Apparel & Textiles',
    gstRate: 5,
    typicalProducts: ['Kurtis', 'Salwar Suits', 'Ethnic Wear', 'Dresses', 'Gowns'],
  },
  {
    code: '5208',
    description: 'Woven fabrics of cotton, containing 85% or more by weight of cotton',
    category: 'Apparel & Textiles',
    gstRate: 5,
    typicalProducts: ['Cotton Sarees', 'Dress Materials', 'Cotton Fabric'],
  },
  {
    code: '6109',
    description: 'T-shirts, singlets and other vests, knitted or crocheted',
    category: 'Apparel & Textiles',
    gstRate: 5,
    typicalProducts: ['Cotton T-Shirts', 'Polo Shirts', 'Gym Vests'],
  },
  {
    code: '6402',
    description: 'Footwear with outer soles and uppers of rubber or plastics (MRP up to ₹1,000)',
    category: 'Footwear',
    gstRate: 12,
    typicalProducts: ['Casual Shoes', 'Sandals', 'Slippers', 'Flip Flops', 'Sneakers'],
  },
  {
    code: '6403',
    description: 'Footwear with outer soles of rubber, plastics, leather (MRP above ₹1,000)',
    category: 'Footwear',
    gstRate: 18,
    typicalProducts: ['Leather Shoes', 'Formal Shoes', 'Boots', 'Branded Sports Shoes'],
  },
  {
    code: '8504',
    description: 'Electrical transformers, static converters (e.g. rectifiers) and inductors',
    category: 'Electronics',
    gstRate: 18,
    typicalProducts: ['Mobile Fast Chargers', 'Power Banks', 'Adapters', 'Laptop Chargers'],
  },
  {
    code: '8544',
    description: 'Insulated wire, cable and other insulated electric conductors',
    category: 'Electronics',
    gstRate: 18,
    typicalProducts: ['USB Type-C Cables', 'Lightning Cables', 'Audio AUX Cables'],
  },
  {
    code: '8518',
    description: 'Microphones, loudspeakers, headphones, earphones and audio amplifiers',
    category: 'Electronics',
    gstRate: 18,
    typicalProducts: ['Bluetooth Neckbands', 'TWS Earbuds', 'Wireless Speakers', 'Gaming Headphones'],
  },
  {
    code: '7117',
    description: 'Imitation jewellery / artificial jewellery',
    category: 'Fashion Jewellery',
    gstRate: 3,
    typicalProducts: ['Oxidised Earrings', 'Kundan Necklaces', 'Bangles', 'Anklets', 'Fashion Rings'],
  },
  {
    code: '3304',
    description: 'Beauty or make-up preparations and preparations for the care of the skin',
    category: 'Cosmetics & Beauty',
    gstRate: 18,
    typicalProducts: ['Lipsticks', 'Face Serums', 'Sunscreen', 'Foundations', 'Face Wash'],
  },
  {
    code: '3401',
    description: 'Soap; organic surface-active products and preparations for use as soap',
    category: 'Personal Care',
    gstRate: 18,
    typicalProducts: ['Handmade Soaps', 'Body Wash', 'Shower Gels'],
  },
  {
    code: '7323',
    description: 'Table, kitchen or other household articles and parts thereof, of iron or steel',
    category: 'Kitchen & Home',
    gstRate: 12,
    typicalProducts: ['Steel Water Bottles', 'Tiffin Boxes', 'Cookware Pots', 'Dinner Sets'],
  },
  {
    code: '3924',
    description: 'Tableware, kitchenware, other household articles and hygienic or toilet articles, of plastics',
    category: 'Kitchen & Home',
    gstRate: 18,
    typicalProducts: ['Plastic Storage Containers', 'Spice Racks', 'Fridge Bottles', 'Baskets'],
  },
  {
    code: '0904',
    description: 'Pepper of the genus Piper; dried or crushed or ground fruits of the genus Capsicum or Pimenta',
    category: 'Groceries & Spices',
    gstRate: 5,
    typicalProducts: ['Black Pepper', 'Red Chilli Powder', 'Crushed Spices'],
  },
  {
    code: '0801',
    description: 'Coconuts, Brazil nuts and cashew nuts, fresh or dried',
    category: 'Dry Fruits',
    gstRate: 5,
    typicalProducts: ['Cashews (Kaju)', 'Almonds (Badam)', 'Walnuts (Akhrot)'],
  },
  {
    code: '4202',
    description: 'Trunks, suit-cases, executive-cases, brief-cases, school satchels, handbag',
    category: 'Bags & Luggage',
    gstRate: 18,
    typicalProducts: ['Laptop Backpacks', 'Handbags', 'Tote Bags', 'Travel Duffle Bags'],
  },
  {
    code: '6304',
    description: 'Other furnishing articles, excluding those of heading 9404',
    category: 'Home Furnishing',
    gstRate: 12,
    typicalProducts: ['Bedsheets', 'Cushion Covers', 'Curtains', 'Table Runners'],
  },
  {
    code: '9403',
    description: 'Other furniture and parts thereof (metal, wooden, plastic)',
    category: 'Furniture',
    gstRate: 18,
    typicalProducts: ['Study Tables', 'Office Chairs', 'Shoe Racks', 'Wall Shelves'],
  },
  {
    code: '9983',
    description: 'Other professional, technical and business services (SAC Code)',
    category: 'Services',
    gstRate: 18,
    typicalProducts: ['Digital Marketing', 'Graphic Design', 'Consulting Services', 'Software Dev'],
  },
  {
    code: '9965',
    description: 'Goods transport agency (GTA) services (SAC Code)',
    category: 'Services',
    gstRate: 5,
    typicalProducts: ['Freight Delivery', 'Courier & Logistics Services'],
  },
];
