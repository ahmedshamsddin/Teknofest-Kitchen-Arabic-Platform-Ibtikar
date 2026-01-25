import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, User, FileText, Star, TrendingUp, Loader2 } from 'lucide-react'
import { teamsService, individualsService, projectsService } from '../../services/api'

interface Stats {
  totalTeams: number
  totalIndividuals: number
  totalProjects: number
  unassignedIndividuals: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalTeams: 0,
    totalIndividuals: 0,
    totalProjects: 0,
    unassignedIndividuals: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [teams, individuals, projects, unassigned] = await Promise.all([
          teamsService.getAll(),
          individualsService.getAll(),
          projectsService.getAll(),
          individualsService.getUnassigned(),
        ])

        setStats({
          totalTeams: teams.length,
          totalIndividuals: individuals.length,
          totalProjects: projects.length,
          unassignedIndividuals: unassigned.length,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'إجمالي الفرق',
      value: stats.totalTeams,
      icon: Users,
      color: 'from-blue-500 to-cyan-400',
      link: '/admin/teams',
    },
    {
      title: 'إجمالي الأفراد',
      value: stats.totalIndividuals,
      icon: User,
      color: 'from-purple-500 to-pink-400',
      link: '/admin/individuals',
    },
    {
      title: 'المشاريع المقدمة',
      value: stats.totalProjects,
      icon: FileText,
      color: 'from-orange-500 to-red-400',
      link: '/admin/projects',
    },
    {
      title: 'أفراد بدون فريق',
      value: stats.unassignedIndividuals,
      icon: TrendingUp,
      color: 'from-green-500 to-teal-400',
      link: '/admin/individuals',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-teknofest-orange animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="card bg-gradient-to-br from-teknofest-orange/20 to-teknofest-red/10 border-teknofest-orange/30">
        <h1 className="text-2xl font-bold text-white mb-2">مرحباً بك في لوحة الإدارة</h1>
        <p className="text-gray-300">
          يمكنك من هنا إدارة الفرق والأفراد والمشاريع وتقييمها
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <Link
              key={index}
              to={card.link}
              className="card hover:border-teknofest-orange/50 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-white">{card.value}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Teams */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-teknofest-orange" />
              آخر الفرق المسجلة
            </h2>
            <Link
              to="/admin/teams"
              className="text-teknofest-cyan text-sm hover:text-white transition-colors"
            >
              عرض الكل
            </Link>
          </div>
          <div className="space-y-3">
            {stats.totalTeams === 0 ? (
              <p className="text-gray-400 text-center py-4">لا توجد فرق مسجلة بعد</p>
            ) : (
              <p className="text-gray-400 text-center py-4">
                {stats.totalTeams} فريق مسجل
              </p>
            )}
          </div>
        </div>

        {/* Quick Tasks */}
        <div className="card">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-teknofest-orange" />
            مهام سريعة
          </h2>
          <div className="space-y-3">
            <Link
              to="/admin/individuals"
              className="flex items-center gap-3 p-4 bg-teknofest-dark-blue/50 rounded-xl hover:bg-teknofest-medium-blue/50 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-medium">فرز الأفراد</p>
                <p className="text-gray-400 text-sm">
                  {stats.unassignedIndividuals} فرد بانتظار الفرز
                </p>
              </div>
            </Link>
            <Link
              to="/admin/projects"
              className="flex items-center gap-3 p-4 bg-teknofest-dark-blue/50 rounded-xl hover:bg-teknofest-medium-blue/50 transition-colors"
            >
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-white font-medium">مراجعة المشاريع</p>
                <p className="text-gray-400 text-sm">
                  {stats.totalProjects} مشروع للمراجعة
                </p>
              </div>
            </Link>
            <Link
              to="/admin/evaluations"
              className="flex items-center gap-3 p-4 bg-teknofest-dark-blue/50 rounded-xl hover:bg-teknofest-medium-blue/50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white font-medium">تقييم المشاريع</p>
                <p className="text-gray-400 text-sm">ابدأ تقييم المشاريع المقدمة</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
