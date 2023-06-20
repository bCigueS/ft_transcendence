import { UserAPI } from "../../store/users-contexte";
import ProfilIcon from "../Profile/ProfilIcon";
import classes from './../../sass/components/Chat/AddToGroup.module.scss';

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
	handleAddAdmin?: boolean}> = ({
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
		handleAddAdmin = false}) => {

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

	if (handleKickBanMute)
		console.log('user connect has power to kick ban mute');
	if (handleKick)
		console.log('member can be kicked');
	if (handleBan)
		console.log('member can be banned');
	if (handleMute)
		console.log('member can be muted');

    return (
		<div className={handleKickBanMute ? classes.enhancedContainer : classes.container}>

			<ProfilIcon user={user} />
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
					<i
						title='Game'
						className='fa-solid fa-table-tennis-paddle-ball'>
					</i>
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