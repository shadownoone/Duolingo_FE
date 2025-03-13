import { CloseSvg } from './Svgs';
import React, { useEffect, useRef, useState } from 'react';
import { useBoundStore } from '../hooks/useBoundStore';
import { useNavigate, useLocation } from 'react-router-dom'; // Thay thế Next.js router

export const FacebookLogoSvg = (props) => (
  <svg width="12" height="22" viewBox="0 0 12 22" {...props}>
    <title>Fill 4</title>
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g fill="#3C5A99">
        <path d="M7.275 21.584v-9.845h3.305l.495-3.837h-3.8v-2.45c0-1.111.309-1.868 1.902-1.868l2.032-.001V.15C10.857.104 9.65 0 8.249 0c-2.93 0-4.936 1.788-4.936 5.072v2.83H0v3.837h3.313v9.845h3.962z" />
      </g>
    </g>
  </svg>
);

export const GoogleLogoSvg = (props) => (
  <svg viewBox="0 0 48 48" {...props}>
    <g>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </g>
  </svg>
);

export const useLoginScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = useBoundStore((x) => x.loggedIn);

  const queryState = (() => {
    if (loggedIn) return 'HIDDEN';
    if (location.search.includes('login')) return 'LOGIN';
    if (location.search.includes('sign-up')) return 'SIGNUP';
    return 'HIDDEN';
  })();

  const [loginScreenState, setLoginScreenState] = useState(queryState);

  useEffect(() => {
    setLoginScreenState(queryState);
  }, [queryState]);

  return { loginScreenState, setLoginScreenState };
};

export const LoginScreen = ({ loginScreenState, setLoginScreenState }) => {
  const navigate = useNavigate();
  const loggedIn = useBoundStore((x) => x.loggedIn);
  const logIn = useBoundStore((x) => x.logIn);
  const setUsername = useBoundStore((x) => x.setUsername);
  const setName = useBoundStore((x) => x.setName);

  const nameInputRef = useRef(null);

  useEffect(() => {
    if (loginScreenState !== 'HIDDEN' && loggedIn) {
      setLoginScreenState('HIDDEN');
    }
  }, [loginScreenState, loggedIn, setLoginScreenState]);

  const logInAndSetUserProperties = () => {
    const name =
      nameInputRef.current?.value.trim() || Math.random().toString().slice(2);
    const username = name.replace(/ +/g, '-');
    setUsername(username);
    setName(name);
    logIn();
    navigate('/learn');
  };

  return (
    <article
      className={[
        'fixed inset-0 z-30 flex flex-col bg-white p-7 transition duration-300',
        loginScreenState === 'HIDDEN'
          ? 'pointer-events-none opacity-0'
          : 'opacity-100',
      ].join(' ')}
      aria-hidden={!loginScreenState}
    >
      <header className="flex flex-row-reverse justify-between sm:flex-row">
        <button
          className="flex text-gray-400"
          onClick={() => setLoginScreenState('HIDDEN')}
        >
          <CloseSvg />
          <span className="sr-only">Close</span>
        </button>
        <button
          className="hidden rounded-2xl border-2 border-b-4 border-gray-200 px-4 py-3 text-sm font-bold uppercase text-blue-400"
          onClick={() =>
            setLoginScreenState((x) => (x === 'LOGIN' ? 'SIGNUP' : 'LOGIN'))
          }
        >
          {loginScreenState === 'LOGIN' ? 'Sign up' : 'Login'}
        </button>
      </header>
      <div className="flex grow items-center justify-center">
        <div className="flex w-full flex-col gap-5 sm:w-96">
          <h2 className="text-center text-2xl font-bold text-gray-800">
            {loginScreenState === 'LOGIN' ? 'Log in' : 'Create your profile'}
          </h2>

          <button
            className="rounded-2xl border-b-4 border-blue-500 bg-blue-400 py-3 font-bold uppercase text-white"
            onClick={logInAndSetUserProperties}
          >
            {loginScreenState === 'LOGIN' ? 'Log in' : 'Create account'}
          </button>
        </div>
      </div>
    </article>
  );
};
