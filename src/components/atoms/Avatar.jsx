import React from 'react'
import {useSelector} from "react-redux";
import './Avatar.css'


const Avatar = (props) => {
    let avatar = props?.avatar || '';
    let size = props?.size || 10;

    if (!avatar?.startsWith('data:')) {
        avatar = useSelector(state => state.auth.user?.avatar) || '';
    }
    console.log('Avatar: ', avatar)

    if (avatar?.length < 10) {
        return (
            <div className='avatar-wrapper' style={{
                width: `${size}px`,
                height: `${size}px`
            }}>

            </div>
        )
    }

    return (
        <div className='avatar-wrapper' style={{
            width: `${size}px`,
            height: `${size}px`
        }}>
            <img src={avatar} alt='avatar-image' className='avatar-image'/>
        </div>
    )
}

export default Avatar;