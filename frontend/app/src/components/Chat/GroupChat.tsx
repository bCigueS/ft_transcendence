import { useEffect, useState } from "react";
import { Channel } from "./chatUtils";
import classes from '../../sass/components/Chat/ChatInfo.module.scss';
import AddToGroup from "./AddToGroup";
import { UserAPI } from "../../store/users-contexte";

type Props = {
    children?: React.ReactNode,
    className?: string,
    chat: Channel,
	onInfoClick: () => void,
    onDelete: () => void,
    onRemove: (member: UserAPI) => void,
};

const GroupChat: React.FC<Props> = (props) => {
    const [ chatName, setChatName ] = useState('');

    /*
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
        setChatName(props.chat.name);
    });

    const channelCreatedOn = () => {
        let date = new Date(props.chat.createdAt);
        return date.toDateString();
    }

    return (
        <div className={classes.container}>
        <h1>{chatName}</h1>
        <div className={classes.info}>
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
                    onRemove={props.onRemove}
                    handleKickBanMute={true}
                    handleDM={true}
                    />
                    ))
                }
        </div>
        </div>
    );
}

export default GroupChat;