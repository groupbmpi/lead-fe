import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavbarParticipant from '@/components/Navbar/NavbarParticipant';
import Head from 'next/head';
import { checkAuth } from '@/utils/auth';

const ViewModule = () => {
    const router = useRouter();
    const googleSiteLink = 'https://docs.google.com/presentation/d/1mGNTMZ3bZQvcm4DD59sw3fqOuzF_N0MsUyn8dhtmVO8/edit#slide=id.p';

    const [allowed, setAllowed] = useState(false);
    useEffect(() => {
        const checkAuthentication = async () => {
            const isAllowed = await checkAuth(['MENTOR']);
            setAllowed(isAllowed);

            // if (!isAllowed) {
            //     router.push('/mentor-login');
            // }
        };
        checkAuthentication();
    });
    
  return (
    <>
        <Head>
            <title>LEAD - View Module</title>
        </Head>
        {/* {allowed && <NavbarParticipant />} */}
        <NavbarParticipant />
        <div className="vh-100 d-flex flex-column overflow-hidden">
            <div className="flex-grow-1">
                <iframe
                    src={googleSiteLink}
                    title="Google Site"
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    </>
  );
};

export default ViewModule;
