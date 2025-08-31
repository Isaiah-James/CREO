import { useContext } from 'react';
import { TimeContext } from '../providers';

export const useTime = () => {
  const ctx = useContext(TimeContext);
  if (!ctx) throw new Error('useTime must be used within a TimeProvider');
  return ctx;
};
