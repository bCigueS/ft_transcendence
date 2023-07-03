import React, { useState } from "react";
import classes from '../../sass/components/UI/Modal.module.scss';
import { Fragment } from 'react';
import ReactDOM from 'react-dom';
import Card from "./../UI/Card";
import { UserAPI } from "../../store/users-contexte";
import { Channel } from "./chatUtils";
import GroupChat from "./GroupChat";
import PrivateChat from "./PrivateChat";

type Props = {
    children?: React.ReactNode,
    className?: string,
    chat: Channel,
	onInfoClick: () => void,
    onDelete: () => void,
    onKick: (channelId: number, kickedId: number) => void,
    onAddAdmin: (channelId: number, userId: number) => void,
    onRemoveAdmin: (channelId: number, userId: number) => void,
    onAddMuted: (channelId: number, userId: number) => void,
    onRemoveMuted: (channelId: number, userId: number) => void,
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
	const [ members, setMembers ] = useState<UserAPI[]>([]);

	const removeMember = (member: UserAPI) => {
		// console.log('removed member: ', member);
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
					onKick={props.onKick}
					onAddAdmin={props.onAddAdmin}
					onRemoveAdmin={props.onRemoveAdmin}
					onAddMuted={props.onAddMuted}
					onRemoveMuted={props.onRemoveMuted}
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
							onDelete={props.onDelete}
							onKick={props.onKick}
							onAddAdmin={props.onAddAdmin}
							onRemoveAdmin={props.onRemoveAdmin}
							onAddMuted={props.onAddMuted}
							onRemoveMuted={props.onRemoveMuted}
							>{props.children}</Overlay>, portalOverlays)}
		</Fragment>
	)
}

export default ChatInfo;