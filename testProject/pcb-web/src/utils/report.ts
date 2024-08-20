import { getToken } from '@/utils/auth';

export const getReportUrl = () =>
  `${import.meta.env.VITE_APP_UREPORT2_URL}&Authorization=${'Bearer ' + getToken()}&Clientid=${
    import.meta.env.VITE_APP_CLIENT_ID
  }`;
