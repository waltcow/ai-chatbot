'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';

import { register, type RegisterActionState } from '../actions';
import { toast } from '@/components/toast';
import { useSession } from 'next-auth/react';

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  // Define registrationDisabled based on environment variable
  const registrationDisabled = process.env.NEXT_PUBLIC_REGISTRATION_DISABLED === 'true';

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: 'idle',
    },
  );

  const { update: updateSession } = useSession();

  useEffect(() => {
    if (state.status === 'user_exists') {
      toast({ type: 'error', description: '账号已存在！' });
    } else if (state.status === 'failed') {
      toast({ type: 'error', description: '创建账号失败！' });
    } else if (state.status === 'invalid_data') {
      toast({
        type: 'error',
        description: '提交校验失败！',
      });
    } else if (state.status === 'registration_disabled') {
      toast({
        type: 'error',
        description: '注册功能暂时关闭！',
      });
    } else if (state.status === 'success') {
      toast({ type: 'success', description: '账号创建成功！' });

      setIsSuccessful(true);
      updateSession();
      router.refresh();
    }
  }, [state]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl gap-12 flex flex-col">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">注册</h3>
          {registrationDisabled ? (
            <p className="text-sm text-red-500 dark:text-red-400">
              注册功能暂时不可用
            </p>
          ) : (
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              使用邮箱和密码创建账号
            </p>
          )}
        </div>
        {registrationDisabled ? (
          <div className="px-4 sm:px-16">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 text-center">
                目前已暂停新用户注册。如需访问，请联系管理员。
              </p>
            </div>
            <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
              {'已经有账号了？'}
              <Link
                href="/login"
                className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
              >
                立即登录
              </Link>
              {'。'}
            </p>
          </div>
        ) : (
          <AuthForm action={handleSubmit} defaultEmail={email}>
            <SubmitButton isSuccessful={isSuccessful}>注册</SubmitButton>
            <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
              {'已经有账号了？'}
              <Link
                href="/login"
                className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
              >
                立即登录
              </Link>
              {'。'}
            </p>
          </AuthForm>
        )}
      </div>
    </div>
  );
}
