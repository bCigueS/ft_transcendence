import { UserAPI } from "../../store/users-contexte";
import ProfilIcon from "../Profile/ProfilIcon";
import classes from './../../sass/components/Chat/AddToGroup.module.scss';

const AddToGroup: React.FC<{user: UserAPI, 	onAdd?: (member: UserAPI) => void,
	onRemove?: (member: UserAPI) => void,
	isSelected?: boolean,
	handleAddRemove?: boolean,
	handleDM?: boolean,
	handleKickBanMute?: boolean}> = ({user, onAdd, onRemove, isSelected = false, handleAddRemove = false, handleDM = false, handleKickBanMute = false}) => {

	const onAddHandler = () => {
		if (onAdd)
			onAdd(user);
	}

	const onRemoveHandler = () => {
		if (onRemove)
			onRemove(user);
	}

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
					<i
						title='Ban'
						onClick={onRemoveHandler}
						className={'fa-solid fa-ban'}>
					</i>
					<i 
						title='Kick'
						onClick={onRemoveHandler}
						className={'fa-solid fa-minus'}>
					</i>
					<i 
						title={"Mute"}
						onClick={onRemoveHandler}
						className={'fa-solid fa-volume-xmark'}>
					</i>
				</div>
			}

		</div>
	)
}

export default AddToGroup;