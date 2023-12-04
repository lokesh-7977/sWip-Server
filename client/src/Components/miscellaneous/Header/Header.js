import React, { useEffect } from 'react';
import Mobile from './HeaderMobile';
import Desktop from './HeaderDesktop';
import { useSelector } from 'react-redux';

const Header = () => {
  const { isSmallScreen } = useSelector((state) => state.pattern);

  useEffect(() => {
    console.log(isSmallScreen);
  }, [isSmallScreen]);

  return (
    <>
      {isSmallScreen ? <Mobile /> : <Desktop />}
    </>
  );
};

export default Header;
