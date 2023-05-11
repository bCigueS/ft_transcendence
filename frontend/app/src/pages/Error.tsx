import Nav from "../components/Nav/Nav";

import classes from '../sass/pages/Error.module.scss';

export default function Error() {
	return (
		<>
			<Nav/>
			<main>
				<div className={classes.container}>
					<h1>An error occured!</h1>
					<p>Could not find this page!</p>
				</div>
			</main>
		</>
	)
}