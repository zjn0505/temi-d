import database from '../../../firebase/clientApp';
import {
    ref,
    set
} from "firebase/database";

function writeHotelLocation(hotel, locations) {
    return set(ref(database, 'hotel/' + hotel), {
        locations: locations
    });
}

export default function handler(req, res) {
    if (req.method === 'POST') {
        // console.log("req =" + JSON.stringify(req.body))
        let hotelId = req.body.hotelId
        let locations = req.body.locations
        if (hotelId && locations) {
            console.log(`hotel ${hotelId}`)
            writeHotelLocation(hotelId, locations)
                .then(() => {
                    res.status(200).send()
                })
                .catch(() => {
                    res.status(500).json({
                        error: 'failed to update data'
                    })
                })
        } else {
            res.status(400).json({
                error: "invalid param"
            })
        }

    } else {
        res.status(405).send()
    }
}