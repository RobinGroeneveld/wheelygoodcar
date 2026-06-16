// This page runs entirely in the browser (client-side) because hooks like useEffect and useSession are only available there.
"use client";
 
// Component that displays the statistics of tags.
import TagStatsTable from '@/components/TagStatsTable';
 
// Hook used to retrieve the currently logged-in user.
import { useSession } from '@/app/lib/auth-client';
 
// React hook for applying side effects after a render.
import { useEffect } from 'react';
 
// Hook that allows programmatic navigation.
import { useRouter } from 'next/navigation';
 
// Navigation component.
import PillNav from '@/components/PillNav';
 
// Animated background.
import LiquidChrome from '@/components/LiquidChrome';
 
export default function AdminTagStatsPage() {
   
    // Retrieves the session.
    // During retrieval, isLoading=true.
    // As soon as the session is known, isLoading=false.
    const { data: session, isLoading } = useSession();
 
    // Router object that allows pages to be modified without a full refresh.
    const router = useRouter();
 
    useEffect(() => {
       
        /*
            This effect hook is executed:
 
            1. After the component is rendered for the first time.
 
            2. Again when one of the dependencies changes.
 
            Dependencies:
 
            - isLoading
            - session
            - router
 
            The goal is to check the access rights.
        */
 
        if (
            !isLoading &&
            (
                !session ||         // No session present
                !session.user ||    // Session contains no user
                session.user.email !== 'admin@wheelygoodcars.nl' // Not the admin
            )
        ) {
           
        /*
 
            replace() replaces the current page in the browser history.
 
            As a result, the user cannot return to this admin page using the "Previous page" button.
 
        */
            router.replace('/login');
        }
 
    }, [isLoading, session, router]);
 
    // We only show a loading screen while checking the session.
    if (isLoading)
        return(
        <main style={{ padding: 32 }}>
            Bezig met laden...
            </main>
        );
       
        /*
            Extra security.
 
            useEffect executes the redirect only AFTER rendering.
 
            Without this check, the admin page might be visible for a very short time.
 
            Returning null displays nothing at all.
        */
 
    if (
        !session ||
        !session.user ||
        session.user.email !== 'admin@wheelygoodcars.nl'
    ) {
        return null;
    }
 
        /*
 
            The interface below is rendered only when the user is the correct admin.
 
        */
 
    return (
        <>
            {/* Animated background */}
            <div className="fixed top-0 left-0 w-screen h-screen -z-10">
                <LiquidChrome baseColor={[0.0, 0.1, 0.1]} speed={0.5} amplitude={0.3} frequencyX={3} frequencyY={3} interactive={true} />
            </div>
            <div className="relative min-h-screen">
               
                {/* Top navigation */}
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
               
                {/* Main content of the page */}
                <main style={{ padding: 32 }}>
                   
                    {/* Component that displays the tag statistics */}
                    <TagStatsTable />
                </main>
            </div>
        </>
    );
}