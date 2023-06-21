import ProfilIcon from "../Profile/ProfilIcon";
import { Channel } from "./chatUtils";
import classes from './../../sass/components/Chat/GroupIcon.module.scss';

const GroupIcon: React.FC<{chat: Channel; displayCo?: boolean; size?: string[]; border?: boolean}> = ( { chat, displayCo = true, size = [], border = false}) => {

    let user1 = chat.members[0];
    let user2 = chat.members[1];

    return (
        <div className={classes.container}>
            <div className={classes.firstUser}>
                <ProfilIcon user={user1} displayCo={false} size={["2.5rem", "2.5rem"]}/>
            </div>
            <div className={classes.secondUser}>
            <ProfilIcon user={user2} displayCo={false} size={["2.5rem", "2.5rem"]}/>
            </div>
        </div>
    )
}

export default GroupIcon;