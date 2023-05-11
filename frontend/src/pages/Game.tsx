import { useState } from "react";
import Pong from "../components/game/Pong";

export default function Game() {
	// player info
	const [username, setUserName] = useState('Fany');
	const [gameId, setGameId] = useState('19');

	return (
		<>
			{/* <Pong 
				username={username}
			/> */}
		</>
	)
}