import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/eventSlice';

const category = [
    "Developer",
    "Painter",
    "Freelancer",
    "Graphic Designer",
    "Carpentry"
];

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    };

    return (
        <div>
            <Carousel className="w-full max-w-xl mx-auto my-20">
                <CarouselContent>
                    {category.map((cat, index) => (
                        <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={index}>
                            <Button 
                                onClick={() => searchJobHandler(cat)} 
                                variant="outline" 
                                className="rounded-full text-[#4FC3F7] border-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white transition-colors duration-300"
                            >
                                {cat}
                            </Button>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Light Blue Carousel Navigation Buttons */}
                <CarouselPrevious 
                    className="text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white transition-colors duration-300" 
                />
                <CarouselNext 
                    className="text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white transition-colors duration-300" 
                />
            </Carousel>
        </div>
    );
};

export default CategoryCarousel;
