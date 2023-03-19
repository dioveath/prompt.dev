import React from 'react'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Container({ children, ...props } : ContainerProps) {
  const { className, ...rest } = props;
  const classStyles = 'px-4 sm:px-8 md:px-16 lg:px-24' + (props.className ? ` ${props.className}` : '');
  return (
    <div className={classStyles} {...rest}>
        { children }
    </div>
  );
}
