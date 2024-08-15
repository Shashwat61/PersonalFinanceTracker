import './App.css'
import { GoogleOAuthProvider, useGoogleLogin} from '@react-oauth/google'
import axios from 'axios'
function App() {


  return (
    <GoogleOAuthProvider clientId=''>
      <CustomButton/>
    </GoogleOAuthProvider>
  )
}

export default App

function CustomButton(){
  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    scope: 'email profile https://mail.google.com/',
    onSuccess: async(response) => {
      console.log(response)
      const tokens = await axios.post('http://localhost:3000/api/auth/sign_up', {
        code: response.code
      })
      console.log(tokens)
    },
    onError: errorResponse => console.log(errorResponse)
  })
  return <button onClick={googleLogin}>Google Login</button>
}
