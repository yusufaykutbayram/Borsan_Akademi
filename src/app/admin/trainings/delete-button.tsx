'use client'

import { deleteTraining } from "../trainings/actions"

export function DeleteTrainingButton({ id }: { id: string }) {
    const handleDelete = async () => {
        if (confirm('Bu eğitimi silmek istediğinizden emin misiniz?')) {
            const res = await deleteTraining(id)
            if (res?.error) alert(res.error)
        }
    }

    return (
        <button 
            onClick={handleDelete}
            className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-5 py-2 rounded-xl text-xs font-bold transition-all border border-red-100"
        >
            Sil
        </button>
    )
}
