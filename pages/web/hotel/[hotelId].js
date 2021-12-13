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
async function submitForm (obj){
    try {
        const response = await fetch('/api/web/register', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`, {cause: response })
        return true
    } catch (err){
        console.error(err)
        if(err.cause){
            err.cause.json().then(data => {
                console.error(data.error)
            })
        }
        return false
    }
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
    const [showAlert, setShowAlert] = useState(null)

    const floorList = hotel.locations.map(({floor}) => {
        return <option key={floor} value={floor}>{floor}层</option>
    })
    const locations = () => {
        const currFloor = hotel.locations.find(item => item.floor === floor)
        if(currFloor){
            return currFloor.locations.filter(loc => !['elevator', 'elevator door', 'home base'].includes(loc)).map((loc, index) => {
                return <option key={index + loc} value={loc}>{loc}</option>
            })
        } else return []
    }
    const submitHandler = async () => {
        const payload = {
            "hotelId": hotelId,
            "user": {
                "name": userName,
                "phone": tel,
                "floor": floor,
                "location": location
            }
        }
        const isSuc = await submitForm(payload)
        setShowAlert(isSuc)
        setTimeout(() => {
            setShowAlert(null)
        }, 3000)
    }
    const AlertComp = () => {
        if(showAlert === true){
            return (
                <div className="alert alert-success d-flex align-items-center" role="alert">
                    <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:" viewBox="0 0 16 16">
                        <path fill="currentColor" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                    <div>
                        提交成功!
                    </div>
                </div>
            )
        } else if (showAlert === false){
            return (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:" viewBox="0 0 16 16">
                        <path fill="currentColor" d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </svg>
                    <div>
                        提交失败!
                    </div>
                </div>
            )
        } else {
            return null
        }
    }
    return (
        <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-lg-6">
                {AlertComp()}
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
