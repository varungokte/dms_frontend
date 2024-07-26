import { Link } from "react-router-dom";
//import KayakingIcon from '@mui/icons-material/Kayaking';

function PageNotFound(){
  return (
    <div>
      <div className="mt-[10%] text-center font-bold">
        {/* <KayakingIcon style={{fontSize:100}}/> */}
       <p className="text-2xl text-custom-1">You seem to be lost</p>
       <br />
       <Link to="/" className="text-blue-600 text-xl hover:underline hover:decoration-blue-700">Click here to go to the Dashboard</Link>
      </div>
    </div>
  )
}

export default PageNotFound;