import {Card,CardContent} from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';

const cardType = {

}

function ThisWeekView(props:{className?:string}){
  return(
    <Card variant="outlined" className={props.className} sx={{borderRadius:"20px"}}>
      <CardContent>
        <div className="flex flex-row">
          <div>
            <div className="font-thin">BUDGET</div>
            <div>$0.00001</div>
          </div>
          <div>
            <PaidIcon sx={{width:"100px", height:"50px"}}/>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ThisWeekView;