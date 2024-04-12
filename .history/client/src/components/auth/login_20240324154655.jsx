import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

//css
import './../../css/auth/animation.css';
//Login function
async function loginUser(credentials) {
  return fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
}


//login tab
function Login({ handleDivChange }) {

  const [isVisible, setVisible] = useState(false);
  const [uname, setUname] = useState('');
  const [pwd, setPwd] = useState('');

  useEffect(() => {
    setVisible(true);
  }, []);
  const change = () => {
    handleDivChange(2);
  }

  //handles submit
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const tokenData = await loginUser({ username: uname, password: pwd });
      const token = tokenData.token;
      // Store the token securely (e.g., in local storage)
      localStorage.setItem('token', token);
      
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login failure, such as displaying an error message
    }

  }
  return (
    <div className={isVisible ? 'slide-in active form' : 'slide-in form'} id="login">
      <form onSubmit={handleSubmit}>
        <input type="text" name="user" placeholder="Username/NickName/email" onChange={u => { setUname(u.target.value) }} />
        <input type="password" name="password" placeholder="Password" onChange={p => { setPwd(p.target.value) }} />
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