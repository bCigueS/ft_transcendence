import { useState } from 'react';
import { ModalProps } from './utils/types';
import classes from  '../../sass/components/Game/Modal.module.scss';

export default function ModalBoard({ onDifficulty, onTool, onPlayerMode, onStartPage, buttonText, closingText }: ModalProps) {
	const [isStarting, setIsStarting] = useState(buttonText === "Start playing" ? true : false);
	const [page, setPage] = useState(0);
	const [isDouble, setIsDouble] = useState(false);

	// function to change the page number, thus triggering a new display of the page
	const onNextPage = () => {
		setPage(p => p += 1);
	}

	return (
		<div className={classes.container}>
			<div className={classes.content}>
				{(isStarting && page === 0) && (
					<div className={classes.subcontent} onClick={onNextPage}>
						<h2>Let's Pong!</h2>
						<i className='fa-solid fa-table-tennis-paddle-ball'></i>
					</div>
				)}
				{(isStarting && page === 1) && (
					<>
						<button onClick={() => {onDifficulty(0); onNextPage();}}>Beginner level</button>
						<button onClick={() => {onDifficulty(1); onNextPage();}}>Medium level</button>
						<button onClick={() => {onDifficulty(2); onNextPage();}}>Hard level</button>
						<button onClick={() => {onDifficulty(3); onNextPage();}}>Special level</button>
					</>
				)}
				{(isStarting && page === 2) && (
					<>
						<button onClick={() => {onTool("keyboard"); onNextPage();}}>Play with keyboard</button>
						<button onClick={() => {onTool("mouse"); onNextPage();}}>Play with mouse</button>
					</>
				)}
				{(isStarting && page === 3) && (
					<>
						<button onClick={() => {onPlayerMode("single"); onNextPage();}}>1 player</button>
						<button onClick={() => {onPlayerMode("double"); setIsDouble(true); onNextPage();}}>2 players</button>
					</>
				)}
				{(isStarting && page === 4 && !isDouble) && (
					<>
						<h2>Are you ready?</h2>
						<button onClick={onStartPage}>{buttonText}</button>
					</>
				)}
				{!isStarting && (
					<>
						<h2>{closingText}</h2>
						<button onClick={() => {
							setIsStarting(true);
							setPage(1);
							setIsDouble(false);
							onPlayerMode("single");
						}}>
							{buttonText}
						</button>
					</>
				)}
			</div>
		</div>
	);
}