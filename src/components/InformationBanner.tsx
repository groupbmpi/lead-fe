import React, { useState, useEffect } from 'react';

interface BannerData {
  information_banner_id: number;
  url_picture: string;
  text: string;
}

const InformationBanner = () => {
  const [bannerData, setBannerData] = useState<BannerData | null>(null);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    fetch(`${backendUrl}/api/v1/informationBanner/1`, {
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => setBannerData(data));
  }, []);

  if (!bannerData) return null;
  
  if (bannerData.text) {
    return <div className="px-4 py-3 text-center bg-dark text-white">{bannerData.text}</div>;
  }
  
  if (bannerData.url_picture) {
    return <img className="min-vw-100" src={bannerData.url_picture} alt="Information Banner" />;
  }
};

export default InformationBanner;