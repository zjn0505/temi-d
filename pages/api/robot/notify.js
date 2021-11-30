import database from '../../../firebase/clientApp';
import sendSMS from '../../../alicloud/sms';
import {
    ref,
    onValue,
    query
} from "firebase/database";

function notifyUserInHotel(userId, hotelId, callback) {
    console.log("hotel Id, " + hotelId)
    onValue(ref(database, `users/${hotelId}/${userId}`), (snapshot) => {
        callback(snapshot.val())
    }, {
        onlyOnce: true
    })
}

export default function handler(req, res) {
    console.log("hello")
    if (req.method === 'POST') {
        let hotelId = req.body.hotelId
        let userId = req.body.userId

        if (hotelId && userId) {
            console.log(`hotel ${hotelId}, user ${userId}`)
            notifyUserInHotel(userId, hotelId, (user) => {
                if (user) {
                    fetch(`https://sc.ftqq.com/${process.env.SERVERCHAN_APP_KEY}.send?text=${user.phone}-${Date.now()}`)
                        .then(() => {
                            res.status(200).json(user)
                        })
                    sendSMS(user.phone, user.name, user.location)    
                } else {
                    res.status(400).json({
                        error: "invalid user"
                    })
                }
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