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
        return <div className="glass-panel" style={{textAlign:'center', padding: '32px'}}>Henüz sistemde soru bulunmuyor.</div>
    }

    if (isFinished) {
        return (
            <div className="glass-card" style={{textAlign:'center', padding: '40px'}}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom:'16px' }}>🎉</span>
                <h2>Sınav Tamamlandı!</h2>
                <p>Oyunlaştırılmış puanlarınız hesaplanıyor...</p>
            </div>
        )
    }

    const q = questions[currentIndex]

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '16px', fontSize: '14px', fontWeight: 'bold' }}>
                    Soru {currentIndex + 1} / {questions.length}
                </span>
                <span style={{ 
                    background: timeLeft <= 5 ? 'var(--danger)' : 'rgba(245, 158, 11, 0.2)', 
                    color: timeLeft <= 5 ? 'white' : 'var(--secondary)',
                    padding: '8px 16px', 
                    borderRadius: '50px', 
                    fontSize: '18px', 
                    fontWeight: 900,
                    transition: 'all 0.3s'
                }}>
                    ⌚ {timeLeft}s
                </span>
            </div>

            <div className="glass-panel" style={{ marginBottom: '24px', minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h2 style={{ fontSize: '20px', lineHeight: '1.6', textAlign: 'center', margin: 0 }}>{q.text}</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {q.answers.map((ans: { id: string, text: string, is_correct: boolean }) => (
                    <button 
                        key={ans.id} 
                        onClick={() => handleAnswer(ans.is_correct)}
                        className="glass-card" 
                        style={{ width: '100%', textAlign: 'left', cursor: 'pointer', padding: '20px', fontSize: '16px', transition: 'transform 0.1s', border: '1px solid var(--glass-border)' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {ans.text}
                    </button>
                ))}
            </div>
        </div>
    )
}
