'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field'
import { useLogin } from '../model/use-login'
import { LoginSchema, type LoginFormData } from '../model/login.schema'

export function LoginForm() {
  const t = useTranslations('Auth')
  const tValidation = useTranslations('validation')
  const { mutate: login, isPending } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (data: LoginFormData) => login(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor='email'>{t('email')}</FieldLabel>
          <Input
            id='email'
            type='email'
            placeholder='john@example.com'
            autoComplete='email'
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && (
            <FieldError errors={[{ message: tValidation(errors.email.message!)}]} />
          )}
        </Field>
        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor='password'>{t('password')}</FieldLabel>
          <Input
            id='password'
            type='password'
            autoComplete='current-password'
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          {errors.password && (
            <FieldError errors={[{ message: tValidation(errors.password.message!)}]} />
          )}
        </Field>

        <Button type='submit' className='w-full' disabled={isPending}>
          {isPending ? t('login') + '...' : t('login')}
        </Button>
      </FieldGroup>
    </form>
  )
}
