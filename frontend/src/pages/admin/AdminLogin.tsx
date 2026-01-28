import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Lock, User, ArrowLeft, Mail, Key, UserPlus, LogIn } from 'lucide-react'
import { authService } from '../../services/api'
import type { LoginCredentials, RegisterCredentials } from '../../types'
import Logo from '../../components/Logo'

type TabType = 'login' | 'register'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('login')
  const [isLoading, setIsLoading] = useState(false)

  // Login form
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginCredentials>()

  // Register form
  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: signupErrors },
  } = useForm<RegisterCredentials>()

  const onLogin = async (data: LoginCredentials) => {
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

  const onRegister = async (data: RegisterCredentials) => {
    setIsLoading(true)
    try {
      await authService.register(data)
      toast.success('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول')
      setActiveTab('login')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'فشل إنشاء الحساب')
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
          <p className="text-gray-400">
            {activeTab === 'login' ? 'تسجيل الدخول إلى لوحة التحكم' : 'إنشاء حساب إداري جديد'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 bg-teknofest-medium-blue rounded-xl p-1">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'login'
                ? 'bg-teknofest-orange text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            تسجيل الدخول
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'register'
                ? 'bg-teknofest-orange text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            إنشاء حساب
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <div className="card fade-in">
            <form onSubmit={handleSubmitLogin(onLogin)} className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-white font-medium mb-2">اسم المستخدم</label>
                <div className="relative">
                  <input
                    {...registerLogin('username', {
                      required: 'اسم المستخدم مطلوب',
                    })}
                    type="text"
                    className="input-field pr-12"
                    placeholder="أدخل اسم المستخدم"
                  />
                  <User className="absolute top-1/2 right-4 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {loginErrors.username && (
                  <p className="text-red-400 text-sm mt-1">{loginErrors.username.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-white font-medium mb-2">كلمة المرور</label>
                <div className="relative">
                  <input
                    {...registerLogin('password', {
                      required: 'كلمة المرور مطلوبة',
                    })}
                    type="password"
                    className="input-field pr-12"
                    placeholder="أدخل كلمة المرور"
                  />
                  <Lock className="absolute top-1/2 right-4 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {loginErrors.password && (
                  <p className="text-red-400 text-sm mt-1">{loginErrors.password.message}</p>
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
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <div className="card fade-in">
            <form onSubmit={handleSubmitSignup(onRegister)} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-white font-medium mb-2">الاسم الكامل</label>
                <div className="relative">
                  <input
                    {...registerSignup('full_name', {
                      required: 'الاسم الكامل مطلوب',
                      minLength: { value: 2, message: 'الاسم قصير جداً' },
                    })}
                    type="text"
                    className="input-field pr-12"
                    placeholder="أدخل اسمك الكامل"
                  />
                  <User className="absolute top-1/2 right-4 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {signupErrors.full_name && (
                  <p className="text-red-400 text-sm mt-1">{signupErrors.full_name.message}</p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-white font-medium mb-2">اسم المستخدم</label>
                <div className="relative">
                  <input
                    {...registerSignup('username', {
                      required: 'اسم المستخدم مطلوب',
                      minLength: { value: 3, message: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' },
                    })}
                    type="text"
                    className="input-field pr-12"
                    placeholder="اختر اسم مستخدم"
                    dir="ltr"
                  />
                  <User className="absolute top-1/2 right-4 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {signupErrors.username && (
                  <p className="text-red-400 text-sm mt-1">{signupErrors.username.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-white font-medium mb-2">البريد الإلكتروني</label>
                <div className="relative">
                  <input
                    {...registerSignup('email', {
                      required: 'البريد الإلكتروني مطلوب',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'بريد إلكتروني غير صالح',
                      },
                    })}
                    type="email"
                    className="input-field pr-12"
                    placeholder="example@email.com"
                    dir="ltr"
                  />
                  <Mail className="absolute top-1/2 right-4 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {signupErrors.email && (
                  <p className="text-red-400 text-sm mt-1">{signupErrors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-white font-medium mb-2">كلمة المرور</label>
                <div className="relative">
                  <input
                    {...registerSignup('password', {
                      required: 'كلمة المرور مطلوبة',
                      minLength: { value: 8, message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' },
                    })}
                    type="password"
                    className="input-field pr-12"
                    placeholder="اختر كلمة مرور قوية"
                  />
                  <Lock className="absolute top-1/2 right-4 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {signupErrors.password && (
                  <p className="text-red-400 text-sm mt-1">{signupErrors.password.message}</p>
                )}
              </div>

              {/* Registration Code */}
              <div>
                <label className="block text-white font-medium mb-2">كود التسجيل</label>
                <p className="text-gray-500 text-xs mb-2">
                  يجب إدخال كود التسجيل السري للتمكن من إنشاء حساب إداري
                </p>
                <div className="relative">
                  <input
                    {...registerSignup('registration_code', {
                      required: 'كود التسجيل مطلوب',
                    })}
                    type="password"
                    className="input-field pr-12"
                    placeholder="أدخل كود التسجيل"
                    dir="ltr"
                  />
                  <Key className="absolute top-1/2 right-4 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {signupErrors.registration_code && (
                  <p className="text-red-400 text-sm mt-1">{signupErrors.registration_code.message}</p>
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
                    جاري إنشاء الحساب...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    إنشاء حساب
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} تكنوفيست - جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  )
}
