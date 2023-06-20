import React, { useContext, useState } from "react";
import classes from '../../sass/components/UI/Modal.module.scss';
import formclasses from '../../sass/components/Chat/CreateGroup.module.scss';
import { Fragment } from 'react';
import ReactDOM from 'react-dom';
import Card from "./../UI/Card";
import { UserAPI, UserContext } from "../../store/users-contexte";
import AddToGroup from "./AddToGroup";
import { createNewChannel } from "./chatUtils";

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
    const [ groupName, setGroupName ] = useState<string>(''); 
	const [ members, setMembers ] = useState<UserAPI[]>([]);
	const [ typeError, setTypeError ] = useState<string>('');
	const [ canBan, setCanBan ] = useState<boolean>(false);
	const [ canMute, setCanMute ] = useState<boolean>(false);
	const [ canRemove, setCanRemove ] = useState<boolean>(false);
	const userCtx = useContext(UserContext);

    const handleSubmit = () => {
		if (groupName === '' || groupName.trim() === '')
		{
			setTypeError('You need to provide a name to create a group.')
			return ;
		}
		if (members.length < 2)
		{
			setTypeError('You need to select at least two members to create a group.');
			return ;
		}
		console.log('about to create group: ', {groupName, members});

		let membersWithConnectedUser = members;
		if (userCtx.user) {
			membersWithConnectedUser = [...members, userCtx.user];
		}

		const chanData = {
			name: groupName,
			members: membersWithConnectedUser.map(member => ({
				userId: member.id
			}))
		}
	
		console.log('ChanData: ', chanData);
		createNewChannel(chanData);
		window.location.reload();
		props.onCloseClick();
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
			<header className={classes.header}>
				<h1>{props.title}</h1>
			</header>
                <form method='patch' className={formclasses.container} onSubmit={handleSubmit}>
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
					<div className={formclasses["members-label"]}>
                        <label>Add members to group</label>
						{
							(userCtx.user?.id) &&
							<div >
								{
									userCtx.user?.friends && 
									userCtx.user.friends.filter((friend) => !members.some(member => member.id === friend.id))
									.map((friend) => (
										<AddToGroup 
											key={friend.id} 
											user={friend}
											onAdd={addMember}
											onRemove={removeMember}
											isSelected={false}
											handleAddRemove={true}
										/>
									))
								}
							</div>
						}
						{
							members.length > 0 &&
						<div className={formclasses.selected}>
						<h2>Selected members</h2>
						{
							members.map((member) => (
								<AddToGroup 
								key={member.id} 
								user={member}
								onAdd={addMember}
								onRemove={removeMember}
								isSelected={true}
								handleAddRemove={true}
								/>
								))
							}
						</div>
						}
                    </div>
					{ 
						typeError &&
						<p className={formclasses.error}>{typeError}</p>
					}
                </form>
			<footer className={classes.actions}>
				<button className={classes["button-cancel"]} onClick={props.onCloseClick}>Cancel</button>
				<button className={classes.button} onClick={handleSubmit}>Create</button>
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