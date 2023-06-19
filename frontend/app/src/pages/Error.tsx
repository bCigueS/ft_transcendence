import React from "react";
import Nav from "../components/Nav/Nav";

import classes from '../sass/pages/Error.module.scss';
import { useRouteError } from "react-router-dom";

const Error: React.FC = () => {

	const error: any = useRouteError();

	let title = 'An error occured!';
	let message = 'Something went wrong!';

	if (error.status === 500) {
		message = error.data.message;
	}

	if (error.status === 404) {
		title = 'Not Found!';
		message = 'Could not find ressource or page.';
	}

	return (
		<>
			<Nav/>
			<main>
				<div className={classes.container}>
					<h1>{title}</h1>
					<p>{message}</p>
				</div>
			</main>
		</>
	)
}

export default Error;