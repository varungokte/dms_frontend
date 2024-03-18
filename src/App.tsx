import './App.css';
import { BrowserRouter,Routes, Route, Link } from 'react-router-dom';

import SidePanel from './components/SidePanel';
import TopPanel from './components/TopPanel';
import TeamMembers from './components/TeamMembers';

function App() {
  
  return (
    <BrowserRouter>
    <div style={{position:"relative"}}>        
      <SidePanel/>
		  <div style={{width: "85%", margin:"auto", paddingLeft:"0%", paddingRight:"1%", float:"right"}}>
        <TopPanel/>
			  <hr/>
        <TeamMembers/>
      </div>
    </div>
    </BrowserRouter> 
  )
}

export default App;