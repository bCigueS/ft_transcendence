

const Layout = () => {

	const items = [ 
		{
			label: 'profile',
			href: '/profile',
		},
		{
			label: 'chat',
			href: '/chat',
		},
		{
			label: 'pong',
			href: '/pong',
		}
	];

	return (
		<div className="container">
			<div className="header_container">
				<div className="logo">
					<div className="logo_square">

					</div>
					<div className="logo_name">
						pong
					</div>
				</div>
				<div className="avatar">
					<div className="avatar_picture">
						<img src="/assets/avatar.jpg" width="30" height="30" />
					</div>
					<div className="avatar_name">
						name
					</div>
				</div>
			</div>
			<div className="main_container">
				<div className="menu_bar">
					{
						items.map((item) => (
							<div className="menu_item">
								{item.label}	
							</div>
						))
					}
				</div>
			</div>
			<div className="game_container">placeholder</div>
		</div>
	);
}

export default Layout;