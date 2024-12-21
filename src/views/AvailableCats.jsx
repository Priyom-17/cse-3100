import { useEffect, useState } from 'react';

const availableCats = [
  { name: 'Whiskers', age: '2', breed: 'Sphynx' },
  { name: 'Mittens', age: '2', breed: 'Bengal' },
  { name: 'Shadow', age: '1', breed: 'Siamese' },
  { name: 'Pumpkin', age: '3', breed: 'Persian' },
  { name: 'Luna', age: '4', breed: 'Birman' },
  { name: 'Simba', age: '2', breed: 'Abyssinian' },
];
const breeds=['All','Sphynx','Bengal', 'Siamese', 'Persian', 'Birman', 'Abyssinian'];

export default function AvailableCats() {
  const [cats, setCats] = useState([]);
  const [filteredCats, setFilteredCats] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch cat images from an API endpoint and assign it to the featuredCats list
    const fetchCatImages = async () => {
      try {
        const responses = await Promise.all(availableCats.map(() => fetch('https://api.thecatapi.com/v1/images/search').then((res) => res.json())));
        const catsWithImages = availableCats.map((cat, index) => ({
          ...cat,
          image: responses[index][0].url,
        }));

        setCats(catsWithImages);
      } catch (error) {
        console.error('Error fetching cat images:', error);
      }
    };

    fetchCatImages();
  }, []);

  // Handle breed filtering
  const handleBreedChange = (event) => {
    const breed = event.target.value;
    setSelectedBreed(breed);
    filterCats(breed, searchTerm);
  };

  // Handle search filtering
  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    filterCats(selectedBreed, term);
  };

  // Filter cats based on breed and search term
  const filterCats = (breed, term) => {
    let filtered = cats;

    if (breed !== 'All') {
      filtered = filtered.filter(cat => cat.breed === breed);
    }
    if (term) {
      filtered = filtered.filter(cat => cat.name.toLowerCase().includes(term.toLowerCase()));
    }

    setFilteredCats(filtered);
  };

  return (
    <section className="text-center mt-4">
      <h2>Available Cats</h2>
      <p>Meet our adorable cats looking for their forever home!</p>
       {/* Filters */}
       <div className="mb-3">
        <select value={selectedBreed} onChange={handleBreedChange} className="form-select">
          {breeds.map((breed, index) => (
            <option key={index} value={breed}>{breed}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="form-control"
        />
      </div>

      <div className="mt-2 row g-4 cats-container" id="cats-container">
        {filteredCats.map((cat, i) => (
          <div key={i} className="col-md-4 col-sm-6 col-12">
            <div className="cat-card">
              <img src={cat.image} alt={cat.name} className="img-fluid mb-2" style={{ borderRadius: '8px', height: '200px', objectFit: 'cover' }} />
              <div className="cat-info">
                <h3 className="h5 mb-1">{cat.name}</h3>
                <p className="mb-0">Age: {cat.age}</p>
                <p className='mb-0'>Breed:{cat.breed}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
