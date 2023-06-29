import React from 'react';

import classes from '../../sass/components/Auth/OtpInput.module.scss';

type Props = {
	value: string;
	valueLength: number;
	onChange: (value: string) => void;
};

const OtpInput: React.FC<Props> = ({ value, valueLength, onChange }) => {
// const OtpInput: React.FC = () => {
	return (
		<div className={classes.otpGroup}>
			{[1, 2, 3, 4, 5, 6].map((digit, idx) => (
				<input
					type="text"
					key={idx}
					inputMode="numeric"
					autoComplete="one-time-code"
					pattern="\d{1}"
					maxLength={6}
					className={classes.input}
					value={digit}
				/>
			))}
		</div>
	);
};

export default OtpInput;
