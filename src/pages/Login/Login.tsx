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
                className="w-full mt-1 px-3 py-2.5 rounded-lg border border-line bg-white text-ink placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-bordeaux focus:border-bordeaux transition"
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
        <div className="min-h-dvh grid grid-rows-[auto_1fr] lg:grid-rows-1 lg:grid-cols-[1.1fr_1fr] bg-pearl">
            <section className="bg-bordeaux text-white flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-20">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl leading-none">
                    Bellíssima
                </h1>
                <p className="mt-3 text-sm tracking-[0.4em] text-champagne">
                    STUDIO
                </p>
                {/* <div className="mt-8 h-px w-16 bg-champagne" />
                <p className="mt-6 text-blush">
                    Slogan
                </p> */}
            </section>

            <section className="flex items-center justify-center px-6 py-10 sm:py-12">
                <div className="w-full max-w-sm">
                    <h2 className="font-serif text-3xl text-bordeaux">
                        Acesse sua agenda
                    </h2>

                    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                        <LoginInput 
                            type="text" placeholder="Usuário"
                            value={usuario} updateValue={setUsuario}
                        />

                        <LoginInput 
                            type="password" placeholder="Senha"
                            value={senha} updateValue={setSenha}
                        />

                        {erro && <p className="text-sm text-danger" role="alert">{erro}</p>}

                        <div>
                            <button type="submit" className="flex items-center justify-center gap-2 cursor-pointer w-full py-2.5 
                            rounded-lg bg-bordeaux text-white font-medium hover:bg-bordeaux-dark transition">
                                Entrar <ArrowRight size={20}/>
                            </button>
                        </div>
                    </form>

                    <p className="text-xs text-muted mt-8">
                        Acesso restrito ao administrador
                    </p>
                </div>
            </section>
        </div>
    )
}