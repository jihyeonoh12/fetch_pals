import React, {useCallback, useEffect, useState}  from "react";
import Card from '../components/Card';
import { Dog, Liked } from '../types/index';
import TabBanner from "../components/TabBanner";
import Pagination from "../components/Pagination";
import SearchForm from "../components/SearchForm";
import { fetchDogs, fetchBreedList, findMatch } from "../utils/api";


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
    const [errorType, setErrorType] = useState("");
    const [finalMatch, setFinalMatch] = useState({} as Dog);
    const [matched, setMatched] = useState(false);


   
    useEffect(() => {
        const getBreedLists = async () => {
            try {
                setLoading(true);
                const { result, errMsg } = await fetchBreedList();
                setBreedList(result);
                setLoading(false);
                setErrorType(errMsg);
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

    useEffect(() => {
      setMatched(false);
    }, [liked])

    
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

    const handleMatch = useCallback(async (liked : Liked) => {
      setLoading(true);
      try {
        const ids = Object.keys(liked);
        const match = await findMatch(ids);

        setFinalMatch(match[0]);
        setMatched(true);
      } catch (err) {
        setError(error);
        console.error("Fetching match result failed:", error);
      } finally {
        setLoading(false);
      }
    }, [liked] )

    if(loading)
      return (
        <div className="container">
          <h1 className="text-primary">Loading...</h1>
        </div>
      )
    if (error)  
      return (
        <div className="container">
          <h1><i className="bi bi-bug"></i> Found a Bug!</h1>
          <p>We couldn't fetch the data. Please contact us for help.</p>
        </div>
        )
    if (errorType == "Error: 401") 
      return (
        <div className="container">
          <h1><i className="bi bi-cookie"></i> We need your Cookie!</h1>
          <p>It looks like your phone isn't sending cookies. Please disable "Prevent Cross-Site Tracking" and "Block All Cookies" in your browser settings to allow us to retrieve data.</p>
        </div>
      )

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
                <div>
                {(Object.values(liked).length > 0 && Object.keys(finalMatch).length > 0 && matched) ? (
                  <div>
                    <h4 className="text-primary">Here is your match</h4>
                    <Card data={finalMatch} liked={liked} setLiked={setLiked}/>

                  </div>
                ) : (
                  <div>
                    <h4 className="text-primary">Find your match</h4>
                    <button className="btn btn-primary" onClick={() => handleMatch(liked)}>Find your Match</button>
                  </div>
                )}
                

                </div>
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
                  <div>Nothing here yet! Begin searching to find results.</div>
                )}
               </div>
                <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages}/>
               </div>
            )}

        </div>

    )

}
export default SearchPage