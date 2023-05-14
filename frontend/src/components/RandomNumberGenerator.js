import { useState, useEffect } from "react";

const RandomNumberGenerator = () => {
    const [randomNumber, setRandomNumber] = useState(null);

    useEffect(() => {
        setRandomNumber(generateRandomNumber());
    }, []);

    function generateRandomNumber() {
        return Math.floor(Math.random() * 100) + 1;
    }

    function handleButtonClick() {
        setRandomNumber(generateRandomNumber());
    }

    return (
        <div>
            <h1>Random Number Generator</h1>
            {randomNumber !== null ? (
                <p>Your random number is: {randomNumber}</p>
            ) : (
                <p>Loading...</p>
            )}
            <button onClick={handleButtonClick}>Generate New Number</button>
        </div>
    );
};

export default RandomNumberGenerator;
