import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('Set MONGODB_URI in .env.local')
  process.exit(1)
}

async function seed() {
  await mongoose.connect(MONGODB_URI!)

  const db = mongoose.connection.db!

  // Clear existing data
  await db.collection('venues').deleteMany({})
  await db.collection('venueratings').deleteMany({})
  await db.collection('tips').deleteMany({})
  await db.collection('opportunities').deleteMany({})
  console.log('Cleared existing data')

  const venues = await db.collection('venues').insertMany([
    { name: 'Prism Gallery', address: '120 Art District Blvd', city: 'Portland', category: 'gallery', avgSafety: 4.6, avgFairPay: 4.3, avgRespect: 4.7, totalRatings: 22, totalIncidents: 0, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Clay & Fire Studio', address: '45 Ceramic Way', city: 'Austin', category: 'pottery_studio', avgSafety: 4.9, avgFairPay: 4.5, avgRespect: 4.8, totalRatings: 18, totalIncidents: 0, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Wynwood Walls', address: '2520 NW 2nd Ave', city: 'Miami', category: 'graffiti_spot', avgSafety: 3.8, avgFairPay: 3.5, avgRespect: 4.2, totalRatings: 35, totalIncidents: 2, createdAt: new Date(), updatedAt: new Date() },
    { name: 'The MakerHouse', address: '88 Innovation Dr', city: 'Brooklyn', category: 'makerspace', avgSafety: 4.5, avgFairPay: 4.0, avgRespect: 4.4, totalRatings: 15, totalIncidents: 1, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Sunset Sculpture Garden', address: '300 Ocean View Rd', city: 'Los Angeles', category: 'outdoor', avgSafety: 4.2, avgFairPay: 3.8, avgRespect: 4.3, totalRatings: 10, totalIncidents: 0, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Palette Studios', address: '77 Canvas St', city: 'Chicago', category: 'studio', avgSafety: 3.2, avgFairPay: 2.9, avgRespect: 3.0, totalRatings: 20, totalIncidents: 4, createdAt: new Date(), updatedAt: new Date() },
    { name: 'East Side Murals', address: '15 Graffiti Alley', city: 'Denver', category: 'graffiti_spot', avgSafety: 3.5, avgFairPay: 3.0, avgRespect: 3.8, totalRatings: 12, totalIncidents: 3, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Kiln & Thread', address: '200 Craft Ave', city: 'Nashville', category: 'pottery_studio', avgSafety: 4.8, avgFairPay: 4.6, avgRespect: 4.9, totalRatings: 28, totalIncidents: 0, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Digital Canvas Co-op', address: '42 Tech Row', city: 'San Francisco', category: 'makerspace', avgSafety: 4.4, avgFairPay: 4.2, avgRespect: 4.5, totalRatings: 16, totalIncidents: 0, createdAt: new Date(), updatedAt: new Date() },
    { name: 'The Loft Gallery', address: '500 High St', city: 'New York', category: 'gallery', avgSafety: 3.9, avgFairPay: 3.5, avgRespect: 3.6, totalRatings: 30, totalIncidents: 5, createdAt: new Date(), updatedAt: new Date() },
  ])
  console.log(`Seeded ${venues.insertedCount} venues`)

  await db.collection('tips').insertMany([
    { body: 'Always get commission terms in writing before showing at a new gallery. Some take up to 60%.', category: 'pricing', upvotes: 34, createdAt: new Date(), updatedAt: new Date() },
    { body: 'Clay & Fire Studio in Austin has the best kiln access and fair studio rates. Highly recommend!', category: 'general', upvotes: 22, createdAt: new Date(), updatedAt: new Date() },
    { body: 'Be careful at Palette Studios in Chicago — multiple reports of stolen supplies from shared spaces.', category: 'safety', upvotes: 45, createdAt: new Date(), updatedAt: new Date() },
    { body: 'For pottery glazes, Amaco and Mayco have the best price-to-quality ratio. Skip the boutique brands.', category: 'supplies', upvotes: 28, createdAt: new Date(), updatedAt: new Date() },
    { body: 'If you price your art too low, you bring down the market for everyone. Know your worth!', category: 'pricing', upvotes: 52, createdAt: new Date(), updatedAt: new Date() },
    { body: 'Try wet-on-wet technique for watercolors — it gives an ethereal look that collectors love.', category: 'technique', upvotes: 19, createdAt: new Date(), updatedAt: new Date() },
    { body: 'Portland galleries are generally great for fair compensation. The art scene there supports women.', category: 'general', upvotes: 17, createdAt: new Date(), updatedAt: new Date() },
    { body: 'Blick Art Materials has a student discount even if you are not a current student. Just ask.', category: 'supplies', upvotes: 40, createdAt: new Date(), updatedAt: new Date() },
  ])
  console.log('Seeded 8 tips')

  await db.collection('opportunities').insertMany([
    { title: 'Fractured Light', artistName: 'Maya Chen', description: 'A digital exploration of how light breaks through urban architecture. Created using generative algorithms and hand-painted overlays in Procreate.', story: 'I was walking through downtown Portland when the sun hit a cracked window just right. I stood there for twenty minutes watching the light fracture into these impossible patterns. I went home and spent three weeks trying to recreate that feeling digitally.', medium: 'digital', imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800', price: '$350', negotiable: true, createdAt: new Date(), updatedAt: new Date() },
    { title: 'Vessel of Memory', artistName: 'Aisha Okafor', description: 'A hand-thrown ceramic piece inspired by the shapes of vessels found in my grandmother\'s kitchen. Raku-fired with copper matte glaze.', story: 'My grandmother kept everything in ceramic vessels — spices, seeds, stories. When she passed, I started throwing pots that echoed the shapes I remembered. This one took 12 tries to get right.', medium: 'pottery', imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800', price: '$480', negotiable: false, createdAt: new Date(), updatedAt: new Date() },
    { title: 'Untitled Wall Study #7', artistName: 'Rosa Villegas', description: 'Part of an ongoing series exploring color theory through large-scale murals. Spray paint and acrylic on concrete.', story: '', medium: 'graffiti', imageUrl: 'https://images.unsplash.com/photo-1561059488-916d69792237?w=800', price: 'Not for sale', negotiable: false, createdAt: new Date(), updatedAt: new Date() },
    { title: 'Woven Histories', artistName: 'Priya Sharma', description: 'A textile piece combining traditional weaving techniques with recycled materials. Each thread tells a story of displacement and belonging.', story: 'I learned to weave from my mother, who learned from hers. When we immigrated, the loom was the one thing we brought. This piece uses threads from clothes we wore in our old home, woven into the pattern of our new one.', medium: 'textile', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800', price: '$600', negotiable: true, createdAt: new Date(), updatedAt: new Date() },
    { title: 'Still Life with Morning Light', artistName: 'Elena Dubois', description: 'Oil on canvas, 24x36. Painted over three months of early morning sessions capturing the same table as seasons changed.', story: 'Every morning at 6am for three months, I set up the same still life and painted what I saw. The light changed everything — the same apple looked different every single day. This painting is all of those mornings layered together.', medium: 'painting', imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800', price: '$1,200', negotiable: false, createdAt: new Date(), updatedAt: new Date() },
    { title: 'Urban Decay — Doorway', artistName: 'Keiko Tanaka', description: 'Medium format film photography documenting abandoned industrial spaces being reclaimed by nature. Silver gelatin print.', story: '', medium: 'photography', imageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800', price: '$250', negotiable: true, createdAt: new Date(), updatedAt: new Date() },
    { title: 'Between Breaths', artistName: 'Fatima Al-Rashid', description: 'A bronze and found-object sculpture exploring the space between action and stillness. Mixed metals and reclaimed wood.', story: 'I found these metal scraps behind a demolition site and saw a figure trying to emerge. Sculpture is about revealing what is already there.', medium: 'sculpture', imageUrl: 'https://images.unsplash.com/photo-1544413660-299165566b1d?w=800', price: '$900', negotiable: true, createdAt: new Date(), updatedAt: new Date() },
    { title: 'Digital Garden #3', artistName: 'Luna Park', description: 'Interactive digital piece created with p5.js. Each viewer interaction generates unique floral patterns that never repeat.', story: 'I wanted to create art that changes every time someone looks at it. No two people will ever see the same garden. That felt important to me — art as a living thing.', medium: 'digital', imageUrl: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=800', price: '$175', negotiable: false, createdAt: new Date(), updatedAt: new Date() },
  ])
  console.log('Seeded 8 art posts')

  await mongoose.disconnect()
  console.log('Done! Database seeded successfully.')
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
