import React from 'react';
import './HeaderIdentityBox.css';
import {useSelector} from "react-redux";
import Avatar from "../atoms/Avatar.jsx";


const HeaderIdentityBox = () => {

    let myName = useSelector(state => state.auth?.user?.fullName) || '';

    return (
        <div className='header-identity__wrapper'>
            <Avatar avatar={'mine'} size={'38'}/>
            <div className='my-name'>{myName}</div>
        </div>
    )
}


export default HeaderIdentityBox;


