import React from 'react';
import Banner from '../../../components/Banner/Banner';
import SaveLife from '../sections/SaveLife';
import Services from '../sections/Services';
import ContactUs from '../sections/Contact/ContactUs';
import Contact from '../sections/Contact/Contact';
import HowItWorks from '../sections/HowItWorks';

const Home = () => {
    return (
        <div className=''>
            <section>
                <Banner></Banner>
            </section>
            {/* SaveLife Section */}
            <section className='mx-0 md:mx-10 xl:mx-[362px]'>
                <SaveLife></SaveLife>
            </section>
            {/* Services Section */}
            <section>
                <Services></Services>
            </section>
            {/* How it works */}
            <section>
                <HowItWorks></HowItWorks>
            </section>
            {/* Contact Section */}
            <section>
                <ContactUs></ContactUs>
            </section>
            {/* Contact Form */}
            <section className='mb-36 xl:mx-96 lg:-mt-52'>
                <Contact></Contact>
            </section>
        </div>
    );
};

export default Home;