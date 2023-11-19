import React from 'react';
import Link from 'next/link';

const ForgotPasswordPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-zinc-950">
      <div className="p-6 max-w-sm w-full bg-white rounded-lg border border-gray-200 shadow-md">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Forgot Password</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
              <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="name@example.com" required />
            </div>
            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Send Instructions</button>
          </form>
          <div className="flex justify-between items-center mt-4">
          <Link href="login">
            <button className="text-sm text-blue-600 hover:underline">Remember your password? Sign in</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
