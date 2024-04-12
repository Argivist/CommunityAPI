import { useState, useEffect, useContext, createContext } from "react";
import PropTypes from 'prop-types';
import io from 'socket.io-client';
//images
import logo from './../img/logo/logo.png';

//css
import './../css/auth.css';

///Components///

const socket = io.connect('http://localhost:4000');
//States
// Context for managing room state
const userContext = createContext();

const useUser = () => useContext(userContext);

const UserProvider = ({ children }) => {

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [nname, setNname] = useState("");
  const [email, setEmail] = useState("");
  const [hobby, setHobby] = useState("");
  const [interest, setInterest] = useState("");
  const [genre, setGenre] = useState("");

  const register=(user,pwd,fname,lname,nname,email,hobby,interest,genre)=>{
    socket.emit('register', { user,pwd,fname,lname,nname,email,hobby,interest,genre });
    socket.on('rstatus', (status) => {
      if (status.value === "success") {
        return true;
      }
    });
  }

  return (
    <userContext.Provider value={{ user, setUser, pwd, setPwd, fname, setFname, lname, setLname, nname, setNname, email, setEmail, hobby, setHobby, interest, setInterest, genre, setGenre, register }}>
      {children}
    </userContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};




//////Login Page
function Login_Page() {
  const [selectDiv, setSelectDiv] = useState(1);
  //changes the selectDiv value
  const handleDivChange = (DivNum) => {
    setSelectDiv(DivNum);
  }
  return (
    <UserProvider>
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
    </UserProvider>
  );
}

export default Login_Page

Login_Page.propTypes = {
  setToken: PropTypes.func.isRequired
};


// login
function Login({ handleDivChange }) {
  const [uname, setUname] = useState("");
  const [pwd, setPwd] = useState("");
  const [isVisible, setVisible] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setVisible(true);
    setError(null);
  }, []);
  const change = () => {
    handleDivChange(2);
  }

  //handles submit
  const handleSubmit = async e => {
    e.preventDefault();
    if (!uname || !pwd) {
      setError(1);
      return;
    }
    //using api so get login token

    socket.emit('login', { uname, pwd });
    socket.on('auth', (token) => {
      if (token.value === "token123") {
        // Store the token securely
        localStorage.setItem('token', token);
        window.location.reload();
        console.log('Login succeeded:', token);
      }
    });
  
  }
  return (
    <div className={isVisible ? 'slide-in active form' : 'slide-in form'} id="login">
      {
        error === 1 && <div className="error">Please fill in the fields</div>
      }
      {
        error === 2 && <div className="error">Invalid Username or Password</div>
      }

      <form onSubmit={handleSubmit}>
        <input type="text" name="user" placeholder="Username/NickName/email" onChange={u => { setUname(u.target.value) }} />
        <input type="password" name="password" placeholder="Password" onChange={p => { setPwd(p.target.value); }} />
        <div className="login_btn">
          <button type='Submit'>
            Log In
          </button>
          <button onClick={change}>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  )
}


//Props validation
// Prop validation
Login.propTypes = {
  handleDivChange: PropTypes.func.isRequired,
  setToken: PropTypes.func.isRequired
};




// securiyty
function Security({ handleDivChange }) {
  const [isVisible, setVisible] = useState(false);
  const { pwd, setPwd ,register} = useUser();
  const [perror, setpError] = useState(null);

  useEffect(() => {
    setVisible(true);
    setpError(null);
  }, []);
  // navigation
  const change = () => {
    handleDivChange(3);
  }


  return (
    <div className={isVisible ? 'slide-in active form' : 'slide-in form'} id="login">
      {
        perror === 1 && <div className="error">Please fill in the fields</div>
      }
      <input type="password" name="pwd" placeholder="Enter Password" onChange={(p) => { setPwd(p.target.value); }
      }/>
      <input type="password" name="pwd" placeholder="Re-enter Password" onChange={(p) => { if (p.target.value !== pwd) { setpError(2); }else{setpError(null);}}
      }/>
      <div className="login_btn">
        <button onClick={change}>
          &#10918;
        </button>
        <button onClick={
          () => {
            if(perror === null){
              if(register){
                            handleDivChange(1);
              }
            }
          }
        
        }>
          Register
        </button>
      </div>
    </div>
  )
}


//Props validation
// Prop validation
Security.propTypes = {
  handleDivChange: PropTypes.func.isRequired
};


// Reg name
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
      <input type="email" name="email" placeholder="email" />

    </div>
  )
}


//Props validation
// Prop validation
RegName.propTypes = {
  handleDivChange: PropTypes.func.isRequired
};


// Detail
function Detail({ handleDivChange }) {
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);
  // navigation
  const change = (opt) => {
    if (opt == 1) {
      handleDivChange(2);
    } else {
      handleDivChange(4);
    }
  }


  return (
    <div className={isVisible ? 'slide-in active form' : 'slide-in form'} id="login">
      <div className="login_btn">
        <button onClick={() => change(1)}>
          &#10918;
        </button>
        <button onClick={() => change(2)}>
          &#10919;
        </button>
      </div>

      {/* Hobbies */}
      <label htmlFor="hobby">Hobby</label>
      <ul className="hobby-list">
        <li><input type="checkbox" name="hobby" value="Reading" /> Reading</li>
        <li><input type="checkbox" name="hobby" value="Painting" /> Painting</li>
        <li><input type="checkbox" name="hobby" value="Photography" /> Photography</li>
        <li><input type="checkbox" name="hobby" value="Gaming" /> Gaming</li>
        <li><input type="checkbox" name="hobby" value="Cooking" /> Cooking</li>
        <li><input type="checkbox" name="hobby" value="Dancing" /> Dancing</li><br />
      </ul>
      <input type="text" name="hobby" placeholder="Other" />
      {/* interests */}
      <label htmlFor="interest">Interest</label>
      <ul className="interest-list">
        <li><input type="checkbox" name="interest" value="Space" /> Space</li>
        <li><input type="checkbox" name="interest" value="Science" /> Science</li>
        <li><input type="checkbox" name="interest" value="Tech" /> Tech</li>
        <li><input type="checkbox" name="interest" value="Music" /> Music</li>
        <li><input type="checkbox" name="interest" value="Movies" /> Movies</li>
        <li><input type="checkbox" name="interest" value="Books" /> Books</li>
        <li><input type="checkbox" name="interest" value="Sports" /> Sports</li>
        <li><input type="checkbox" name="interest" value="Travel" /> Travel</li>
      </ul>
      {/* Genre */}
      <label htmlFor="genre">Favourite Genres</label>
      <ul className="genre-list">
        <li><input type="checkbox" name="genre" value="Action" /> Action</li>
        <li><input type="checkbox" name="genre" value="Adventure" /> Adventure</li>
        <li><input type="checkbox" name="genre" value="Comedy" /> Comedy</li>
        <li><input type="checkbox" name="genre" value="Drama" /> Drama</li>
        <li><input type="checkbox" name="genre" value="Fantasy" /> Fantasy</li>
        <li><input type="checkbox" name="genre" value="Horror" /> Horror</li>
        <li><input type="checkbox" name="genre" value="Mystery" /> Mystery</li>
        <li><input type="checkbox" name="genre" value="Romance" /> Romance</li>
        <li><input type="checkbox" name="genre" value="Sci-fi" /> Sci-fi</li>
        <li><input type="checkbox" name="genre" value="Thriller" /> Thriller</li>
        <li><input type="checkbox" name="genre" value="Western" /> Western</li>
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