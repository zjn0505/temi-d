import database from '../../firebase/clientApp';
import { ref, set, onValue } from "firebase/database";

function writeUserData(userId, name, email, imageUrl) {
    set(ref(database, 'users/' + userId), {
        username: name,
        email: email,
        profile_picture: imageUrl
    });
}

function getAllData(res) {
    return onValue(ref(database, '/users/' + "001"), (snapshot) => {
        const username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        console.log(username)
        res.status(200).json({
            name: 'John Doe'
        })
        return username
      }, {
        onlyOnce: true
      });
}

export default function handler(req, res) {
    // writeUserData("002", "charlie", "zjn0505@hotmail.com", "https://www.baidu.com")
    // res.status(200).json({
    //     name: 'John Doe'
    // })

    let data = getAllData(res)
    console.log("data =" )
    console.log(data)
}