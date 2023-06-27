import { useContext, useState } from 'react';
import { ModalProps } from './utils/types';
import classes from  '../../sass/components/Game/Modal.module.scss';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../store/users-contexte';

export default function ModalBoard({ onDifficulty, onTool, onPlayerMode, onStartPage, onRestart, inviteMode, isInvited, buttonText, cancelText, closingText }: ModalProps) {
	const [isStarting, setIsStarting] = useState(buttonText === "Start playing" ? true : false);
	const [isDouble, setIsDouble] = useState(false);
	const [page, setPage] = useState(0);

	const userCtx = useContext(UserContext);
	const navigate = useNavigate();

	const handlePlayAgain = () => {
		navigate('/pong', {
			state: {
				playerId: userCtx.user?.id,
				opponentId: undefined,
				gameInvitation: undefined,
				isInvited: undefined,
				isSpectator: undefined,
			}
		});
	}

	const setToPage = (pageNo: number) => {
		setIsStarting(true);
		setPage(pageNo);
		setIsDouble(false);
		onPlayerMode('');
		onRestart();
	}

	const handleGoToHomepage = () => {
		navigate('/');
	}

	// function to change the page number, thus triggering a new display of the page
	const onNextPage = () => {
		setPage(p => p += 1);
	}

	return (
		<div className={classes.container}>
			<div className={classes.content}>
				{(isStarting && page === 0 && !inviteMode && !isInvited) && (
					<div className={classes.subcontent} onClick={onNextPage}>
						<h2>Let's Pong!</h2>
						<i className='fa-solid fa-table-tennis-paddle-ball'></i>
					</div>
				)}
				{(isStarting && page === 0 && inviteMode && !isInvited) && (
					<>
						<div className={classes.subcontent} onClick={onNextPage}>
							<h2>Let's Pong!</h2>
							<i className='fa-solid fa-table-tennis-paddle-ball'></i>
						</div>
						<button onClick={() => {setToPage(0); handlePlayAgain();}}>{cancelText}</button>
					</>
				)}
				{(isStarting && page === 0 && inviteMode && isInvited) && (
					<>
						<div className={classes.subcontent} onClick={() => {onNextPage(); onNextPage();}}>
							<h2>Let's Pong!</h2>
							<i className='fa-solid fa-table-tennis-paddle-ball'></i>
						</div>
						<button onClick={() => {setToPage(0); handlePlayAgain();}}>{cancelText}</button>
					</>
				)}
				{(isStarting && page === 1 && !isInvited) && (
					<>
						<div>
							<button onClick={() => {onDifficulty(0); onNextPage();}}>Beginner level</button>
							<button onClick={() => {onDifficulty(1); onNextPage();}}>Medium level</button>
							<button onClick={() => {onDifficulty(2); onNextPage();}}>Hard level</button>
							<button onClick={() => {onDifficulty(3); onNextPage();}}>Special level</button>
						</div>
						<button onClick={() => {setToPage(0); handlePlayAgain();}}>{cancelText}</button>
					</>
				)}
				{(isStarting && page === 2 && !inviteMode) && (
					<>
						<div>
							<button onClick={() => {onTool("keyboard"); onNextPage();}}>Play with keyboard</button>
							<button onClick={() => {onTool("mouse"); onNextPage();}}>Play with mouse</button>
						</div>
						<button onClick={() => {setToPage(0);}}>{cancelText}</button>
					</>
				)}
				{(isStarting && page === 2 && inviteMode) && (
					<>
						<div>
							<button onClick={() => {onTool("keyboard"); onPlayerMode("double"); setIsDouble(true); onNextPage(); setIsStarting(false);}}>Play with keyboard</button>
							<button onClick={() => {onTool("mouse"); onPlayerMode("double"); setIsDouble(true); onNextPage(); setIsStarting(false);}}>Play with mouse</button>
						</div>
						<button onClick={() => {setToPage(0); handlePlayAgain();}}>{cancelText}</button>
					</>
				)}
				{(isStarting && page === 3 && !inviteMode) && (
					<>
						<div>
							<button onClick={() => {onPlayerMode("single"); onNextPage();}}>1 player</button>
							<button onClick={() => {onPlayerMode("double"); setIsDouble(true); onNextPage();}}>2 players</button>
						</div>
						<button onClick={() => {setToPage(0);}}>{cancelText}</button>
					</>
				)}
				{(isStarting && page === 4 && !isDouble) && (
					<>
						<h2>Are you ready?</h2>
						<div>
							<button onClick={onStartPage}>{buttonText}</button>
						</div>
						<div>
							<button onClick={() => {setToPage(0);}}>{cancelText}</button>
						</div>
					</>
				)}
				{!isStarting && (
					<>
						<h2>{closingText}</h2>
						<p>Do you want to start a new game?</p>
						<div>
							<button onClick={() => {setToPage(1); handlePlayAgain();}}>{buttonText}</button>
						</div>
						<div>
							<button onClick={handleGoToHomepage}>Return to homepage</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}