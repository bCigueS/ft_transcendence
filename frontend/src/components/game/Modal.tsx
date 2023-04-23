import '../../sass/main.scss'

type ModalProps = {
	text: string;
	onClick(): void;
}

export default function Modal({ text, onClick }: ModalProps) {
	return (
		<div className="modal">
			<div className="modal-contents">
				<p>{text}</p>
				<button onClick={onClick}>Start playing!</button>
			</div>
		</div>
	);
}