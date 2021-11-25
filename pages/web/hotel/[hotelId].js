import database from '../../../firebase/clientApp';
import {
    ref,
    onValue
} from "firebase/database";

import { useRouter } from 'next/router'

function getHotelData(hotelId, callback) {
    return onValue(ref(database, '/hotel/' + hotelId), (snapshot) => {
        const hotel = snapshot.val();
        callback(hotel)
    }, {
        onlyOnce: true
    });
}

const RegisterPage = () => {
    const router = useRouter()
    const { hotelId } = router.query

    getHotelData(hotelId, (hotel) => {
        // res.status(200).json(hotel)
        // TODO return html
        console.log(`${JSON.stringify(hotel)}`)
        return <p> Post: { JSON.stringify(hotel) } </p>
    })

    console.log(hotelId)
    // return <p> Post: { hotelId } </p>
}


export async function getServerSideProps({ params }) {
    console.log(`https://.../posts/${params.hotelId}`)
    const res = await fetch(`https://.../posts/${params.id}`)
    const post = await res.json()
  
    // Pass post data to the page via props
    return { props: { post } }
  }

export default RegisterPage

// export default function handler(req, res) {
//     if (req.method === 'GET') {
//         // console.log("req =" + JSON.stringify(req.body))
//         let { hotelId } = req.query
//         if (hotelId) {
//             console.log(`hotel ${hotelId}`)
            
//         } else {
//             res.status(400).json({
//                 error: "invalid param"
//             })
//         }

//     } else {
//         res.status(405).send()
//     }
// }