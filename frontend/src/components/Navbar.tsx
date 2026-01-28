import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Home, Users, User, FileText, Trophy, LogIn } from 'lucide-react'
import Logo from './Logo'

const navLinks = [
  { to: '/', label: 'الرئيسية', icon: Home },
  { to: '/register/team', label: 'تسجيل فريق', icon: Users },
  { to: '/register/individual', label: 'تسجيل فردي', icon: User },
  { to: '/project/submit', label: 'تقديم مشروع', icon: FileText },
  { to: '/top-teams', label: 'أفضل الفرق', icon: Trophy },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="bg-teknofest-dark-blue/90 backdrop-blur-md border-b border-teknofest-light-blue/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Logo size="md" className="transform group-hover:scale-110 transition-transform" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white">تكنوفيست</h1>
              <p className="text-xs text-teknofest-cyan">TEKNOFEST</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-teknofest-orange text-white'
                      : 'text-gray-300 hover:bg-teknofest-medium-blue hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Admin Login Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/admin/login"
              className="flex items-center gap-2 px-4 py-2 border border-teknofest-cyan text-teknofest-cyan rounded-lg hover:bg-teknofest-cyan hover:text-teknofest-dark-blue transition-all duration-300"
            >
              <LogIn className="w-4 h-4" />
              <span>لوحة الإدارة</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-300 hover:bg-teknofest-medium-blue"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-teknofest-light-blue/20">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-teknofest-orange text-white'
                        : 'text-gray-300 hover:bg-teknofest-medium-blue'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                )
              })}
              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 mt-2 border border-teknofest-cyan text-teknofest-cyan rounded-lg"
              >
                <LogIn className="w-5 h-5" />
                <span>لوحة الإدارة</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
