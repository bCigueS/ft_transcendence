import { useNavigate } from "react-router-dom";
import { UserAPI, UserContext } from "../../store/users-contexte";
import ProfilIcon from "../Profile/ProfilIcon";
import classes from './../../sass/components/Chat/AddToGroup.module.scss';
import { useContext } from "react";

const AddToGroup: React.FC<{user: UserAPI, 	onAdd?: (member: UserAPI) => void,
	onRemove?: (member: UserAPI) => void,
	onAddAdmin?: (member: UserAPI) => void,
	onAddBanned?: (member: UserAPI) => void,
	onAddMuted?: (member: UserAPI) => void,
	isSelected?: boolean,
	handleAddRemove?: boolean,
	handleDM?: boolean,
	handleKickBanMute?: boolean,
	handleKick?: boolean,
	handleBan?: boolean,
	handleMute?: boolean,
	handleAddAdmin?: boolean,
	superUser?: boolean}> = ({
		user, 
		onAdd, 
		onRemove,
		onAddAdmin,
		onAddBanned,
		onAddMuted,
		isSelected = false, 
		handleAddRemove = false, 
		handleDM = false, 
		handleKickBanMute = false,
		handleKick = false,
		handleBan = false,
		handleMute = false,
		handleAddAdmin = false,
		superUser= false}) => {
	
	const userCtx = useContext(UserContext);
	const navigate = useNavigate();

	const onAddHandler = () => {
		if (onAdd)
			onAdd(user);
	}

	const onRemoveHandler = () => {
		if (onRemove)
			onRemove(user);
	}

	const onAddAdminHandler = () => {
		if (onAddAdmin)
			onAddAdmin(user);
	}

	const onAddBannedHandler = () => {
		if (onAddBanned)
			onAddBanned(user);
	}

	const onAddMutedHandler = () => {
		if (onAddMuted)
			onAddMuted(user);
	}

	const onPlayHandler = () => {
		console.log('about to invite user ', user.name, ' to pong duel');
		navigate('/pong', {
            state: {
                playerId: userCtx.user?.id,
                opponentId: user.id,
                gameInvitation: true,
                isInvited: false,
                isSpectator: false,
                gameRoom: undefined,
            }
        })
	}

    return (
		<div className={handleKickBanMute ? classes.enhancedContainer : classes.container}>

			<ProfilIcon user={user} superUser={superUser}/>
			<h2>{user?.name}</h2>

			{
				handleAddRemove ?
				<div className={classes.info}>
					{
						isSelected ?
						<i 
							title='Remove'
							onClick={onRemoveHandler}
							className='fa-solid fa-minus'>
						</i>
						:
						<i
							title='Add'
							onClick={onAddHandler}
							className='fa-solid fa-plus'>
						</i>
					}
				</div>
				:
				<div className={classes.info}>
					{
						handleDM &&
						<i 
						title='Private Message'
						className='fa-solid fa-message'>
						</i>
					}
					{
						userCtx.user?.id !== user.id &&
						<i
						title='Game'
						onClick={onPlayHandler}
						className='fa-solid fa-table-tennis-paddle-ball'>
					</i>
					}
				</div>
			}

			
			{
				handleKickBanMute &&
				<div className={classes.option}>
					{
						handleBan &&
						<i
						title='Ban'
						onClick={onAddBannedHandler}
						className={'fa-solid fa-ban'}>
						</i>
					}
					{
						handleKick && 
						<i 
						title='Kick'
						onClick={onRemoveHandler}
						className={'fa-solid fa-minus'}>
						</i>
					}
					{
						handleMute &&
						<i 
						title={"Mute"}
						onClick={onAddMutedHandler}
						className={'fa-solid fa-volume-xmark'}>
						</i>
					}
					{
						handleAddAdmin &&
						<i 
						title={"Admin"}
						onClick={onAddAdminHandler}
						className={'fa-solid fa-star'}>
						</i>
					}
				</div>
			}

		</div>
	)
}

export default AddToGroup;