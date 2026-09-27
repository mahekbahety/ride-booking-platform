import { createContext, useState } from 'react';

export const CaptainDataContext = createContext();

const CaptainContext = ({ children }) => {

    const [captain, setCaptainState] = useState(() => {
        const savedCaptain = localStorage.getItem('captain');

        if (savedCaptain) {
            try {
                return JSON.parse(savedCaptain);
            } catch (error) {
                localStorage.removeItem('captain');
                return null;
            }
        }

        return null;
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    const setCaptain = (captainData) => {

        setCaptainState(captainData);

        if (captainData) {
            localStorage.setItem(
                'captain',
                JSON.stringify(captainData)
            );
        } else {
            localStorage.removeItem('captain');
        }
    };


    const updateCaptain = (captainData) => {

        setCaptainState(captainData);

        if (captainData) {
            localStorage.setItem(
                'captain',
                JSON.stringify(captainData)
            );
        }
    };


    const value = {
        captain,
        setCaptain,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateCaptain
    };


    return (
        <CaptainDataContext.Provider value={value}>
            {children}
        </CaptainDataContext.Provider>
    );
};

export default CaptainContext;