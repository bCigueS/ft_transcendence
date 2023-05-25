import React, { useCallback, useEffect, useState } from 'react';


const AuthForm = () => {

	const [ logCode, setLogCode ] = useState<string>("");
	const [ token, setToken ] = useState<string>("");
	
	useEffect(() => {
		if (window.location.href.includes("code="))
			setLogCode(window.location.href.split("code=")[1])
	}, [])

	useEffect(() => {
		if (logCode !== "") {
			const fetchToken = async () => {
				const response = await fetch("http://localhost:3000/auth/me", {
					method: "POST",
					headers: {
					"Content-Type": "application/json"
					},
					body: JSON.stringify({code: logCode}),
				});
				if (response.ok) {
					const data = await response.json();
					setToken(data.token.access_token);
				}
			}
			fetchToken()
		}
	}, [logCode])

	// useEffect(() => {
	// 	if (token !== "") {
	// 		console.log("Token: ", token);
	// 		const fetch42UserMe = async () => {
	// 			const response = await fetch('https://api.intra.42.fr/v2/me', {
	// 				headers: {
	// 					"Authorization": "Bearer " + token,
	// 				}
	// 			});
	// 			const data = await response.json();
	// 			console.log(data);
	// 		}

	// 		fetch42UserMe();
	// 	}
	// }, [token]);

	return (
		<div>
			<div>
				<p>Log with 42 API</p>
				<a href={`http://127.0.0.1:3000/auth/forty-two`}>
					<button>Log in with 42</button>
				</a>
			</div>
		</div>
	)
}

export default AuthForm;


	// const fetchUserMe = useCallback( async () => {
	// 	const response = await fetch("https://api.intra.42.fr/v2/me", {
	// 		method: "GET",
	// 		headers: {
	// 			"Authorization": 'Bearer ' +  
	// 		}
	// 	})
	// }, [])