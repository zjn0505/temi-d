import database from '../../../firebase/clientApp';
import {
    ref,
    get,
    child,
    set
} from "firebase/database";

function registerUserToHotel(user, hotelId) {
    const userId = user.phone
    return get(child(ref(database), `users/${hotelId}/${userId}`)).then((snapshot) => {
        if (snapshot.exists()) {
        console.log("User has registered to this hotel, to make it simple, we override it"); // TODO Notify web that the user already exist in this hotel
          console.log(snapshot.val());
          return set(ref(database, `users/${hotelId}/${userId}`), user)
        } else {
          console.log("User hasn't registered to this hotel");
          return set(ref(database, `users/${hotelId}/${userId}`), user)
        }
      }).catch((error) => {
        console.error(error);
      });
}

export default function handler(req, res) {
    if (req.method === 'POST') {
        console.log("req =" + JSON.stringify(req.body))
        let hotelId = req.body.hotelId
        let user = req.body.user
        let userId = req.body.user.phone
        if (hotelId && user && userId) {
            console.log(`hotel ${hotelId}`)
            registerUserToHotel(user, hotelId)
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