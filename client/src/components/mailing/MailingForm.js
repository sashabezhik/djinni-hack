import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'react-bootstrap'
import { useUserInfo } from './UserInfoContext'

export const MailingForm = ({ 
    mailing: { name: mailingName = '', url = '', message: mailingMessage = '', created }
 }) => {
    const [btnEnabled, setBtnEnabled] = useState(false)
    
    const [nameValue, setNameValue] = useState(mailingName)
    const [urlValue, setUrlValue] = useState(url)
    const [messageValue, setMessageValue] = useState(mailingMessage)

    const name = useRef()
    const filterUrl = useRef()
    const message = useRef()
    
    const { addMailing, requestMailings, updateMailing } = useUserInfo()

    useEffect(() => {
        if (created) {
            const enabled = 
                nameValue !== mailingName || urlValue !== url || messageValue !== mailingMessage
                
            setBtnEnabled(enabled)
        }
    }, [nameValue, urlValue, messageValue])   

    const handleSubmit = async (event) => {
        try {
            event.preventDefault()

            const mailingInfo = { 
                name: name.current.value, 
                filterUrl: filterUrl.current.value, 
                message: message.current.value 
            }

            if (created) {
                await updateMailing({...mailingInfo, oldFilterUrl: url})
                setBtnEnabled(false)
            } else {
                await addMailing(mailingInfo)
            }

            await requestMailings()
        } catch (err) {
            if (created) {
                setBtnEnabled(false)
                name.current.value = mailingName
                filterUrl.current.value = url
                message.current.value = mailingMessage
            }
            
            await requestMailings()
            console.log(err.message)
        }
    }

    return (
        <form onSubmit={handleSubmit}>

            <div className='form-group mb-4 mailing-text lato'>
                <label 
                    htmlFor='name'
                    className='mb-2'
                >
                    Name:
                </label>
                <input 
                    type='text'  
                    id='name' 
                    ref={name}
                    defaultValue={mailingName} 
                    className='form-control mailing-input mailing-text lato'
                    onChange={created ? e => setNameValue(e.target.value) : null}
                    required
                />
            </div>

            <div className='form-group mb-4 mailing-text lato'>
                <label 
                    htmlFor='url'
                    className='mb-2'
                >
                    Link:
                </label>
                <input 
                    type='text'  
                    id='url' 
                    ref={filterUrl}
                    defaultValue={url} 
                    className='form-control mailing-input mailing-text lato'
                    onChange={created ? e => setUrlValue(e.target.value) : null}
                    required
                />
            </div>

            <div className='form-group mb-4 mailing-text lato'>
                <label 
                    htmlFor='message' 
                    className='mb-2'
                >
                    Text of the letter:
                </label>
                <textarea 
                    id='message'
                    rows='5'
                    ref={message}
                    defaultValue={mailingMessage}
                    className='form-control mailing-input mailing-text lato'
                    onChange={created ? e => setMessageValue(e.target.value) : null}
                    minLength={250}
                    required
                ></textarea>
            </div>

            {created ? 

                (btnEnabled ? 
                    
                    <div className='d-flex justify-content-end'>

                        <Button 
                            type='submit'
                            className='lato mailing-save-btn ml-auto'
                        >
                            Save
                        </Button>

                    </div> 

                : null) 

            : 

                <div className='d-flex justify-content-end'>

                    <Button 
                        type='submit'
                        className='lato mailing-save-btn ml-auto'
                    >
                        Save
                    </Button>

                </div>

            }
            
        </form>
    )
}