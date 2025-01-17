import React from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import { Star } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';



const TestimonialsSection = () => {
  const testimonialSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <section id="testimonials" className="welcome-section welcome-testimonials-section">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="welcome-testimonials-content"
      >
        <h2>Client Testimonials</h2>
        <Slider {...testimonialSettings} className="welcome-testimonial-slider">
          <TestimonialCard 
            rating={5}
            quote="An incredible system that transformed our client management process with its intuitive design and powerful features."
            name="John Doe"
            company="CEO, TechCorp Solutions"
          />
          <TestimonialCard 
            rating={4}
            quote="Perfect solution for tracking policies and managing agent assignments. Highly recommend for streamlining operations."
            name="Jane Smith"
            company="Operations Manager, Global Enterprises"
          />
          <TestimonialCard 
            rating={5}
            quote="ClientPro has revolutionized how we manage client relationships. Exceptional tool with remarkable efficiency."
            name="Michael Chen"
            company="Director, Innovation Partners"
          />
        </Slider>
      </motion.div>
    </section>
  );
};

const TestimonialCard = ({ rating, quote, name, company }) => (
  <div className="welcome-testimonial-card">
    <div className="welcome-testimonial-stars">
      {[...Array(5)].map((_, index) => (
        <Star 
          key={index} 
          size={20} 
          fill={index < rating ? '#FFD700' : 'none'}
          color={index < rating ? '#FFD700' : '#888'}
          stroke={index < rating ? '#FFD700' : '#888'}
        />
      ))}
    </div>
    <p>{quote}</p>
    <div className="welcome-testimonial-author">
      <span>{name}</span>
      <span>{company}</span>
    </div>
  </div>
);


export default TestimonialsSection;