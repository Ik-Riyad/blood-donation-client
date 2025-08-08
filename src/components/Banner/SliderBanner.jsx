import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import banner1 from '../../../assets/banner/banner1.avif'
import banner2 from '../../../assets/banner/banner2.avif'
import banner3 from '../../../assets/banner/banner3.avif'

const SliderBanner = () => {
    return (
        <Carousel autoPlay={true} infiniteLoop={true} showThumbs={false}>
                <div>
                    <img src={banner1} className="h-[800px] w-full object-cover"/>
                </div>
                <div>
                    <img src={banner2} className="h-[800px] w-full object-cover"/>
                </div>
                <div>
                    <img src={banner3} className="h-[800px] w-full object-cover"/>
                </div>
            </Carousel>
    );
};

export default SliderBanner;