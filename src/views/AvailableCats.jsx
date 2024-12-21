import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const availableCats = [
  { name: 'Whiskers', age: '2', breed: 'Sphynx' },
  { name: 'Mittens', age: '2', breed: 'Bengal' },
  { name: 'Shadow', age: '1', breed: 'Siamese' },
  { name: 'Pumpkin', age: '3', breed: 'Persian' },
  { name: 'Luna', age: '4', breed: 'Birman' },
  { name: 'Simba', age: '2', breed: 'Abyssinian' },
];

const breeds = ['All', 'Sphynx', 'Bengal', 'Siamese', 'Persian', 'Birman', 'Abyssinian'];

export default function AvailableCats() {
  const [cats, setCats] = useState([]);
  const [filteredCats, setFilteredCats] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCatImages = async () => {
      try {
        const responses = await Promise.all(availableCats.map(() =>
          fetch('https://api.thecatapi.com/v1/images/search').then((res) => res.json())
        ));
        const catsWithImages = availableCats.map((cat, index) => ({
          ...cat,
          image: responses[index][0].url,
        }));

        setCats(catsWithImages);
        setFilteredCats(catsWithImages); // Set initial filtered cats
      } catch (error) {
        console.error('Error fetching cat images:', error);
      }
    };

    fetchCatImages();
  }, []);

  const handleBreedChange = (event) => {
    const breed = event.target.value;
    setSelectedBreed(breed);
    filterCats(breed, searchTerm);
  };

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
  };

  const handleSearch = () => {
    filterCats(selectedBreed, searchTerm);
  };

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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Purrfect Adoption</h2>
        
      </div>
      <p>Available cats</p>

      {/* Filters */}
      <div className="mb-3 d-flex justify-content-center">
        <select value={selectedBreed} onChange={handleBreedChange} className="form-select me-2" style={{ width: '200px' }}>
          {breeds.map((breed, index) => (
            <option key={index} value={breed}>{breed}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="form-control me-2"
          style={{ width: '200px' }}
        />
        <button className="btn btn-primary" onClick={handleSearch}>Search</button>
      </div>

      <div className="mt-2 row g-4 cats-container" id="cats-container">
        {filteredCats.map((cat, i) => (
          <div key={i} className="col-md-4 col-sm-6 col-12">
            <div className="cat-card">
              <img src={cat.image} alt={cat.name} className="img-fluid mb-2" style={{ borderRadius: '8px', height: '200px', objectFit: 'cover' }} />
              <div className="cat-info">
                <h3 className="h5 mb-1">{cat.name}</h3>
                <p className="mb-0">Age: {cat.age}</p>
                <p className="mb-0">Breed: {cat.breed}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}