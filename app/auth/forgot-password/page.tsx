"use server";

import NavBar from '@/components/NavBar';
import ForgotPasswordForm from '@/components/forms/ForgotPasswordForm';

const ForgotPassword = () => {

  return (
    <div>
      <NavBar includeBurger={false} accountLink={"/auth/login"} logoLink={"/"}/>
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPassword;
