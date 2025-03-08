const Login = () => {
  return (
    <>
      <h1 className="text-3xl items-center">Welcome Back!</h1>
      <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box mx-auto">
        <legend className="fieldset-legend">Login</legend>

        <label className="fieldset-label">Email</label>
        <input type="email" className="input" placeholder="Email" />

        <label className="fieldset-label">Password</label>
        <input type="password" className="input" placeholder="Password" />

        <button className="btn btn-neutral mt-4">Login</button>
      </fieldset>
    </>
  );
};

export default Login;
