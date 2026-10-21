process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const API_URL = 'https://vista-tour-travel-api.onrender.com/api';
const TOKEN = 'vtt_admin_authenticated_' + Date.now();

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json'
};

const authenticImages = {
  kurukshetra: 'https://commons.wikimedia.org/wiki/Special:FilePath/Brahma_Sarovar_Kurukshetra.jpg?width=1200',
  ambala: 'https://commons.wikimedia.org/wiki/Special:FilePath/Holy_Redeemer_Church_Ambala.jpg?width=1200',
  delhi: 'https://commons.wikimedia.org/wiki/Special:FilePath/India_Gate_in_New_Delhi_03-2016.jpg?width=1200',
  karnal: 'https://commons.wikimedia.org/wiki/Special:FilePath/Karna_Lake_Karnal.jpg?width=1200',
  panipat: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kabuli_Bagh_Mosque_Panipat.jpg?width=1200',
  yamunanagar: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hathni_Kund_Barrage.jpg?width=1200',
  chandigarh: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rock_Garden_of_Chandigarh.jpg?width=1200',
  kaithal: '/assets/images/kaithal-temple.jpg'
};

async function sync() {
  try {
    const response = await fetch(`${API_URL}/destinations?limit=100`);
    const res = await response.json();
    if (!res.success || !Array.isArray(res.data)) {
      console.log('Failed to fetch destinations');
      return;
    }

    for (const d of res.data) {
      const slug = (d.slug || d.name).toLowerCase();
      let hero = d.heroImage;
      let featured = d.featuredImage;

      if (slug === 'kaithal' && Array.isArray(d.attractions) && d.attractions[0]?.image?.startsWith('data:image')) {
        hero = d.attractions[0].image;
        featured = d.attractions[0].image;
      } else {
        if (!hero || hero.includes('Dharamshala') || hero.includes('unsplash') || hero.includes('Kaithal_Fort')) {
          hero = authenticImages[slug] || hero;
        }
        if (!featured || featured.includes('Dharamshala') || featured.includes('unsplash') || featured.includes('Kaithal_Fort')) {
          featured = authenticImages[slug] || hero;
        }
      }

      let gallery = Array.isArray(d.gallery) ? d.gallery.filter(img => img && !img.includes('Dharamshala') && !img.includes('unsplash') && !img.includes('Kaithal_Fort')) : [];
      if (gallery.length === 0 && hero) {
        gallery = [hero];
      }

      console.log(`Updating ${d.name} (${d._id})...`);
      const updateRes = await fetch(`${API_URL}/destinations/${d._id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          heroImage: hero,
          featuredImage: featured,
          gallery
        })
      });
      const updateJson = await updateRes.json();
      console.log(`-> ${d.name} updated: success = ${updateJson.success}`);
    }

    console.log('All destinations successfully cleaned and synchronized with MongoDB Atlas!');
  } catch (err) {
    console.error('Error during sync:', err.message);
  }
}

sync();
