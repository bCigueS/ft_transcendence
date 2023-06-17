import React, { useState } from "react";
import classes from '../../sass/components/UI/Modal.module.scss';
import formclasses from '../../sass/components/Chat/CreateGroup.module.scss';
import { Fragment } from 'react';
import ReactDOM from 'react-dom';
import Card from "./../UI/Card";

type Props = {
    children?: React.ReactNode,
	title?: string,
	message?: string,
    className?: string,
	onCloseClick: () => void,
	onDelete?: () => void,
};

const Backdrop: React.FC<Props> = (props) => {
	return <div className={classes.backdrop} onClick={props.onCloseClick}></div>
}

const Overlay: React.FC<Props> = (props) => {
    const [ enteredText, setEnteredText ] = useState<string>(''); 
	const [ placeholder, setPlaceholder ] = useState<string>('');
    
	const handleDelete = () => {
		if (props.onDelete)
			props.onDelete();
		props.onCloseClick();
	}

    const handleSubmit = () => {

    }

    const nameHandler = (event: any) => {
		setEnteredText(event.target.value);
	}

	return (
		<Card className={classes.modal}>
			<header className={classes.header}>
				<h1>{props.title}</h1>
			</header>
                <form method='patch' className={formclasses.container} onSubmit={handleSubmit}>
                    <div className={formclasses.label}>
                        <label htmlFor="name">Enter a group name</label>
                        <input 
                            type="text" 
                            id='name' 
                            name='name' 
                            value={enteredText} 
                            onChange={nameHandler}
                            placeholder={placeholder} 
                            maxLength={12}/>
                    </div>
                    <button type="submit">Confirm</button>
                </form>
			<footer className={classes.actions}>
				<button className={classes["button-cancel"]} onClick={props.onCloseClick}>Cancel</button>
				<button className={classes.button} onClick={handleDelete}>Create</button>
			</footer>
		</Card>
	);
}

const portalOverlays = document.getElementById('overlays');
const portalBackdrop = document.getElementById('backdrop');

const CreateGroup: React.FC<Props> = (props) => {

	return (
		<Fragment>
			{portalBackdrop && ReactDOM.createPortal(<Backdrop 
							onCloseClick={props.onCloseClick} />, portalBackdrop)}
			{portalOverlays && ReactDOM.createPortal(<Overlay 
							title={props.title}
							message={props.message}
							onCloseClick={props.onCloseClick}
							onDelete={props.onDelete}>{props.children}</Overlay>, portalOverlays)}
		</Fragment>
	)
}

export default CreateGroup;