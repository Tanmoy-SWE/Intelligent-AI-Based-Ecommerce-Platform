import { Product } from './shopify/types';

/**
 * Mock product data for testing the AI Assistant
 * This is used when Shopify credentials are not configured
 */
export const mockProducts: Product[] = [
  {
    id: 'mock-1',
    handle: 'acme-t-shirt',
    availableForSale: true,
    title: 'Acme T-Shirt',
    description: 'A comfortable cotton t-shirt with the Acme logo. Perfect for everyday wear.',
    descriptionHtml: '<p>A comfortable cotton t-shirt with the Acme logo. Perfect for everyday wear.</p>',
    options: [
      {
        id: 'option-1',
        name: 'Size',
        values: ['S', 'M', 'L', 'XL'],
      },
      {
        id: 'option-2',
        name: 'Color',
        values: ['Black', 'White', 'Blue'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '25.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '25.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme T-Shirt',
      description: 'A comfortable cotton t-shirt with the Acme logo',
    },
    tags: ['clothing', 't-shirt', 'casual', 'cotton'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    handle: 'acme-hoodie',
    availableForSale: true,
    title: 'Acme Hoodie',
    description: 'Stay warm with this premium hoodie featuring the Acme logo. Made from soft fleece material. Perfect for winter, fall, and cold weather.',
    descriptionHtml: '<p>Stay warm with this premium hoodie featuring the Acme logo. Made from soft fleece material. Perfect for winter, fall, and cold weather.</p>',
    options: [
      {
        id: 'option-3',
        name: 'Size',
        values: ['S', 'M', 'L', 'XL'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '55.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '55.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme Hoodie',
      description: 'Premium hoodie with Acme logo',
    },
    tags: ['clothing', 'hoodie', 'warm', 'fleece', 'winter', 'fall', 'cold-weather'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    handle: 'acme-cap',
    availableForSale: true,
    title: 'Acme Cap',
    description: 'Classic baseball cap with embroidered Acme logo. Adjustable strap for perfect fit.',
    descriptionHtml: '<p>Classic baseball cap with embroidered Acme logo. Adjustable strap for perfect fit.</p>',
    options: [
      {
        id: 'option-4',
        name: 'Color',
        values: ['Black', 'Navy', 'Red'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '20.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '20.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme Cap',
      description: 'Classic baseball cap with Acme logo',
    },
    tags: ['accessories', 'cap', 'hat', 'baseball'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-4',
    handle: 'acme-mug',
    availableForSale: true,
    title: 'Acme Mug',
    description: 'Ceramic coffee mug with Acme branding. Holds 12oz of your favorite beverage.',
    descriptionHtml: '<p>Ceramic coffee mug with Acme branding. Holds 12oz of your favorite beverage.</p>',
    options: [],
    priceRange: {
      maxVariantPrice: {
        amount: '15.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '15.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme Mug',
      description: 'Ceramic coffee mug with Acme branding',
    },
    tags: ['accessories', 'mug', 'coffee', 'ceramic'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-5',
    handle: 'acme-backpack',
    availableForSale: true,
    title: 'Acme Backpack',
    description: 'Durable backpack with multiple compartments. Perfect for work, school, or travel.',
    descriptionHtml: '<p>Durable backpack with multiple compartments. Perfect for work, school, or travel.</p>',
    options: [
      {
        id: 'option-5',
        name: 'Color',
        values: ['Black', 'Gray'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '75.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '75.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme Backpack',
      description: 'Durable backpack for work and travel',
    },
    tags: ['accessories', 'backpack', 'travel', 'durable'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-6',
    handle: 'acme-water-bottle',
    availableForSale: true,
    title: 'Acme Water Bottle',
    description: 'Stainless steel water bottle keeps drinks cold for 24 hours. BPA-free and eco-friendly.',
    descriptionHtml: '<p>Stainless steel water bottle keeps drinks cold for 24 hours. BPA-free and eco-friendly.</p>',
    options: [
      {
        id: 'option-6',
        name: 'Size',
        values: ['16oz', '24oz', '32oz'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '30.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '25.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme Water Bottle',
      description: 'Insulated stainless steel water bottle',
    },
    tags: ['accessories', 'water-bottle', 'eco-friendly', 'insulated'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-7',
    handle: 'acme-notebook',
    availableForSale: false,
    title: 'Acme Notebook',
    description: 'Premium leather-bound notebook with 200 pages. Perfect for journaling or note-taking.',
    descriptionHtml: '<p>Premium leather-bound notebook with 200 pages. Perfect for journaling or note-taking.</p>',
    options: [],
    priceRange: {
      maxVariantPrice: {
        amount: '35.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '35.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme Notebook',
      description: 'Premium leather-bound notebook',
    },
    tags: ['accessories', 'notebook', 'leather', 'journal'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-8',
    handle: 'acme-socks',
    availableForSale: true,
    title: 'Acme Socks (3-Pack)',
    description: 'Comfortable cotton socks with Acme branding. Comes in a pack of 3 pairs.',
    descriptionHtml: '<p>Comfortable cotton socks with Acme branding. Comes in a pack of 3 pairs.</p>',
    options: [
      {
        id: 'option-7',
        name: 'Size',
        values: ['S', 'M', 'L'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '18.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '18.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme Socks',
      description: 'Comfortable cotton socks 3-pack',
    },
    tags: ['clothing', 'socks', 'cotton', 'pack'],
    updatedAt: new Date().toISOString(),
  },
  // Additional T-Shirts
  {
    id: 'mock-9',
    handle: 'acme-v-neck-tee',
    availableForSale: true,
    title: 'Acme V-Neck Tee',
    description: 'Classic v-neck t-shirt made from premium cotton. Stylish and comfortable for any occasion.',
    descriptionHtml: '<p>Classic v-neck t-shirt made from premium cotton. Stylish and comfortable for any occasion.</p>',
    options: [
      {
        id: 'option-9-1',
        name: 'Size',
        values: ['S', 'M', 'L', 'XL', 'XXL'],
      },
      {
        id: 'option-9-2',
        name: 'Color',
        values: ['Navy', 'Gray', 'White'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '28.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '28.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme V-Neck Tee',
      description: 'Classic v-neck t-shirt made from premium cotton',
    },
    tags: ['clothing', 't-shirt', 'v-neck', 'cotton', 'casual'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-10',
    handle: 'acme-graphic-tee',
    availableForSale: true,
    title: 'Acme Graphic Tee',
    description: 'Bold graphic t-shirt with modern Acme design. Made from soft, breathable fabric.',
    descriptionHtml: '<p>Bold graphic t-shirt with modern Acme design. Made from soft, breathable fabric.</p>',
    options: [
      {
        id: 'option-10-1',
        name: 'Size',
        values: ['S', 'M', 'L', 'XL'],
      },
      {
        id: 'option-10-2',
        name: 'Color',
        values: ['Black', 'Red', 'Green'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '32.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '32.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme Graphic Tee',
      description: 'Bold graphic t-shirt with modern Acme design',
    },
    tags: ['clothing', 't-shirt', 'graphic', 'casual', 'trendy'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-11',
    handle: 'acme-long-sleeve-tee',
    availableForSale: true,
    title: 'Acme Long Sleeve Tee',
    description: 'Comfortable long sleeve t-shirt perfect for cooler weather. 100% cotton construction.',
    descriptionHtml: '<p>Comfortable long sleeve t-shirt perfect for cooler weather. 100% cotton construction.</p>',
    options: [
      {
        id: 'option-11-1',
        name: 'Size',
        values: ['S', 'M', 'L', 'XL', 'XXL'],
      },
      {
        id: 'option-11-2',
        name: 'Color',
        values: ['Black', 'Gray', 'Navy', 'Olive'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '35.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '35.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme Long Sleeve Tee',
      description: 'Comfortable long sleeve t-shirt perfect for cooler weather',
    },
    tags: ['clothing', 't-shirt', 'long-sleeve', 'cotton', 'casual'],
    updatedAt: new Date().toISOString(),
  },
  // Additional Hoodies
  {
    id: 'mock-12',
    handle: 'acme-zip-hoodie',
    availableForSale: true,
    title: 'Acme Zip Hoodie',
    description: 'Full-zip hoodie with premium fleece lining. Features front pockets and adjustable drawstring hood. Perfect for winter and cold weather.',
    descriptionHtml: '<p>Full-zip hoodie with premium fleece lining. Features front pockets and adjustable drawstring hood. Perfect for winter and cold weather.</p>',
    options: [
      {
        id: 'option-12-1',
        name: 'Size',
        values: ['S', 'M', 'L', 'XL', 'XXL'],
      },
      {
        id: 'option-12-2',
        name: 'Color',
        values: ['Black', 'Gray', 'Navy'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '65.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '65.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme Zip Hoodie',
      description: 'Full-zip hoodie with premium fleece lining',
    },
    tags: ['clothing', 'hoodie', 'zip', 'fleece', 'casual', 'warm', 'winter', 'cold-weather'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-13',
    handle: 'acme-pullover-hoodie',
    availableForSale: true,
    title: 'Acme Pullover Hoodie',
    description: 'Classic pullover hoodie with kangaroo pocket. Ultra-soft fleece keeps you warm and cozy. Perfect for winter and cold weather.',
    descriptionHtml: '<p>Classic pullover hoodie with kangaroo pocket. Ultra-soft fleece keeps you warm and cozy. Perfect for winter and cold weather.</p>',
    options: [
      {
        id: 'option-13-1',
        name: 'Size',
        values: ['S', 'M', 'L', 'XL'],
      },
      {
        id: 'option-13-2',
        name: 'Color',
        values: ['Charcoal', 'Burgundy', 'Forest Green'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '58.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '58.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme Pullover Hoodie',
      description: 'Classic pullover hoodie with kangaroo pocket',
    },
    tags: ['clothing', 'hoodie', 'pullover', 'fleece', 'casual', 'warm', 'winter', 'cold-weather'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-14',
    handle: 'acme-lightweight-hoodie',
    availableForSale: true,
    title: 'Acme Lightweight Hoodie',
    description: 'Lightweight hoodie perfect for spring and fall. Breathable fabric with a modern fit.',
    descriptionHtml: '<p>Lightweight hoodie perfect for spring and fall. Breathable fabric with a modern fit.</p>',
    options: [
      {
        id: 'option-14-1',
        name: 'Size',
        values: ['S', 'M', 'L', 'XL', 'XXL'],
      },
      {
        id: 'option-14-2',
        name: 'Color',
        values: ['Light Gray', 'Beige', 'Sky Blue'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '48.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '48.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme Lightweight Hoodie',
      description: 'Lightweight hoodie perfect for spring and fall',
    },
    tags: ['clothing', 'hoodie', 'lightweight', 'casual', 'spring', 'fall'],
    updatedAt: new Date().toISOString(),
  },
  // Additional Caps
  {
    id: 'mock-15',
    handle: 'acme-snapback-cap',
    availableForSale: true,
    title: 'Acme Snapback Cap',
    description: 'Classic snapback cap with embroidered Acme logo. Adjustable fit for all head sizes.',
    descriptionHtml: '<p>Classic snapback cap with embroidered Acme logo. Adjustable fit for all head sizes.</p>',
    options: [
      {
        id: 'option-15-1',
        name: 'Color',
        values: ['Black', 'Navy', 'Red', 'White'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '25.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '25.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme Snapback Cap',
      description: 'Classic snapback cap with embroidered Acme logo',
    },
    tags: ['accessories', 'cap', 'snapback', 'casual', 'headwear'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-16',
    handle: 'acme-dad-hat',
    availableForSale: true,
    title: 'Acme Dad Hat',
    description: 'Unstructured dad hat with curved brim. Soft cotton twill construction for maximum comfort.',
    descriptionHtml: '<p>Unstructured dad hat with curved brim. Soft cotton twill construction for maximum comfort.</p>',
    options: [
      {
        id: 'option-16-1',
        name: 'Color',
        values: ['Khaki', 'Black', 'Olive', 'Pink'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '22.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '22.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme Dad Hat',
      description: 'Unstructured dad hat with curved brim',
    },
    tags: ['accessories', 'cap', 'dad-hat', 'casual', 'headwear'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-17',
    handle: 'acme-beanie',
    availableForSale: true,
    title: 'Acme Beanie',
    description: 'Warm knit beanie perfect for cold weather. Stretchy acrylic blend keeps you cozy.',
    descriptionHtml: '<p>Warm knit beanie perfect for cold weather. Stretchy acrylic blend keeps you cozy.</p>',
    options: [
      {
        id: 'option-17-1',
        name: 'Color',
        values: ['Black', 'Gray', 'Navy', 'Burgundy'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '18.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '18.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme Beanie',
      description: 'Warm knit beanie perfect for cold weather',
    },
    tags: ['accessories', 'beanie', 'winter', 'warm', 'headwear'],
    updatedAt: new Date().toISOString(),
  },
  // Additional Bags
  {
    id: 'mock-18',
    handle: 'acme-tote-bag',
    availableForSale: true,
    title: 'Acme Tote Bag',
    description: 'Spacious canvas tote bag perfect for shopping or daily use. Durable construction with reinforced handles.',
    descriptionHtml: '<p>Spacious canvas tote bag perfect for shopping or daily use. Durable construction with reinforced handles.</p>',
    options: [
      {
        id: 'option-18-1',
        name: 'Color',
        values: ['Natural', 'Black', 'Navy'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '28.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '28.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme Tote Bag',
      description: 'Spacious canvas tote bag perfect for shopping or daily use',
    },
    tags: ['accessories', 'bag', 'tote', 'canvas', 'eco-friendly'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-19',
    handle: 'acme-messenger-bag',
    availableForSale: true,
    title: 'Acme Messenger Bag',
    description: 'Professional messenger bag with padded laptop compartment. Multiple pockets for organization.',
    descriptionHtml: '<p>Professional messenger bag with padded laptop compartment. Multiple pockets for organization.</p>',
    options: [
      {
        id: 'option-19-1',
        name: 'Color',
        values: ['Black', 'Gray', 'Brown'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '85.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '85.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme Messenger Bag',
      description: 'Professional messenger bag with padded laptop compartment',
    },
    tags: ['accessories', 'bag', 'messenger', 'laptop', 'professional'],
    updatedAt: new Date().toISOString(),
  },
  // Additional Drinkware
  {
    id: 'mock-20',
    handle: 'acme-travel-mug',
    availableForSale: true,
    title: 'Acme Travel Mug',
    description: 'Insulated travel mug keeps drinks hot for 6 hours or cold for 12 hours. Leak-proof lid.',
    descriptionHtml: '<p>Insulated travel mug keeps drinks hot for 6 hours or cold for 12 hours. Leak-proof lid.</p>',
    options: [
      {
        id: 'option-20-1',
        name: 'Color',
        values: ['Black', 'Silver', 'Blue', 'Red'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '22.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '22.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme Travel Mug',
      description: 'Insulated travel mug keeps drinks hot or cold',
    },
    tags: ['accessories', 'drinkware', 'travel-mug', 'insulated'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-21',
    handle: 'acme-sports-bottle',
    availableForSale: true,
    title: 'Acme Sports Bottle',
    description: 'BPA-free sports bottle with flip-top lid. Perfect for gym, hiking, or everyday hydration.',
    descriptionHtml: '<p>BPA-free sports bottle with flip-top lid. Perfect for gym, hiking, or everyday hydration.</p>',
    options: [
      {
        id: 'option-21-1',
        name: 'Size',
        values: ['500ml', '750ml', '1L'],
      },
      {
        id: 'option-21-2',
        name: 'Color',
        values: ['Clear', 'Blue', 'Green', 'Pink'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '12.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '12.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme Sports Bottle',
      description: 'BPA-free sports bottle with flip-top lid',
    },
    tags: ['accessories', 'drinkware', 'sports', 'gym', 'eco-friendly'],
    updatedAt: new Date().toISOString(),
  },
  // Additional T-Shirt Variations
  {
    id: 'mock-22',
    handle: 'acme-t-shirt-black',
    availableForSale: true,
    title: 'Acme T-Shirt - Black',
    description: 'Classic black cotton t-shirt with the Acme logo. Perfect for everyday wear. Available in all sizes.',
    descriptionHtml: '<p>Classic black cotton t-shirt with the Acme logo. Perfect for everyday wear. Available in all sizes.</p>',
    options: [
      {
        id: 'option-22-1',
        name: 'Size',
        values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '25.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '25.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme T-Shirt - Black',
      description: 'Classic black cotton t-shirt with Acme logo',
    },
    tags: ['clothing', 't-shirt', 'casual', 'cotton', 'black', 'short-sleeve'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-23',
    handle: 'acme-t-shirt-white',
    availableForSale: true,
    title: 'Acme T-Shirt - White',
    description: 'Clean white cotton t-shirt with the Acme logo. Perfect for summer and casual wear. Available in all sizes.',
    descriptionHtml: '<p>Clean white cotton t-shirt with the Acme logo. Perfect for summer and casual wear. Available in all sizes.</p>',
    options: [
      {
        id: 'option-23-1',
        name: 'Size',
        values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '25.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '25.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme T-Shirt - White',
      description: 'Clean white cotton t-shirt with Acme logo',
    },
    tags: ['clothing', 't-shirt', 'casual', 'cotton', 'white', 'short-sleeve', 'summer'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-24',
    handle: 'acme-t-shirt-navy',
    availableForSale: true,
    title: 'Acme T-Shirt - Navy Blue',
    description: 'Navy blue cotton t-shirt with the Acme logo. Perfect for everyday wear. Available in all sizes.',
    descriptionHtml: '<p>Navy blue cotton t-shirt with the Acme logo. Perfect for everyday wear. Available in all sizes.</p>',
    options: [
      {
        id: 'option-24-1',
        name: 'Size',
        values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '25.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '25.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme T-Shirt - Navy Blue',
      description: 'Navy blue cotton t-shirt with Acme logo',
    },
    tags: ['clothing', 't-shirt', 'casual', 'cotton', 'navy', 'blue', 'short-sleeve'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-25',
    handle: 'acme-long-sleeve-tee-gray',
    availableForSale: true,
    title: 'Acme Long Sleeve T-Shirt - Gray',
    description: 'Comfortable gray long sleeve t-shirt with the Acme logo. Perfect for cooler weather and layering.',
    descriptionHtml: '<p>Comfortable gray long sleeve t-shirt with the Acme logo. Perfect for cooler weather and layering.</p>',
    options: [
      {
        id: 'option-25-1',
        name: 'Size',
        values: ['S', 'M', 'L', 'XL', 'XXL'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '32.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '32.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme Long Sleeve T-Shirt - Gray',
      description: 'Gray long sleeve t-shirt with Acme logo',
    },
    tags: ['clothing', 't-shirt', 'long-sleeve', 'cotton', 'gray', 'fall', 'layering'],
    updatedAt: new Date().toISOString(),
  },
  // Additional Hoodie Variations
  {
    id: 'mock-26',
    handle: 'acme-hoodie-black',
    availableForSale: true,
    title: 'Acme Hoodie - Black',
    description: 'Premium black hoodie with the Acme logo. Made from soft fleece material. Perfect for winter, fall, and cold weather.',
    descriptionHtml: '<p>Premium black hoodie with the Acme logo. Made from soft fleece material. Perfect for winter, fall, and cold weather.</p>',
    options: [
      {
        id: 'option-26-1',
        name: 'Size',
        values: ['S', 'M', 'L', 'XL', 'XXL'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '55.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '55.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme Hoodie - Black',
      description: 'Premium black hoodie with Acme logo',
    },
    tags: ['clothing', 'hoodie', 'warm', 'fleece', 'winter', 'fall', 'cold-weather', 'black'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-27',
    handle: 'acme-hoodie-gray',
    availableForSale: true,
    title: 'Acme Hoodie - Heather Gray',
    description: 'Cozy heather gray hoodie with the Acme logo. Made from soft fleece material. Perfect for winter, fall, and cold weather.',
    descriptionHtml: '<p>Cozy heather gray hoodie with the Acme logo. Made from soft fleece material. Perfect for winter, fall, and cold weather.</p>',
    options: [
      {
        id: 'option-27-1',
        name: 'Size',
        values: ['S', 'M', 'L', 'XL', 'XXL'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '55.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '55.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme Hoodie - Heather Gray',
      description: 'Cozy heather gray hoodie with Acme logo',
    },
    tags: ['clothing', 'hoodie', 'warm', 'fleece', 'winter', 'fall', 'cold-weather', 'gray'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-28',
    handle: 'acme-hoodie-navy',
    availableForSale: true,
    title: 'Acme Hoodie - Navy Blue',
    description: 'Classic navy blue hoodie with the Acme logo. Made from soft fleece material. Perfect for winter, fall, and cold weather.',
    descriptionHtml: '<p>Classic navy blue hoodie with the Acme logo. Made from soft fleece material. Perfect for winter, fall, and cold weather.</p>',
    options: [
      {
        id: 'option-28-1',
        name: 'Size',
        values: ['S', 'M', 'L', 'XL', 'XXL'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '55.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '55.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme Hoodie - Navy Blue',
      description: 'Classic navy blue hoodie with Acme logo',
    },
    tags: ['clothing', 'hoodie', 'warm', 'fleece', 'winter', 'fall', 'cold-weather', 'navy', 'blue'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-29',
    handle: 'acme-zip-hoodie-black',
    availableForSale: true,
    title: 'Acme Zip Hoodie - Black',
    description: 'Premium black zip-up hoodie with the Acme logo. Full-length zipper for easy on/off. Perfect for winter and cold weather.',
    descriptionHtml: '<p>Premium black zip-up hoodie with the Acme logo. Full-length zipper for easy on/off. Perfect for winter and cold weather.</p>',
    options: [
      {
        id: 'option-29-1',
        name: 'Size',
        values: ['S', 'M', 'L', 'XL', 'XXL'],
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: '65.00',
        currencyCode: 'USD',
      },
      minVariantPrice: {
        amount: '65.00',
        currencyCode: 'USD',
      },
    },
    variants: [],
    featuredImage: undefined,
    images: [],
    seo: {
      title: 'Acme Zip Hoodie - Black',
      description: 'Premium black zip-up hoodie with Acme logo',
    },
    tags: ['clothing', 'hoodie', 'zip-up', 'warm', 'fleece', 'winter', 'cold-weather', 'black'],
    updatedAt: new Date().toISOString(),
  },
];

