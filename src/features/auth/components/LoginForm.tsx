import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface LoginFormValues {
  email: string
  password: string
}

export const LoginForm = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>()

  const onSubmit = async (_data: LoginFormValues) => {
    login(_data.email, _data.password)
    navigate('/dashboard', { replace: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
        type="email"
        placeholder="john@example.com"
        error={errors.email?.message}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Enter a valid email',
          },
        })}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Minimum 6 characters',
          },
        })}
      />
      <Button
        type="submit"
        isLoading={isSubmitting}
        className="w-full"
      >
        Sign In
      </Button>
      <p className="text-xs text-center text-gray-400 mt-2">
        Use any email & password (mock auth)
      </p>
    </form>
  )
}