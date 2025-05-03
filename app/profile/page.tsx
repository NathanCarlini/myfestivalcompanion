"use client"
import { useSession } from 'next-auth/react';

const UserProfile = () => {
  const { data: session, status } = useSession();

if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>You are not logged in</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <p>Welcome {session.user.name}</p>
      <p>Email: {session.user.email}</p>
    </div>
  );
};

export default UserProfile;
