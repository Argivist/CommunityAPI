import { useState,useEffect  } from "react";
import PropTypes from 'prop-types';
//images
import logo from './../img/logo/logo.png';

//css
import './../css/auth.css';

///Components///
// import Login from './auth/Login.jsx';
import RegName from './auth/RegName.jsx';
// import Detail from './auth/Detail.jsx';
import Security from './auth/Security.jsx';

function Login_Page(){
    


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

export default Login_Page

Login_Page.propTypes = {
  setToken: PropTypes.func.isRequired
};



// Login
function RegName({ handleDivChange }) {
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);
  // navigation
  const change = (opt) => {
    if (opt == 1) {
      handleDivChange(1);
    } else {
      handleDivChange(3);
    }
  }


  return (
    <div className={isVisible ? 'slide-in active form' : 'slide-in form'} id="login">
      <div className="login_btn">
        <button onClick={() => change(1)}>
          Log In
        </button>
        <button onClick={() => change(2)}>
          &#10919;
        </button> 
      </div>
      <input type="text" name="fname" placeholder="First Name" />
      <input type="text" name="lname" placeholder="Last Name" />
      <input type="text" name="nname" placeholder="Nick name" />

    </div>
  )
}


//Props validation
// Prop validation
RegName.propTypes = {
  handleDivChange: PropTypes.func.isRequired
};


// Detail
function Detail({handleDivChange}){
  const [isVisible,setVisible]=useState(false);

  useEffect(() => { 
    setVisible(true);
  },[]);
// navigation
    const change = (opt) => {
      if(opt==1){
        handleDivChange(2);
      }else{
        handleDivChange(4);
      }
    }


return(
<div className={isVisible ? 'slide-in active form' : 'slide-in form'} id="login">
<div className="login_btn">
                <button onClick={()=>change(1)}>
                &#10918;
                </button>
                <button onClick={()=>change(2)}>
                &#10919;
                </button>
              </div>
            
              {/* Hobbies */}
              <label htmlFor="hobby">Hobby</label>
              <ul className="hobby-list">
                <li><input type="checkbox" name="hobby" value="Reading" /> Reading</li>
                <li><input type="checkbox" name="hobby" value="Painting"/> Painting</li>
                <li><input type="checkbox" name="hobby" value="Photography"/> Photography</li>
                <li><input type="checkbox" name="hobby" value="Gaming"/> Gaming</li>
                <li><input type="checkbox" name="hobby" value="Cooking"/> Cooking</li>
                <li><input type="checkbox" name="hobby" value="Dancing"/> Dancing</li><br/>
              </ul>
              <input type="text" name="hobby" placeholder="Other" />
              {/* interests */}
              <label htmlFor="interest">Interest</label>
              <ul className="interest-list">
              <li><input type="checkbox" name="interest" value="Space" /> Space</li>
              <li><input type="checkbox" name="interest" value="Science"/> Science</li>
              <li><input type="checkbox" name="interest" value="Tech"/> Tech</li>
              <li><input type="checkbox" name="interest" value="Music"/> Music</li> 
              <li><input type="checkbox" name="interest" value="Movies"/> Movies</li>
              <li><input type="checkbox" name="interest" value="Books"/> Books</li>
              <li><input type="checkbox" name="interest" value="Sports"/> Sports</li>
              <li><input type="checkbox" name="interest" value="Travel"/> Travel</li>
              </ul>
              {/* Genre */}
              <label htmlFor="genre">Favourite Genres</label>
              <ul className="genre-list">
                <li><input type="checkbox" name="genre" value="Action" /> Action</li>
                <li><input type="checkbox" name="genre" value="Adventure"/> Adventure</li>
                <li><input type="checkbox" name="genre" value="Comedy"/> Comedy</li>
                <li><input type="checkbox" name="genre" value="Drama"/> Drama</li>
                <li><input type="checkbox" name="genre" value="Fantasy"/> Fantasy</li>
                <li><input type="checkbox" name="genre" value="Horror"/> Horror</li>
                <li><input type="checkbox" name="genre" value="Mystery"/> Mystery</li>
                <li><input type="checkbox" name="genre" value="Romance"/> Romance</li>
                <li><input type="checkbox" name="genre" value="Sci-fi"/> Sci-fi</li>
                <li><input type="checkbox" name="genre" value="Thriller"/> Thriller</li>
                <li><input type="checkbox" name="genre" value="Western"/> Western</li>
              </ul>


          
            

          </div>
)
}


//Props validation
// Prop validation
Detail.propTypes = {
    handleDivChange: PropTypes.func.isRequired
  };

//export login