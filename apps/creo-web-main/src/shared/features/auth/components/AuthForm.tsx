'use client';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

export default function AuthForm() {
    const params = useSearchParams();
    const [formType, setFormType] = useState(params.get("form") || "register");

    useEffect(() => {
        setFormType(params.get('form') || "register");
    }, [params])


  switch (formType) {
    case "login": return <LoginForm />
    case "register": return <RegisterForm />
    default: return <RegisterForm />
  };
}
