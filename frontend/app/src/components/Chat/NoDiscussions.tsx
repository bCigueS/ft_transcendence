import classes from './../../sass/components/Chat/NoDiscussions.module.scss';

const NoDiscussions = () => {
    return (
        <div className={classes.container}>

            <div className={classes.noconvo}>
                
                    Go to leaderbord to find users to chat with or click on the add button to create a group.
            </div>
        </div>
    )
}

export default NoDiscussions;