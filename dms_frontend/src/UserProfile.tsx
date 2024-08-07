import { useEffect, useState } from 'react';
import useGlobalContext from './../GlobalContext';
import { FieldValues } from 'DataTypes';
import ProfileIcon from './components/BasicComponents/ProfileIcon';

function UserProfile(){
  const {getDecryptedToken} = useGlobalContext();
  const [token, setToken] = useState<FieldValues>();

  const UserStatusStyling:any = {
    Unverified:"text-yellow-600",
    Active:"text-green-600",
    Inactive:"text-red-600"
  };

  const getUserInfo = async() => {
		const decodedToken = await getDecryptedToken();
		if (decodedToken){
			setToken(decodedToken)
			return decodedToken;
		}
	};

  useEffect(()=>{
    getUserInfo();
  },[]);

  if (!token)
    return <></>;

  return (
    <div>
      <div className="flex flex-row m-auto w-[70%] mt-10">
        <ProfileIcon size="large" name={token["N"]} />
        <div className="grid grid-rows-3 grid-flow-col gap-4 ml-5 mt-5">
          <div>
            <p className="text-2xl"><strong>Name</strong>: {token["N"]}</p>
          </div>
          <div>
            <p><strong>Email</strong>: {token["E"]} </p>
          </div>
          <div>
            <p><strong>Role</strong>: {token["R"]}</p>
          </div>
          <div> </div>
          <div>
            <p><strong>User Status</strong>: <span className={UserStatusStyling[token["S"]]}>{token["S"]}</span></p>
          </div>
          <div>
            <p><strong>Business ID</strong>: {token["BID"]}</p>
          </div>
        </div>
      </div>
    </div>
  )

}

export default UserProfile;