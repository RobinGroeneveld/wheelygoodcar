// This page is executed in the browser. This is necessary because the components used contain client-side functionality.
'use client';
 
// Component that displays all top providers in an overview
import MagicBentoAdminSellers from '../../components/MagicBentoAdminSellers'
 
// Navigation bar displayed at the top of the page.
import PillNav from '../../components/PillNav';
 
export default function AdminTopCarsOverviewPage() {
   
        /*
            This is the main page of the overview.
 
            The page consists of two parts:
 
            1. The navigation bar.
 
            2. The overview of all top providers.
 
        */
    return (
        <>
    {/* Top navigation */}
    <header className="pt-20">
        <div className="flex justify-center gap-8">
            <PillNav
                logo="/images/logo.png"
                items={[
                        { label: 'Home', href: '/' },
                    { label: 'Auto verkopen', href: '/sell-car' },
                    { label: "Overzicht alle auto's", href: '/overview' },
                    { label: "Mijn auto's", href: '/my-cars' },
                    {label: 'admin', href: '/admin/tag-stats'},
                    {label: 'Admin Top Cars', href: '/admin-top-cars'},
                    {label: 'Admin Dashboard', href: '/admin-dashboard-overview'},
                    { label: 'Inloggen', href: '/login' }
                ]}
                activeHref="/admin/tag-stats"
                className="custom-nav"
                ease="power2.easeOut"
                baseColor="#000000"
                pillColor="#ffffff"
                hoveredPillTextColor="#ffffff"
                pillTextColor="#000000"
                initialLoadAnimation={false}
            />
        </div>
    </header>
           
            {/* Main content */}
            <div className="tekst-overzicht-top" >
 
                <div
                    className="container"
                    style={{
                        marginTop: 40,
                        justifyContent: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                   
                    {/* Page title */}
                    <h1
                        style={{
                            marginTop: 40,
                            color: '#f1f5f9',
                            textAlign: 'center',
                            marginBottom: 32,
                            fontSize: 36,
                            letterSpacing: 1,
                            fontWeight: 800,
                            textShadow: '0 2px 16px #0008'
                        }}
                    >
                        Het overzicht van de top aanbieders
                    </h1>
                    <MagicBentoAdminSellers />
                </div>
            </div>
        </>
    );
}