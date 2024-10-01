import React from 'react'
import Card3 from '../components/card3'
import PayBox from '../components/payBox'

export default function payment() {
    return (
        <div className='p-5'>
            <Card3 />
            <Card3 />
            <PayBox/>
        </div>
    )
}
