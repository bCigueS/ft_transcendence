import { useContext, useEffect, useState } from "react";
import { Channel, UpdateChannelDTO, banUser, kickUser, modifyChannel, removeAdmin, removeBan, removeMute } from "./chatUtils";
import classes from '../../sass/components/Chat/ChatInfo.module.scss';
import AddToGroup from "./AddToGroup";
import { UserAPI, UserContext } from "../../store/users-contexte";

type Props = {
    children?: React.ReactNode,
    className?: string,
    chat: Channel,
	onInfoClick: () => void,
    onDelete: () => void,
    onRemove: (member: UserAPI) => void,
    onAddAdmin: (member: UserAPI) => void,
    onKick: (channelId: number, kickedId: number) => void
};

const GroupChat: React.FC<Props> = (props) => {
    const [ chatName, setChatName ] = useState('');
    const [ userConfirm, setUserConfirm ] = useState<boolean>(false);
    const [ isAdmin, setIsAdmin ] = useState(false);
    const [ isCreator, setIsCreator ] = useState(false);
    const [ isChatPasswordProtected, setIsChatPasswordProtected ] = useState(false);
    const [ chatPassword, setChatPassword ] = useState('');
	const [ typeError, setTypeError ] = useState<string>('');
    const [ admins, setAdmins ] = useState<UserAPI[]>([]);
    const [ members, setMembers ] = useState<UserAPI[]>([]);
    const [ banned, setBanned ] = useState<UserAPI[]>([]);
    const [ muted, setMuted ] = useState<UserAPI[]>([]);
    const [ displayMembers, setDisplayMembers ] = useState(true);
    const [ displayAdmin, setDisplayAdmin ] = useState(false);
    const [ displayBanned, setDisplayBanned ] = useState(false);
    const [ displayMuted, setDisplayMuted ] = useState(false);
    const [ joinLink, setJoinLink ] = useState('');
	const userCtx = useContext(UserContext);
    

    /*
        everyone can:
            leave channel ✅
            access members profile ✅
            invite them for a pong duel 
        creator can:
            ban users ✅
            mute users ✅
            kick users ✅
            set new administrators ✅
            add a password to protect the channel ✅
            delete chat ✅
        administrator can
            kick, ban, mute other users, except the channel administrator ✅
    */

    useEffect(() => {
        if (userCtx.user?.id === props.chat.creatorId)
            setIsCreator(true);
        if (props.chat.admins?.find(admin => admin.id === userCtx.user?.id))
            setIsAdmin(true);
        setChatName(props.chat.name);
        if (props.chat.admins)
            setAdmins(props.chat.admins);
        if (props.chat.members)
            setMembers(props.chat.members);
        if (props.chat.banned)
            setBanned(props.chat.banned);
        if (props.chat.muted)
            setMuted(props.chat.muted);
		if (props.chat.isPasswordProtected)
			setIsChatPasswordProtected(true);
    }, [props.chat.admins, props.chat.banned, props.chat.muted, props.chat.creatorId, props.chat.members, props.chat.name, userCtx.user?.id]);

    const channelCreatedOn = () => {
        let date = new Date(props.chat.createdAt);
        return date.toDateString();
    }

    const handleClickLeave = () => {
        console.log(userCtx.user?.name, ' left channel ', props.chat.name);
        if (userCtx.user)
            handleRemoveAdmin(userCtx.user);
        if (userCtx.user)
            handleRemoveBan(userCtx.user);
        if (userCtx.user)
            handleRemoveMute(userCtx.user);
        const newMembers = members.filter(m => m.id !== userCtx.user?.id);
        setMembers(newMembers);
        if (userCtx.user)
            kickUser(props.chat.id, userCtx.user?.id);
        if (userCtx.user)
            props.onKick(props.chat.id, userCtx.user.id);
    }

    const handleClickDelete = () => {
        setUserConfirm(true);
    }

    const handleConfirmDelete = () => {
        props.onDelete();
        setUserConfirm(false);
    }

    const handleCancelDelete = () => {
        setUserConfirm(false);
    }

    const canKickBanMute = (member: UserAPI) => {
        if (isCreator)
            return true;
        if (isAdmin && (member.id !== props.chat.creatorId))
            return true;
        return false;
    }

    const canBan = (member: UserAPI) => {
        if (banned.find(b => b.id === member.id))
            return false;
        return true;
    }

    const canMute = (member: UserAPI) => {
        if (muted.find(m => m.id === member.id))
            return false;
        return true;
    }

    const canAddAsAdmin = (member: UserAPI) => {
        if (admins.find(admin => admin.id === member.id))
            return false;
        if (isCreator)
            return true;
        return false; 
    }

    const handlePasswordProtect = async(event: any) => {
		event.preventDefault();
        if (!isChatPasswordProtected && (chatPassword.length === 0 || chatPassword.trim().length === 0))
        {
            setTypeError('Provide a password to protect channel.')
            return ;
        }

		let updatedChan: UpdateChannelDTO;

		if (isChatPasswordProtected)
		{
			updatedChan = {
				isPasswordProtected: false,
			}
		}
		else
		{
			updatedChan = {
				isPasswordProtected: true,
				password: chatPassword,
			}
			
		}
        console.log('about to cange channel protection setting : ', updatedChan);
		await modifyChannel(props.chat.id, updatedChan);
        setIsChatPasswordProtected(!isChatPasswordProtected);
        setChatPassword('');
    }

    const passwordHandler = (event: any) => {
		event.preventDefault();
		setChatPassword(event.target.value);
	}

    const handleShowMembers = () => {
        setDisplayMembers(!displayMembers);
    }

    const handleShowAdministrators = () => {
        setDisplayAdmin(!displayAdmin);
    }

    const handleShowBanned = () => {
        setDisplayBanned(!displayBanned);
    }

    const handleShowMuted = () => {
        setDisplayMuted(!displayMuted);
    }

    const handleAddAdmin = (member: UserAPI) => {
        console.log('about to add member as admin: ', member);

        setAdmins([...admins, member]);
        const chanData = {
            admins: [
                {
                    userId: member.id
                }
            ]
        }
        modifyChannel(props.chat.id, chanData);
    }

    const handleAddBanned = (member: UserAPI) => {
        console.log('about to add member as banned: ', member);

		handleKick(member);
        setBanned([...banned, member]);
        const chanData = {
            banned: [
                {
                    userId: member.id
                }
            ]
        }
        banUser(props.chat.id, member.id);
    }

    const handleAddMuted = (member: UserAPI) => {
        console.log('about to add member as muted user: ', member);

        setMuted([...muted, member]);
        const chanData = {
            muted: [
                {
                    userId: member.id
                }
            ]
        }
        modifyChannel(props.chat.id, chanData);
    }

    const handleRemoveAdmin = (admin: UserAPI) => {
        console.log('about to remove admin: ', admin);
        const newAdmins = admins.filter(a => a.id !== admin.id);
        setAdmins(newAdmins);
        removeAdmin(props.chat.id, admin.id);
    }

    const handleRemoveBan = (ban: UserAPI) => {
        console.log('about to remove ban: ', ban);
        const newBanned = banned.filter(b => b.id !== ban.id);
        setBanned(newBanned);
        removeBan(props.chat.id, ban.id);
    }

    const handleRemoveMute = (mute: UserAPI) => {
        console.log('about to remove mute: ', mute);
        const newMuted = muted.filter(m => m.id !== mute.id);
        setAdmins(newMuted);
        removeMute(props.chat.id, mute.id);
    }

    const handleKick = (member: UserAPI) => {
        console.log('about to remove user from chat: ', member);
        handleRemoveAdmin(member);
        handleRemoveBan(member);
        handleRemoveMute(member);
        const newMembers = members.filter(m => m.id !== member.id);
        setMembers(newMembers);
        kickUser(props.chat.id, member.id);
        props.onKick(props.chat.id, member.id);
    }

    useEffect(() => {
        if(props.chat && props.chat.id && props.chat.name) {
          setJoinLink(`join/${props.chat.name}_${props.chat.id}`);
        }
      }, [props.chat]);
    
      const copyToClipboard = (e: any) => {
        navigator.clipboard.writeText(joinLink);
        e.target.focus();
      };

    return (
        <div className={classes.container}>
        <h1>{chatName}</h1>
        <div className={classes.info}>
            <h2>
            This awesome conversation started on {channelCreatedOn()}.
            </h2><br></br>
            <div className={classes.display}>
            <h2>
            ✨ members ({members.length})
            </h2>
                <i 
                    title={"members"}
                    onClick={handleShowMembers}
                    className={displayMembers ? 'fa-solid fa-caret-down' : 'fa-solid fa-caret-right'}>
                </i>
            </div>
            <div className={classes.userList}>
                {
                    displayMembers &&
                        members.map((member) => 
                        member.id !== userCtx.user?.id ? (
                        <AddToGroup 
                        key={member.id} 
                        user={member}
                        onRemove={handleKick}
                        onAddAdmin={handleAddAdmin}
                        onAddBanned={handleAddBanned}
                        onAddMuted={handleAddMuted}
                        handleKickBanMute={canKickBanMute(member)}
                        handleKick={true}
                        handleBan={canBan(member)}
                        handleMute={canMute(member)}
                        handleDM={true}
                        handleAddAdmin={canAddAsAdmin(member)}
                        />
                        ) : 
                        <AddToGroup 
                        key={member.id} 
                        user={member}
                        />)
                    }
                </div>
                <div className={classes.display}>
                <h2>
                👑 admins ({admins.length})
                </h2>
                    <i 
                        title={"administrators"}
                        onClick={handleShowAdministrators}
                        className={displayAdmin ? 'fa-solid fa-caret-down' : 'fa-solid fa-caret-right'}>
                    </i>
                </div>
                    <div className={classes.userList}>
                {
                        displayAdmin && admins.length > 0 ?
                            admins.map((admin) => (
                        <AddToGroup 
                        key={admin.id} 
                        user={admin}
                        onRemove={handleRemoveAdmin}
                        handleAddRemove={true}
                        isSelected={true}
                        // handleKickBanMute={canKickBanMute(administrator)}
                        handleDM={true}
                        />
                        ))
                    :
                    displayAdmin && admins.length === 0 &&
                    <p className={classes.error}>There are no administrators in this group.</p>
                }
                    </div>
                    <div className={classes.display}>
                <h2>
                🚫 banned users ({banned.length})
                </h2>
                    <i 
                        title={"banned"}
                        onClick={handleShowBanned}
                        className={displayBanned ? 'fa-solid fa-caret-down' : 'fa-solid fa-caret-right'}>
                    </i>
                </div>
                    <div className={classes.userList}>
                {
                        displayBanned && banned.length > 0 ?
                            banned.map((ban) => (
                        <AddToGroup 
                        key={ban.id} 
                        user={ban}
                        onRemove={handleRemoveBan}
                        handleAddRemove={true}
                        isSelected={true}
                        handleDM={true}
                        />
                        ))
                    :
                    displayBanned && banned.length === 0 &&
                    <p className={classes.error}>There are no banned users in this group.</p>
                }
                    </div>
                    <div className={classes.display}>
                <h2>
                🙊 muted users ({muted.length})
                </h2>
                    <i 
                        title={"muted"}
                        onClick={handleShowMuted}
                        className={displayMuted ? 'fa-solid fa-caret-down' : 'fa-solid fa-caret-right'}>
                    </i>
                </div>
                    <div className={classes.userList}>
                {
                        displayMuted && muted.length > 0 ?
                            muted.map((mute) => (
                        <AddToGroup 
                            key={mute.id} 
                            user={mute}
                            onRemove={handleRemoveMute}
                            handleAddRemove={true}
                            isSelected={true}
                            handleDM={true}
                        />
                        ))
                    :
                    displayMuted && muted.length === 0 &&
                    <p className={classes.error}>There are no muted users in this group.</p>
                }
                    </div>
                    <div className={classes.invite}>
                        <h2>
                            Invite your friends
                        </h2>
                        {/* <p>Join link: {joinLink}</p> */}
                        <button onClick={copyToClipboard}>Copy Join Link</button>
                    </div>
                    {
                        isCreator &&
                        <div>
                            <div className={classes.passwordLabel}>
                                <h2>
                                Password protection
                                </h2>
                                <i 
                                    title={isChatPasswordProtected ? "block" : "unblock"}
                                    onClick={handlePasswordProtect}
                                    className={isChatPasswordProtected ? 'fa-solid fa-lock' : 'fa-solid fa-lock-open'}>
                                </i>
                            </div>
                        {
                            !isChatPasswordProtected && 
                            <div className={classes.label}>
                            <form onSubmit={handlePasswordProtect}>
                            <input 
                            type="password" 
                            id='name' 
                            name='name'
                            value={chatPassword} 
                            onChange={passwordHandler}
                            maxLength={12}/>
                            <br></br>
                            </form>
                            { 
                                typeError &&
                                <p className={classes.error}>{typeError}</p>
                            }
                            </div>
                        }
                </div>
                }
                <div className={classes.actions}>
                {
                    isCreator && 
                    <button className={classes.deleteButton} onClick={handleClickDelete}>Delete {chatName}</button>
                }
                {
                    <button className={classes.leaveButton} onClick={handleClickLeave}>Leave {chatName}</button>
                }
                </div>
                <div className={classes.actions}>
                    {
                        userConfirm &&
                        <div className={classes.clickDelete}>
                            <h3>Are you sure you wish to delete this chat?</h3>
                            <div className={classes.actions}>
                                <button className={classes.cancelButton} onClick={handleCancelDelete}>Cancel</button>
                                <button className={classes.button} onClick={handleConfirmDelete}>Confirm</button>
                            </div>
                        </div>
                    }
                </div>
        </div>
        </div>
    );
}

export default GroupChat;