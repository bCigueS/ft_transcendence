import React from 'react';

import classes from '../../sass/components/UI/Button.module.scss';

type Props = {
    className?: string,
	onClick: () => void
    children?: React.ReactNode,
};

const Button: React.FC<Props> = (props) => {
  return (
    <button
      className={classes.button}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;