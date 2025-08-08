import React from 'react';
import contactImage from '../../../../assets/images/image7.jpg'

const ContactUs = () => {
    return (
        <>
            <div className='py-36 space-y-5'>
                <h1 className='text-4xl italic text-center'>"Let’s Save Lives Together"</h1>
                <h1 className='text-4xl italic text-center '>"You don’t need a cape to be a hero — just roll up <br/> your sleeve and donate blood today."</h1>
            </div>
            <div>
                <section
                    className="h-[65vh] bg-fixed bg-center bg-cover flex justify-center"
                    style={{ backgroundImage: `url(${contactImage})` }}
                >
                    <div className='text-center flex flex-col items-center pt-26'>
                        <h1 className="text-white text-5xl italic">Give Blood, Give Hope</h1>
                        <div className='border-b w-4/5 md:w-100 border-white mt-5 mb-7'></div>
                        <p className=' text-white text-xl'>Your donation matters. Help hospitals, emergency services, <br/> and people in crisis by giving the gift that flows from the heart.</p>
                    </div>
                </section>

            </div>
        </>
    );
};

export default ContactUs;