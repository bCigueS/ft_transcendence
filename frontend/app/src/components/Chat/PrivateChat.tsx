import { useContext, useEffect, useState } from "react";
import AddToGroup from "./AddToGroup";
import { Channel } from "./chatUtils";
import { UserAPI, UserContext } from "../../store/users-contexte";
import classes from '../../sass/components/Chat/ChatInfo.module.scss';

type Props = {
    children?: React.ReactNode,
    className?: string,
    chat: Channel,
	onInfoClick: () => void,
    onDelete: () => void,
};

const PrivateChat: React.FC<Props> = (props) => {
    const [ sender, setSender ] = useState<UserAPI>();
    const [ chatName, setChatName ] = useState('');
    const [ userConfirm, setUserConfirm ] = useState<boolean>(false);
	const userCtx = useContext(UserContext);

    useEffect(() => {
        getSender();
    });

    const getSender = () => {
        if (props.chat.members && props.chat.name === "private")
        {
            props.chat.members.forEach((member) => {
                if (member.id !== userCtx.user?.id)
                {
                    setSender(member);
                    setChatName(member.name);
                }
            })
        }
    }

    const channelCreatedOn = () => {
        let date = new Date(props.chat.createdAt);
        return date.toDateString();
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

    return (
        <div className={classes.container}>
            <h1>{chatName}</h1>
            <div className={classes.info}>
                <h2>
                This awesome conversation started on {channelCreatedOn()}.
                </h2><br></br>
                <h2>
                
                </h2>
                { sender &&				
                    <AddToGroup 
                    key={sender?.id} 
                    user={sender}
                    />
                }

                <button className={classes.deleteButton} onClick={handleClickDelete}>Delete</button>
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
    );
}

export default PrivateChat;