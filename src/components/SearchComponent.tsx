import React, {useCallback, useEffect, useState}  from "react";

interface Dog {
  id: string
  img: string
  name: string
  age: number
  zip_code: string
  breed: string
}

interface Liked {
  id: string
  liked: boolean
  detail : Dog
}

const SearchComponent = () => {
    const [breedList, setBreedList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBreed, setSelectedBreed] = useState("");
    const [dogList, setDogList] = useState([]);
    const [zipCode, setzipCode] = useState("");

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [tab, setTab] = useState("searchTab");

    const [liked, setLiked] = useState({} as Liked)
    const [sortMethod, setSortMethod] = useState("ascending");
  
    useEffect(() => {
      const fetchBreedList = async () => {
        try {
          const response = await fetch("https://frontend-take-home-service.fetch.com/dogs/breeds/", {
            method: "GET",
            credentials: "include"
          });
          if (!response.ok) throw new Error("Failed to fetch data");
          const result = await response.json();
          setBreedList(result);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchBreedList();
    }, []);

    useEffect(() => {
      if(totalPages > 0) {
         fetchData();
      }
    },[currentPage])

    useEffect(() => {
      setCurrentPage(0);
    }, [selectedBreed, zipCode])

    const fetchData = useCallback( async () => {
      setLoading(true);
      const breedInput= selectedBreed ? `breeds=${selectedBreed}` : '';
      const zipCodeInput = zipCode ? `zipCodes=${parseInt(zipCode)}` : '';
      const pageParam = currentPage != 0 ? `&size=25&from=${currentPage * 25}` : '';
      const queryParam = zipCodeInput ? breedInput + '&' + zipCodeInput : breedInput;
      const sortParam = sortMethod === 'ascending' ? '&sort=name:asc' : '&sort=name:desc'

      try {
        const response = await fetch(`https://frontend-take-home-service.fetch.com/dogs/search?${queryParam}${pageParam}${sortParam}` , {
          method: "GET",
          credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch data");
        const breedIds = await response.json();

        if(breedIds.next || breedIds.prev) {
          setTotalPages(Math.ceil(breedIds.total / 25));
        }

        try {
          const fetchDogDetails = await fetch("https://frontend-take-home-service.fetch.com/dogs", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(breedIds.resultIds)
        });
         
        const dogDetails = await fetchDogDetails.json();

        setDogList(dogDetails);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      
        
      } catch (err) {
        setError(err.message);
        setLoading(false);

      } finally {
        setLoading(false);
      }

    },[selectedBreed, zipCode, currentPage, sortMethod])

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      await fetchData();
    }

    const toggleLike = (data: Dog) => {
      setLiked((prev) => {
        const updated = { ...prev };
    
        if (updated[data.id] && updated[data.id].liked) {
          delete updated[data.id]; 
        } else {
          updated[data.id] = {
            liked: !(prev[data.id]?.liked || false),
            detail: { ...data },
          };
        }
    
        return updated;
      });
    };

    if (loading || error) return <></>;

    return (
      <div className="container">
            <div className="text-center">
              <h2 className="text-primary"><strong>Welcome to Fetch Pals</strong></h2>
              <p>Where wagging tails and happy hearts meet.</p>
              <ul className="nav nav-underline d-flex justify-content-center py-3">
                <li className="nav-item">
                  <button onClick={() => setTab("searchTab")} className={`nav-link ${tab === 'searchTab' && 'active'}`} aria-current="page" >Search</button>
                </li>
                <li className="nav-item">
                  <button onClick={() => setTab("favoriteTab")} className={`nav-link ${tab === 'favoriteTab' && 'active'}`} >Favorite</button>
                </li>
              </ul>
            </div>
            {tab === 'favoriteTab' ? (
              <div className="row g-4">
                {Object.values(liked).length > 0 ? Object.values(liked).map((data) => (
                  <div key={data.detail.id} className="col-md-4">
                  <div className="card h-100 text-start">
                    <div className="relative">
                      <img src={data.detail.img} alt={`${data.detail.name}-image`} className="card-img-top pet-card-img"/>
                    </div>
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                      <h3 className="card-title fw-bold mb-2">{data.detail.name}</h3>
                      <button className="like-btn" onClick={() => {toggleLike(data.detail)}} >
                          <h4 className="">
                            <i className={`bi bi-heart${liked[data.detail.id] && liked[data.detail.id].liked ? '-fill' : ''}`}></i>
                          </h4>
                        </button>
                      </div>
                 
                      <div className="space-y-1">
                        <p className="card-text mb-1">{data.detail.breed}</p>
                        <p className="card-text mb-2">
                          Age: {data.detail.age} years old
                        </p>
                        <p className="card-text text-muted small d-flex">
                        <i className="bi bi-geo-alt"></i>                          
                        {data.detail.zip_code}
                        </p>
                      </div>
                    </div>
                   </div>
                </div>
                )) : (
                  <div>
                    Time to add your favorite pups! 🐶
                  </div>
                )}
              </div>
            ) : (
              <div>
              <form action="" onSubmit={handleSubmit} className="w-700 d-md-flex my-3 mx-auto">
              <select className="form-select m-1" onChange={(e) => setSelectedBreed(e.target.value)} value={selectedBreed}>
                  <option value="">All Breeds</option>
                  {breedList && breedList.map((breed) => (
                      <option key={breed} value={breed}>
                      {breed}
                      </option>
                  ))}
               </select>
               <input pattern="[0-9]{5}" maxLength={5} className="form-control m-1 w-md-25" placeholder="zipcode" type="text" onChange={(e) => setzipCode(e.target.value)} value={zipCode} />
               <select className="form-select m-1" value={sortMethod} onChange={(e) => setSortMethod(e.target.value)}>
                  <option value="ascending">Sort A-Z</option>
                  <option value="descending">Sort Z-A</option>
                </select>
                <button className="btn btn-primary m-1 container-fluid">Search</button>
               </form>
              
               <div className="row g-4">
                {(totalPages > 0) ? dogList.map((dog : Dog) => (
                  <div key={dog.id} className="col-md-4">
                    <div className="card text-start h-100 shadow">
                      <div className="relative">
                        <img src={dog.img} alt={`${dog.name}-image`} className="card-img-top pet-card-img"/>
                      </div>
                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                        <h3 className="card-title fw-bold mb-2">{dog.name}</h3>
                        <button className="like-btn" onClick={() => {toggleLike(dog)}} >
                            <h4 className="">
                              <i className={`bi bi-heart${liked[dog.id] && liked[dog.id].liked ? '-fill' : ''}`}></i>
                            </h4>
                          </button>
                        </div>
                   
                        <div className="space-y-1">
                          <p className="card-text mb-1">{dog.breed}</p>
                          <p className="card-text mb-2">
                            Age: {dog.age} years old
                          </p>
                          <p className="card-text text-muted small d-flex">
                          <i className="bi bi-geo-alt"></i>       
                           {dog.zip_code}
                          </p>
                        </div>
                      </div>
                     </div>
                  </div>
                )) : (
                  <div>
                    Nothing here yet! Begin searching to find results.</div>
                )}
               </div>
  
               <div className="container mx-auto py-5 text-center">
                {currentPage >= 1 && <button onClick={() => (setCurrentPage(currentPage - 1))}>
                  <p>
                    <i className="bi bi-caret-left-fill"></i>
                  </p>
                  </button>}
                {totalPages > 1 && [...Array(totalPages)].map((_, index) => (
                  <button disabled={currentPage === index || (currentPage === 0 && index === 0)} onClick={() => (setCurrentPage(index))}>{index + 1}</button>
                ))}
                {(currentPage + 1 != totalPages && totalPages > 1) && <button onClick={() => (setCurrentPage(currentPage + 1))}>
                  <p>
                    <i className="bi bi-caret-right-fill"></i>
                  </p>
                  </button>}
               </div>
               </div>
            )}

        </div>

    )

}
export default SearchComponent