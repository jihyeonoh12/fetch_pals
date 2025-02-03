// import React, {useCallback}  from "react";

const fetchDogs = async (queryParam, pageParam, sortParam) => {
      try {
        const response = await fetch(`https://frontend-take-home-service.fetch.com/dogs/search?${queryParam}${pageParam}${sortParam}` , {
          method: "GET",
          credentials: "include"
        });

        if (!response.ok) throw new Error("Failed to fetch data");
        const breedIds = await response.json();
        const totalPages = breedIds.total ? Math.ceil(breedIds.total / 25) : 0;
        if(breedIds.resultIds && breedIds.resultIds.length > 0) {

            const fetchDogDetails = await fetch("https://frontend-take-home-service.fetch.com/dogs", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(breedIds.resultIds)
            });
            if (!fetchDogDetails.ok) throw new Error("Failed to fetch dog details");
            const dogDetails = await fetchDogDetails.json();

            return { dogDetails, totalPages };
        }
        return { dogDetails: [], totalPages };
      } catch (err) {
        console.error("Error fetching dogs:", err);
        throw err;
      } 

}

const fetchBreedList = async () => {
  try {
    const response = await fetch("https://frontend-take-home-service.fetch.com/dogs/breeds/", {
      method: "GET",
      credentials: "include"
    });
    if (!response.ok) throw new Error("Failed to fetch data");
    const result = await response.json();
    return { result }
  } catch (err) {
    console.error("Error fetching dogs:", err);
    throw err;
  } 
};
export {fetchDogs, fetchBreedList};