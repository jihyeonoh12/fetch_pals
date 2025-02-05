const login = async (name, email, setAuthenticated) => {
  try {
      const response = await fetch("https://frontend-take-home-service.fetch.com/auth/login", {
          method: "POST",
          credentials: "include", 
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
          throw new Error("Login failed");
      }


      setAuthenticated(true);
      console.log("Login successful");

  } catch (error) {
      console.error("Error logging in:", error);
      setAuthenticated(false);

  }
};

const fetchBreedList = async () => {
  try {
    const response = await fetch("https://frontend-take-home-service.fetch.com/dogs/breeds/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
    },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(response.status);
    };
    const errorType = "Error: " + response.status;
    const result = await response.json();
    return { result, errMsg: errorType }
    
  } catch (err) {
    console.error("Error fetching dog list:", err);
    return { result: [], errMsg: err}
  } 
};

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
          const dogDetails = await fetchDogDetails(breedIds.resultIds);
          return { dogDetails, totalPages };
        }

        return { dogDetails: [], totalPages };
      } catch (err) {
        console.error("Error fetching dogs1:", err);
        throw err;
      } 
}

const fetchDogDetails = async (ids) => {
  try {
    const response = await fetch("https://frontend-take-home-service.fetch.com/dogs", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ids)
      });

      if (!response.ok) throw new Error("Failed to fetch dog details2");
      const detail = await response.json();
      return detail
  } catch (err) {
    console.error("Error fetching dogs2:", err);
    throw err;
  } 
}

const findMatch = async (ids) => {
  try {
    const response = await fetch("https://frontend-take-home-service.fetch.com/dogs/match", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ids)
  });
  const matchDetail = [];
    if (!response.ok) throw new Error("Failed to find match");
    const result = await response.json();
    if(result.match) {
      const matchDetail = await fetchDogDetails([result.match]);
      console.log('matchDetail');
      console.log(matchDetail);

      return matchDetail;
    }
      return matchDetail;
  } catch (err) {
    console.error("Error matching dog:", err);
    throw err;
  }
}

export {login, fetchDogs, fetchBreedList, findMatch};