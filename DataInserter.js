import { initializeApp } from 'firebase/app';
import {getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

class DataInserter {
  constructor(firebaseConfig) {
    // Initialize Firebase
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
  }

  // Parse address to extract city and province
  parseAddress(address) {
    const addressParts = {
      address: address,
      city: '',
      province: '',
      country: 'Canada',
      postalCode: '',
      coordinates: { lat: null, lng: null }
    };

    // Extract city and province from address
    if (address.includes('Montreal, QC')) {
      addressParts.city = 'Montreal';
      addressParts.province = 'Quebec';
      // Extract specific neighborhood/area
      const parts = address.split(',');
      if (parts.length > 0) {
        addressParts.address = parts[0].trim();
      }
    } else if (address.includes('Vancouver, BC')) {
      addressParts.city = 'Vancouver';
      addressParts.province = 'British Columbia';
      // Extract specific address
      const parts = address.split(',');
      if (parts.length > 0) {
        addressParts.address = parts[0].trim();
      }
    } else if (address.includes('Calgary, AB')) {
      addressParts.city = 'Calgary';
      addressParts.province = 'Alberta';
    } else if (address.includes('Toronto, ON')) {
      addressParts.city = 'Toronto';
      addressParts.province = 'Ontario';
    }

    // Extract postal code if present
    const postalCodeMatch = address.match(/[A-Z]\d[A-Z]\s?\d[A-Z]\d/);
    if (postalCodeMatch) {
      addressParts.postalCode = postalCodeMatch[0];
    }

    return addressParts;
  }

  // Parse description to extract cuisine types
  parseCuisine(description) {
    const cuisineTypes = [];
    const cuisineKeywords = [
      'Persian', 'Iranian', 'Middle Eastern', 'Mediterranean', 
      'Turkish', 'Moroccan', 'BBQ', 'Grill', 'Halal'
    ];

    cuisineKeywords.forEach(keyword => {
      if (description.toLowerCase().includes(keyword.toLowerCase())) {
        cuisineTypes.push(keyword);
      }
    });

    return cuisineTypes.length > 0 ? cuisineTypes[0] : 'Persian';
  }

  // Parse features from description
  parseFeatures(description, category) {
    const features = [];
    
    // Common restaurant features
    if (description.toLowerCase().includes('vegetarian')) features.push('vegetarian');
    if (description.toLowerCase().includes('gluten-free')) features.push('gluten-free');
    if (description.toLowerCase().includes('halal')) features.push('halal');
    if (description.toLowerCase().includes('patio') || description.toLowerCase().includes('terrasse')) features.push('outdoor-seating');
    if (description.toLowerCase().includes('takeout') || description.toLowerCase().includes('delivery')) features.push('takeout');
    
    // Default features
    features.push('dine-in');
    
    return features;
  }

  // Parse café-specific features
  parseCafeFeatures(description) {
    return {
      hasWifi: description.toLowerCase().includes('wifi') || description.toLowerCase().includes('internet'),
      hasOutdoorSeating: description.toLowerCase().includes('patio') || description.toLowerCase().includes('terrasse') || description.toLowerCase().includes('outdoor'),
      hasParking: false, // Default, can be updated later
      petFriendly: false, // Default, can be updated later
      hasDelivery: description.toLowerCase().includes('delivery'),
      hasTakeout: description.toLowerCase().includes('takeout') || description.toLowerCase().includes('take-out')
    };
  }

  // Transform raw data to restaurant format
  transformToRestaurant(item) {
    const location = this.parseAddress(item.address);
    const cuisine = this.parseCuisine(item.description);
    const features = this.parseFeatures(item.description, item.category);

    return {
      name: item.name,
      description: item.description,
      cuisine: cuisine,
      category: "Restaurant",
      location: location,
      contact: {
        phone: "",
        email: "",
        website: ""
      },
      hours: {
        monday: "",
        tuesday: "",
        wednesday: "",
        thursday: "",
        friday: "",
        saturday: "",
        sunday: ""
      },
      priceRange: "$$", // Default medium price range
      rating: item.rating || 0,
      reviewCount: item.reviewCount || 0,
      features: features,
      paymentMethods: ["cash", "card", "interac"],
      image: "",
      images: [],
      menu: "",
      status: "pending", // Requires admin approval
      verified: false,
      featured: false,
      views: item.views || 0,
      postedBy: item.createdBy || "system-import",
      approvedBy: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
  }

  // Transform raw data to café format
  transformToCafe(item) {
    const location = this.parseAddress(item.address);
    const specialty = this.parseCuisine(item.description);
    const cafeFeatures = this.parseCafeFeatures(item.description);
    const amenities = [];

    // Build amenities array based on features
    if (cafeFeatures.hasWifi) amenities.push("free-wifi");
    if (cafeFeatures.hasOutdoorSeating) amenities.push("outdoor-seating");
    if (cafeFeatures.hasParking) amenities.push("parking");
    if (cafeFeatures.petFriendly) amenities.push("pet-friendly");

    return {
      name: item.name,
      description: item.description,
      specialty: specialty,
      category: "Cafe",
      location: location,
      contact: {
        phone: "",
        email: "",
        website: ""
      },
      hours: {
        monday: "",
        tuesday: "",
        wednesday: "",
        thursday: "",
        friday: "",
        saturday: "",
        sunday: ""
      },
      priceRange: "$$", // Default medium price range
      rating: item.rating || 0,
      reviewCount: item.reviewCount || 0,
      features: cafeFeatures,
      amenities: amenities,
      paymentMethods: ["cash", "card", "interac"],
      image: "",
      images: [],
      menu: "",
      status: "pending", // Requires admin approval
      verified: false,
      featured: false,
      views: item.views || 0,
      postedBy: item.createdBy || "system-import",
      approvedBy: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
  }

  // Insert single item into appropriate collection
  async insertItem(item) {
    try {
      let transformedItem;
      let collectionName;

      if (item.category === 'Restaurant') {
        transformedItem = this.transformToRestaurant(item);
        collectionName = 'restaurants';
      } else if (item.category === 'Cafe') {
        transformedItem = this.transformToCafe(item);
        collectionName = 'cafes';
      } else {
        throw new Error(`Unknown category: ${item.category}`);
      }

      const docRef = await addDoc(collection(this.db, collectionName), transformedItem);
      console.log(`✅ ${item.category} "${item.name}" inserted with ID: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error(`❌ Error inserting ${item.name}:`, error);
      throw error;
    }
  }

  // Insert all items from the array
  async insertAllItems(items) {
    console.log(`🚀 Starting to insert ${items.length} items...`);
    const results = {
      success: [],
      failed: [],
      restaurants: 0,
      cafes: 0
    };

    for (const item of items) {
      try {
        const id = await this.insertItem(item);
        results.success.push({ name: item.name, id, category: item.category });
        
        if (item.category === 'Restaurant') {
          results.restaurants++;
        } else if (item.category === 'Cafe') {
          results.cafes++;
        }
      } catch (error) {
        results.failed.push({ name: item.name, error: error.message });
      }
    }

    console.log('\n📊 INSERTION SUMMARY:');
    console.log(`✅ Successfully inserted: ${results.success.length} items`);
    console.log(`   - Restaurants: ${results.restaurants}`);
    console.log(`   - Cafés: ${results.cafes}`);
    console.log(`❌ Failed insertions: ${results.failed.length} items`);

    if (results.failed.length > 0) {
      console.log('\n❌ Failed items:');
      results.failed.forEach(item => {
        console.log(`   - ${item.name}: ${item.error}`);
      });
    }

    return results;
  }
}

module.exports = DataInserter;
