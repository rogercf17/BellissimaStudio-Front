import { useState, type FormEvent } from "react"
import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface LoginInputProps {
    type: string,
    placeholder: string,
    value: string,
    updateValue(value: string):  void
}

export const LoginInput = ({ type, placeholder, value, updateValue }: LoginInputProps) => {
    return(
        <div>
            <input 
                type={type} 
                value={value} 
                placeholder={placeholder} 
                onChange={(event) => updateValue(event.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-[#E7E0DC] focus:outline-none focus:ring-2 focus:ring-[#C98989]"
            />
        </div>
    )
}

export default function Login() {
    const [usuario, setUsuario] = useState("")
    const [senha, setSenha] = useState("")
    const [erro, setErro] = useState("")
    const navigate = useNavigate()

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        if(!usuario || !senha) {
            setErro("Usuário e Senha devem ser Preenchidos")
            return
        }

        if (usuario !== "leia-maria" || senha !== "2810") {
           setErro("Usuário ou Senha estão errados")
           return 
        }

        navigate("/home")
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-[#FAF7F4]">
            <div className="bg-white rounded-2xl shadow-sm p-10 w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="font-serif text-2xl text-[#292524]">
                        Bellíssima Studio
                    </h1>
                    <p className="text-sm text-[#78716C] mt-1">
                        Slogan
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <LoginInput 
                        type="text" placeholder="Usuário"
                        value={usuario} updateValue={setUsuario}
                    />

                    <LoginInput 
                        type="password" placeholder="Senha"
                        value={senha} updateValue={setSenha}
                    />

                    {erro && <p className="text-sm text-red-500">{erro}</p>}

                    <div>
                        <button type="submit" className="flex items-center justify-center gap-2 cursor-pointer w-full py-2 rounded-lg bg-[#C98989] text-white font-medium hover:opacity-90 transition">
                            Entrar <ArrowRight size={20}/>
                        </button>
                    </div>
                </form>

                <p className="text-xs text-center text-[#78716C] mt-6">
                    Acesso restrito ao administrador
                </p>
            </div>
        </div>
    )
}