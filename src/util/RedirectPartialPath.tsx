import { Navigate, Outlet, useLocation } from 'react-router-dom';
import React from 'react';

type RedirectPartialPathProps = {
  from: string[];
  to: string;
};

export function RedirectPartialPath(props: RedirectPartialPathProps) {
  const location = useLocation();

  return (
    <>
      {props.from.includes(location.pathname) && (
        <Navigate replace to={props.to} />
      )}
      <Outlet />
    </>
  );
}
