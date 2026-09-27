const axios = require('axios');
const captainModel = require('../models/captain.model');

const NOMINATIM_URL =
    'https://nominatim.openstreetmap.org/search';

const PHOTON_URL =
    'https://photon.komoot.io/api/';

const OSRM_URL =
    'https://router.project-osrm.org/route/v1/driving';


// =========================
// CONFIG
// =========================


const USER_AGENT = 'UberClonePractice/1.0';

const NOMINATIM_MIN_GAP_MS = 1100;

const INDIA_BBOX =
    '68.1,6.5,97.4,35.7';


// =========================
// HELPERS
// =========================

class HttpError extends Error {

    constructor(message, status = 500) {
        super(message);
        this.status = status;
    }
}


const sleep = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));


// =========================
// CACHE
// =========================

const geocodeCache = new Map();


// =========================
// NOMINATIM THROTTLE
// =========================

let lastNominatimCall = 0;

const throttleNominatim = async () => {

    const wait =
        lastNominatimCall +
        NOMINATIM_MIN_GAP_MS -
        Date.now();

    if (wait > 0) {
        await sleep(wait);
    }

    lastNominatimCall = Date.now();
};


// =========================
// NOMINATIM
// =========================

const geocodeNominatim = async (query) => {

    await throttleNominatim();

    const { data } = await axios.get(
        NOMINATIM_URL,
        {
            params: {
                q: query,
                format: 'json',
                limit: 1,
                countrycodes: 'in'
            },

            headers: {
                'User-Agent': USER_AGENT
            },

            timeout: 8000
        }
    );


    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {
        return null;
    }


    return {

        // Nominatim property is "lat"
        // We keep "ltd" because your captain schema
        // currently uses ltd.

        ltd: Number(data[0].lat),

        lng: Number(data[0].lon)
    };
};


// =========================
// PHOTON
// =========================

const geocodePhoton = async (query) => {

    const { data } = await axios.get(
        PHOTON_URL,
        {
            params: {
                q: query,
                limit: 1,
                lang: 'en',
                bbox: INDIA_BBOX
            },

            timeout: 8000
        }
    );


    const feature =
        data &&
        data.features &&
        data.features[0];


    if (!feature) {
        return null;
    }


    return {

        ltd: Number(
            feature.geometry.coordinates[1]
        ),

        lng: Number(
            feature.geometry.coordinates[0]
        )
    };
};


// =========================
// ADDRESS → COORDINATES
// =========================

module.exports.getAddressCoordinate =
    async (address) => {

        if (
            !address ||
            typeof address !== 'string' ||
            !address.trim()
        ) {
            throw new HttpError(
                'Address is required',
                400
            );
        }


        const cleanAddress =
            address.trim();


        const cacheKey =
            cleanAddress.toLowerCase();


        // Return cached result
        if (geocodeCache.has(cacheKey)) {

            return geocodeCache.get(cacheKey);
        }


        // Example:
        // Sheryians Coding School, Bhopal, MP, India
        //
        // fallback:
        // Bhopal, MP, India

        const parts =
            cleanAddress
                .split(',')
                .map(p => p.trim())
                .filter(Boolean);


        const shortened =
            parts.length > 1
                ? parts.slice(1).join(', ')
                : null;


        const attempts = [

            {
                name: 'Nominatim full',

                run: () =>
                    geocodeNominatim(
                        cleanAddress
                    )
            },

            {
                name: 'Photon full',

                run: () =>
                    geocodePhoton(
                        cleanAddress
                    )
            }

        ];


        if (shortened) {

            attempts.push({

                name: 'Nominatim shortened',

                run: () =>
                    geocodeNominatim(
                        shortened
                    )

            });
        }


        for (const attempt of attempts) {

            try {

                const result =
                    await attempt.run();


                if (result) {

                    geocodeCache.set(
                        cacheKey,
                        result
                    );


                    console.log(
                        `[geocode] ${attempt.name}:`,
                        result
                    );


                    return result;
                }


                console.warn(
                    `[geocode] ${attempt.name}: no result`
                );


            } catch (err) {

                console.error(
                    `[geocode] ${attempt.name} failed:`,
                    err.message
                );
            }
        }


        throw new HttpError(
            `Location not found: ${cleanAddress}`,
            404
        );
    };


// =========================
// DISTANCE + TIME
// =========================

module.exports.getDistanceTime =
    async (origin, destination) => {

        if (!origin || !destination) {

            throw new HttpError(
                'Origin and destination are required',
                400
            );
        }


        // Geocode pickup
        const originCoordinates =
            await module.exports.getAddressCoordinate(
                origin
            );


        // Geocode destination
        const destinationCoordinates =
            await module.exports.getAddressCoordinate(
                destination
            );


        console.log(
            'Origin coordinates:',
            originCoordinates
        );


        console.log(
            'Destination coordinates:',
            destinationCoordinates
        );


        // OSRM
        const url =
            `${OSRM_URL}/` +
            `${originCoordinates.lng},${originCoordinates.ltd};` +
            `${destinationCoordinates.lng},${destinationCoordinates.ltd}`;


        console.log(
            'OSRM URL:',
            url
        );


        let response;


        try {

            response = await axios.get(
                url,
                {
                    params: {
                        overview: false
                    },

                    timeout: 15000
                }
            );


        } catch (error) {

            console.error(
                'OSRM error:',
                error.response?.data ||
                error.message
            );


            throw new HttpError(
                'Routing service unavailable',
                502
            );
        }


        if (
            !response.data ||
            response.data.code !== 'Ok' ||
            !response.data.routes ||
            response.data.routes.length === 0
        ) {

            throw new HttpError(
                'Route not found',
                404
            );
        }


        const route =
            response.data.routes[0];


        return {

            distance: {

                value: route.distance,

                text:
                    `${(
                        route.distance / 1000
                    ).toFixed(2)} km`
            },


            duration: {

                value: route.duration,

                text:
                    `${Math.round(
                        route.duration / 60
                    )} mins`
            }
        };
    };


// =========================
// AUTOCOMPLETE
// =========================

module.exports.getAutoCompleteSuggestions =
    async (input) => {

        if (
            !input ||
            typeof input !== 'string' ||
            !input.trim()
        ) {

            throw new HttpError(
                'Query is required',
                400
            );
        }


        try {

            const response =
                await axios.get(
                    PHOTON_URL,
                    {
                        params: {

                            q: input.trim(),

                            limit: 8,

                            lang: 'en',

                            bbox: INDIA_BBOX
                        },

                        timeout: 8000
                    }
                );


            const features =
                response.data.features || [];


            return features.map(place => {

                const p =
                    place.properties || {};


                return {

                    address:
                        p.name || '',

                    city:
                        p.city ||
                        p.county ||
                        '',

                    state:
                        p.state || '',

                    country:
                        p.country || '',

                    ltd:
                        Number(
                            place.geometry.coordinates[1]
                        ),

                    lng:
                        Number(
                            place.geometry.coordinates[0]
                        )
                };
            });


        } catch (error) {

            console.error(
                'Photon error:',
                error.response?.data ||
                error.message
            );


            throw new HttpError(
                'Autocomplete service unavailable',
                502
            );
        }
    };


// =========================
// CAPTAINS IN RADIUS
// =========================
module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    if (typeof ltd !== 'number' || typeof lng !== 'number' || typeof radius !== 'number') {
        throw new HttpError('Invalid coordinates or radius', 400);
    }

    const captains = await captainModel.find({
        socketId: { $exists: true, $ne: null }
    });

    return captains;
};