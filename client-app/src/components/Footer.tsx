import * as React from 'react';

interface IFooterProps {
}

const Footer: React.FunctionComponent<IFooterProps> = () => {
  return (
    <div className='fixed bottom-0 left-0 w-full bg-slate-900 text-white text-base text-center py-2'>
        Copyright &#169; UrlChop | MayLord
    </div>
  );
};

export default Footer;

