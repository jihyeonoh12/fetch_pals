import React, {useCallback, useEffect, useState}  from "react";
import Card from '../components/Card';
import { Dog, Liked } from '../types/index';
import TabBanner from "../components/TabBanner";
import Pagination from "../components/Pagination";
import SearchForm from "../components/SearchForm";
import { fetchDogs, fetchBreedList } from "../utils/api";


const SearchPage = () => {
    const [breedList, setBreedList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBreed, setSelectedBreed] = useState("");
    const [dogList, setDogList] = useState([] as Dog[]);
    const [zipCode, setzipCode] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [tab, setTab] = useState("searchTab");
    const [liked, setLiked] = useState({} as Liked)
    const [sortMethod, setSortMethod] = useState("ascending");
  
    useEffect(() => {
        const getBreedLists = async () => {
            try {
                setLoading(true);
                const { result } = await fetchBreedList();
                setBreedList(result);
                setLoading(false);
            } catch (error) {
                setError(error);
            }
        }
        getBreedLists();
    }, []);

    useEffect(() => {
      if(totalPages > 0) {
        handleFetchDogs();
      }
    },[currentPage])

    useEffect(() => {
      setCurrentPage(0);
    }, [selectedBreed, zipCode])

    
    const handleFetchDogs = useCallback(async () => {
      setLoading(true);
      const breedInput= selectedBreed ? `breeds=${selectedBreed}` : '';
      const zipCodeInput = zipCode ? `zipCodes=${parseInt(zipCode)}` : '';
      const pageParam = currentPage != 0 ? `&size=25&from=${currentPage * 25}` : '';
      const queryParam = zipCodeInput ? breedInput + '&' + zipCodeInput : breedInput;
      const sortParam = sortMethod === 'ascending' ? '&sort=name:asc' : '&sort=name:desc'

      try {
        const { dogDetails, totalPages } = await fetchDogs(queryParam, pageParam,sortParam);
        setDogList(dogDetails);
        setTotalPages(totalPages);
        setLoading(false);
      } catch (error) {
        setError(error);
        console.error("Fetching dogs failed:", error);
        setLoading(false);
         }
    }
    ,[selectedBreed, zipCode, currentPage, sortMethod])

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      await handleFetchDogs();
    }

    if (loading || error) return <></>;

    return (
      <div className="container">
        <TabBanner tab={tab} setTab={setTab}/>
            {tab === 'favoriteTab' ? (
              <div className="row g-4">
                {Object.values(liked).length > 0 ? Object.values(liked).map((data) => (
                  <Card data={data.detail} liked={liked} setLiked={setLiked}/>
                )) : (
                  <div>
                    Time to add your favorite pups! 🐶
                  </div>
                )}
              </div>
            ) : (
              <div>
                <SearchForm 
                    breedList={breedList} 
                    handleSubmit={handleSubmit} 
                    selectedBreed={selectedBreed} 
                    setSelectedBreed={setSelectedBreed} 
                    sortMethod={sortMethod} 
                    setSortMethod={setSortMethod} 
                    zipCode={zipCode}
                    setzipCode={setzipCode} 
                />
               <div className="row g-4">
                {(totalPages > 0 && dogList.length >0) ? dogList.map((dog : Dog) => (
                  <Card data={dog} liked={liked} setLiked={setLiked}/>
                )) : (
                  <div>
                    Nothing here yet! Begin searching to find results.</div>
                )}
               </div>
                <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages}/>
               </div>
            )}

        </div>

    )

}
export default SearchPage