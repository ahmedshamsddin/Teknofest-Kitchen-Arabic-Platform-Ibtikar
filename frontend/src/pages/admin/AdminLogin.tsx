import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Lock, User, ArrowLeft } from 'lucide-react'
import { authService } from '../../services/api'
import type { LoginCredentials } from '../../types'
import Logo from '../../components/Logo'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>()

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true)
    try {
      const response = await authService.login(data)
      localStorage.setItem('admin_token', response.access_token)
      toast.success('تم تسجيل الدخول بنجاح')
      navigate('/admin')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'فشل تسجيل الدخول')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="stars-bg"></div>

      {/* Back to Home Link */}
      <Link
        to="/"
        className="absolute top-6 right-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-20"
      >
        <span>العودة للرئيسية</span>
        <ArrowLeft className="w-4 h-4" />
      </Link>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">لوحة الإدارة</h1>
          <p className="text-gray-400">تسجيل الدخول إلى لوحة التحكم</p>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-white font-medium mb-2">اسم المستخدم</label>
              <div className="relative">
                <input
                  {...register('username', {
                    required: 'اسم المستخدم مطلوب',
                  })}
                  type="text"
                  className="input-field pr-12"
                  placeholder="أدخل اسم المستخدم"
                />
                <User className="absolute top-1/2 right-4 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.username && (
                <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-white font-medium mb-2">كلمة المرور</label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'كلمة المرور مطلوبة',
                  })}
                  type="password"
                  className="input-field pr-12"
                  placeholder="أدخل كلمة المرور"
                />
                <Lock className="absolute top-1/2 right-4 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري الدخول...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  تسجيل الدخول
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} تكنوفيست - جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  )
}
