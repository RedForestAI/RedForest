
import React from 'react';
import NavBar from '@/components/NavBar';

const UpdatePassword = () => {
  return (
    <div>
      <NavBar includeBurger={false} accountLink={"login"} logoLink={"/"} />
      <div className="flex justify-center items-center h-screen bg-zinc-950">
        <div className="p-6 max-w-sm w-full bg-white rounded-lg border border-gray-200 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Update Password</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">New Password</label>
                <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
              </div>
              <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Update Password</button>
            </form>
        </div>
      </div>
   </div>
  );
};

export default UpdatePassword;