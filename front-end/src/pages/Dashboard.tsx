const Dashboard = () => {
  return (
    <>
      <h1>Dashboard</h1>
      <p>
        This page is only accessible if the user has logged in (i.e. an access
        token exists in the global state)
      </p>
    </>
  );
};

export default Dashboard;
