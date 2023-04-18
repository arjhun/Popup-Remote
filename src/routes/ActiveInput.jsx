import React ,{useState} from 'react'
import { Form } from 'react-router-dom';
import axios from 'axios';

export default function ActiveInput({user}) {
    const [active, setActive]  = useState(user.active);
   
    const handleActivate = async (e) =>{
        
      axios({
          method: "put",
          url: `/users/${user._id}/active`,
          data: {active:e.target.checked},
        })
          .then((result) => {
            if(result.status === 200){
               setActive(!active);
            }
          })
          .catch((error) => {
            console.log(error);
          });
    }
  return (
    <Form><input type="checkbox" checked={active} onChange={(e)=>handleActivate(e)}></input></Form>
  )
}
