import { UserAPI } from "../../store/users-contexte";
import ProfilIcon from "../Profile/ProfilIcon";
import classes from './../../sass/components/Chat/AddToGroup.module.scss';

const AddToGroup: React.FC<{user: UserAPI, onAdd: (member: UserAPI) => void,
	onRemove: (member: UserAPI) => void,
	isSelected: boolean,
	handleSelect: boolean,
	handleBan: boolean,
	handleMute: boolean}> = (props) => {

	const onAddHandler = () => {
		props.onAdd(props.user);
	}

	const onRemoveHandler = () => {
		props.onRemove(props.user);
	}

    return (
		<div className={classes.container}>

			<ProfilIcon user={props.user} />

			<div className={classes.info}>
				<h2>{props.user?.name}</h2>
			</div>
			
			{
				props.handleSelect && !props.isSelected &&
				<div className={classes.option}>
						<i 
						title='Friend'
						onClick={onAddHandler}
						className={'fa-solid fa-plus'}>
					</i>
				</div>
			}
			{
				props.handleSelect && props.isSelected &&
				<div className={classes.option}>
						<i 
						title='Friend'
						onClick={onRemoveHandler}
						className={'fa-solid fa-minus'}>
					</i>
				</div>
			}
			{
				props.handleBan &&
				<div className={classes.option}>
						<i 
						title='Friend'
						onClick={onRemoveHandler}
						className={'fa-solid fa-ban'}>
					</i>
				</div>
			}
			{
				props.handleMute && props.isSelected &&
				<div className={classes.option}>
						<i 
						title='Friend'
						onClick={onRemoveHandler}
						className={'fa-solid fa-volume-xmark'}>
					</i>
				</div>
			}
		</div>
	)
}

export default AddToGroup;