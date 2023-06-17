import { useState } from "react";
import classes from './../../sass/components/Chat/ManageChats.module.scss';

import CreateGroup from "./CreateGroup";

const ManageChats = () => {

    const [ showAddModal, setShowAddModal ] = useState(false);

    const handleAddClick = () => {
        setShowAddModal(true);
    }

    const handleUserConfirmation = () => {
        setShowAddModal(false);
    }

    return (
        <>
        {
            showAddModal && 
            <CreateGroup 
                title="Create a group"
				message="Select user for your group"
				onCloseClick={handleUserConfirmation}
				onDelete={handleUserConfirmation}
            />
        }
            <div className={classes.container}>
				<h3>
                    Discussions
                </h3>
                <div className={classes.add}>
                    <i 
                    className='fa-solid fa-add'
                    onClick={handleAddClick}
                    ></i>
                </div>
            </div>

        </>

    );
}

export default ManageChats;