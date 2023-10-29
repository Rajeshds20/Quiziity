useEffect(() => {
    fetch(`${API_URL}/user/hi`, {
        method: 'GET',
        credentials: 'include',
    })
        .then(async (response) => {
            console.log(response);
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                console.log("Authentication verified");
            }
            else {
                console.log("Authentication failed");
                navigate('/login');
            }
        })
        .catch(
            // Navigate to login screen if not authenticated
            navigate('/login')
        );
}, [API_URL, navigate]);

useEffect(() => {
    fetch(`${API_URL}/user/hi`, {
        method: 'GET',
        credentials: 'include',
    })
        .then(async (response) => {
            if (response.status === 200) {
                console.log("Authenticated");
                navigate('/');
            }
            else {
                console.log("Not authenticated");
            }
        })
        .catch(
            console.log("Not authenticated")
        );
}, [navigate]);

useEffect(() => {
    fetch(`${API_URL}/user/hi`, {
        method: 'GET',
        credentials: 'include',
    })
        .then(async (response) => {
            if (response.status === 200) {
                console.log("Authenticated");
                navigate('/');
            }
            else {
                console.log("Not authenticated");
            }
        })
        .catch(
            console.log("Not authenticated")
        );
}, [API_URL, navigate]);