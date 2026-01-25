import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import {
  User,
  Search,
  Users,
  Loader2,
  Check,
  X,
  UserPlus,
} from 'lucide-react'
import { individualsService } from '../../services/api'
import { PROJECT_FIELDS, type Individual } from '../../types'

export default function AdminIndividuals() {
  const [individuals, setIndividuals] = useState<Individual[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndividuals, setSelectedIndividuals] = useState<number[]>([])
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamField, setNewTeamField] = useState('')
  const [assigning, setAssigning] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unassigned' | 'assigned'>('all')

  useEffect(() => {
    const fetchIndividuals = async () => {
      try {
        const data = await individualsService.getAll()
        setIndividuals(data)
      } catch (error) {
        toast.error('حدث خطأ في تحميل الأفراد')
      } finally {
        setLoading(false)
      }
    }

    fetchIndividuals()
  }, [])

  const filteredIndividuals = individuals.filter((ind) => {
    const matchesSearch =
      ind.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ind.email.toLowerCase().includes(searchTerm.toLowerCase())

    if (filter === 'unassigned') return matchesSearch && !ind.is_assigned
    if (filter === 'assigned') return matchesSearch && ind.is_assigned
    return matchesSearch
  })

  const toggleSelect = (id: number) => {
    setSelectedIndividuals((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleAssign = async () => {
    if (selectedIndividuals.length < 3) {
      toast.error('يجب اختيار 3 أفراد على الأقل')
      return
    }
    if (selectedIndividuals.length > 6) {
      toast.error('الحد الأقصى 6 أفراد')
      return
    }
    if (!newTeamName.trim()) {
      toast.error('يرجى إدخال اسم الفريق')
      return
    }
    if (!newTeamField) {
      toast.error('يرجى اختيار مجال المسابقة')
      return
    }

    setAssigning(true)
    try {
      await individualsService.assignToTeam(
        selectedIndividuals,
        newTeamName,
        newTeamField
      )
      toast.success('تم إنشاء الفريق وفرز الأفراد بنجاح')

      // Refresh individuals
      const data = await individualsService.getAll()
      setIndividuals(data)

      // Reset state
      setSelectedIndividuals([])
      setShowAssignModal(false)
      setNewTeamName('')
      setNewTeamField('')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'حدث خطأ في فرز الأفراد')
    } finally {
      setAssigning(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-teknofest-orange animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">إدارة الأفراد</h1>
          <p className="text-gray-400">فرز الأفراد إلى فرق</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg">
            <User className="w-5 h-5" />
            <span className="font-medium">{individuals.length} فرد</span>
          </div>
          {selectedIndividuals.length >= 3 && (
            <button
              onClick={() => setShowAssignModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              فرز المحددين ({selectedIndividuals.length})
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث عن فرد..."
            className="input-field pr-12"
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'الكل' },
            { value: 'unassigned', label: 'غير مفرز' },
            { value: 'assigned', label: 'مفرز' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value as typeof filter)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === f.value
                  ? 'bg-teknofest-orange text-white'
                  : 'bg-teknofest-medium-blue text-gray-300 hover:bg-teknofest-light-blue'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Individuals Grid */}
      {filteredIndividuals.length === 0 ? (
        <div className="card text-center py-12">
          <User className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">لا يوجد أفراد للعرض</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIndividuals.map((individual) => (
            <div
              key={individual.id}
              className={`card cursor-pointer transition-all ${
                selectedIndividuals.includes(individual.id!)
                  ? 'border-teknofest-orange bg-teknofest-orange/10'
                  : individual.is_assigned
                  ? 'border-green-500/30 opacity-60'
                  : 'hover:border-teknofest-orange/50'
              }`}
              onClick={() => !individual.is_assigned && toggleSelect(individual.id!)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      individual.is_assigned
                        ? 'bg-green-500/20'
                        : 'bg-gradient-to-br from-purple-500 to-pink-500'
                    }`}
                  >
                    {individual.is_assigned ? (
                      <Check className="w-6 h-6 text-green-400" />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{individual.full_name}</h3>
                    <p className="text-gray-400 text-sm">{individual.experience_level}</p>
                  </div>
                </div>
                {!individual.is_assigned && (
                  <div
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      selectedIndividuals.includes(individual.id!)
                        ? 'border-teknofest-orange bg-teknofest-orange'
                        : 'border-gray-500'
                    }`}
                  >
                    {selectedIndividuals.includes(individual.id!) && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-gray-400">
                  <span className="text-gray-500">البريد:</span> {individual.email}
                </p>
                <p className="text-gray-400">
                  <span className="text-gray-500">المجال:</span> {individual.preferred_field}
                </p>
                <p className="text-gray-400">
                  <span className="text-gray-500">المهارات:</span>{' '}
                  {individual.technical_skills.substring(0, 50)}...
                </p>
              </div>

              {individual.is_assigned && (
                <div className="mt-4 pt-4 border-t border-teknofest-light-blue/20">
                  <span className="text-green-400 text-sm flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    تم الفرز
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="card max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">إنشاء فريق جديد</h2>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">اسم الفريق</label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="أدخل اسم الفريق"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">مجال المسابقة</label>
                <select
                  value={newTeamField}
                  onChange={(e) => setNewTeamField(e.target.value)}
                  className="input-field"
                >
                  <option value="">اختر المسابقة</option>
                  {PROJECT_FIELDS.map((field) => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 bg-teknofest-dark-blue/50 rounded-xl">
                <p className="text-gray-400 text-sm mb-2">الأفراد المحددين:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedIndividuals.map((id) => {
                    const ind = individuals.find((i) => i.id === id)
                    return (
                      <span
                        key={id}
                        className="px-3 py-1 bg-teknofest-orange/20 text-teknofest-orange rounded-full text-sm"
                      >
                        {ind?.full_name}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleAssign}
                disabled={assigning}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {assigning ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Users className="w-5 h-5" />
                )}
                إنشاء الفريق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
