'use client';

import MagicBentoAdminSellers from '../../components/MagicBentoAdminSellers'
import PillNav from '../../components/PillNav';

export default function AdminTopCarsOverviewPage() {
    return (
        <>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                <div style={{ maxWidth: 1100, width: '100%' }}>
                    <PillNav
                        logo=""
                        items={[
                            { label: 'Home', href: '/' },
                            { label: 'Auto verkopen', href: '/sell-car' },
                            { label: "Overzicht alle auto's", href: '/overview' },
                            { label: "Mijn auto's", href: '/my-cars' },
                            {label: 'admin', href: '/admin/tag-stats'},
                            {label: 'Admin Top Cars', href: '/admin-top-cars'},
                            { label: 'Inloggen', href: '/login' }
                        ]}
                        activeHref="/admin-top-cars-overview"
                        className="custom-nav"
                        ease="power2.easeOut"
                        baseColor="#000000"
                        pillColor="#ffffff"
                        hoveredPillTextColor="#ffffff"
                        pillTextColor="#000000"
                        initialLoadAnimation={false}
                    />
                </div>
            </div>
            <div className="tekst-overzicht-top" >
                <div className="container" style={{marginTop: 40, justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                     <h1 style={{
                        marginTop: 40,
                        color: '#f1f5f9',
                        textAlign: 'center',
                        marginBottom: 32,
                        fontSize: 36,
                        letterSpacing: 1,
                        fontWeight: 800,
                        textShadow: '0 2px 16px #0008'
                    }}>
                        Het overzicht van de top aanbieders
                    </h1>
                    <MagicBentoAdminSellers />
                </div>
                
            </div>
        </>
    );
}