const DataInserter = require('./DataInserter.cjs');

// Firebase configuration - Replace with your actual config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Raw data to be inserted
const rawData = [
  {
    "name": "Rumi",
    "description": "Middle Eastern, Moroccan, Turkish, Mediterranean, Persian. Offers homemade juice, Mezze, braised lamb, roast lamb & Middle Eastern brunch.",
    "address": "Mile-End/Outremont, Montreal, QC",
    "category": "Restaurant"
  },
  {
    "name": "Diba Restaurant",
    "description": "Authentic Persian Pleasures Await. Persian, Iranian, Middle Eastern, Grill, Kebab.",
    "address": "Notre-Dame-de-Grâce (NDG)/Monkland Village, Montreal, QC",
    "category": "Restaurant"
  },
  {
    "name": "Maison Inja",
    "description": "Persian, Café, Salads, Sandwiches.",
    "address": "Downtown/Shaughnessy Village, Montreal, QC",
    "category": "Restaurant"
  },
  {
    "name": "Cheminee Perse",
    "description": "Persian, Iranian, Middle Eastern, Halal, Kebab.",
    "address": "Côte-des-Neiges, Montreal, QC",
    "category": "Restaurant"
  },
  {
    "name": "Byblos Le Petit Café",
    "description": "Persian, Iranian, Middle Eastern, Breakfast.",
    "address": "Le Plateau-Mont-Royal, Montreal, QC",
    "category": "Cafe"
  },
  {
    "name": "Chelow BBQ",
    "description": "BBQ, Grill, Persian, Salads, Sandwiches.",
    "address": "Pierrefonds-Roxboro, Montreal, QC",
    "category": "Restaurant"
  },
  {
    "name": "Café Toranj",
    "description": "Café, Persian. Traditional Persian café experience.",
    "address": "Monkland Village/Notre-Dame-de-Grâce (NDG), Montreal, QC",
    "category": "Cafe"
  },
  {
    "name": "Ispahan Restaurant",
    "description": "Persian, Middle Eastern, Grill, Vegetarian, Gluten-free Options.",
    "address": "Pointe St-Charles/Montreal-Southwest, Montreal, QC",
    "category": "Restaurant"
  },
  {
    "name": "Azalea Buvette Caviste Terrasse",
    "description": "Globally inspired cuisine, Persian, Mediterranean, Fusion, Middle Eastern, Bistro.",
    "address": "Le Plateau-Mont-Royal/Mile-End, Montreal, QC",
    "category": "Restaurant"
  },
  {
    "name": "La Maison De Kebab",
    "description": "Persian, Iranian, Middle Eastern, Halal, Kebab.",
    "address": "820 Avenue Atwater, Montreal, QC H4C 2H1",
    "category": "Restaurant"
  },
  {
    "name": "Fardin Express Restaurant",
    "description": "Persian, Grill.",
    "address": "Ville Saint-Laurent, Montreal, QC",
    "category": "Restaurant"
  },
  {
    "name": "Gillaneh | گیلانه",
    "description": "Persian Restaurant. Can serve parties up to 16, restaurant capacity 70. Patio seating available.",
    "address": "1072 Denman St, Vancouver, BC V6G 2M8",
    "category": "Restaurant"
  },
  {
    "name": "Tehran Restaurant | رستوران تهران",
    "description": "Family owned, over 25 years of dedication to Persian food.",
    "address": "5065 Boulevard de Maisonneuve Ouest, Montreal, QC H4A 1Y9",
    "category": "Restaurant"
  },
  {
    "name": "House Of Kabob | خانه کباب",
    "description": "Middle Eastern cuisine in Calgary. Freshly prepared, authentic Iranian food.",
    "address": "Calgary, AB",
    "category": "Restaurant"
  },
  {
    "name": "Queen of Persia | ملکه پرشیا",
    "description": "Family owned restaurant offering passion for food and Persian cuisine.",
    "address": "Toronto, ON",
    "category": "Restaurant"
  }
];

// Main execution function
async function main() {
  try {
    console.log('🔥 Firebase Data Inserter for Iranian Community Canada');
    console.log('=' .repeat(60));
    
    // Create DataInserter instance
    const inserter = new DataInserter(firebaseConfig);
    
    // Insert all data
    const results = await inserter.insertAllItems(rawData);
    
    console.log('\n🎉 Data insertion completed!');
    console.log('=' .repeat(60));
    
    if (results.success.length > 0) {
      console.log('\n✅ Successfully inserted items:');
      results.success.forEach(item => {
        console.log(`   📍 ${item.category}: ${item.name} (ID: ${item.id})`);
      });
    }
    
    if (results.failed.length > 0) {
      console.log('\n❌ Failed to insert:');
      results.failed.forEach(item => {
        console.log(`   ⚠️  ${item.name}: ${item.error}`);
      });
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. 🔐 Login to your admin panel');
    console.log('2. 📝 Review and approve the pending items');
    console.log('3. ✏️  Add missing information (phone, website, hours)');
    console.log('4. 📸 Upload images for better presentation');
    console.log('5. ✅ Set items to "active" status to make them visible');
    
  } catch (error) {
    console.error('💥 Fatal error during data insertion:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, rawData, firebaseConfig };
