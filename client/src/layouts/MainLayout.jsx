import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

function MainLayout({ children }) {
  return (
<div className="main-layout">
<Navbar />
<main className="main-content">
        {children || <p>Job Portal System — main content placeholder.</p>}
</main>
<Footer />
</div>
  );
}

export default MainLayout;
