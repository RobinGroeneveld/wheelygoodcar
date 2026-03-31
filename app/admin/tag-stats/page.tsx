
"use client";

import TagStatsTable from '@/components/TagStatsTable';
import { useSession } from '@/app/lib/auth-client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PillNav from '@/components/PillNav';
import LiquidChrome from '@/components/LiquidChrome';

export default function AdminTagStatsPage() {
    const { data: session, isLoading } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!session || !session.user || session.user.email !== 'admin@wheelygoodcars.nl')) {
            router.replace('/login');
        }
    }, [isLoading, session, router]);

    if (isLoading) return <main style={{ padding: 32 }}>Bezig met laden...</main>;
    if (!session || !session.user || session.user.email !== 'admin@wheelygoodcars.nl') {
        return null;
    }

    return (
        <>
            <div className="fixed top-0 left-0 w-screen h-screen -z-10">
                <LiquidChrome baseColor={[0.0, 0.1, 0.1]} speed={0.5} amplitude={0.3} frequencyX={3} frequencyY={3} interactive={true} />
            </div>
            <div className="relative min-h-screen">
                <header className="pt-20">
                    <div className="flex justify-center gap-8 mt-20">
                        <PillNav
                            logo="/images/logo.png"
                            items={[
                                 { label: 'Home', href: '/' },
                                { label: 'Auto verkopen', href: '/sell-car' },
                                { label: "Overzicht alle auto's", href: '/overview' },
                                { label: "Mijn auto's", href: '/my-cars' },
                                {label: 'admin', href: '/admin/tag-stats'},
                                {label: 'Admin Top Cars', href: '/admin-top-cars'},
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
                <main style={{ padding: 32 }}>
                    {/* <h1>Tag statistieken</h1> */}
                    <TagStatsTable />
                </main>
            </div>
        </>
    );
}


  
