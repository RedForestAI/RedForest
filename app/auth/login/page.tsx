"use server";

import NavBar from '@/components/NavBar';
import LoginForm from '@/components/forms/LoginForm';

const Login = () => {

  return (
    <div>
      <NavBar includeBurger={false} accountLink={"/auth/login"} logoLink={"/"}/>
      <LoginForm />
    </div>
  );
};

export default Login;
