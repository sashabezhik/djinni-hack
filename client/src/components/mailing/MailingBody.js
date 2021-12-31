import React from 'react'
import { MailingForm } from './MailingForm'

export const MailingBody = ({ idx, mailing }) => {
    return (
        <div 
            id={`collapse-${idx}`} 
            className='accordion-collapse collapse'
            aria-labelledby={`heading-${idx}`}
            data-bs-parent='#accordion'
        >

            <div className='accordion-body collapsed'>

                <MailingForm mailing={mailing} />
                
            </div>
            
        </div>
    )
}