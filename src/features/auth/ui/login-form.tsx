'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Button } from '@/shared/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/ui/field'
import { Input } from '@/shared/ui/input'
import { ROUTES } from '@/shared/config/routes'
import { useLogin } from '../model/use-login'
import { useLoginSocial } from '../model/use-login-social'
import { LoginSchema, type LoginFormData } from '../model/login.schema'

/**
 * Login form - card layout mirroring the shared/ui login-form design, wired to
 * Better Auth email/password sign-in and Google OAuth.
 */
export function LoginForm() {
  const t = useTranslations('Auth')
  const tValidation = useTranslations('validation')
  const { mutate: login, isPending } = useLogin()
  const { mutate: loginSocial, isPending: isSocialPending } = useLoginSocial()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  })

  return (
    <div className='flex flex-col gap-6'>
      <Card>
        <CardHeader>
          <CardTitle>{t('loginTitle')}</CardTitle>
          <CardDescription>{t('loginDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((data) => login(data))}
            noValidate
          >
            <FieldGroup>
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor='email'>{t('email')}</FieldLabel>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  autoComplete='email'
                  aria-invalid={!!errors.email}
                  {...register('email')}
                />
                {errors.email && (
                  <FieldError
                    errors={[
                      { message: tValidation(errors.email.message!) },
                    ]}
                  />
                )}
              </Field>
              <Field data-invalid={!!errors.password}>
                <div className='flex items-center'>
                  <FieldLabel htmlFor='password'>{t('password')}</FieldLabel>
                  <a
                    href='#'
                    className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                  >
                    {t('forgotPassword')}
                  </a>
                </div>
                <Input
                  id='password'
                  type='password'
                  autoComplete='current-password'
                  aria-invalid={!!errors.password}
                  {...register('password')}
                />
                {errors.password && (
                  <FieldError
                    errors={[
                      { message: tValidation(errors.password.message!) },
                    ]}
                  />
                )}
              </Field>
              <Field>
                <Button
                  type='submit'
                  className='w-full'
                  disabled={isPending || isSocialPending}
                >
                  {isPending ? t('login') + '...' : t('login')}
                </Button>
                <Button
                  variant='outline'
                  type='button'
                  className='w-full'
                  disabled={isPending || isSocialPending}
                  onClick={() =>
                    loginSocial({
                      provider: 'google',
                      callbackURL: new URL(
                        ROUTES.homePage,
                        window.location.origin
                      ).toString(),
                    })
                  }
                >
                  {isSocialPending
                    ? t('loginWithGoogle') + '...'
                    : t('loginWithGoogle')}
                </Button>
                <FieldDescription className='text-center'>
                  {t('noAccount')} <a href='#'>{t('signUp')}</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
