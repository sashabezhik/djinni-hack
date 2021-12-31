import React from 'react'
import { MailingHeader } from './MailingHeader'
import { MailingBody } from './MailingBody'

export const Mailing = ({ index, mailingInfo }) => (
    <div className='accordion-item'>

        <MailingHeader 
            idx={index} 
            mailing={mailingInfo} 
        />

        <MailingBody 
            idx={index} 
            mailing={mailingInfo} 
        />
    
    </div>
)

