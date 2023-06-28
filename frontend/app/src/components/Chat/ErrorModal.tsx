import React, { useContext, useState } from "react";
import classes from '../../sass/components/UI/Modal.module.scss';
import formclasses from '../../sass/components/Chat/CreateGroup.module.scss';
import { Fragment } from 'react';
import ReactDOM from 'react-dom';
import Card from "./../UI/Card";
import { UserAPI, UserContext } from "../../store/users-contexte";
import { createNewChannel } from "./chatUtils";

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
				<h1>{props.message}</h1>
			</header>
                {/* <form method='patch' className={formclasses.container} onSubmit={handleSubmit}>
                    <div className={formclasses.label}>
                        <label>Group name</label>
                        <input 
                            type="text" 
                            id='name' 
                            name='name' 
                            value={groupName}
                            onChange={nameHandler}
                            maxLength={12}/>
                    </div>
					{ 
						typeError &&
						<p className={formclasses.error}>{typeError}</p>
					}
                </form> */}
			<footer className={classes.actions}>
				<button className={classes["button-cancel"]} onClick={props.onCloseClick}>Ok</button>
			</footer>
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