import useSWR from 'swr';
import { Contact } from '../models';
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => res.json());

function useContacts() {
    const { data, error, isLoading } = useSWR<Contact[]>(`/api/contacts`, fetcher);

    return {
        contacts: data,
        loading: isLoading,
        error: error
    }
}

export { useContacts };