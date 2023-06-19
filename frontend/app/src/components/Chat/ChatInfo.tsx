import React, { useContext, useState } from "react";
import classes from '../../sass/components/UI/Modal.module.scss';
import infoclasses from '../../sass/components/Chat/ChatInfo.module.scss';
import { Fragment } from 'react';
import ReactDOM from 'react-dom';
import Card from "./../UI/Card";
import { UserAPI, UserContext } from "../../store/users-contexte";
import { Channel } from "./chatUtils";
import AddToGroup from "./AddToGroup";

type Props = {
    children?: React.ReactNode,
    className?: string,
    chat: Channel,
    sender: UserAPI,
	onInfoClick: () => void,
    onDelete: () => void
};

const Backdrop: React.FC<Props> = (props) => {
	return <div className={classes.backdrop} onClick={props.onInfoClick}></div>
}

const Overlay: React.FC<Props> = (props) => {
    const [ groupName, setGroupName ] = useState<string>(''); 
	const [ members, setMembers ] = useState<UserAPI[]>([]);
	const [ typeError, setTypeError ] = useState<string>('');
	const userCtx = useContext(UserContext);

    const handleSubmit = () => {
		// if (groupName === '' || groupName.trim() === '')
		// {
		// 	setTypeError('You need to provide a name to create a group.')
		// 	return ;
		// }
		// if (members.length < 2)
		// {
		// 	setTypeError('You need to select at least two members to create a group.');
		// 	return ;
		// }
		// console.log('about to create group: ', {groupName, members});

		// let membersWithConnectedUser = members;
		// if (userCtx.user) {
		// 	membersWithConnectedUser = [...members, userCtx.user];
		// }

		// const chanData = {
		// 	name: groupName,
		// 	members: membersWithConnectedUser.map(member => ({
		// 		userId: member.id
		// 	}))
		// }
	
		// console.log('ChanData: ', chanData);
		// createNewChannel(chanData);
		// window.location.reload();
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

    const displayChatName = () => {
        if (props.chat.name === "private")
            return props.sender?.name;
        return props.chat.name;
    }

    const channelCreatedOn = () => {
        let date = new Date(props.chat.createdAt);
        return date.toDateString();
    }
	
	return (
		<Card className={classes.modal}>
            <div className={infoclasses.container}>
				<h1>{displayChatName()}</h1>
            <div className={infoclasses.info}>
                <h2>
                This awesome conversation started on {channelCreatedOn()}.
                </h2><br></br>
                <h2>
                There are special people in this chat.
                </h2>
                {
                    props.chat.members.map((member) => (
                        <AddToGroup 
                        key={member.id} 
                        user={member}
                        onAdd={addMember}
                        onRemove={removeMember}
                        isSelected={true}
                        handleSelect={true}
                        handleBan={true}
                        handleMute={true}
                        />
                        ))
                    }
            </div>
            </div>
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
                            sender={props.sender}
							onInfoClick={props.onInfoClick}
							onDelete={props.onDelete}>{props.children}</Overlay>, portalOverlays)}
		</Fragment>
	)
}

export default ChatInfo;