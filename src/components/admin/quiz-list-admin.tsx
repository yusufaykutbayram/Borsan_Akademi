'use client'

import React, { useState } from 'react'
import { deleteQuizGroup, updateQuestion } from '@/app/admin/questions/actions'

interface Answer {
    id: string
    text: string
    is_correct: boolean
}

interface Question {
    id: string
    text: string
    answers: Answer[]
}

interface QuizGroup {
    id: string
    title: string
    category: string
    exams: {
        questions: Question[]
    }[]
}

export function QuizListAdmin({ quizGroups }: { quizGroups: QuizGroup[] }) {
    const [openGroupId, setOpenGroupId] = useState<string | null>(null)
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)
    const [editData, setEditData] = useState<{ text: string, answers: Answer[] } | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const toggleGroup = (id: string) => {
        setOpenGroupId(openGroupId === id ? null : id)
        setEditingQuestionId(null)
    }

    const handleDelete = async (e: React.MouseEvent, id: string, title: string) => {
        e.stopPropagation()
        if (!confirm(`"${title}" quizini ve içindeki tüm soruları silmek istediğinize emin misiniz?`)) return
        
        setIsProcessing(true)
        const res = await deleteQuizGroup(id)
        setIsProcessing(false)
        
        if (!res.success) alert("Hata: " + res.error)
    }

    const startEdit = (q: Question) => {
        setEditingQuestionId(q.id)
        setEditData({ text: q.text, answers: JSON.parse(JSON.stringify(q.answers)) })
    }

    const handleSave = async (qId: string) => {
        if (!editData) return
        setIsProcessing(true)
        const res = await updateQuestion(qId, editData.text, editData.answers)
        setIsProcessing(false)
        
        if (res.success) {
            setEditingQuestionId(null)
        } else {
            alert("Hata: " + res.error)
        }
    }

    return (
        <div className="space-y-4">
            {quizGroups.map((group) => {
                const questionCount = group.exams[0]?.questions.length || 0
                const isOpen = openGroupId === group.id

                return (
                    <div key={group.id} className="glass-panel overflow-hidden border border-gray-100 transition-all">
                        {/* Header */}
                        <div 
                            className={`p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${isOpen ? 'bg-gray-50 border-b border-gray-100' : ''}`}
                            onClick={() => toggleGroup(group.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                                    group.category === 'URETIM' ? 'bg-blue-50 text-blue-500' :
                                    group.category === 'KALITE' ? 'bg-emerald-50 text-emerald-500' :
                                    group.category === 'ISG' ? 'bg-amber-50 text-amber-500' : 'bg-gray-100 text-gray-500'
                                }`}>
                                    {group.category === 'URETIM' ? '⚙️' :
                                     group.category === 'KALITE' ? '💎' :
                                     group.category === 'ISG' ? '🛡️' : '📚'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-secondary">{group.title}</h3>
                                    <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase">{group.category}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                                <button 
                                    onClick={(e) => handleDelete(e, group.id, group.title)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Quizi Sil"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-secondary">{questionCount} Soru</div>
                                </div>
                                <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Questions List */}
                        {isOpen && (
                            <div className="bg-white p-6 space-y-6 animate-slide-down">
                                {group.exams[0]?.questions.map((q, idx) => {
                                    const isEditing = editingQuestionId === q.id
                                    
                                    return (
                                        <div key={q.id} className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                                            {isEditing ? (
                                                <div className="space-y-4">
                                                    <div className="flex gap-4">
                                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                                                            {idx + 1}
                                                        </span>
                                                        <textarea 
                                                            className="flex-1 p-3 border border-gray-200 rounded-xl text-sm font-semibold text-secondary bg-white focus:border-primary outline-none"
                                                            value={editData?.text}
                                                            onChange={(e) => setEditData({...editData!, text: e.target.value})}
                                                            rows={2}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                                                        {editData?.answers.map((a, aIdx) => (
                                                            <div key={a.id} className="flex items-center gap-2">
                                                                <input 
                                                                    type="text"
                                                                    className="flex-1 p-2 border border-gray-200 rounded-lg text-sm bg-white"
                                                                    value={a.text}
                                                                    onChange={(e) => {
                                                                        const newAnswers = [...editData.answers]
                                                                        newAnswers[aIdx].text = e.target.value
                                                                        setEditData({...editData, answers: newAnswers})
                                                                    }}
                                                                />
                                                                <button 
                                                                    onClick={() => {
                                                                        const newAnswers = editData.answers.map((ans, i) => ({
                                                                            ...ans,
                                                                            is_correct: i === aIdx
                                                                        }))
                                                                        setEditData({...editData, answers: newAnswers})
                                                                    }}
                                                                    className={`p-2 rounded-lg text-xs font-bold transition-all ${a.is_correct ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                                                                >
                                                                    ✓
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex justify-end gap-2 pt-2">
                                                        <button onClick={() => setEditingQuestionId(null)} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-lg">İptal</button>
                                                        <button onClick={() => handleSave(q.id)} className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg shadow-sm">Kaydet</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex justify-between items-start gap-4 mb-4">
                                                        <div className="flex gap-4">
                                                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm font-bold text-secondary">
                                                                {idx + 1}
                                                            </span>
                                                            <p className="font-semibold text-secondary pt-1 leading-relaxed">{q.text}</p>
                                                        </div>
                                                        <button 
                                                            onClick={() => startEdit(q)}
                                                            className="text-gray-400 hover:text-primary p-1"
                                                            title="Düzenle"
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                                                        {q.answers.map((a) => (
                                                            <div 
                                                                key={a.id} 
                                                                className={`p-3 rounded-xl text-sm border flex items-center justify-between ${
                                                                    a.is_correct 
                                                                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                                                                    : 'bg-white border-gray-100 text-gray-500'
                                                                }`}
                                                            >
                                                                <span>{a.text}</span>
                                                                {a.is_correct && <span className="text-xs font-bold bg-emerald-500 text-white px-2 py-0.5 rounded uppercase">Doğru</span>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )
            })}
            
            {isProcessing && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-3xl shadow-2xl flex items-center gap-4">
                        <span className="spinner-small"></span>
                        <span className="font-bold text-secondary">İşlem yapılıyor...</span>
                    </div>
                </div>
            )}
        </div>
    )
}
