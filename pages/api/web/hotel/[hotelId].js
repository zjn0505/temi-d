import database from '../../../../firebase/clientApp';
import {
    ref,
    onValue
} from "firebase/database";

function getHotelData(hotelId, callback) {
    return onValue(ref(database, '/hotel/' + hotelId), (snapshot) => {
        const hotel = snapshot.val();
        callback(hotel)
    }, {
        onlyOnce: true
    });
}

export default function handler(req, res) {
    if (req.method === 'GET') {
        // console.log("req =" + JSON.stringify(req.body))
        let { hotelId } = req.query
        if (hotelId) {
            console.log(`hotel ${hotelId}`)
            getHotelData(hotelId, (hotel) => {
                hotel.hotelId = hotelId
                res.status(200).json(hotel)
                // TODO return html
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