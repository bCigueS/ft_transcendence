import { is } from '@babel/types';
import { useState } from 'react';
import '../../sass/main.scss'

type ModalProps = {
	buttonText?: string;
	text?: string;
	onClickStart?(): void;
	onClickNext?(): void;
	onClickKeyboard?(): void;
	onClickMouse?(): void;
	onMode?(mode: "keyboard" | "mouse"): void;
}

function SettingPage({onClickKeyboard, onClickMouse}: ModalProps) {
	return (
		<>
			<button onClick={onClickKeyboard}>Play with keyboard</button>
			<button onClick={onClickMouse}>Play with mouse</button>
		</>
	);
}

function StartPage ({ buttonText, text, onClickStart }: ModalProps) {
	const isGameOver = buttonText === "Play again" ? true : false;
	
	const startMode = ({buttonText, onClickStart}: ModalProps) => {
		return <button onClick={onClickStart}>{buttonText}</button>
	}
	
	const restartMode = ({buttonText, text, onClickStart}: ModalProps) => {
		return (
			<>
				<p>{text}</p>
				<button onClick={onClickStart}>{buttonText}</button>
			</>
		);
	}
	return (
		<>
			{isGameOver && (restartMode({buttonText, text, onClickStart}))} 
			{!isGameOver && (startMode({buttonText, onClickStart}))}
		</>
	);
}

export default function Modal({ buttonText, text, onClickStart, onMode }: ModalProps) {
	const isGameOver = buttonText === "Play again" ? true : false;
	const [page, setPage] = useState(0);

	return (
		<div className="modal">
			<div className="modal-contents">
				{(!isGameOver && page === 0 && onMode) && (
					<SettingPage
						onClickKeyboard={() => {onMode("keyboard"); setPage(p => p += 1);}}
						onClickMouse={() => {onMode("mouse"); setPage(p => p += 1);}}
					/>
				)}
				{(isGameOver || page === 1) && (
					<StartPage 
						buttonText={buttonText}
						text={text}
						onClickStart={onClickStart}
					/>
				)}
			</div>
		</div>
	);
}