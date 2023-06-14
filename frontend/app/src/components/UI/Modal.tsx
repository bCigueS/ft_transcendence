import React from "react";
import classes from '../../sass/components/UI/Modal.module.scss';
import Card from "./Card";

type Props = {
    children?: React.ReactNode,
    className?: string
};

const Modal: React.FC<Props> = ({ children, className }) => {
    return (
        <div>
        <div className={classes.backdrop}/>
        <Card className={classes.modal}>
            <h1>Modal</h1>
        </Card>
        </div>
    );
}

export default Modal;