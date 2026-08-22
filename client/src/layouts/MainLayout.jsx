import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

function MainLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Navbar />
      <main style={{ flex: 1, width: '100%' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
