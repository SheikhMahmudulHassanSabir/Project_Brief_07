function AuthLayout({ children }) {
  return (
<div className="auth-layout">
<div className="auth-card">
<h2 className="auth-brand">Job Portal System</h2>
        {children || <p>Authentication form placeholder.</p>}
</div>
</div>
  );
}

export default AuthLayout;
