import React, { useContext, useEffect, useState } from "react";
import classes from '../../sass/components/UI/Modal.module.scss';
import infoclasses from '../../sass/components/Chat/ChatInfo.module.scss';
import { Fragment } from 'react';
import ReactDOM from 'react-dom';
import Card from "./../UI/Card";
import { UserAPI, UserContext } from "../../store/users-contexte";
import { Channel } from "./chatUtils";
import AddToGroup from "./AddToGroup";
import GroupChat from "./GroupChat";
import PrivateChat from "./PrivateChat";

type Props = {
    children?: React.ReactNode,
    className?: string,
    chat: Channel,
	onInfoClick: () => void,
    onDelete: () => void
};

type BackdropProps = {
    children?: React.ReactNode,
    className?: string,
	onInfoClick: () => void,
};

const Backdrop: React.FC<BackdropProps> = (props) => {
	return <div className={classes.backdrop} onClick={props.onInfoClick}></div>
}

const Overlay: React.FC<Props> = (props) => {
    const [ groupName, setGroupName ] = useState<string>(''); 
	const [ members, setMembers ] = useState<UserAPI[]>([]);
	const [ typeError, setTypeError ] = useState<string>('');
	const userCtx = useContext(UserContext);

    const handleSubmit = () => {
		props.onInfoClick();
    }

    const nameHandler = (event: any) => {
		setGroupName(event.target.value);
	}

	const addMember = (member: UserAPI) => {
		console.log('added member: ', member);
		setMembers([...members, member]);
	}

	const removeMember = (member: UserAPI) => {
		console.log('removed member: ', member);
		setMembers(members.filter(m => m.id !== member.id));
	}

	return (
		<Card className={classes.modal}>
            {
				props.chat.name === 'private' ?
				<PrivateChat
					chat={props.chat}
					onInfoClick={props.onInfoClick}
					onDelete={props.onDelete}
				/>
				:
				<GroupChat
					chat={props.chat}
					onInfoClick={props.onInfoClick}
					onDelete={props.onDelete}
					onRemove={removeMember}
				/>
			}
		</Card>
	);
}

const portalOverlays = document.getElementById('overlays');
const portalBackdrop = document.getElementById('backdrop');

const ChatInfo: React.FC<Props> = (props) => {

	return (
		<Fragment>
			{portalBackdrop && ReactDOM.createPortal(<Backdrop 
							onInfoClick={props.onInfoClick} />, portalBackdrop)}
			{portalOverlays && ReactDOM.createPortal(<Overlay 
							chat={props.chat}
							onInfoClick={props.onInfoClick}
							onDelete={props.onDelete}>{props.children}</Overlay>, portalOverlays)}
		</Fragment>
	)
}

export default ChatInfo;