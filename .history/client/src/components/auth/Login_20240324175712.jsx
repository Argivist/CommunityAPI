import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

//css
import './../../css/auth/animation.css';
//Login function
async function loginUser(credentials) {
  if (credentials.username === '' || credentials.password === '') {
  
    return;
  }else{
  
  return fetch('http://localhost:4000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json());
  }
}


//login tab
function Login({ handleDivChange }) {
  const [error, setError] = useState(null);
  const [isVisible, setVisible] = useState(false);
  const [uname, setUname] = useState('');
  const [pwd, setPwd] = useState('');

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
    try {
      const tokenData = await loginUser({ username: uname, password: pwd });
      if (tokenData === undefined) {//checks if login is empty
        setError(1);//empty credentials
        

      }else{
            
      const token = tokenData.token;
      // Store the token securely 
      localStorage.setItem('token', token);
      window.location.reload();
      console.log('Login succeeded:', token);
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login failure, such as displaying an error message
    }

  }
  return (
    <div className={isVisible ? 'slide-in active form' : 'slide-in form'} id="login">
      {
        error === 1 && <div className="error">Please fill in the fields</div>
      }
      
      <form onSubmit={handleSubmit}>
        <input type="text" name="user" placeholder="Username/NickName/email" onChange={u => { setUname(u.target.value) }} />
        <input type="password" name="password" placeholder="Password" onChange={p => { setPwd(p.target.value);}} />
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

//export login
export default Login;