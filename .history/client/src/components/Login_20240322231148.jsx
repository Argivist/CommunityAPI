import { useState } from "react";


//css
import './../css/auth.css';

///Components///
import Login from './auth/Login.jsx';
import RegName from './auth/RegName.jsx';
import Detail from './auth/Detail.jsx';
import Security from './auth/Security.jsx';

function Login(){
    const [selectDiv, setSelectDiv] = useState(1);
    //changes the selectDiv value
    const handleDivChange = (DivNum) => {
      setSelectDiv(DivNum);
    }
    return(
        <>
          <div className="auth_box">
        <img src={logo} width="40%" alt="logo" />
        {/* Login box */}
        {selectDiv === 1 && (
        <Login handleDivChange={handleDivChange} />
        )}
        {/* Profile Info box */}
        {selectDiv === 2 && (
          <RegName handleDivChange={handleDivChange} />
        )}
        {/* Profile Info box */}
        {selectDiv === 3 && (
          <Detail handleDivChange={handleDivChange} />
        )}
        {/* Password box */}
        {selectDiv === 4 && (
        <Security handleDivChange={handleDivChange} />
        )}
        </div>
        </>
    );
}