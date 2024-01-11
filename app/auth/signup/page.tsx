"use server";

import NavBar from '@/components/NavBar';
import SignUpForm from '@/components/forms/SignUpForm';

const SignUp = () => {

  return (
    <div>
      <NavBar includeBurger={false} accountLink={"/auth/login"} logoLink={"/"}/>
      <SignUpForm />
    </div>
  );
};

export default SignUp;
