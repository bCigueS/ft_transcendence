import React, { useRef, useContext } from 'react';
import { User, UserContext } from '../../store/users-contexte';

const ProfilSettings: React.FC<{user: User}> = ( props ) => {

	const userCtx = useContext(UserContext);
	const settingTextInput = useRef<HTMLInputElement>(null);

	const submitHandler = (event: React.FormEvent) => {
		event.preventDefault();
		const enteredText = settingTextInput.current!.value;
		if (enteredText.trim().length === 0) {
			return ;
		}
		userCtx.changeNickname(enteredText);
		settingTextInput.current!.value = '';
	}

	return (
		<form onSubmit={submitHandler}>

			<label htmlFor="text">Nickname</label>
			<input type="text" id="text" ref={settingTextInput} />

			<button>Save Change</button>
		</form>
	)
}

export default ProfilSettings;