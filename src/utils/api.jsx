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
      const rawCookies = response.headers.get("set-cookie");
      if (rawCookies) {
          console.log("Raw Cookies from Login:", rawCookies);
          localStorage.setItem("authCookies", rawCookies); // Save cookies manually
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

export {login, fetchDogs, fetchBreedList};