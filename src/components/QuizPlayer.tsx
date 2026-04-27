'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Question {
    id: string
    text: string
    answers: { id: string, text: string, is_correct: boolean }[]
}

interface QuizPlayerProps {
    questions: Question[]
    onFinish: (score: number, timeSpent: number) => Promise<any>
    redirectPath: string
    mode?: 'competition' | 'quiz'
}

export function QuizPlayer({ questions, onFinish, redirectPath, mode = 'quiz' }: QuizPlayerProps) {
    const router = useRouter()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [timeLeft, setTimeLeft] = useState(20)
    const [score, setScore] = useState(0)
    const [stats, setStats] = useState({ correct: 0, incorrect: 0 })
    const [totalTimeSpent, setTotalTimeSpent] = useState(0)
    const [startTime] = useState(Date.now())
    const [isFinished, setIsFinished] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [resultData, setResultData] = useState<{ rank: number, totalUsers: number, topUsers: any[] } | null>(null)

    useEffect(() => {
        if (isFinished || questions.length === 0) return;
        
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleAnswer(false);
                    return 20;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [currentIndex, isFinished, questions.length]);

    const handleAnswer = async (isCorrect: boolean) => {
        let points = 0
        if (isCorrect) {
            points = mode === 'competition' ? (10 + Math.floor(timeLeft / 2)) : 10
            setScore(prev => prev + points)
            setStats(prev => ({ ...prev, correct: prev.correct + 1 }))
        } else {
            setStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }))
        }

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1)
            setTimeLeft(20)
        } else {
            const timeTaken = Math.floor((Date.now() - startTime) / 1000)
            setTotalTimeSpent(timeTaken)
            finishQuiz(score + points, timeTaken)
        }
    }

    const finishQuiz = async (finalScore: number, timeTaken: number) => {
        setIsFinished(true);
        setIsSubmitting(true);
        try {
            const res = await onFinish(finalScore, timeTaken);
            if (res && res.rank) {
                setResultData(res)
            }
            setIsSubmitting(false);
        } catch (error) {
            console.error("Submission error:", error);
            setIsSubmitting(false);
        }
    }

    const handleRedirect = () => {
        router.push(redirectPath)
    }

    if (questions.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-12 text-center shadow-soft border border-gray-100">
                <p className="text-gray-500 font-medium">Henüz sistemde soru bulunmuyor.</p>
            </div>
        )
    }

    if (isFinished) {
        return (
            <div className="max-w-4xl mx-auto space-y-6 animate-scale-in pb-20">
                <div className="bg-white rounded-[2.5rem] p-10 text-center shadow-premium border border-gray-100">
                    <span className="text-6xl block mb-6">🏆</span>
                    <h2 className="text-3xl font-black text-secondary mb-2">Yarışma Bitti!</h2>
                    <p className="text-gray-400 mb-8">Performansın analiz edildi.</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                            <span className="text-emerald-500 text-2xl font-black block">{stats.correct}</span>
                            <span className="text-emerald-700/50 text-[10px] font-bold uppercase tracking-widest">Doğru</span>
                        </div>
                        <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
                            <span className="text-rose-500 text-2xl font-black block">{stats.incorrect}</span>
                            <span className="text-rose-700/50 text-[10px] font-bold uppercase tracking-widest">Yanlış</span>
                        </div>
                        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                            <span className="text-blue-500 text-2xl font-black block">{totalTimeSpent}s</span>
                            <span className="text-blue-700/50 text-[10px] font-bold uppercase tracking-widest">Süre</span>
                        </div>
                        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                            <span className="text-amber-500 text-2xl font-black block">{resultData?.rank || '?'}.</span>
                            <span className="text-amber-700/50 text-[10px] font-bold uppercase tracking-widest">Sıra</span>
                        </div>
                    </div>

                    {resultData && (
                        <div className="mb-8 p-4 bg-surface rounded-2xl border border-gray-100">
                            <p className="text-secondary font-bold text-sm">
                                {resultData.totalUsers} kişi arasından <span className="text-primary">{resultData.rank}.</span> sıradasın!
                            </p>
                        </div>
                    )}

                    <button 
                        onClick={handleRedirect}
                        disabled={isSubmitting}
                        className="w-full bg-secondary text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-secondary/20 hover:bg-secondary-dark transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? 'Veriler Alınıyor...' : 'Liderlik Tablosuna Dön'}
                    </button>
                </div>

                {/* Leaderboard Summary */}
                {resultData?.topUsers && (
                    <div className="bg-white rounded-[2rem] p-8 shadow-premium border border-gray-100">
                        <h3 className="text-lg font-bold text-secondary mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm">👑</span>
                            En İyi 10 Yarışmacı
                        </h3>
                        <div className="space-y-3">
                            {resultData.topUsers.map((user: any, idx: number) => (
                                <div key={user.id} className={`flex items-center justify-between p-3 rounded-xl transition-all ${idx === 0 ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50'}`}>
                                    <div className="flex items-center gap-3">
                                        <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                                            idx === 0 ? 'bg-amber-400 text-white' : 
                                            idx === 1 ? 'bg-gray-300 text-white' : 
                                            idx === 2 ? 'bg-orange-300 text-white' : 'bg-white text-gray-400'
                                        }`}>
                                            {idx + 1}
                                        </span>
                                        <span className="font-bold text-secondary text-sm">{user.name}</span>
                                    </div>
                                    <span className="text-primary font-black text-sm">{user.xp} XP</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    const q = questions[currentIndex]
    const progress = ((currentIndex + 1) / questions.length) * 100

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-20">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-soft border border-gray-50">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Soru</p>
                    <p className="text-xl font-bold text-secondary">{currentIndex + 1} <span className="text-gray-300">/</span> {questions.length}</p>
                </div>
                
                <div className={`flex flex-col items-end transition-all ${timeLeft <= 5 ? 'scale-110' : ''}`}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Kalan Süre</p>
                    <div className={`px-6 py-2 rounded-full font-black text-2xl ${timeLeft <= 5 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-surface text-secondary'}`}>
                        {timeLeft}s
                    </div>
                </div>
            </div>

            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="bg-white rounded-[2rem] p-10 sm:p-16 shadow-premium border border-gray-50 text-center space-y-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-secondary leading-tight">{q.text}</h2>
                <div className="grid grid-cols-1 gap-4 pt-4">
                    {q.answers.map((ans, idx) => (
                        <button 
                            key={ans.id} 
                            onClick={() => handleAnswer(ans.is_correct)}
                            className="group relative w-full text-left p-6 rounded-2xl border-2 border-gray-50 hover:border-primary/20 hover:bg-primary/[0.02] transition-all flex items-center gap-4"
                        >
                            <div className="w-10 h-10 rounded-xl bg-surface group-hover:bg-primary/10 flex items-center justify-center font-bold text-gray-400 group-hover:text-primary transition-colors">
                                {String.fromCharCode(65 + idx)}
                            </div>
                            <span className="text-lg font-medium text-gray-600 group-hover:text-secondary transition-colors">{ans.text}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
