/*
    Created by Warren Goodson
*/
import React from 'react';

import styles from './CloseButton.module.css';

const closeButton = (props) => {


    return (
        <div className={styles.CloseButton} onClick={props.closeSidebar}>
            <div className={styles.svgDiv}>
                <svg viewBox={"0 0 20 20"}>
                    <line x1={"4"} y1={"4"}
                          x2={"16"} y2={"16"}
                          stroke={"#f5b971"}
                          strokeWidth={2}
                          opacity={"0.8"}
                    />
                    <line x1={"16"} y1={"4"}
                          x2={"4"} y2={"16"}
                          stroke={"#f5b971"}
                          strokeWidth={2}
                          opacity={"0.8"}
                    />
                </svg>
            </div>
        </div>
    );
}

export default closeButton;