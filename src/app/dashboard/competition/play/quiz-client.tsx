'use client'
import { useState, useEffect } from 'react'
import { submitQuiz } from './actions'
import { useRouter } from 'next/navigation'

export function QuizClient({ questions }: { questions: { id: string, text: string, answers: { id: string, text: string, is_correct: boolean }[] }[] }) {
    const router = useRouter()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [timeLeft, setTimeLeft] = useState(20)
    const [score, setScore] = useState(0)
    const [isFinished, setIsFinished] = useState(false)

    // Time handler
    useEffect(() => {
        if (isFinished || questions.length === 0) return;
        
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleAnswer(false); // timeout
                    return 20;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex, isFinished, questions.length]);

    // Anti cheat: blur tab
    useEffect(() => {
        const handleBlur = () => {
             // In real app, auto-fail here.
             alert("Uyarı: Sekmeden ayrılırsanız diskalifiye olursunuz!");
        }
        window.addEventListener('blur', handleBlur);
        return () => window.removeEventListener('blur', handleBlur);
    }, []);

    const handleAnswer = async (isCorrect: boolean) => {
        if (isCorrect) {
            setScore(prev => prev + 10 + Math.floor(timeLeft / 2)); // Base 10 + Time bonus
        }

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1)
            setTimeLeft(20)
        } else {
            finishQuiz(score + (isCorrect ? 10 + Math.floor(timeLeft / 2) : 0));
        }
    }

    const finishQuiz = async (finalScore: number) => {
        setIsFinished(true);
        await submitQuiz(finalScore);
        router.push('/dashboard/competition');
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
            <div className="bg-white rounded-3xl p-12 text-center shadow-soft border border-gray-100 animate-fade-in">
                <span className="text-6xl block mb-6">🎉</span>
                <h2 className="text-3xl font-bold text-secondary mb-4">Sınav Tamamlandı!</h2>
                <p className="text-gray-500">Oyunlaştırılmış puanlarınız hesaplanıyor...</p>
            </div>
        )
    }

    const q = questions[currentIndex]
    const progress = ((currentIndex + 1) / questions.length) * 100

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-20">
            {/* Header Info */}
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

            {/* Global Progress Bar */}
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-primary transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-[2rem] p-10 sm:p-16 shadow-premium border border-gray-50 text-center space-y-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-secondary leading-tight">
                    {q.text}
                </h2>
                
                <div className="grid grid-cols-1 gap-4 pt-4">
                    {q.answers.map((ans) => (
                        <button 
                            key={ans.id} 
                            onClick={() => handleAnswer(ans.is_correct)}
                            className="group relative w-full text-left p-6 rounded-2xl border-2 border-gray-50 hover:border-primary/20 hover:bg-primary/[0.02] transition-all flex items-center gap-4"
                        >
                            <div className="w-10 h-10 rounded-xl bg-surface group-hover:bg-primary/10 flex items-center justify-center font-bold text-gray-400 group-hover:text-primary transition-colors">
                                {String.fromCharCode(65 + q.answers.indexOf(ans))}
                            </div>
                            <span className="text-lg font-medium text-gray-600 group-hover:text-secondary transition-colors">
                                {ans.text}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer Tip */}
            <p className="text-center text-gray-400 text-xs">
                Doğru cevabı ne kadar hızlı verirseniz o kadar çok **Ek XP** kazanırsınız.
            </p>
        </div>
    )
}
