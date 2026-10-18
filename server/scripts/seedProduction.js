import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Destination from '../models/Destination.js';
import Package from '../models/Package.js';
import Car from '../models/Car.js';

dotenv.config();

const runSeed = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb+srv://sanehmandyal_db_user:KvGLMRqlhhJNroRL@cluster0.wjzihrm.mongodb.net/rinku_tour_travels';
  console.log('[Seed] Connecting to MongoDB Atlas...');
  await mongoose.connect(mongoUri);
  console.log('[Seed] Connected successfully!');

  // 1. Clear old destinations, packages, and cars
  await Promise.all([
    Destination.deleteMany(),
    Package.deleteMany(),
    Car.deleteMany()
  ]);
  console.log('[Seed] Cleared old destination, package, and car records.');

  // 2. 12 Authentic 100% Himachal Pradesh Destinations
  const destinationsData = [
    {
      name: 'Dharamshala & McLeodganj',
      slug: 'dharamshala-mcleodganj',
      country: 'India',
      state: 'Himachal Pradesh',
      region: 'Himalayas',
      shortDescription: 'Spiritual heart of Kangra with the Dalai Lama Temple, HPCA Stadium, and snow-capped Dhauladhar peaks.',
      description: 'Home to His Holiness the 14th Dalai Lama and the seat of the Tibetan government-in-exile, Dharamshala and McLeodganj offer a mesmerizing fusion of Buddhist spirituality, colonial charm, cedar woodlands, and scenic mountain cafes. Key highlights include the world-famous HPCA stadium, the ridge of Triund, Bhagsu waterfall, and peaceful monasteries.',
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dharamshala_stadium%2Chimachal_pradesh.jpg?width=1200',
      gallery: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Dharamshala_stadium%2Chimachal_pradesh.jpg?width=800',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Mcleodganj.jpg?width=800'
      ],
      attractions: [
        { title: 'HPCA Cricket Stadium', description: 'Scenic international stadium with snow-covered Dhauladhar peaks in the backdrop.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dharamshala_stadium%2Chimachal_pradesh.jpg?width=600' },
        { title: 'McLeodGanj Town & Tsuglagkhang', description: 'Sacred Buddhist sanctum, prayer wheels, and Dalai Lama residence.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mcleodganj.jpg?width=600' }
      ],
      thingsToDo: [
        { title: 'Triund Day Trek', description: 'Trek up through rhododendron and pine forests for panoramic Dhauladhar vistas.', icon: 'Compass' },
        { title: 'Tibetan Market Shopping', description: 'Handcrafted singing bowls, thangkas, and warm pashmina shawls.', icon: 'ShoppingBag' }
      ],
      bestTimeToVisit: 'Throughout the year (March to June & Sept to Dec best)',
      startingPrice: 5999,
      featured: true,
      status: 'active'
    },
    {
      name: 'Dalhousie & Khajjiar',
      slug: 'dalhousie-khajjiar',
      country: 'India',
      state: 'Himachal Pradesh',
      region: 'Himalayas',
      shortDescription: 'The "Mini Switzerland of India" featuring dense deodar forests, colonial bungalows, and saucer-shaped emerald meadows.',
      description: 'Spread over five scenic hills, Dalhousie is famed for its vintage Scottish architecture, tranquil pine-scented promenades, and old stone churches. A short scenic drive away lies Khajjiar, a breathtaking saucer-shaped green meadow ringed by tall cedars with a pristine lake at its center, famously officially christened "Mini Switzerland".',
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Khajjiar.jpg?width=1200',
      gallery: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Khajjiar.jpg?width=800',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Khajjiar_lake.jpg?width=800'
      ],
      attractions: [
        { title: 'Khajjiar Lake & Meadow', description: 'Lush alpine meadow with cedar trees, floating island, and 12th-century Khajji Nag temple.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Khajjiar.jpg?width=600' },
        { title: 'Khajjiar Forest Vista', description: 'Thick deodar woodlands home to barking deer and exotic Himalayan views.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Khajjiar_lake.jpg?width=600' }
      ],
      thingsToDo: [
        { title: 'Zorbing & Horse Riding in Khajjiar', description: 'Roll down green grassy slopes or take a peaceful pony ride across the meadow.', icon: 'Sun' },
        { title: 'Heritage Walk to St. John’s Church', description: 'Visit Dalhousie’s oldest church surrounded by majestic deodar trees.', icon: 'Compass' }
      ],
      bestTimeToVisit: 'April to July (Pleasant) & December to February (Snow)',
      startingPrice: 6999,
      featured: true,
      status: 'active'
    },
    {
      name: 'Manali & Solang Valley',
      slug: 'manali-solang',
      country: 'India',
      state: 'Himachal Pradesh',
      region: 'Himalayas',
      shortDescription: 'Snow-capped peaks, pine forests, Rohtang Pass glaciers, Atal Tunnel, and thrilling mountain sports.',
      description: 'Nestled on the banks of the Beas River, Manali is one of India’s most celebrated mountain destinations. From skiing down Solang Valley to unwinding near the historic Hadimba Temple, traversing the historic Rohtang Pass, and crossing the engineering marvel of Atal Tunnel to Sissu, Manali caters to families, honeymooners, and adventure-seekers alike.',
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hidimba_Temple_Manali.jpg?width=1200',
      gallery: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Hidimba_Temple_Manali.jpg?width=800',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Solang_Valley_Manali.JPG?width=800'
      ],
      attractions: [
        { title: 'Hadimba Wooden Temple', description: 'Historic 16th-century pagoda-style wooden temple inside deodar woods.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hidimba_Temple_Manali.jpg?width=600' },
        { title: 'Solang Valley Snow Point', description: 'Famous for paragliding, zorbing, and winter snow skiing.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Solang_Valley_Manali.JPG?width=600' }
      ],
      thingsToDo: [
        { title: 'Skiing & Snow Tubing at Solang', description: 'Pure powder snow fun during winter months.', icon: 'Wind' },
        { title: 'Beas River Rafting in Kullu', description: 'Navigate Grade II and III rapids along Kullu valley.', icon: 'Compass' }
      ],
      bestTimeToVisit: 'Throughout the year (Snow from Dec to Feb)',
      startingPrice: 8999,
      featured: true,
      status: 'active'
    },
    {
      name: 'Shimla & Kufri',
      slug: 'shimla-kufri',
      country: 'India',
      state: 'Himachal Pradesh',
      region: 'Himalayas',
      shortDescription: 'The Queen of Hills with charming British colonial heritage, UNESCO Toy Train, and scenic Mall Road.',
      description: 'Shimla, the former summer capital of British India, retains timeless colonial elegance. Surrounded by oak and deodar forests, Shimla is famed for its iconic Ridge, Christ Church, the UNESCO World Heritage Toy Train, and lush apple orchards and snow points in Kufri.',
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Christ_Church_-_Ridge_-_Shimla_2014-05-07_0963.JPG?width=1200',
      gallery: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Christ_Church_-_Ridge_-_Shimla_2014-05-07_0963.JPG?width=800',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Christ_Church_Shimla.jpg?width=800'
      ],
      attractions: [
        { title: 'The Ridge & Mall Road', description: 'The cultural center with neo-Gothic Christ Church and Himalayan valley views.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Christ_Church_-_Ridge_-_Shimla_2014-05-07_0963.JPG?width=600' },
        { title: 'Christ Church Shimla', description: 'Historic yellow neo-Gothic church standing prominently on The Ridge.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Christ_Church_Shimla.jpg?width=600' }
      ],
      thingsToDo: [
        { title: 'Kalka-Shimla Toy Train Ride', description: 'Ride through 102 tunnels across scenic pine valleys.', icon: 'Train' },
        { title: 'Jakhoo Temple Ropeway', description: 'Panoramic cable car to the giant Lord Hanuman statue atop Jakhoo hill.', icon: 'Mountain' }
      ],
      bestTimeToVisit: 'March to June & December to February',
      startingPrice: 7499,
      featured: true,
      status: 'active'
    },
    {
      name: 'Bir Billing',
      slug: 'bir-billing',
      country: 'India',
      state: 'Himachal Pradesh',
      region: 'Himalayas',
      shortDescription: 'World-famous Paragliding Capital of India with high-altitude take-offs, Tibetan monasteries, and organic tea estates.',
      description: 'Ranked as the 2nd best site in the world for paragliding, Bir Billing is an international adventure haven. Take off from the dizzying ridge of Billing (8,000 ft) and glide effortlessly over the breathtaking Kangra Valley before touching down smoothly in Bir. Explore Tibetan settlements, peaceful monasteries, and lush green tea gardens.',
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Paragliding%2C_Bir-Billing_%28HP%29%2C_India.jpg?width=1200',
      gallery: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Paragliding%2C_Bir-Billing_%28HP%29%2C_India.jpg?width=800',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Bir-Billing.jpg?width=800'
      ],
      attractions: [
        { title: 'Billing Paragliding Take-Off Point', description: 'Launchpad at 2,400 meters offering panoramic aerial views of Kangra.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Paragliding%2C_Bir-Billing_%28HP%29%2C_India.jpg?width=600' },
        { title: 'Bir Billing Mountain Ridge', description: 'Scenic launch ridge where gliders take flight over Himachal peaks.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bir-Billing.jpg?width=600' }
      ],
      thingsToDo: [
        { title: 'Tandem Paragliding Flight', description: 'Fly high with seasoned, certified pilots with full HD GoPro video.', icon: 'Wind' },
        { title: 'Sunset at Bir Landing Site', description: 'Relax at cozy cafes as colorful gliders descend against evening horizons.', icon: 'Sunset' }
      ],
      bestTimeToVisit: 'October to June',
      startingPrice: 4999,
      featured: true,
      status: 'active'
    },
    {
      name: 'Spiti Valley & Kaza',
      slug: 'spiti-valley-kaza',
      country: 'India',
      state: 'Himachal Pradesh',
      region: 'Himalayas',
      shortDescription: 'The Middle Land with stark cold desert moonscapes, 1000-year-old Key Monastery, and azure Chandratal Lake.',
      description: 'Separating India from Tibet, Spiti Valley is a dramatic high-altitude desert kingdom. Marvel at the ancient Key Monastery perched on a conical hill, send a letter from Hikkim (the world’s highest post office), gaze at dinosaur fossils in Langza, and camp near the crescent Moon Lake (Chandratal).',
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Key_Monastery,_Himachal_Pradesh.jpg?width=1200',
      gallery: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Key_Monastery,_Himachal_Pradesh.jpg?width=800',
        'https://commons.wikimedia.org/wiki/Special:FilePath/1000_Year_loop.jpg?width=800'
      ],
      attractions: [
        { title: 'Key Gompa Monastery', description: 'Historic fortress-like Tibetan Buddhist monastery over 1,000 years old.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Key_Monastery,_Himachal_Pradesh.jpg?width=600' },
        { title: 'Spiti Key Complex', description: 'Perched monastery views over Spiti river valley.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/1000_Year_loop.jpg?width=600' }
      ],
      thingsToDo: [
        { title: 'Milky Way Stargazing', description: 'Marvel at pristine, crystal-clear Himalayan night skies.', icon: 'Star' },
        { title: 'Cross Kunzum La Pass (14,931 ft)', description: 'Drive the rugged high pass connecting Lahaul and Spiti.', icon: 'Compass' }
      ],
      bestTimeToVisit: 'June to October',
      startingPrice: 18999,
      featured: true,
      status: 'active'
    },
    {
      name: 'Kasol & Tosh (Parvati Valley)',
      slug: 'kasol-parvati-valley',
      country: 'India',
      state: 'Himachal Pradesh',
      region: 'Himalayas',
      shortDescription: 'Riverside mountain cafes, hot sulphur springs of Manikaran, apple orchards of Tosh, and Kheerganga trails.',
      description: 'Cradled in the lush Parvati Valley, Kasol is a tranquil riverside haven famous for fresh mountain air, vibrant bohemian cafes, and pine forest walks along the churning Parvati river. Nearby lies holy Manikaran with its natural thermal springs and historic Gurudwara, and the rustic cliffside village of Tosh.',
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Manikaran_Sahib%2C_Himachal_Pradesh.jpg?width=1200',
      gallery: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Manikaran_Sahib%2C_Himachal_Pradesh.jpg?width=800',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Manikaran_Lake.jpg?width=800'
      ],
      attractions: [
        { title: 'Manikaran Sahib Gurudwara & Hot Springs', description: 'Sacred thermal sulphur springs that cook rice and heal ailments.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Manikaran_Sahib%2C_Himachal_Pradesh.jpg?width=600' },
        { title: 'Parvati River Valley', description: 'Raging crystal river surrounded by pine mountains and wooden bridges.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Manikaran_Lake.jpg?width=600' }
      ],
      thingsToDo: [
        { title: 'Chalal Riverside Forest Walk', description: 'Peaceful stroll through deodar trails crossing scenic suspension bridges.', icon: 'Compass' },
        { title: 'Dip in Holy Hot Springs', description: 'Rejuvenate in the natural mineral-rich pools of Manikaran.', icon: 'Sun' }
      ],
      bestTimeToVisit: 'March to June & September to November',
      startingPrice: 5499,
      featured: true,
      status: 'active'
    },
    {
      name: 'Jibhi & Tirthan Valley',
      slug: 'jibhi-tirthan-valley',
      country: 'India',
      state: 'Himachal Pradesh',
      region: 'Himalayas',
      shortDescription: 'Pristine offbeat paradise with wooden Himachali cottages, Serolsar Lake, Jalori Pass, and trout streams.',
      description: 'Hidden away in the Kullu district, Jibhi and Tirthan Valley are the crown jewels of offbeat Himachal. Bordering the UNESCO World Heritage Great Himalayan National Park, enjoy cascading freshwater streams, serene brown trout angling, lush cedar woodlands, and cozy wooden chalets.',
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jibhi_Bridge.jpg?width=1200',
      gallery: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Jibhi_Bridge.jpg?width=800',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Jibhi_Waterfall_Gate.jpg?width=800'
      ],
      attractions: [
        { title: 'Jibhi Wooden Bridge', description: 'Scenic pine forest stream and traditional wooden footbridge.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jibhi_Bridge.jpg?width=600' },
        { title: 'Jibhi Waterfall Trail', description: 'Hidden multi-tiered waterfalls connected by rustic wooden bridges.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jibhi_Waterfall_Gate.jpg?width=600' }
      ],
      thingsToDo: [
        { title: 'Trout Fishing in Tirthan River', description: 'Catch and release freshwater rainbow and brown trout.', icon: 'Compass' },
        { title: 'Bonfire by Wooden Chalets', description: 'Unwind amidst quiet starlit pine forests.', icon: 'Sun' }
      ],
      bestTimeToVisit: 'March to June & September to December',
      startingPrice: 6499,
      featured: true,
      status: 'active'
    },
    {
      name: 'Kinnaur, Kalpa & Sangla (Chitkul)',
      slug: 'kinnaur-kalpa-sangla',
      country: 'India',
      state: 'Himachal Pradesh',
      region: 'Himalayas',
      shortDescription: 'Land of Kinner Kailash peak, apple orchards of Sangla, and Chitkul - the legendary last village of India.',
      description: 'Kinnaur is an enchanting tribal wonderland where Tibetan and Hindu traditions intertwine. Stand before the sacred Kinner Kailash peak in Kalpa, wander through apple and walnut orchards along the Baspa river in Sangla, and travel to Chitkul, the last inhabited village on the Indo-Tibetan border.',
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chitkul_the_last_village_of_India.jpg?width=1200',
      gallery: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Chitkul_the_last_village_of_India.jpg?width=800',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Temple_at_Chitkul.JPG?width=800'
      ],
      attractions: [
        { title: 'Chitkul (Last Indian Village)', description: 'Charming wooden village surrounded by snowy peaks on the banks of Baspa River.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chitkul_the_last_village_of_India.jpg?width=600' },
        { title: 'Mathi Temple Chitkul', description: 'Ancient wooden temple dedicated to the guardian goddess of Chitkul.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Temple_at_Chitkul.JPG?width=600' }
      ],
      thingsToDo: [
        { title: 'Drive through Tranda Dhank', description: 'Hindustan-Tibet highway cut into sheer vertical granite cliffs.', icon: 'Compass' },
        { title: 'Taste Fresh Kinnauri Apples', description: 'Savor world-renowned sweet, crunchy Kinnauri apples straight from the trees.', icon: 'Sun' }
      ],
      bestTimeToVisit: 'April to October',
      startingPrice: 16999,
      featured: true,
      status: 'active'
    },
    {
      name: 'Palampur Tea Gardens & Baijnath',
      slug: 'palampur-baijnath',
      country: 'India',
      state: 'Himachal Pradesh',
      region: 'Himalayas',
      shortDescription: 'The Tea Capital of North India with sprawling emerald tea gardens, Neugal Khad stream, and ancient Shiva temple.',
      description: 'Lying in the picturesque Kangra valley, Palampur is framed by the dramatic snow-crested Dhauladhar mountains. Stroll through fragrant Kangra tea estates, visit the historic Wah Tea Estate, walk along Neugal Khad gorge, and offer prayers at the 13th-century stone temple of Baijnath.',
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Baijnath_temple.jpg?width=1200',
      gallery: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Baijnath_temple.jpg?width=800',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Kangra_Fort_Himachal_Pradesh.jpg?width=800'
      ],
      attractions: [
        { title: 'Baijnath Mahadev Temple', description: 'Architectural masterpiece housing one of the 12 revered Shiva Jyotirlingas.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Baijnath_temple.jpg?width=600' },
        { title: 'Kangra Valley Tea Region', description: 'Walk through century-old tea gardens and taste world-famous Kangra Green Tea.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kangra_Fort_Himachal_Pradesh.jpg?width=600' }
      ],
      thingsToDo: [
        { title: 'Tea Tasting Experience', description: 'Sample organic orthodox black and green teas.', icon: 'Coffee' },
        { title: 'Neugal Khad Riverside Picnic', description: 'Relax by crystal clear Himalayan waters overlooking Dhauladhars.', icon: 'Sun' }
      ],
      bestTimeToVisit: 'Throughout the year',
      startingPrice: 4499,
      featured: false,
      status: 'active'
    },
    {
      name: 'Kangra & Jawalamukhi (Shaktipeeths)',
      slug: 'kangra-jawalamukhi',
      country: 'India',
      state: 'Himachal Pradesh',
      region: 'Himalayas',
      shortDescription: 'Historic Kangra Fort, Brajeshwari Devi, Jawalaji eternal flame temple, Chamunda Devi, and Masroor Rock Cut Temple.',
      description: 'Kangra is the cultural and historical cradle of Himachal Pradesh. Home to powerful 51 Shaktipeeths including Brajeshwari Devi Kangra, Jawalamukhi (where sacred blue flames burn perpetually without fuel), Chamunda Devi, and Baglamukhi temple, along with the magnificent 1,000-year-old Kangra Fort and Masroor Rock-cut Monolithic Temples.',
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kangra_Fort_Himachal_Pradesh.jpg?width=1200',
      gallery: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Kangra_Fort_Himachal_Pradesh.jpg?width=800',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Jawala_Ji_Temple.jpg?width=800'
      ],
      attractions: [
        { title: 'Kangra Fort', description: 'The oldest surviving fort in the Himalayas with royal gates and museum.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kangra_Fort_Himachal_Pradesh.jpg?width=600' },
        { title: 'Jawalamukhi Shaktipeeth', description: 'Sacred temple where eternal natural flames have burned for centuries.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jawala_Ji_Temple.jpg?width=600' }
      ],
      thingsToDo: [
        { title: 'Devi Darshan Circuit', description: 'Dedicated comfortable AC cab pilgrimage covering all major Shaktipeeths.', icon: 'Heart' },
        { title: 'Kangra Fort Audio Tour', description: 'Relive the battles and dynasties of the Katoch kings.', icon: 'Compass' }
      ],
      bestTimeToVisit: 'Throughout the year',
      startingPrice: 4999,
      featured: false,
      status: 'active'
    },
    {
      name: 'Kullu & Naggar Castle',
      slug: 'kullu-naggar',
      country: 'India',
      state: 'Himachal Pradesh',
      region: 'Himalayas',
      shortDescription: 'Valley of Gods with wooden medieval Naggar Castle, Nicholas Roerich Art Gallery, and thrilling Beas river rafting.',
      description: 'The ancient capital of the Kullu Rajas, Naggar is an artistic haven nestled amidst apple orchards and deodar hills above the Beas river. Explore the 500-year-old wooden Naggar Castle with its kath-kuni architecture, the Roerich Art estate, and bustling handloom shawl weaving centers in Kullu.',
      heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Naggar_Castle_-_2.jpg?width=1200',
      gallery: [
        'https://commons.wikimedia.org/wiki/Special:FilePath/Naggar_Castle_-_2.jpg?width=800',
        'https://commons.wikimedia.org/wiki/Special:FilePath/Naggar_Castle.jpg?width=800'
      ],
      attractions: [
        { title: 'Naggar Castle', description: 'Medieval timber and stone fort commanding sweeping views of Kullu valley.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Naggar_Castle_-_2.jpg?width=600' },
        { title: 'Naggar Royal Courtyard', description: 'Historic wooden castle architectural woodwork in Kullu valley.', image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Naggar_Castle.jpg?width=600' }
      ],
      thingsToDo: [
        { title: 'White Water Rafting in Beas', description: '14 km river rafting expedition with certified guides and lifejackets.', icon: 'Compass' },
        { title: 'Authentic Kullu Shawl Shopping', description: 'Visit cooperative handloom weavers for genuine pure wool shawls.', icon: 'ShoppingBag' }
      ],
      bestTimeToVisit: 'March to June & September to December',
      startingPrice: 5999,
      featured: false,
      status: 'active'
    }
  ];

  const destinations = await Destination.insertMany(destinationsData);
  console.log(`[Seed] Successfully inserted ${destinations.length} Himachal Pradesh Destinations!`);

  const destMap = {};
  destinations.forEach(d => {
    destMap[d.slug] = d;
  });

  // 3. 10 Comprehensive Himachal Pradesh Tour Packages
  const packagesData = [
    {
      title: 'Kangra Valley, Dharamshala & Dalhousie Mini-Switzerland Tour',
      slug: 'kangra-valley-dharamshala-dalhousie-tour',
      destination: destMap['dharamshala-mcleodganj']._id,
      destinationName: 'Dharamshala & McLeodganj',
      category: 'Family Trips',
      duration: '5 Days / 4 Nights',
      daysCount: 5,
      nightsCount: 4,
      price: 16999,
      discountedPrice: 13999,
      rating: 5.0,
      reviewsCount: 48,
      description: 'The definitive Himachal holiday operated by Vista Tour and Travels. Discover Dalai Lama Temple in McLeodganj, scenic HPCA stadium, historic Kangra Fort, colonial Dalhousie, and the pristine meadows of Khajjiar (Mini Switzerland).',
      featuredImage: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1000&q=80',
      images: [
        'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80'
      ],
      itinerary: [
        { day: 1, title: 'Arrival in Kangra / Dharamshala & Temples', description: 'Pickup from Kangra Airport / Pathankot Station. Visit ancient Kangra Fort, Chamunda Devi, and check into resort.', meals: 'Welcome Drink & Dinner', hotel: 'Deluxe Valley Resort Dharamshala' },
        { day: 2, title: 'McLeodganj, Dalai Lama Temple & HPCA Stadium', description: 'Tour the Tsuglagkhang complex, Bhagsu waterfall, HPCA Cricket Stadium, and Dal Lake.', meals: 'Breakfast & Dinner', hotel: 'Deluxe Valley Resort Dharamshala' },
        { day: 3, title: 'Dharamshala to Dalhousie Scenic Drive', description: 'Scenic drive through pine ridges to Dalhousie. Relax and take an evening walk along Garam Sadak & Mall Road.', meals: 'Breakfast & Dinner', hotel: 'Grand View Resort Dalhousie' },
        { day: 4, title: 'Khajjiar (Mini Switzerland) & Kalatop Excursion', description: 'Full day in Khajjiar meadow. Enjoy zorbing, horse riding, and cedar forest walk in Kalatop sanctuary.', meals: 'Breakfast & Dinner', hotel: 'Grand View Resort Dalhousie' },
        { day: 5, title: 'Departure with Scenic Memories', description: 'Breakfast at hotel, souvenir shopping, and smooth drop to Pathankot / Kangra airport.', meals: 'Breakfast', hotel: 'Checkout' }
      ],
      inclusions: [
        '4 Nights accommodation in 3/4-star valley-facing hotels',
        'Daily buffet breakfast and dinner',
        'Dedicated private AC Sedan / SUV (Toyota Innova Crysta / Dzire)',
        'Driver allowances, state taxes, toll tax, and parking included',
        'Assistance at all destinations by local Kangra team'
      ],
      exclusions: [
        'Train or flight tickets',
        'Monument entry tickets',
        'Adventure sports fees (zorbing, horse riding)',
        'Personal expenses'
      ],
      hotels: 'D’s Casa Dharamshala & Grand View Hotel Dalhousie',
      transport: 'Private AC Toyota Innova / Dzire with seasoned Kangra hill chauffeur',
      tags: ['Family', 'Hills', 'Scenic', 'Temple', 'Khajjiar'],
      featured: true,
      status: 'published'
    },
    {
      title: 'Grand Complete Himachal Circuit (Shimla, Manali, Dharamshala, Dalhousie)',
      slug: 'complete-himachal-grand-circuit-tour',
      destination: destMap['manali-solang']._id,
      destinationName: 'Manali & Solang Valley',
      category: 'Family Trips',
      duration: '9 Days / 8 Nights',
      daysCount: 9,
      nightsCount: 8,
      price: 28999,
      discountedPrice: 24999,
      rating: 5.0,
      reviewsCount: 64,
      description: 'The ultimate all-inclusive Himachal vacation. Covers Shimla colonial heritage, Kufri snow point, Solang Valley, Atal Tunnel into Sissu, tea gardens of Palampur, McLeodganj Tibetan culture, and Khajjiar Mini-Switzerland.',
      featuredImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',
      images: [
        'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'
      ],
      itinerary: [
        { day: 1, title: 'Chandigarh to Shimla Arrival', description: 'Scenic drive to Shimla. Evening stroll along Mall Road & Ridge.', meals: 'Dinner', hotel: 'Hotel Willow Banks Shimla' },
        { day: 2, title: 'Kufri Snow Adventure & Jakhoo Temple', description: 'Horse riding, Himalayan nature park, and Jakhoo ropeway.', meals: 'Breakfast & Dinner', hotel: 'Hotel Willow Banks Shimla' },
        { day: 3, title: 'Shimla to Manali via Kullu Valley', description: 'Drive along Beas river, stopping at Pandoh Dam and Kullu shawl factories.', meals: 'Breakfast & Dinner', hotel: 'Snow Valley Resort Manali' },
        { day: 4, title: 'Solang Valley & Atal Tunnel Sissu Excursion', description: 'Snow games, paragliding, and crossing the 9km tunnel to Lahaul.', meals: 'Breakfast & Dinner', hotel: 'Snow Valley Resort Manali' },
        { day: 5, title: 'Manali Local Sightseeing & Old Manali Cafes', description: 'Hadimba Temple, Vashisht hot springs, and Manu Temple.', meals: 'Breakfast & Dinner', hotel: 'Snow Valley Resort Manali' },
        { day: 6, title: 'Manali to Dharamshala via Palampur Tea Gardens', description: 'Scenic road trip through tea estates and Baijnath Shiva Temple.', meals: 'Breakfast & Dinner', hotel: 'D’s Casa Dharamshala' },
        { day: 7, title: 'McLeodganj, Dalai Lama Temple & HPCA Stadium', description: 'Bhagsunag waterfall, Tibetan monasteries, and cricket stadium.', meals: 'Breakfast & Dinner', hotel: 'D’s Casa Dharamshala' },
        { day: 8, title: 'Dharamshala to Dalhousie & Khajjiar', description: 'Transfer to Dalhousie and explore Khajjiar green meadows.', meals: 'Breakfast & Dinner', hotel: 'Grand View Dalhousie' },
        { day: 9, title: 'Departure via Pathankot / Chandigarh', description: 'Breakfast and smooth departure transfer.', meals: 'Breakfast', hotel: 'Checkout' }
      ],
      inclusions: [
        '8 Nights in verified 3/4-star mountain hotels',
        'Daily buffet breakfast and multi-cuisine dinner',
        'Dedicated private AC Innova Crysta / Ertiga for the complete tour',
        'All hill permits, tolls, parking, and driver allowances'
      ],
      exclusions: ['Flight/Train tickets', 'Personal expenses', 'Adventure activities'],
      hotels: 'Top rated 4-star properties in Shimla, Manali, Dharamshala & Dalhousie',
      transport: 'Private AC Toyota Innova Crysta with veteran mountain chauffeur',
      tags: ['GrandTour', 'Family', 'Himachal', 'Snow', 'Complete'],
      featured: true,
      status: 'published'
    },
    {
      title: 'Manali Snow Escape, Solang Valley & Atal Tunnel Tour',
      slug: 'manali-snow-solang-atal-tunnel-tour',
      destination: destMap['manali-solang']._id,
      destinationName: 'Manali & Solang Valley',
      category: 'Honeymoon',
      duration: '5 Days / 4 Nights',
      daysCount: 5,
      nightsCount: 4,
      price: 15999,
      discountedPrice: 12499,
      rating: 4.9,
      reviewsCount: 54,
      description: 'The classic honeymoon and family snow getaway in the Himalayas. Experience skiing down Solang Valley, traversing the Atal Tunnel into frozen Sissu (Lahaul), Old Manali cafes, and riverside Kullu.',
      featuredImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',
      images: [
        'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1586351012965-861624544334?auto=format&fit=crop&w=800&q=80'
      ],
      itinerary: [
        { day: 1, title: 'Arrival in Manali & Hadimba Temple', description: 'Check into hotel. Visit Hadimba Temple, Vashisht Sulphur Springs, and evening stroll along Mall Road.', meals: 'Welcome Drink & Dinner', hotel: 'Snow Valley Resort Manali' },
        { day: 2, title: 'Solang Valley Adventure & Snow Sports', description: 'Head to Solang Valley for paragliding, snow scooter rides, zorbing, and ropeway cable car.', meals: 'Breakfast & Dinner', hotel: 'Snow Valley Resort Manali' },
        { day: 3, title: 'Atal Tunnel & Sissu Waterfall Exploration', description: 'Pass through the 9.02 km Atal Tunnel to the frozen valley of Sissu in Lahaul.', meals: 'Breakfast & Dinner', hotel: 'Snow Valley Resort Manali' },
        { day: 4, title: 'Naggar Castle & Kullu River Rafting', description: 'Visit historic wooden Naggar Castle, Nicholas Roerich Gallery, and river rafting in Kullu.', meals: 'Breakfast & Dinner', hotel: 'Snow Valley Resort Manali' },
        { day: 5, title: 'Departure', description: 'Breakfast and smooth departure drop to Chandigarh or Pathankot.', meals: 'Breakfast', hotel: 'Checkout' }
      ],
      inclusions: [
        '4 Nights stay in 4-star mountain resort',
        'Daily buffet breakfast and hot dinner',
        'Private AC Sedan / SUV for the entire itinerary',
        'Solang Valley & Atal Tunnel excursion permits and all tolls'
      ],
      exclusions: ['Adventure activities', 'Personal shopping'],
      hotels: 'Snow Valley Resort Manali',
      transport: 'Private AC Sedan / Innova',
      tags: ['Snow', 'Honeymoon', 'Family', 'Manali'],
      featured: true,
      status: 'published'
    },
    {
      title: 'Shimla, Kufri & Chail Heritage Getaway',
      slug: 'shimla-kufri-chail-heritage-tour',
      destination: destMap['shimla-kufri']._id,
      destinationName: 'Shimla & Kufri',
      category: 'Weekend Getaways',
      duration: '4 Days / 3 Nights',
      daysCount: 4,
      nightsCount: 3,
      price: 11999,
      discountedPrice: 9499,
      rating: 4.8,
      reviewsCount: 31,
      description: 'A refreshing British colonial escape. Experience iconic Mall Road, Christ Church, the Kufri snow meadows, and Chail Palace, home to the world’s highest cricket ground.',
      featuredImage: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1000&q=80',
      images: [
        'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=800&q=80'
      ],
      itinerary: [
        { day: 1, title: 'Drive to Shimla & The Ridge Walk', description: 'Scenic drive up the Shivaliks. Check in, visit Christ Church, Lakkar Bazaar, and Mall Road.', meals: 'Dinner', hotel: 'Willow Banks Shimla' },
        { day: 2, title: 'Kufri Snow Adventure & Jakhoo Hill', description: 'Horse riding in Kufri, nature park, and Jakhoo ropeway cable car.', meals: 'Breakfast & Dinner', hotel: 'Willow Banks Shimla' },
        { day: 3, title: 'Chail Palace Excursion', description: 'Visit Chail Maharaja Palace and the world’s highest cricket ground.', meals: 'Breakfast & Dinner', hotel: 'Willow Banks Shimla' },
        { day: 4, title: 'Viceregal Lodge & Return Transfer', description: 'Tour the British Viceregal Lodge before returning comfortably.', meals: 'Breakfast', hotel: 'Checkout' }
      ],
      inclusions: [
        '3 Nights stay in premium 3/4-star hotel with breakfast & dinner',
        'Private sanitized AC car for the complete trip',
        'Tolls, taxes, and driver allowance'
      ],
      exclusions: ['Monument tickets', 'Personal shopping'],
      hotels: 'Willow Banks Shimla',
      transport: 'Private AC Sedan / Dzire',
      tags: ['Weekend', 'Heritage', 'Shimla'],
      featured: false,
      status: 'published'
    },
    {
      title: 'Spiti Valley & Chandratal Lake 4x4 High-Altitude Expedition',
      slug: 'spiti-valley-chandratal-4x4-expedition',
      destination: destMap['spiti-valley-kaza']._id,
      destinationName: 'Spiti Valley & Kaza',
      category: 'Adventure',
      duration: '7 Days / 6 Nights',
      daysCount: 7,
      nightsCount: 6,
      price: 32999,
      discountedPrice: 27999,
      rating: 5.0,
      reviewsCount: 42,
      description: 'An epic Himalayan road expedition through Atal Tunnel, Kunzum Pass (14,931 ft), Kaza, Key Monastery, the world’s highest post office at Hikkim, and luxury camping beside the turquoise crescent Moon Lake (Chandratal).',
      featuredImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1000&q=80',
      images: [
        'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
      ],
      itinerary: [
        { day: 1, title: 'Manali to Kaza via Atal Tunnel & Kunzum Pass', description: 'Early morning drive crossing Atal Tunnel and Kunzum Pass into Spiti.', meals: 'Dinner', hotel: 'Grand Dew Kaza' },
        { day: 2, title: 'Key Monastery & Kibber Village', description: 'Tour the 1,000-year-old Key Monastery and cross Chicham Bridge (highest in Asia).', meals: 'Breakfast & Dinner', hotel: 'Grand Dew Kaza' },
        { day: 3, title: 'Hikkim, Komic & Langza Circuit', description: 'Post letters from Hikkim, see Komic monastery, and search for fossils in Langza.', meals: 'Breakfast & Dinner', hotel: 'Grand Dew Kaza' },
        { day: 4, title: 'Pin Valley National Park Excursion', description: 'Drive to scenic Kungri monastery and search for Himalayan ibex.', meals: 'Breakfast & Dinner', hotel: 'Grand Dew Kaza' },
        { day: 5, title: 'Kaza to Chandratal Lake Luxury Camping', description: 'Drive to turquoise Moon Lake. Sunset walk and stargazing by luxury camps.', meals: 'Breakfast & Dinner', hotel: 'Luxury Swiss Camp Chandratal' },
        { day: 6, title: 'Chandratal to Manali via Batal', description: 'Sunrise over the lake, cross Batal and Rohtang Pass, returning to Manali.', meals: 'Breakfast & Dinner', hotel: 'Snow Valley Resort Manali' },
        { day: 7, title: 'Departure Transfer', description: 'Breakfast and smooth departure drop.', meals: 'Breakfast', hotel: 'Checkout' }
      ],
      inclusions: [
        '6 Nights hotel & luxury camp accommodation',
        'Dedicated 4x4 SUV (Mahindra Scorpio-N 4x4 / Innova) with high-altitude driver',
        'Oxygen cylinder and first-aid kits on board',
        'Daily breakfast & hot dinner',
        'Spiti inner line permits and environment fees'
      ],
      exclusions: ['Travel insurance', 'Personal medicines'],
      hotels: 'Grand Dew Kaza & Chandratal Alpine Swiss Camps',
      transport: '4x4 High-Clearance SUV with expert mountain chauffeur',
      tags: ['Offbeat', 'Adventure', '4x4', 'Stargazing', 'Spiti'],
      featured: true,
      status: 'published'
    },
    {
      title: 'Bir Billing Paragliding & Baijnath Adventure Weekend',
      slug: 'bir-billing-paragliding-adventure-weekend',
      destination: destMap['bir-billing']._id,
      destinationName: 'Bir Billing',
      category: 'Adventure',
      duration: '3 Days / 2 Nights',
      daysCount: 3,
      nightsCount: 2,
      price: 8999,
      discountedPrice: 6999,
      rating: 4.9,
      reviewsCount: 38,
      description: 'Feel the ultimate rush of flying in the paragliding capital of India. Includes high-altitude tandem paragliding from Billing (8,000 ft), cozy boutique stay, cafe crawl, and visit to Baijnath Shiva Temple.',
      featuredImage: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1000&q=80',
      images: [
        'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=80'
      ],
      itinerary: [
        { day: 1, title: 'Arrival in Bir & Cafe Crawl', description: 'Pickup from Kangra / Dharamshala. Check in, explore local Tibetan cafes, and watch the sunset at the landing site.', meals: 'Dinner & Bonfire', hotel: 'The Hosteller Bir / Boutique Camp' },
        { day: 2, title: 'Billing Paragliding Flight & Monasteries', description: 'Morning ascent to Billing take-off point. 15-25 min tandem paragliding with GoPro video. Afternoon visit to Chokling Monastery.', meals: 'Breakfast & Dinner', hotel: 'The Hosteller Bir' },
        { day: 3, title: 'Baijnath Temple & Departure Transfer', description: 'Visit historic 13th-century Baijnath Shiva Temple and return transfer to Kangra/Pathankot.', meals: 'Breakfast', hotel: 'Checkout' }
      ],
      inclusions: [
        '2 Nights stay in deluxe alpine resort / boutique camp',
        '1 High-altitude tandem paragliding flight with certified pilot',
        'GoPro HD video recording of your flight',
        'Daily breakfast, dinner, and evening bonfire with music',
        'Private sanitized vehicle for all transfers'
      ],
      exclusions: ['Travel insurance', 'Personal cafe expenses', 'Tips'],
      hotels: 'The Hosteller Bir / Zostel Plus Glamping',
      transport: 'Private AC vehicle with local driver',
      tags: ['Paragliding', 'Adventure', 'Youth', 'Weekend'],
      featured: true,
      status: 'published'
    },
    {
      title: 'Kasol, Tosh & Kheerganga Parvati Valley Trek Tour',
      slug: 'kasol-tosh-kheerganga-parvati-valley-tour',
      destination: destMap['kasol-parvati-valley']._id,
      destinationName: 'Kasol & Tosh (Parvati Valley)',
      category: 'Adventure',
      duration: '4 Days / 3 Nights',
      daysCount: 4,
      nightsCount: 3,
      price: 11499,
      discountedPrice: 8999,
      rating: 4.9,
      reviewsCount: 27,
      description: 'Immerse in the magic of Parvati Valley. Riverside cafes in Kasol, holy hot water springs of Manikaran Sahib, traditional Himachali homestay in Tosh, and scenic nature walks through deodar forests.',
      featuredImage: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1000&q=80',
      images: [
        'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'
      ],
      itinerary: [
        { day: 1, title: 'Arrival in Kasol & Parvati River Walk', description: 'Check into riverside resort. Stroll through Chalal village trail and dine at authentic riverside cafes.', meals: 'Dinner & Music', hotel: 'Riverside Alpine Resort Kasol' },
        { day: 2, title: 'Manikaran Sahib Hot Springs & Gurudwara', description: 'Visit sacred hot sulphur springs, take a holy dip, and enjoy Langar.', meals: 'Breakfast & Dinner', hotel: 'Riverside Alpine Resort Kasol' },
        { day: 3, title: 'Tosh Village & Waterfall Excursion', description: 'Scenic drive to Tosh. Hike up to Tosh waterfall overlooking snow peaks.', meals: 'Breakfast & Dinner', hotel: 'Boutique Homestay Tosh' },
        { day: 4, title: 'Departure Transfer', description: 'Breakfast and smooth departure drop to Bhuntar / Chandigarh.', meals: 'Breakfast', hotel: 'Checkout' }
      ],
      inclusions: [
        '3 Nights accommodation (Riverside resort & wooden homestay)',
        'Daily breakfast & dinner',
        'Private AC vehicle for all transfers and sightseeing',
        'Assistance of local valley guide'
      ],
      exclusions: ['Cafe food', 'Personal expenses'],
      hotels: 'The Kasol Heights & Tosh Homestay',
      transport: 'Private AC Sedan / SUV',
      tags: ['ParvatiValley', 'Kasol', 'Tosh', 'Riverside'],
      featured: false,
      status: 'published'
    },
    {
      title: 'Jibhi, Jalori Pass & Tirthan Valley Offbeat Nature Retreat',
      slug: 'jibhi-jalori-pass-tirthan-valley-tour',
      destination: destMap['jibhi-tirthan-valley']._id,
      destinationName: 'Jibhi & Tirthan Valley',
      category: 'Weekend Getaways',
      duration: '4 Days / 3 Nights',
      daysCount: 4,
      nightsCount: 3,
      price: 12999,
      discountedPrice: 9999,
      rating: 5.0,
      reviewsCount: 33,
      description: 'Discover untouched Himachal. Stay in authentic handcrafted wooden tree chalets, trek from Jalori Pass (10,800 ft) to crystal Serolsar Lake, see hidden Jibhi waterfalls, and relax by Tirthan river streams.',
      featuredImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
      images: [
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
      ],
      itinerary: [
        { day: 1, title: 'Arrival in Jibhi & Wooden Chalet Check-in', description: 'Scenic drive through Banjar valley. Check into wooden cottage, visit Jibhi Waterfall and rustic wooden bridges.', meals: 'Dinner & Bonfire', hotel: 'Jibhi Wooden Chalet' },
        { day: 2, title: 'Jalori Pass & Serolsar Lake Trek', description: 'Drive up to 10,800 ft Jalori Pass. 5 km peaceful oak forest trek to the sacred Serolsar Lake.', meals: 'Breakfast & Dinner', hotel: 'Jibhi Wooden Chalet' },
        { day: 3, title: 'Tirthan Valley & Great Himalayan National Park', description: 'Riverside stroll, trout hatchery visit, and relaxation by the crystal clear river.', meals: 'Breakfast & Dinner', hotel: 'Jibhi Wooden Chalet' },
        { day: 4, title: 'Departure', description: 'Farewell breakfast and return drive.', meals: 'Breakfast', hotel: 'Checkout' }
      ],
      inclusions: [
        '3 Nights stay in premium wooden chalet with mountain views',
        'Daily breakfast and hot dinner',
        'Private sanitized car with experienced mountain driver',
        'Jalori Pass excursion'
      ],
      exclusions: ['Trout fishing permit', 'Personal expenses'],
      hotels: 'Pine Chalets Jibhi',
      transport: 'Private AC Car',
      tags: ['Offbeat', 'Jibhi', 'Nature', 'Serene'],
      featured: true,
      status: 'published'
    },
    {
      title: 'Kinnaur, Sangla, Chitkul & Kalpa Tribal Circuit',
      slug: 'kinnaur-sangla-chitkul-kalpa-tour',
      destination: destMap['kinnaur-kalpa-sangla']._id,
      destinationName: 'Kinnaur, Kalpa & Sangla (Chitkul)',
      category: 'Adventure',
      duration: '7 Days / 6 Nights',
      daysCount: 7,
      nightsCount: 6,
      price: 24999,
      discountedPrice: 20999,
      rating: 5.0,
      reviewsCount: 22,
      description: 'Journey into the heart of Kinnaur. Marvel at the golden Kinner Kailash peak at sunrise, walk through Baspa valley apple orchards, explore Kamru Fort, and stand at Chitkul - the last village on the border.',
      featuredImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
      images: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
      ],
      itinerary: [
        { day: 1, title: 'Shimla to Sarahan (Bhimakali Temple)', description: 'Drive along Sutlej river to Sarahan. Visit the 800-year-old wooden Bhimakali Temple.', meals: 'Dinner', hotel: 'HPTDC Hotel Srikhand Sarahan' },
        { day: 2, title: 'Sarahan to Sangla Valley', description: 'Drive into picturesque Baspa valley. Check into luxury riverside Swiss tents.', meals: 'Breakfast & Dinner', hotel: 'Sangla Alpine Camp' },
        { day: 3, title: 'Chitkul (Last Village of India) Excursion', description: 'Full day excursion to the wooden village of Chitkul along turquoise Baspa river.', meals: 'Breakfast & Dinner', hotel: 'Sangla Alpine Camp' },
        { day: 4, title: 'Sangla to Kalpa & Suicide Point', description: 'Drive to Kalpa. Gaze at the towering Kinner Kailash peak and visit Roghi cliff.', meals: 'Breakfast & Dinner', hotel: 'Grand Kalpa Resort' },
        { day: 5, title: 'Kalpa Apple Orchards & Chini Village', description: 'Explore ancient Buddhist monasteries and local Kinnauri wooden architecture.', meals: 'Breakfast & Dinner', hotel: 'Grand Kalpa Resort' },
        { day: 6, title: 'Kalpa to Narkanda / Rampur', description: 'Return drive through the Sutlej canyon to apple town of Narkanda.', meals: 'Breakfast & Dinner', hotel: 'Tethys Resort Narkanda' },
        { day: 7, title: 'Departure Transfer to Chandigarh', description: 'Breakfast and final descent drop.', meals: 'Breakfast', hotel: 'Checkout' }
      ],
      inclusions: [
        '6 Nights accommodation in premium hotels & Swiss camps',
        'Daily breakfast and hot dinner',
        'Dedicated private SUV (Innova / Scorpio) with seasoned hill driver',
        'All inner-line tribal road taxes and tolls'
      ],
      exclusions: ['Airfare/train', 'Personal shopping'],
      hotels: 'HPTDC Sarahan, Sangla Camps, Grand Kalpa Resort',
      transport: 'Private AC Toyota Innova / Mahindra Scorpio-N',
      tags: ['Kinnaur', 'Chitkul', 'Kalpa', 'TribalCircuit'],
      featured: false,
      status: 'published'
    },
    {
      title: 'Sacred Himachal Devi Darshan Shaktipeeth Yatra',
      slug: 'sacred-himachal-devi-darshan-shaktipeeth-yatra',
      destination: destMap['kangra-jawalamukhi']._id,
      destinationName: 'Kangra & Jawalamukhi (Shaktipeeths)',
      category: 'Group Tours',
      duration: '5 Days / 4 Nights',
      daysCount: 5,
      nightsCount: 4,
      price: 13999,
      discountedPrice: 10999,
      rating: 5.0,
      reviewsCount: 68,
      description: 'The most sacred pilgrimage in Himachal Pradesh operated by Vista Tour and Travels. Covers all major holy shrines: Mata Chamunda Devi, Kangra Brajeshwari Devi, Jawalamukhi (eternal flame), Chintpurni Devi, Baglamukhi, and Naina Devi.',
      featuredImage: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1000&q=80',
      images: [
        'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80'
      ],
      itinerary: [
        { day: 1, title: 'Arrival in Kangra & Mata Chamunda Devi', description: 'Pickup from Kangra Airport / Pathankot / Una. Visit holy Chamunda Devi Temple and Baner river ghat.', meals: 'Dinner', hotel: 'Hotel Sagar Ganga Kangra / Dharamshala' },
        { day: 2, title: 'Mata Brajeshwari Devi (Kangra) & Kangra Fort', description: 'Morning Aarti and Darshan at Mata Brajeshwari Devi Temple, followed by Kangra Fort visit.', meals: 'Breakfast & Dinner', hotel: 'Hotel Sagar Ganga Kangra' },
        { day: 3, title: 'Mata Jawalamukhi & Baglamukhi Darshan', description: 'Witness the miraculous eternal blue flames at Jawalamukhi and seek blessings at Maa Baglamukhi temple.', meals: 'Breakfast & Dinner', hotel: 'Hotel Jawalaji Grand' },
        { day: 4, title: 'Mata Chintpurni Devi Darshan', description: 'Visit the wish-fulfilling Chintpurni Devi temple and enjoy holy Prasad.', meals: 'Breakfast & Dinner', hotel: 'Hotel Chintpurni Residency' },
        { day: 5, title: 'Mata Naina Devi & Return Transfer', description: 'Cable car ride to Mata Naina Devi overlooking Gobind Sagar Lake, followed by smooth return drop.', meals: 'Breakfast', hotel: 'Checkout' }
      ],
      inclusions: [
        '4 Nights accommodation in comfortable AC hotels near temple complexes',
        'Daily pure vegetarian breakfast and dinner',
        'Dedicated AC vehicle (Dzire / Ertiga / Innova / Tempo Traveller for group)',
        'VIP Darshan assistance where available',
        'All parking, tolls, and driver allowances'
      ],
      exclusions: ['Personal pooja materials', 'Special VIP entry tickets'],
      hotels: 'Verified pure-veg pilgrim hotels in Kangra, Jawalaji, and Chintpurni',
      transport: 'Dedicated private sanitized AC vehicle with respectful local driver',
      tags: ['Pilgrimage', 'Shaktipeeth', 'DeviDarshan', 'Kangra', 'Family'],
      featured: true,
      status: 'published'
    }
  ];

  const packages = await Package.insertMany(packagesData);
  console.log(`[Seed] Successfully inserted ${packages.length} Himachal Pradesh Tour Packages!`);

  // 4. 12 Diverse Himachal Travel Fleet Cars
  const carsData = [
    {
      name: 'Toyota Innova Crysta',
      category: 'SUV',
      seatingCapacity: '6 + 1 Seats',
      luggageCapacity: '4 Large Bags',
      fuelType: 'Diesel',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Innova_Crysta_2.4_Z_front_right.jpg?width=800',
      features: [
        'Dual AC & Climate Control',
        'Roof Carrier for Extra Luggage',
        'Pushback Recliner Seats',
        'Experienced Mountain Driver'
      ],
      description: 'Premier luxury SUV for Himachal hill stations and family vacations. High safety rating and comfortable ride.',
      isAvailable: true
    },
    {
      name: 'Toyota Innova Hycross',
      category: 'Luxury',
      seatingCapacity: '6 + 1 Seats',
      luggageCapacity: '4 Large Bags',
      fuelType: 'Hybrid / Petrol',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/2023_Toyota_Kijang_Innova_Zenix_2.0_Q_Hybrid_Modellista_(front),_West_Surabaya.jpg?width=800',
      features: [
        'Ottoman Recliner Captain Seats',
        'Dual Zone Chilled Climate Control',
        'Panoramic Sunroof Experience',
        'Silent Hybrid Hill Cruise'
      ],
      description: 'Ultra-luxurious hybrid cruiser for VIPs, executives, and luxury family holidays across Himachal Pradesh.',
      isAvailable: true
    },
    {
      name: 'Maruti Suzuki Ertiga',
      category: 'MUV',
      seatingCapacity: '5 + 1 Seats',
      luggageCapacity: '3 Large Bags',
      fuelType: 'Petrol / Hybrid',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_Ertiga(2).jpg?width=800',
      features: [
        'Chilled AC with Rear Vents',
        'Comfortable 3-Row Seating',
        'Smooth Hill Suspension',
        'Certified Chauffeur'
      ],
      description: 'Budget-friendly yet remarkably spacious. Great for small families, local Kangra temple circuits, and airport transfers.',
      isAvailable: true
    },
    {
      name: 'Maruti Suzuki Swift Dzire',
      category: 'Sedan',
      seatingCapacity: '4 + 1 Seats',
      luggageCapacity: '2 Large Bags + Handbags',
      fuelType: 'Petrol',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_Dzire_VXi_VVT_(front).JPG?width=800',
      features: [
        'AC & Cabin Heating',
        'Deep Boot Space',
        'Smooth Highway Ride',
        'Sanitized Daily'
      ],
      description: 'Most popular and economical choice for couples, solo travelers, and city tours across Kangra and Dharamshala.',
      isAvailable: true
    },
    {
      name: 'Toyota Etios',
      category: 'Sedan',
      seatingCapacity: '4 + 1 Seats',
      luggageCapacity: '3 Large Bags',
      fuelType: 'Diesel / Petrol',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Etios_1.5_XLS_Sedan_2019.jpg?width=800',
      features: [
        'Extra Legroom & Shoulder Room',
        'Huge 595L Boot Space',
        'Powerful Mountain AC',
        'Chauffeur Driven'
      ],
      description: 'Remarkably roomy sedan renowned for rugged reliability, comfort, and generous luggage room for mountain touring.',
      isAvailable: true
    },
    {
      name: 'Maruti Suzuki Alto K10 / WagonR',
      category: 'Hatchback',
      seatingCapacity: '4 + 1 Seats',
      luggageCapacity: '2 Medium Bags',
      fuelType: 'Petrol',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maruti_Suzuki_-_Alto_800_LXi.JPG?width=800',
      features: [
        'Compact & Nimble on Mountain Roads',
        'Chilled AC & Hill Heater',
        'Most Economical Budget Rates',
        'Local Kangra Driver'
      ],
      description: 'Agile and budget-friendly. Navigates narrow mountain lanes and temple roads with ease.',
      isAvailable: true
    },
    {
      name: 'Mahindra Scorpio-N 4x4',
      category: '4x4 Off-Road',
      seatingCapacity: '6 + 1 Seats',
      luggageCapacity: '4 Large Bags',
      fuelType: 'Diesel',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mahindra_Scorpio.jpg?width=800',
      features: [
        '4x4 High Ground Clearance',
        'Rugged All-Terrain Hill Tires',
        'Roof Luggage Rack',
        'Snow Chain Equipped'
      ],
      description: 'Built tough for rough Himalayan terrains. Best suited for high-altitude Spiti expeditions and winter snow.',
      isAvailable: true
    },
    {
      name: 'Toyota Fortuner 4x4',
      category: 'Luxury',
      seatingCapacity: '6 + 1 Seats',
      luggageCapacity: '5 Large Bags',
      fuelType: 'Diesel',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Fortuner_2.8_GR_Sport_4x4_2022.jpg?width=800',
      features: [
        '4x4 High-Torque Mountain Engine',
        'Plush Leather Interior',
        'Extreme Off-Road Capability',
        'VIP Hill Escort Service'
      ],
      description: 'The ultimate beast for luxury travel, mountain passes, and snowy winter expeditions across Himachal.',
      isAvailable: true
    },
    {
      name: 'Force Urbania Luxury Van',
      category: 'Tempo Traveller',
      seatingCapacity: '10 + 1 Passengers',
      luggageCapacity: '8 Large Bags',
      fuelType: 'Diesel',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Force_Traveller_Luxury.jpg?width=800',
      features: [
        'Individual Aircraft-Style Bucket Seats',
        'Triple AC with Personalized Vents',
        'Panoramic Tinted Windows',
        'Individual USB Ports & Mood Lights'
      ],
      description: 'Next-generation European luxury van for executive groups, high-end family trips, and corporate delegates.',
      isAvailable: true
    },
    {
      name: 'Force Tempo Traveller (12-Seater Deluxe)',
      category: 'Tempo Traveller',
      seatingCapacity: '12 + 1 Passengers',
      luggageCapacity: 'Rear Boot + Heavy Roof Carrier',
      fuelType: 'Diesel',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Force_Traveller,_Leh-Manali_Highway.jpg?width=800',
      features: [
        'Reclining Pushback Seats',
        'Individual AC Vents',
        'Music Surround Sound',
        'High Roof Stand-up Interior'
      ],
      description: 'First-class group luxury. Perfect for joint families, corporate offsites, and wedding guest transfers across Himachal.',
      isAvailable: true
    },
    {
      name: 'Force Tempo Traveller (17-Seater Deluxe)',
      category: 'Tempo Traveller',
      seatingCapacity: '17 + 1 Passengers',
      luggageCapacity: 'Extra Heavy Overhead Carrier',
      fuelType: 'Diesel',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Force_Traveller_Luxury.jpg?width=800',
      features: [
        'Wide Reclining Luxury Seats',
        'Dual High-Capacity AC Units',
        'High-Roof Stand-up Height',
        'First Aid Kit & Fire Safety'
      ],
      description: 'Maximum capacity with supreme comfort for large pilgrim groups and family holidays.',
      isAvailable: true
    },
    {
      name: 'Force Tempo Traveller (26-Seater Maharaja)',
      category: 'Tempo Traveller',
      seatingCapacity: '26 + 1 Passengers',
      luggageCapacity: 'Massive Roof Carrier + Rear Space',
      fuelType: 'Diesel',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Force_Traveller,_Leh-Manali_Highway.jpg?width=800',
      features: [
        '2x2 Pushback Maharaja Seats',
        'Twin High-Powered Cooling Units',
        'LCD TV with Sound System',
        'Senior Mountain Chauffeur'
      ],
      description: 'The ultimate group carrier for weddings, school excursions, and grand Himachal temple pilgrimages.',
      isAvailable: true
    }
  ];

  const cars = await Car.insertMany(carsData);
  console.log(`[Seed] Successfully inserted ${cars.length} Car Fleet Models!`);

  console.log('\n==========================================');
  console.log('✅ SEED COMPLETE:');
  console.log(`- 12 Authentic Himachal Pradesh Destinations`);
  console.log(`- 10 Comprehensive Himachal Pradesh Tour Packages`);
  console.log(`- 12 Broad Car Fleet Models (Hatchback, Sedan, MUV, SUV, Luxury, 4x4, Tempo)`);
  console.log('==========================================\n');

  process.exit(0);
};

runSeed().catch(err => {
  console.error('[Seed Error]', err);
  process.exit(1);
});
