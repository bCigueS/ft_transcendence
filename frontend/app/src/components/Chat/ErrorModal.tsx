import React from "react";
import classes from '../../sass/components/UI/Modal.module.scss';
import { Fragment } from 'react';
import ReactDOM from 'react-dom';
import Card from "./../UI/Card";

type Props = {
    children?: React.ReactNode,
	title?: string,
	message?: string,
    className?: string,
	onCloseClick: () => void,
};

const Backdrop: React.FC<Props> = (props) => {
	return <div className={classes.backdrop} onClick={props.onCloseClick}></div>
}

const Overlay: React.FC<Props> = (props) => {
	
	return (
		<Card className={classes.modal}>
			<header className={classes.header}>
				<h1>{props.title}</h1>
			</header>
			<div className={classes.error}>
				{props.message}
			</div>
		</Card>
	);
}

const portalOverlays = document.getElementById('overlays');
const portalBackdrop = document.getElementById('backdrop');

const ErrorModal: React.FC<Props> = (props) => {

	return (
		<Fragment>
			{portalBackdrop && ReactDOM.createPortal(<Backdrop 
							onCloseClick={props.onCloseClick} />, portalBackdrop)}
			{portalOverlays && ReactDOM.createPortal(<Overlay 
							title={props.title}
							message={props.message}
							onCloseClick={props.onCloseClick}>{props.children}</Overlay>, portalOverlays)}
		</Fragment>
	)
}

export default ErrorModal;