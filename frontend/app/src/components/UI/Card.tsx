import React from "react";
import classes from '../../sass/components/UI/Card.module.scss';

type Props = {
    children?: React.ReactNode,
    className?: string
};

const Card: React.FC<Props> = ({ children, className }) => {
    return (
        <div className={`${classes.card} ${className}`}>
            {children}
        </div>
    );
}

export default Card;
