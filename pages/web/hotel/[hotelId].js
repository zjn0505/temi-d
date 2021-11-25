import database from '../../../firebase/clientApp';
import {
    ref,
    onValue,
} from "firebase/database";
import { useState } from 'react';

function getHotelData(hotelId) {
    return new Promise((res, rej) => {
        onValue(ref(database, '/hotel/' + hotelId), (snapshot) => {
            const hotel = snapshot.val();
            res(hotel)
        }, {
            onlyOnce: true
        });
    })
}
function submitForm (obj){
    fetch('/api/web/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'content-type': 'application/json',
        }
    })
}
export async function getServerSideProps({params}) {
    const { hotelId } = params
    const hotel = await getHotelData(hotelId)
    return {
      props: {
        hotel,
        hotelId,
      },
    }
  }

  export default function RegisterPage ({hotel, hotelId}) {
    const [floor, setFloor] = useState(null)
    const [location, setLocation] = useState('')
    const [userName, setUserName] = useState('')
    const [tel, setTel] = useState('')

    const floorList = hotel.locations.map(({floor}) => {
        return <option key={floor} value={floor}>{floor}层</option>
    })
    const locations = () => {
        const currFloor = hotel.locations.find(item => item.floor === floor)
        if(currFloor){
            return currFloor.locations.filter(loc => !['elevator', 'elevator door'].includes(loc)).map((loc, index) => {
                return <option key={index + loc} value={loc}>{loc}</option>
            })
        } else return []
    }
    const submitHandler = () => {
        const payload = {
            "hotelId": hotelId,
            "user": {
                "name": userName,
                "phone": tel,
                "floor": floor,
                "location": location
            }
        }
        submitForm(payload)
    }
    return (
        <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-lg-6">
                <title>Register</title>
                <h1>Register</h1>
                <div className="input-group mb-3 mt-3">
                    <span className="input-group-text" id="basic-addon1">姓名</span>
                    <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" onChange={(e) => setUserName(e.target.value)}/>
                </div>
                <div className="input-group mb-3 mt-3">
                    <span className="input-group-text" id="basic-addon1">手机</span>
                    <input type="tel" className="form-control" placeholder="Phone" aria-label="Phone" aria-describedby="basic-addon1" onChange={(e) => setTel(e.target.value)}/>
                </div>
                <select className="form-select mb-3 mt-3" defaultValue="null" aria-label="select floor" onChange={(e) => setFloor(e.target.value)}>
                    <option value="null" disabled>楼层</option>
                    {floorList}
                </select>
                <select className="form-select mb-3 mt-3" defaultValue="null" aria-label="select location" onChange={(e) => setLocation(e.target.value)}>
                    <option value="null" disabled>地点</option>
                    {locations()}
                </select>
                <button className="btn btn-primary" onClick={submitHandler}>提交</button>
            </div>
        </div>
    )
}
