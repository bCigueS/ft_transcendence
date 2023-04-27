import { useState } from 'react';
import '../../sass/main.scss'

type ModalProps = {
	buttonText?: string;
	text?: string;
	onStartPage?(): void;
	onTool?(mode: "keyboard" | "mouse"): void;
	onKeyboard?(): void;
	onMouse?(): void;
	onDifficulty?(level: "beginner" | "medium" | "hard"): void;
	onBeginner?(): void;
	onMedium?(): void;
	onHard?(): void;
	onPlayerMode?(mode: "single" | "double"): void;
	onSingle?(): void;
	onDouble?(): void;
}

function PlayerModePage({onSingle, onDouble}: ModalProps) {
	return (
		<>
			<button onClick={onSingle}>1 Player</button>
			<button onClick={onDouble}>2 Players</button>
		</>
	);
}

function DifficultyLevelPage({onBeginner, onMedium, onHard}: ModalProps) {
	return (
		<>
			<button onClick={onBeginner}>Beginner level</button>
			<button onClick={onMedium}>Medium level</button>
			<button onClick={onHard}>Hard level</button>
		</>
	);
}

function ToolModePage({onKeyboard, onMouse}: ModalProps) {
	return (
		<>
			<button onClick={onKeyboard}>Play with keyboard</button>
			<button onClick={onMouse}>Play with mouse</button>
		</>
	);
}

function StartPage ({ buttonText, text, onStartPage }: ModalProps) {
	const isGameOver = buttonText === "Play again" ? true : false;
	
	const startMode = ({buttonText, onStartPage}: ModalProps) => {
		return (
			<>
				<p>Are you ready?</p>
				<button onClick={onStartPage}>{buttonText}</button>
			</>
		);
	}
	
	const restartMode = ({buttonText, text, onStartPage}: ModalProps) => {
		return (
			<>
				<p>{text}</p>
				<button onClick={onStartPage}>{buttonText}</button>
			</>
		);
	}
	return (
		<>
			{isGameOver && (restartMode({buttonText, text, onStartPage}))} 
			{!isGameOver && (startMode({buttonText, onStartPage}))}
		</>
	);
}

export default function Modal({ buttonText, text, onStartPage, onTool, onDifficulty, onPlayerMode }: ModalProps) {
	const isGameOver = buttonText === "Play again" ? true : false;
	const [page, setPage] = useState(0);

	const onNextPage = () => {
		setPage(p => p += 1);
	}

	return (
		<div className="modal">
			<div className="modal-contents" onClick={onNextPage}>
				{(!isGameOver && page === 0) && (
					<>
						<h2>Ready to have fun?</h2>
						<p>(click anywhere ...)</p>
					</>
				)}
				{(!isGameOver && page === 1 && onDifficulty) && (
					<DifficultyLevelPage
						onBeginner={() => {onDifficulty("beginner"); onNextPage();}}
						onMedium={() => {onDifficulty("medium"); onNextPage();}}
						onHard={() => {onDifficulty("hard"); onNextPage();}}
					/>
				)}
				{(!isGameOver && page === 2 && onTool) && (
					<ToolModePage
						onKeyboard={() => {onTool("keyboard"); onNextPage();}}
						onMouse={() => {onTool("mouse"); onNextPage();}}
					/>
				)}
				{(!isGameOver && page === 3 && onPlayerMode) && (
					<PlayerModePage
						onSingle={() => {onPlayerMode("single"); onNextPage();}}
						onDouble={() => {onPlayerMode("double"); onNextPage();}}
					/>
				)}
				{(isGameOver || page === 4) && (
					<StartPage 
						buttonText={buttonText}
						text={text}
						onStartPage={onStartPage}
					/>
				)}
			</div>
		</div>
	);
}