import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react"

type ClientSession = {
    auth: boolean;
}

type Props = {
    children: ReactNode;
}

type ClientSessionContext = {
    session: ClientSession,
    setSession: Dispatch<SetStateAction<ClientSession>>,
}

const Session = createContext<ClientSessionContext>({
    session: { auth: false },
    setSession: (_v) => { }
});


export default function SessionProvider({ children }: Props) {
    const [session, setSession] = useState<ClientSession>({ auth: false });

    useEffect(() => {
        fetch('/api/auth/check')
            .then(r => r.ok && setSession({ auth: true }))
            .catch(e => console.error(e));
    }, []);

    return <Session.Provider value={{ session, setSession }}>{children}</Session.Provider>
}

export const useSession = () => useContext(Session);