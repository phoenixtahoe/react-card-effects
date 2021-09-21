import React, { useState } from "react";
import './card.css'

function Card (props) {
    const {name, image} = props

    const [{angle, x, y}] = useState({
        angle: Math.random() * 90 - 45,
        x: Math.random() * 40 - 20,
        y: Math.random() * 40 - 20
    })

    const style = `translate(${x}px, ${y}px) rotate(${angle}deg)`

    return <img className="card-draw" alt={name} src={image} style={{transform: style}}/>
}

export default Card