
import React from 'react';
import NavBar from '~/components/ui/NavBar';

const UpdatePassword = () => {
  return (
    <div>
      <NavBar/>
      <div className="flex justify-center items-center h-screen">
        <div className="p-6 max-w-sm w-full rounded-lg border border-gray-200 shadow-md">
          <h2 className="mb-4 text-xl font-bold">Update Password</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="password" className="block mb-2 text-sm font-medium">New Password</label>
                <input type="password" id="password" className="border border-gray-300 text-sm rounded-lg block w-full p-2.5" required />
              </div>
              <button type="submit" className="w-full btn btn-ghost text-primary">Update Password</button>
            </form>
        </div>
      </div>
   </div>
  );
};

export default UpdatePassword;
