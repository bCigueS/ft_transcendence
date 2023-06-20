import { useContext, useEffect, useState } from "react";
import { Channel } from "./chatUtils";
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
};

const GroupChat: React.FC<Props> = (props) => {
    const [ chatName, setChatName ] = useState('');
    const [ userConfirm, setUserConfirm ] = useState<boolean>(false);
    const [ isAdmin, setIsAdmin ] = useState(false);
    const [ isCreator, setIsCreator ] = useState(false);
    const [ isChatPasswordProtected, setIsChatPasswordProtected ] = useState(false);
    const [ chatPassword, setChatPassword ] = useState('');
	const [ typeError, setTypeError ] = useState<string>('');
    const [ administrators, setAdministrators ] = useState<UserAPI[]>([]);
    const [ displayMembers, setDisplayMembers ] = useState(true);
    const [ displayAdmin, setDisplayAdmin ] = useState(false);
	const userCtx = useContext(UserContext);
    

    /*
    ✅ 
        everyone can:
            leave channel
            access members profile
            invite them for a pong duel
        creator can:
            ban users 
            mute users
            kick users
            set new administrators
            add a password to protect the channel
            delete chat
        administrator can
            kick, ban, mute other users, except the channel administrator
    */

    useEffect(() => {
        if (userCtx.user?.id === props.chat.creatorId)
            setIsCreator(true);
        if (props.chat.admins.find(admin => admin.id === userCtx.user?.id))
            setIsAdmin(true);
        setChatName(props.chat.name);
        setAdministrators(props.chat.admins);
    });

    const channelCreatedOn = () => {
        let date = new Date(props.chat.createdAt);
        return date.toDateString();
    }

    const handleClickLeave = () => {
        console.log(userCtx.user?.name, ' left channel ', props.chat.name);
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

    const handlePasswordProtect = (event: any) => {
		event.preventDefault();
        if (!isChatPasswordProtected && (chatPassword.length === 0 || chatPassword.trim().length === 0))
        {
            setTypeError('Provide a password to protect channel.')
            return ;
        }
        setIsChatPasswordProtected(!isChatPasswordProtected);
        console.log('about to cange channel setting to be protected with password: ', chatPassword);
        // update chat settings in backend.
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

    return (
        <div className={classes.container}>
        <h1>{chatName}</h1>
        <div className={classes.info}>
            <h2>
            This awesome conversation started on {channelCreatedOn()}.
            </h2><br></br>
            <div className={classes.display}>
            <h2>
            See special people in this chat.
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
                    props.chat.members.map((member) => (
                        <AddToGroup 
                        key={member.id} 
                        user={member}
                        onRemove={props.onRemove}
                        onAddAdmin={props.onAddAdmin}
                        // handleKickBanMute={true}
                        handleKickBanMute={canKickBanMute(member)}
                        handleDM={true}
                        handleAddAdmin={true}
                        />
                        ))
                    }
                </div>
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
                <div className={classes.display}>
                <h2>
                See administrators
                </h2>
                    <i 
                        title={"administrators"}
                        onClick={handleShowAdministrators}
                        className={displayAdmin ? 'fa-solid fa-caret-down' : 'fa-solid fa-caret-right'}>
                    </i>
                </div>
                {
                    displayAdmin && administrators.length > 0 ?
                    administrators.map((administrator) => (
                        <AddToGroup 
                        key={administrator.id} 
                        user={administrator}
                        onRemove={props.onRemove}
                        // handleKickBanMute={canKickBanMute(administrator)}
                        // handleDM={true}
                        />
                        ))
                    :
                    displayAdmin && administrators.length === 0 &&
                    <p className={classes.error}>There are no administrators in this group.</p>
                }
                {
                    <button className={classes.deleteButton} onClick={handleClickLeave}>Leave {chatName}</button>
                }
                {
                    userConfirm &&
                    <div className={classes.clickDelete}>
                    <h3>Are you sure you wish to leave this chat?</h3>
                    <div className={classes.actions}>
                    <button className={classes.cancelButton} onClick={handleCancelDelete}>Cancel</button>
                    <button className={classes.button} onClick={handleConfirmDelete}>Confirm</button>
                    </div>
                    </div>
                }
                {
                    isCreator && 
                    <button className={classes.deleteButton} onClick={handleClickDelete}>Delete {chatName}</button>
                }
        </div>
        </div>
    );
}

export default GroupChat;