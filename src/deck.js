import React, { useEffect, useState, useRef } from "react";
import Card from "./card";
import axios from "axios";

function Deck () {
    const [deck, setDeck] = useState(null);
    const [drawn, setDrawn] = useState([]);
    const [autoDraw, setAutoDraw] = useState(false);
    const timer = useRef(null);

    useEffect(() => {
        async function getDeck() {
            let res = await axios.get(`http://deckofcardsapi.com/api/deck/new/shuffle/`);
            setDeck(res.data);
        }
        getDeck();
    }, [setDeck]);

    useEffect(() => {
        async function getCard() {
            let { deck_id } = deck
            try {
                let res = await axios.get(`http://deckofcardsapi.com/api/deck/${deck_id}/draw`)
                 
                if (res.data.remaining === 0) {
                    setAutoDraw(false)
                    throw new Error("No more card's in deck!")
                } 
                setDrawn((d) => [
                    ...d, {
                        id: res.data.cards[0].code,
                        name: res.data.cards[0].suit + " " + res.data.cards[0].value,
                        image: res.data.cards[0].image
                    }
                ])
            } catch (err) {
                console.error(err)
            }
        }
        if (autoDraw && !timer.current) {
            timer.current = setInterval(async () => {
                await getCard();
            }, 1000);
        }
        return () => {
            clearInterval(timer.current);
            timer.current = null;
        };

    }, [autoDraw, setAutoDraw, deck])

    const cards = drawn.map(c => (
        <Card key={c.id} name={c.name} image={c.image} />
    ));
    
    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto);
    }

    return (
        <div className="m-2">
            <button className="btn-primary btn" onClick={toggleAutoDraw}>
                {autoDraw ? "Stop" : "Start"} Drawing
            </button>
            <div className="m-5">{cards}</div>
        </div>
    )
}

export default Deck
