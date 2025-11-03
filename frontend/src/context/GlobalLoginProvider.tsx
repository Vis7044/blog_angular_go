'use client';
import { useEffect, useState } from 'react';
import { eventEmitter } from '@/utils/eventEmittor';
import { LoginDialog } from '@/components/LoginDialog';

export const GlobalLoginProvider = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = () => setVisible(true);
    const hide = () => setVisible(false);

    eventEmitter.on('showLoginModal', show);
    eventEmitter.on('hideLoginModal', hide);

    return () => {
      eventEmitter.off('showLoginModal', show);
      eventEmitter.off('hideLoginModal', hide);
    };
  }, []);

  return (
    <>
      {children}
      <LoginDialog visible={visible} setVisible={setVisible} />
    </>
  );
};
