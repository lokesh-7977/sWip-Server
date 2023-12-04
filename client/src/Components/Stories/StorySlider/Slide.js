import React from "react";
import styles from './StorySlider.module.css';


const Slide = ({slides, imgIndex}) => {

    return (
        <div className={styles.slidesContainer}>
            {slides && slides.map((slide, index) => (
                <div className={styles.slides} key={`s-${index}`}>
                    <img
                        className={styles.slidesImage}
                        key={slide._id}
                        style={{
                            display: index === imgIndex ? "block" : "none",

                        }}
                        src={slide?.imageUrl}
                        alt={`Slide ${index}`}
                    />
                    <div className={styles.slideText} style={{display: index === imgIndex ? "block" : "none"}}>
                        <h1 className={styles.slideHeading}>{slide?.heading}</h1>
                        <p className={styles.slidePara}>{slide?.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Slide;