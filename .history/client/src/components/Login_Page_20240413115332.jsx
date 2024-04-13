import bcrypt from 'bcryptjs';
import { useState, useEffect, useContext, createContext } from "react";
import PropTypes from 'prop-types';
import io from 'socket.io-client';
//images
import logo from './../img/logo/logo.png';

//css
import './../css/auth.css';

///Components///

const socket = io.connect('http://localhost:4000');
// const socket = io.connect('https://circleapi.azurewebsites.net/');
//States
// Context for managing room state
const userContext = createContext();

const useUser = () => useContext(userContext);
// const hashPassword = async (password) => {
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     return hashedPassword;
//   } catch (error) {
//     console.error('Error hashing password:', error);
//     throw error;
//   }
// };
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
  const [regSuccess, setRegSuccess] = useState(false);
  function register() {
    //encrypt password

    // validate all inputs
    socket.emit('register', { user, pwd, fname, lname, nname, email, hobby, interest, genre });
    socket.on('rstatus', (status) => {
      if (status.value === "success") {
        console.log('Registration succeeded:', status);
        setRegSuccess(true);
        console.log('Registration succeeded:', status);
      }
    });
    return () => {
      socket.off("rstatus");
    };
  }

  return (
    <userContext.Provider value={{ user, setUser, pwd, setPwd, fname, setFname, lname, setLname, nname, setNname, email, setEmail, hobby, setHobby, interest, setInterest, genre, setGenre, register, regSuccess, setRegSuccess }}>
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
      if (token.success) {
        localStorage.setItem('token', token.value);
        console.log('Login succeeded:', token);
        window.location.reload();
      } else {
        setError(2);
      }
      
    });
    return () => {
      socket.off("auth");
    };

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
  const { pwd, setPwd, register, regSuccess } = useUser();
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

      <siv className="error">{perror}</siv>
      <input type="password" name="pwd" placeholder="Enter Password" onChange={(p) => { setPwd(p.target.value); }
      } />
      <input type="password" name="pwd" placeholder="Re-enter Password" onChange={(p) => { if (p.target.value !== pwd) { setpError(2); } else { setpError(null); } }
      } />
      <div className="login_btn">
        <button onClick={change}>
          &#10918;
        </button>
        <button onClick={() => {
          if (pwd === "") {
            setpError(1);
          } else if (pwd.length < 8) {
            setpError("Password must be at least 8 characters long");
          } else if (!/[a-z]/.test(pwd) || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd) || !/[^a-zA-Z0-9]/.test(pwd)) {
            setpError("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
          } else {
            setpError(null);
            if (perror === null) {
              register();
              if (regSuccess) {
                handleDivChange(1);
              }
            }
          }
        }}>


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

  const { fname, setFname, lname, setLname, nname, setNname, email, setEmail } = useUser();
  const [error, setError] = useState(null);

  useEffect(() => {
    setVisible(true);
    setError(null);
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
      {error === 1 && <div className="error">Please fill in the fields</div>}
      <div className="login_btn">
        <button onClick={() => change(1)}>
          Log In
        </button>
        <button onClick={() => {
          if (fname === "" || lname === "" || nname === "" || email === "") {
            setError(1);
          } else if (email !== "") {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              setError(2);
            } else {
              change(2)
            }
            //enforcing the email

          }
        }
        }>
          &#10919;
        </button>
      </div>
      <input type="text" name="fname" placeholder="First Name" onChange={
        (f) => { setFname(f.target.value); }
      } />
      <input type="text" name="lname" placeholder="Last Name" onChange={
        (l) => { setLname(l.target.value); }

      } />
      <input type="text" name="nname" placeholder="Nick name" onChange={
        (n) => { setNname(n.target.value); }

      } />
      <input type="email" name="email" placeholder="email" onChange={
        (e) => { setEmail(e.target.value); }
      } />

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

  const { setInterest } = useUser();
  const { setHobby } = useUser();
  const { setGenre } = useUser();

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
      <select className="hobby-list" onChange={
      
          (h) => setHobby(h.target.value)
        
      }>
        <option><input type="checkbox" name="hobby" value="Reading" /> Reading</option>
        <option><input type="checkbox" name="hobby" value="Painting" /> Painting</option>
        <option><input type="checkbox" name="hobby" value="Photography" /> Photography</option>
        <option><input type="checkbox" name="hobby" value="Gaming" /> Gaming</option>
        <option><input type="checkbox" name="hobby" value="Cooking" /> Cooking</option>
        <option><input type="checkbox" name="hobby" value="Dancing" /> Dancing</option><br />
      </select>

      {/* interests */}
      <label htmlFor="interest">Interest</label>
      <select className="interest-list" onChange={(i) => {
        setInterest(
          i.target.value
        )
      }}><option><input type="checkbox" name="interest" value="" /> </option>
        <option><input type="checkbox" name="interest" value="Space" /> Space</option>
        <option><input type="checkbox" name="interest" value="Science" /> Science</option>
        <option><input type="checkbox" name="interest" value="Tech" /> Tech</option>
        <option><input type="checkbox" name="interest" value="Music" /> Music</option>
        <option><input type="checkbox" name="interest" value="Movies" /> Movies</option>
        <option><input type="checkbox" name="interest" value="Books" /> Books</option>
        <option><input type="checkbox" name="interest" value="Sports" /> Sports</option>
        <option><input type="checkbox" name="interest" value="Travel" /> Travel</option>
      </select>
      {/* Genre */}
      <label htmlFor="genre">Favourite Genres</label>
      <select className="genre-list"
        onChange={
          (g) => { setGenre(g.target.value); }
        }
      >
        <option><input type="checkbox" name="interest" value="" /> </option>
        <option><input type="checkbox" name="genre" value="Action" /> Action</option>
        <option><input type="checkbox" name="genre" value="Adventure" /> Adventure</option>
        <option><input type="checkbox" name="genre" value="Comedy" /> Comedy</option>
        <option><input type="checkbox" name="genre" value="Drama" /> Drama</option>
        <option><input type="checkbox" name="genre" value="Fantasy" /> Fantasy</option>
        <option><input type="checkbox" name="genre" value="Horror" /> Horror</option>
        <option><input type="checkbox" name="genre" value="Mystery" /> Mystery</option>
        <option><input type="checkbox" name="genre" value="Romance" /> Romance</option>
        <option><input type="checkbox" name="genre" value="Sci-fi" /> Sci-fi</option>
        <option><input type="checkbox" name="genre" value="Thriller" /> Thriller</option>
        <option><input type="checkbox" name="genre" value="Western" /> Western</option>
      </select>





    </div>
  )
}


//Props validation
// Prop validation
Detail.propTypes = {
  handleDivChange: PropTypes.func.isRequired
};

//export login