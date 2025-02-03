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
        // console.log("Login successful");
        setAuthenticated(true);
        console.log("Login successful");


    } catch (error) {
        console.error("Error logging in:", error);
        setAuthenticated(false);

    }
};

export { login };