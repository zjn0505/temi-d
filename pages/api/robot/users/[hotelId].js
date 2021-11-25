import database from '../../../../firebase/clientApp';
import {
    ref,
    onValue,
    query
} from "firebase/database";

function getHotelUserData(hotelId, callback) {
    console.log("hotel Id, " + hotelId)
    let queryRef = query(ref(database, `users/${hotelId}`));

    onValue(queryRef, (snapshot) => {
        callback(snapshot.val())
      }, {
        onlyOnce: true
      })
}

export default function handler(req, res) {
    console.log("hello")
    if (req.method === 'GET') {
        let hotelId  = req.query.hotelId

        if (hotelId) {
            console.log(`hotel ${hotelId}`)
            getHotelUserData(hotelId, (users) => {
                res.status(200).json(Object.keys(users).map(key => users[key]))
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