/* scripts/seedData.ts */

const { MongoClient } = require('mongodb');

const products = [
  {
    name: "Chocolate Fudge Cake",
    description: "Rich, moist chocolate cake with creamy fudge frosting and chocolate shavings.",
    price: 32.99,
    category: "cakes",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80",
    ingredients: ["premium cocoa", "organic flour", "fresh eggs", "butter", "sugar", "dark chocolate"],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "French Butter Croissant",
    description: "Authentic French butter croissant with 27 flaky layers and a golden crust.",
    price: 4.99,
    category: "pastries",
    // NEW: clearly a croissant photo
    image: "https://images.unsplash.com/photo-1654808991961-141a731f55db?w=800&auto=format&fit=crop&q=80",
    ingredients: ["French butter", "artisan flour", "yeast", "milk", "sea salt"],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Artisan Chocolate Chip Cookies",
    description: "Handmade cookies with premium chocolate chunks and a hint of sea salt.",
    price: 12.99,
    category: "cookies",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&auto=format&fit=crop&q=80",
    ingredients: ["flour", "butter", "chocolate chunks", "brown sugar", "eggs", "vanilla"],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Classic Red Velvet Cake",
    description: "Velvety red sponge cake with cream cheese frosting and cocoa notes.",
    price: 34.99,
    category: "cakes",
    image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=800&auto=format&fit=crop&q=80",
    ingredients: ["flour", "cocoa", "buttermilk", "eggs", "butter", "cream cheese"],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Crusty French Baguette",
    description: "Traditional French baguette with a crisp crust and airy interior.",
    price: 5.49,
    category: "breads",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
    ingredients: ["flour", "water", "salt", "yeast"],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Fresh Blueberry Muffins",
    description: "Soft muffins bursting with juicy blueberries and a crumb topping.",
    price: 11.99,
    category: "muffins",
    image: "https://images.unsplash.com/photo-1572383672419-ab35444a6934?w=800&auto=format&fit=crop&q=80",
    ingredients: ["flour", "fresh blueberries", "sugar", "eggs", "butter", "milk"],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Classic Tiramisu",
    description: "Italian tiramisu with coffee-soaked ladyfingers and mascarpone cream.",
    price: 24.99,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop&q=80",
    ingredients: ["mascarpone", "espresso", "ladyfingers", "cocoa", "sugar", "cream"],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Cinnamon Rolls with Cream Cheese Glaze",
    description: "Warm cinnamon rolls topped with rich cream cheese icing.",
    price: 14.99,
    category: "pastries",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&auto=format&fit=crop&q=80",
    ingredients: ["flour", "cinnamon", "brown sugar", "butter", "cream cheese", "yeast"],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "New York Cheesecake",
    description: "Classic New York style cheesecake with a buttery graham cracker crust.",
    price: 28.99,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=800&auto=format&fit=crop&q=80",
    ingredients: ["cream cheese", "sugar", "eggs", "sour cream", "graham crackers", "vanilla"],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Apple Pie with Lattice Crust",
    description: "Homemade apple pie with cinnamon-spiced filling and lattice butter crust.",
    price: 18.99,
    category: "pies",
    // NEW: dedicated apple-pie image
    image: "https://images.unsplash.com/photo-1562007908-17c67e878c88?w=800&auto=format&fit=crop&q=80",
    ingredients: ["apples", "cinnamon", "nutmeg", "flour", "butter", "lemon juice", "sugar"],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "French Macarons Assortment",
    description: "Colorful assorted French macarons with delicate shells and creamy fillings.",
    price: 22.99,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1558326560-0fecd0ff8aab?w=800&auto=format&fit=crop&q=80",
    ingredients: ["almond flour", "egg whites", "sugar", "buttercream", "flavorings"],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Sourdough Bread Loaf",
    description: "Artisan sourdough loaf with a tangy flavor and open crumb.",
    price: 8.49,
    category: "breads",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&auto=format&fit=crop&q=80",
    ingredients: ["flour", "water", "salt", "natural starter"],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Chocolate Éclairs",
    description: "Choux pastry filled with vanilla cream and topped with chocolate glaze.",
    price: 16.99,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1558319024-50d6580590e4?w=800&auto=format&fit=crop&q=80",
    ingredients: ["flour", "eggs", "butter", "milk", "chocolate", "cream"],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Rainbow Birthday Cake",
    description: "Colorful layered birthday cake with vanilla frosting and sprinkles.",
    price: 39.99,
    category: "cakes",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&auto=format&fit=crop&q=80",
    ingredients: ["flour", "eggs", "sugar", "butter", "vanilla", "food coloring"],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Fudgy Chocolate Brownies",
    description: "Dense, fudgy brownies with a crackly top and intense chocolate flavor.",
    price: 13.99,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1606313564200-75f3d5108c4c?w=800&auto=format&fit=crop&q=80",
    ingredients: ["dark chocolate", "cocoa", "butter", "eggs", "sugar", "flour"],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Danish Pastry Assortment",
    description: "Assorted Danish pastries with fruit, cream cheese and almond fillings.",
    price: 19.99,
    category: "pastries",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80",
    ingredients: ["laminated dough", "butter", "fruit compote", "cream cheese", "almonds"],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Pumpkin Pie",
    description: "Spiced pumpkin pie with smooth filling and buttery crust.",
    price: 17.99,
    category: "pies",
    image: "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=800&auto=format&fit=crop&q=80",
    ingredients: ["pumpkin puree", "cream", "eggs", "spices", "butter", "flour"],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Buttery Brioche Bread",
    description: "Rich, buttery brioche loaf with a soft crumb and golden top.",
    price: 7.99,
    category: "breads",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80",
    ingredients: ["flour", "butter", "eggs", "milk", "sugar", "yeast"],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Lemon Meringue Pie",
    description: "Tangy lemon custard topped with fluffy toasted meringue.",
    price: 20.99,
    category: "pies",
    // uses a different pie image than Apple Pie
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80",
    ingredients: ["lemons", "eggs", "sugar", "butter", "cornstarch", "egg whites"],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Chocolate Cupcakes",
    description: "Moist chocolate cupcakes topped with swirls of buttercream frosting.",
    price: 15.99,
    category: "cakes",
    image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=800&auto=format&fit=crop&q=80",
    ingredients: ["cocoa", "flour", "sugar", "eggs", "butter", "buttercream"],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedDatabase() {
  const client = new MongoClient('mongodb://localhost:27017');

  try {
    await client.connect();
    const db = client.db('divine-delights');

    await db.collection('products').deleteMany({});
    await db.collection('products').insertMany(products);

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Added ${products.length} products`);
  } catch (error: any) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seedDatabase();
