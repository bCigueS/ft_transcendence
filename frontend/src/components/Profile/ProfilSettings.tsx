import React, { useRef, useContext, useState } from 'react';
import { User, UserContext } from '../../store/users-contexte';
import classes from '../../sass/components/Profile/ProfilSettings.module.scss';


const ProfilSettings: React.FC<{user: User}> = ( props ) => {

	const userCtx = useContext(UserContext);
	const [image, setImage] = useState<File>();
	const [preview, setPreview] = useState<string>(props.user.profilePic);

	const settingTextInput = useRef<HTMLInputElement>(null);

	const submitHandler = (event: React.FormEvent) => {
		event.preventDefault();
		const enteredText = settingTextInput.current!.value;
		if (enteredText.trim().length === 0 || enteredText.trim().length > 12) {
			settingTextInput.current!.value = '';
			return ;
		}
		userCtx.changeNickname(enteredText);
		settingTextInput.current!.value = '';
		userCtx.updateImage(preview);
		setPreview(preview);
	}

	const imageChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = event.target.files as FileList;
		setImage(selectedFiles?.[0]);
		setPreview(URL.createObjectURL(selectedFiles?.[0]));
	}

	return (
		<form className={classes.container} onSubmit={submitHandler}>
			<div className={classes.grid}>
				<div className={classes.name}>
					<label htmlFor="text">Nickname</label>
					<input type="text" id="text" ref={settingTextInput} placeholder='12char max'/>
				</div>

				<div className={classes.image}>
					<label htmlFor="profil">
						Change picture
						<div className={classes.imageContent}>
							<img src={preview} alt="" />
						</div>
					</label>
					<input className={classes.file} type="file" name='file' id='profil' onChange={imageChangeHandler}/>
				</div>

				<div className={classes.auth}>
					<label htmlFor="switch"> Double Auth</label>
					<input type="checkbox" id='switch'/>
				</div>
				<div className={classes.submit}>
					<button>Save Change</button>
				</div>
			</div>
		</form>
	)
}

export default ProfilSettings;