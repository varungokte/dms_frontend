import ErrorIcon from '@mui/icons-material/Error';
import Backdrop from '@mui/material/Backdrop';
import { Link } from 'react-router-dom';

function ForbiddenMessage(){
  return (
    <Backdrop
        sx={{ color: "white", backgroundColor:"gray", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <div>
          <div className='m-auto text-center'>
            <ErrorIcon color="error" sx={{fontSize:"200px"}}/>
          </div>
          <br />
          <div className="text-center">
            <p className="text-3xl text-red-700">Halt Trespasser</p>
            <p className="text-lg">You have attempted to perform an action for which you have not the authorization.</p>
            <p className="text-lg">Return now whence you came, lest you be destroyed for thine unscrupulous action.</p>
            <Link to="./../" className='text-blue-600'>Go to the Home Page</Link>
          </div>
        </div>

      </Backdrop>
  )
}

export default ForbiddenMessage;