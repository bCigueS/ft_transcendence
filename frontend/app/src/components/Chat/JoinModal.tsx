import React, { useContext, useState } from "react";
import classes from '../../sass/components/UI/Modal.module.scss';
import formclasses from '../../sass/components/Chat/CreateGroup.module.scss';
import { Fragment } from 'react';
import ReactDOM from 'react-dom';
import Card from "./../UI/Card";
import { UserContext } from "../../store/users-contexte";
import { Channel, JoinChannelDTO } from "./chatUtils";

type JoinResponse = {
	status: number;
	error?: string;
  };

type Props = {
    children?: React.ReactNode,
	title?: string,
	message?: string,
    className?: string,
	channel: Channel | null,
	onCloseClick: () => void,
	onConfirm: (joinData: JoinChannelDTO) => Promise<JoinResponse>;
};

type BackdropProps = {
    children?: React.ReactNode,
    className?: string,
	onCloseClick: () => void,
};

const Backdrop: React.FC<BackdropProps> = (props) => {
	return <div className={classes.backdrop} onClick={props.onCloseClick}></div>
}

const Overlay: React.FC<Props> = (props) => {
	const [ typeError, setTypeError ] = useState<string>('');
	const [ channelPassword, setChannelPassword ] = useState('');
	
	const userCtx = useContext(UserContext);

    const handleSubmit = async(event: any) => {
		event.preventDefault();

		if (!props.channel?.id || !userCtx.user?.id)
			return ;

		let joinData: JoinChannelDTO = {
			channelId: props.channel?.id,
			userId: userCtx.user?.id,
			password: channelPassword,
		}

		try {
			const response: JoinResponse = await props.onConfirm(joinData);

			if (response.status !== 200 && response.error) {
			  	setTypeError(response.error);
				return ;
			}
		  
		  } catch (error) {
			console.error(error);
		  }
		  
    }

    const passwordHandler = (event: any) => {
		setChannelPassword(event.target.value);
	}
	
	return (
		<Card className={classes.modal}>
			<header className={classes.header}>
				<h1>{props.title}</h1>
			</header>
				<h2>{props.message}</h2>
                <form method='patch' className={formclasses.container} onSubmit={handleSubmit}>
                    <div className={formclasses.label}>
                        <label>Enter password</label>
                        <input 
                            type="password" 
                            id='name' 
                            name='name' 
                            value={channelPassword}
                            onChange={passwordHandler}/>
                    </div>
					{ 
						typeError &&
						<p className={formclasses.error}>{typeError}</p>
					}
                </form>
			<footer className={classes.actions}>
				<button className={classes["button-cancel"]} onClick={props.onCloseClick}>Cancel</button>
				<button className={classes.button} onClick={handleSubmit}>Confirm</button>
			</footer>
		</Card>
	);
}

const portalOverlays = document.getElementById('overlays');
const portalBackdrop = document.getElementById('backdrop');

const JoinModal: React.FC<Props> = (props) => {

	return (
		<Fragment>
			{portalBackdrop && ReactDOM.createPortal(<Backdrop 
							onCloseClick={props.onCloseClick} />, portalBackdrop)}
			{portalOverlays && ReactDOM.createPortal(<Overlay 
							title={props.title}
							message={props.message}
							channel={props.channel}
							onCloseClick={props.onCloseClick}
							onConfirm={props.onConfirm}>{props.children}</Overlay>, portalOverlays)}
		</Fragment>
	)
}

export default JoinModal;