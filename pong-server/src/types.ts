export type PlayerInfo = {
	name: string;
	playerId: string;
	level: number;
	gameId: string;
}

export type AddPlayerResult = {
	player: PlayerInfo;
	opponent: PlayerInfo | null;
	message: string;
}

export type RemovePlayerResult = {
	player: PlayerInfo | null;
	message: string;
}

export type CallbackInfo = (message: string) => {
	message: string;
}